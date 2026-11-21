import type { Analysis, Language, Verdict } from "./types";
import { redactSensitive } from "./redact";

/**
 * Deterministic offline scam rules engine.
 * Used when no GEMINI_API_KEY is configured (or the Gemini call fails), so the
 * prototype never breaks — including during evals, where determinism matters.
 *
 * Rules run in order; the first match wins. All output text is in the selected
 * language and pre-redacted (OTPs / PINs / account numbers -> [REDACTED]).
 */

type Localized<T> = Record<Language, T>;

interface Rule {
  id: string;
  verdict: Verdict;
  scamType: Localized<string>;
  reasons: Localized<string[]>;
  nextAction: Localized<string>;
  test: (text: string) => boolean;
}

const RULES: Rule[] = [
  {
    id: "apk-malware",
    verdict: "HIGH_RISK",
    test: (t) => /\.apk\b|apk file|\.apk"/i.test(t),
    scamType: {
      English: "Fake APK Malware",
      Hindi: "फर्ज़ी APK मैलवेयर",
      Hinglish: "Fake APK Malware",
    },
    reasons: {
      English: [
        "A real bank never asks you to install an app or APK file to fix your account.",
        "Installing it can let thieves read your OTPs and empty your account.",
      ],
      Hindi: [
        "असली बैंक कभी नहीं कहता कि अकाउंट ठीक करने के लिए ऐप या APK इंस्टॉल करो।",
        "यह इंस्टॉल करने से ठग आपका OTP पढ़ सकते हैं और पैसे निकाल सकते हैं।",
      ],
      Hinglish: [
        "Asli bank kabhi nahi kehta ki account theek karne ke liye app ya APK install karo.",
        "Ye install karne se thag aapka OTP padh sakte hain aur paise nikal sakte hain.",
      ],
    },
    nextAction: {
      English:
        "Do not install anything. Report on Chakshu (Sanchar Saathi) — if you already installed the app, call 1930 immediately.",
      Hindi:
        "कुछ भी इंस्टॉल न करें। इसे Chakshu (Sanchar Saathi) पर रिपोर्ट करें — अगर ऐप इंस्टॉल हो चुका है तो तुरंत 1930 पर कॉल करें।",
      Hinglish:
        "Kuch bhi install mat karo. Chakshu (Sanchar Saathi) pe report karo — agar app install ho chuka hai to turant 1930 dial karo.",
    },
  },
  {
    id: "digital-arrest",
    verdict: "HIGH_RISK",
    test: (t) =>
      /digital arrest|crime branch|cbi\b|fedex|parcel.{0,60}(drug|aadhaar|aadhar)|(video call|video conferenc).{0,50}(police|arrest|officer)/i.test(
        t,
      ),
    scamType: {
      English: "Digital Arrest Scam",
      Hindi: "डिजिटल अरेस्ट घोटाला",
      Hinglish: "Digital Arrest Scam",
    },
    reasons: {
      English: [
        "Police never arrest anyone over a video call — 'Digital Arrest' is a well-known trick.",
        "Stories about parcels, drugs or Aadhaar are made up to scare you into paying.",
      ],
      Hindi: [
        "पुलिस कभी वीडियो कॉल पर किसी को गिरफ़्तार नहीं करती — 'डिजिटल अरेस्ट' एक जानी-पहचानी चाल है।",
        "पार्सल, ड्रग्स या आधार वाली कहानियाँ डराकर पैसे ऐंठने के लिए बनाई जाती हैं।",
      ],
      Hinglish: [
        "Police kabhi video call pe kisi ko arrest nahi karti — 'Digital Arrest' ek jaani-pehchaani chaal hai.",
        "Parcel, drugs ya Aadhaar wali kahaniyan dara ke paise aanthne ke liye banayi jaati hain.",
      ],
    },
    nextAction: {
      English:
        "Do not join any video call or pay anything. Report on Chakshu (Sanchar Saathi); if money was already sent, call 1930 immediately.",
      Hindi:
        "कोई वीडियो कॉल जॉइन न करें और कुछ भी भुगतान न करें। Chakshu (Sanchar Saathi) पर रिपोर्ट करें; अगर पैसा जा चुका है तो तुरंत 1930 पर कॉल करें।",
      Hinglish:
        "Koi video call join mat karo aur kuch bhi pay mat karo. Chakshu (Sanchar Saathi) pe report karo; agar paisa ja chuka hai to turant 1930 dial karo.",
    },
  },
  {
    id: "otp-theft",
    verdict: "HIGH_RISK",
    test: (t) =>
      /(otp|o\.t\.p|\bpin\b|cvv).{0,60}(share|send|bata|bol|bhej|confirm|tell)|share.{0,25}(otp|\bpin\b|cvv)/i.test(
        t,
      ),
    scamType: {
      English: "OTP Theft Scam",
      Hindi: "OTP चोरी का घोटाला",
      Hinglish: "OTP Theft Scam",
    },
    reasons: {
      English: [
        "Your OTP or PIN is like your house key — never share it with anyone.",
        "Banks and police never ask for OTPs on calls or messages, even 'for verification'.",
      ],
      Hindi: [
        "आपका OTP या PIN आपकी घर की चाबी जैसा है — इसे किसी से साझा न करें।",
        "बैंक और पुलिस कभी भी OTP नहीं माँगते, 'वेरिफिकेशन' के लिए भी नहीं।",
      ],
      Hinglish: [
        "Aapka OTP ya PIN ghar ki chaabi jaisa hai — kisi se share mat karo.",
        "Bank aur police kabhi bhi OTP nahi maangte, 'verification' ke liye bhi nahi.",
      ],
    },
    nextAction: {
      English:
        "Do not share any code with anyone. Report on Chakshu (Sanchar Saathi); if a code was shared or money sent, call 1930 immediately.",
      Hindi:
        "कोई भी कोड किसी से साझा न करें। Chakshu (Sanchar Saathi) पर रिपोर्ट करें; अगर कोड साझा हो गया या पैसा गया है तो तुरंत 1930 पर कॉल करें।",
      Hinglish:
        "Koi bhi code kisi se share mat karo. Chakshu (Sanchar Saathi) pe report karo; agar code share ho gaya ya paisa gaya hai to turant 1930 dial karo.",
    },
  },
  {
    id: "lottery-prize",
    verdict: "HIGH_RISK",
    test: (t) =>
      /(lottery|lucky draw|prize|congratulations).{0,80}(won|win|selected|claim)|won.{0,30}(lottery|prize)/i.test(
        t,
      ) && /fee|processing|tax|charge|gst|registration|claim|pay/i.test(t),
    scamType: {
      English: "Lottery / Prize Scam",
      Hindi: "लॉटरी / इनाम घोटाला",
      Hinglish: "Lottery / Prize Scam",
    },
    reasons: {
      English: [
        "You cannot win a lottery you never bought — this message is fake.",
        "Asking for a 'processing fee' or 'tax' to release a prize is a classic trick.",
      ],
      Hindi: [
        "जो लॉटरी आपने कभी खरीदी ही नहीं, वह आप जीत नहीं सकते — यह संदेश फर्ज़ी है।",
        "इनाम दिलाने के लिए 'प्रोसेसिंग फ़ीस' या 'टैक्स' माँगना एक जानी-पहचानी चाल है।",
      ],
      Hinglish: [
        "Jo lottery aapne kabhi kharidi hi nahi, wo aap jeet nahi sakte — ye message fake hai.",
        "Inaam dilane ke liye 'processing fee' ya 'tax' maangna ek jaani-pehchaani chaal hai.",
      ],
    },
    nextAction: {
      English:
        "Do not pay any fee or share any details. Report on Chakshu (Sanchar Saathi); if money was already sent, call 1930 immediately.",
      Hindi:
        "कोई फ़ीस न दें और कोई जानकारी साझा न करें। Chakshu (Sanchar Saathi) पर रिपोर्ट करें; अगर पैसा जा चुका है तो तुरंत 1930 पर कॉल करें।",
      Hinglish:
        "Koi fee mat do aur koi details share mat karo. Chakshu (Sanchar Saathi) pe report karo; agar paisa ja chuka hai to turant 1930 dial karo.",
    },
  },
  {
    id: "utility-disconnect",
    verdict: "HIGH_RISK",
    test: (t) =>
      (/electricity|power|bijli|बिजली/i.test(t) &&
        /disconnect|disconn|cut|kat|काट|band|bandh|tonight|रात|jayegi|जाएगी|immediately|turant|तुरंत/i.test(
          t,
        )) ||
      /disconnect.{0,50}(tonight|immediately|30 min|1 hour)/i.test(t),
    scamType: {
      English: "Fake Electricity Disconnect Threat",
      Hindi: "फर्ज़ी बिजली कटौती की धमकी",
      Hinglish: "Fake Electricity Disconnect Threat",
    },
    reasons: {
      English: [
        "Electricity boards send proper notices — not urgent messages asking you to call a personal mobile number.",
        "'Pay right now or power goes off tonight' is pressure tactics used by impostors.",
      ],
      Hindi: [
        "बिजली विभाग ठीक नोटिस भेजता है — किसी निजी मोबाइल नंबर पर कॉल करने को नहीं कहता।",
        "'अभी भुगतान करो वरना आज रात बिजली कट जाएगी' — यह धमकी की भाषा है।",
      ],
      Hinglish: [
        "Bijli board theek notice bhejta hai — kisi private number pe call karne ko nahi kehta.",
        "'Abhi pay karo warna aaj raat bijli cut jayegi' — ye dhamki ki bhasha hai.",
      ],
    },
    nextAction: {
      English:
        "Do not call the number or pay. Check your bill only on the official electricity board app or website, and report on Chakshu (Sanchar Saathi).",
      Hindi:
        "इस नंबर पर कॉल न करें और भुगतान न करें। बिल की जाँच सिर्फ़ आधिकारिक ऐप/वेबसाइट पर करें, और Chakshu (Sanchar Saathi) पर रिपोर्ट करें।",
      Hinglish:
        "Is number pe call mat karo aur pay mat karo. Bill sirf official app/website pe check karo, aur Chakshu (Sanchar Saathi) pe report karo.",
    },
  },
  {
    id: "kyc-account-block",
    verdict: "CAUTION",
    test: (t) =>
      /(kyc|account|a\/c).{0,70}(expired|block|suspend|invalid|frozen|renew|update)|(update|renew).{0,25}kyc/i.test(
        t,
      ),
    scamType: {
      English: "Fake KYC / Account Block",
      Hindi: "फर्ज़ी KYC / अकाउंट ब्लॉक",
      Hinglish: "Fake KYC / Account Block",
    },
    reasons: {
      English: [
        "Banks handle KYC inside their official app or a branch — not through links in messages.",
        "The link may open a fake page that steals your login details and OTP.",
      ],
      Hindi: [
        "बैंक KYC अपने आधिकारिक ऐप या ब्रांच में करवाते हैं — संदेश में आए लिंक से नहीं।",
        "यह लिंक नकली पेज खोल सकता है जो आपकी लॉगिन जानकारी और OTP चुरा सकता है।",
      ],
      Hinglish: [
        "Bank KYC apne official app ya branch mein karwate hain — message ke link se nahi.",
        "Ye link nakli page khol sakta hai jo aapki login details aur OTP chura sakta hai.",
      ],
    },
    nextAction: {
      English:
        "Do not click the link. Open your bank's official app or visit the branch to check, and ask a family member first.",
      Hindi:
        "लिंक पर क्लिक न करें। जाँच के लिए अपने बैंक का आधिकारिक ऐप खोलें या ब्रांच जाएँ, और पहले परिवार से पूछें।",
      Hinglish:
        "Link pe click mat karo. Check karne ke liye bank ka official app kholo ya branch jao, aur pehle family se poochho.",
    },
  },
  {
    id: "fake-job",
    verdict: "CAUTION",
    test: (t) =>
      /(part.?time|work from home|wfh|earn).{0,70}(daily|per day|week|₹|rs\.?\s?\d)|(kamai|kamana).{0,40}(₹|rs|rupaye)/i.test(
        t,
      ),
    scamType: {
      English: "Fake Job / Earning Offer",
      Hindi: "फर्ज़ी नौकरी / कमाई का ऑफ़र",
      Hinglish: "Fake Job / Earning Offer",
    },
    reasons: {
      English: [
        "Easy-money offers usually demand 'registration fees' or advance payments later.",
        "Real companies do not recruit through random SMS or WhatsApp messages.",
      ],
      Hindi: [
        "आसान कमाई के ऑफ़र आगे चलकर 'रजिस्ट्रेशन फ़ीस' या एडवांस पैसे माँगते हैं।",
        "असली कंपनियाँ आए-दिन के SMS या WhatsApp संदेश से भर्ती नहीं करतीं।",
      ],
      Hinglish: [
        "Aasaan kamai ke offers aage chal kar 'registration fees' ya advance paise maangte hain.",
        "Asli companies roz-marra ke SMS ya WhatsApp se recruitment nahi karti.",
      ],
    },
    nextAction: {
      English:
        "Do not pay anything or share documents. Check the company on its official website first, and ask your family.",
      Hindi:
        "कुछ भी भुगतान न करें और दस्तावेज़ साझा न करें। पहले कंपनी की आधिकारिक वेबसाइट जाँचें और परिवार से पूछें।",
      Hinglish:
        "Kuch bhi pay mat karo aur documents share mat karo. Pehle company ki official website check karo aur family se poochho.",
    },
  },
  {
    id: "suspicious-link",
    verdict: "CAUTION",
    test: (t) =>
      /(click|tap).{0,30}(link|here|below)|tinyurl|bit\.ly|shorturl|\.xyz\b|\.top\b|\.info\b|\.club\b/i.test(
        t,
      ),
    scamType: {
      English: "Suspicious Link",
      Hindi: "संदिग्ध लिंक",
      Hinglish: "Suspicious Link",
    },
    reasons: {
      English: [
        "Links in unexpected messages often open fake pages made to steal money or details.",
        "The sender's name can be copied, so do not trust it alone.",
      ],
      Hindi: [
        "अचानक आए संदेशों के लिंक अक्सर नकली पेज खोलते हैं जो पैसे या जानकारी चुरा सकते हैं।",
        "भेजने वाले का नाम नकल हो सकता है, इसलिए उस पर अकेले भरोसा न करें।",
      ],
      Hinglish: [
        "Achanak aaye messages ke links aksar nakli page kholte hain jo paise ya details chura sakte hain.",
        "Bhejne wale ka naam copy ho sakta hai, isliye us pe akele bharosa mat karo.",
      ],
    },
    nextAction: {
      English:
        "Do not click. If it claims to be your bank or a company you know, open their official app or website yourself instead.",
      Hindi:
        "क्लिक न करें। अगर यह आपके बैंक या किसी जानी-पहचानी कंपनी का है, तो स्वयं उनका आधिकारिक ऐप/वेबसाइट खोलें।",
      Hinglish:
        "Click mat karo. Agar ye aapke bank ya kisi jaani-pehchaani company ka hai, to khud unka official app/website kholo.",
    },
  },
  {
    id: "transaction-alert",
    verdict: "LIKELY_SAFE",
    test: (t) =>
      /(debited|credited|spent|received|paid|sent).{0,60}(rs\.?|₹|inr|\d)|(rs\.?|₹)\s?[\d,]+.{0,50}(debited|credited|spent|received|paid)/i.test(
        t,
      ) && !/(otp|cvv|install|\.apk|lottery|prize|fee)/i.test(t),
    scamType: {
      English: "Legitimate Bank Alert",
      Hindi: "सामान्य बैंक सूचना",
      Hinglish: "Legitimate Bank Alert",
    },
    reasons: {
      English: [
        "This looks like a normal bank notification about money moving in or out.",
        "It only informs — it does not ask you to install anything or share codes.",
      ],
      Hindi: [
        "यह एक सामान्य बैंक सूचना लगती है जिसमें पैसे के आने-जाने का ज़िक्र है।",
        "यह सिर्फ़ सूचित करती है — कोई ऐप इंस्टॉल करने या कोड बताने को नहीं कहती।",
      ],
      Hinglish: [
        "Ye ek normal bank notification lagti hai jisme paise ke aane-jaane ka zikr hai.",
        "Ye sirf inform karti hai — koi app install karne ya code batane ko nahi kehti.",
      ],
    },
    nextAction: {
      English:
        "No action needed. If you do not recognise this transaction, check your bank app or call the number printed on your card.",
      Hindi:
        "कोई कार्रवाई ज़रूरी नहीं। अगर यह लेन-देन आपको समझ नहीं आया, तो बैंक ऐप देखें या कार्ड पर छपे नंबर पर कॉल करें।",
      Hinglish:
        "Koi action nahi chahiye. Agar ye transaction samajh nahi aaya, to bank app dekho ya card pe chhape number pe call karo.",
    },
  },
  {
    id: "delivery-update",
    verdict: "LIKELY_SAFE",
    test: (t) =>
      /(out for delivery|delivered|shipped|dispatch|arriving|track(ing)? (your )?(order|parcel)|order #)/i.test(
        t,
      ) && !/(drug|arrest|fee|otp|kyc|\.apk)/i.test(t),
    scamType: {
      English: "Regular Delivery Update",
      Hindi: "सामान्य डिलीवरी सूचना",
      Hinglish: "Regular Delivery Update",
    },
    reasons: {
      English: [
        "This looks like a routine delivery status message.",
        "It does not ask for money, codes or app installs.",
      ],
      Hindi: [
        "यह एक सामान्य डिलीवरी स्थिति का संदेश लगता है।",
        "यह पैसे, कोड या ऐप इंस्टॉल करने को नहीं कहता।",
      ],
      Hinglish: [
        "Ye ek routine delivery status message lagta hai.",
        "Ye paise, code ya app install karne ko nahi kehta.",
      ],
    },
    nextAction: {
      English: "No action needed. If you did not order anything, simply ignore this message.",
      Hindi: "कोई कार्रवाई ज़रूरी नहीं। अगर आपने कुछ ऑर्डर नहीं किया, तो इसे अनदेखा कर दें।",
      Hinglish: "Koi action nahi chahiye. Agar aapne kuch order nahi kiya, to ise ignore kar do.",
    },
  },
];

const FALLBACK: Rule = {
  id: "needs-second-opinion",
  verdict: "CAUTION",
  // Never actually evaluated — FALLBACK is only used via `?? FALLBACK`.
  test: () => false,
  scamType: {
    English: "Needs a Second Opinion",
    Hindi: "दूसरी राय ज़रूरी",
    Hinglish: "Needs a Second Opinion",
  },
  reasons: {
    English: [
      "Kavach could not confidently verify this message.",
      "Scammers keep finding new tricks, so unusual messages deserve extra care.",
    ],
    Hindi: [
      "कवच इस संदेश की पक्के तौर पर जाँच नहीं कर सका।",
      "ठग नए-नए तरीके आज़माते रहते हैं, इसलिए अजीब संदेशों से सावधान रहें।",
    ],
    Hinglish: [
      "Kavach is message ko pakke taur pe verify nahi kar saka.",
      "Thag naye-naye tarike aazmate rehte hain, isliye ajeeb messages se bachke raho.",
    ],
  },
  nextAction: {
    English:
      "Do not click anything yet. Forward it to a family member, and report on Chakshu (Sanchar Saathi) if it feels wrong.",
    Hindi:
      "अभी कुछ भी क्लिक न करें। इसे परिवार के किसी सदस्य को भेजें, और गलत लगे तो Chakshu (Sanchar Saathi) पर रिपोर्ट करें।",
    Hinglish:
      "Abhi kuch bhi click mat karo. Ise family ke kisi member ko bhejo, aur galat lage to Chakshu (Sanchar Saathi) pe report karo.",
  },
};

function excerpt(text: string, max = 120): string {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max - 1)}…` : clean;
}

function buildSummary(rule: Rule, language: Language, redactedText: string): string {
  const scam = rule.scamType[language];
  const snip = excerpt(redactedText);
  const verdictLine: Record<Language, string> = {
    English: `Kavach flagged this as "${scam}" on your parent's phone. Message: "${snip}" Please call and guide them calmly.`,
    Hindi: `कवच ने आपके अभिभावक के फ़ोन पर इसे "${scam}" चिह्नित किया है। संदेश: "${snip}" कृपया उन्हें कॉल करके शांति से समझाएँ।`,
    Hinglish: `Kavach ne aapke parents ke phone pe ise "${scam}" flag kiya hai. Message: "${snip}" Please unhe call karke shaanti se samjhao.`,
  };
  return verdictLine[language];
}

export function analyzeWithRules(text: string, language: Language): Analysis {
  const redactedText = redactSensitive(text);
  const rule = RULES.find((r) => r.test(redactedText)) ?? FALLBACK;
  return {
    verdict: rule.verdict,
    scamType: rule.scamType[language],
    reasons: rule.reasons[language],
    nextAction: rule.nextAction[language],
    familyAlertSummary: buildSummary(rule, language, redactedText),
  };
}
