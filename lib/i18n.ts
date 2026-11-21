import type { Language } from "./types";

/**
 * All UI chrome strings in the three supported languages.
 * Analysis text (verdict reasons, actions, alert summaries) is produced in the
 * selected language by the AI layer / heuristic rules — not from this file.
 */
export interface Strings {
  subtitle: string;
  welcome: string;
  disclaimer: string;
  chipsTitle: string;
  inputPlaceholder: string;
  analyzing: string;
  today: string;
  encryption: string;
  typing: string;
  listening: string;
  voiceUnsupported: string;
  menuLabel: string;
  guardSettings: string;
  clearChat: string;
  reset: string;
  why: string;
  doNow: string;
  listen: string;
  stopListening: string;
  sendToGuard: (name: string) => string;
  alertSentCaption: (name: string, relation: string, phone: string) => string;
  reportChakshu: string;
  call1930: string;
  offlineNote: string;

  guardTitle: string;
  guardDesc: string;
  fieldLabel: { name: string; relation: string; phone: string };
  relationOptions: string[];
  autoAlertToggle: string;
  save: string;
  phoneError: string;
  savedNote: string;

  close: string;

  errorGeneric: string;
  autoAlertNoContact: string;
  onboardConfirm: string;
  changeLanguage: string;
  menuAsk: string;
  menuTip: string;
  guardSetupAsk: (name: string, relation: string, phone: string) => string;
  guardKeep: (name: string, relation: string) => string;
  guardKeepConfirm: (name: string, relation: string) => string;
  guardUpdatedConfirm: (name: string, relation: string, phone: string) => string;
  imgTooBig: string;
  imgTypeBad: string;
  removeAttachment: string;

  verdictLabel: Record<"HIGH_RISK" | "CAUTION" | "LIKELY_SAFE", string>;
}

export const STRINGS: Record<Language, Strings> = {
  English: {
    subtitle: "Online",
    welcome:
      "Forward any suspicious SMS, WhatsApp message, or screenshot here before clicking. I will tell you if it is safe — in simple words.",
    disclaimer: "Demo prototype. Always double-check with your bank or family.",
    chipsTitle: "Forward a sample message",
    inputPlaceholder: "Paste suspicious message...",
    analyzing: "Kavach is checking this message…",
    today: "TODAY",
    encryption:
      "🔒 Messages in this demo never leave your phone. Only the text you send for checking is analyzed.",
    typing: "typing…",
    listening: "Listening…",
    voiceUnsupported: "Voice input is not supported in this browser",
    menuLabel: "Menu",
    guardSettings: "Family Guard settings",
    clearChat: "Clear chat",
    reset: "Reset prototype",
    why: "Why?",
    doNow: "What to do now",
    listen: "Listen",
    stopListening: "Stop",
    sendToGuard: (n) => `📤 Send this to ${n}`,
    alertSentCaption: (n, r, p) => `Sent to ${n} (${r}) · +91 ${p}`,
    reportChakshu: "🌐 Report on Chakshu",
    call1930: "📞 Call 1930",
    offlineNote: "Checked with Kavach's built-in safety rules (offline mode)",

    guardTitle: "Family Guard",
    guardDesc:
      "If Kavach finds a high-risk scam, it can WhatsApp a calm alert to your trusted person.",
    fieldLabel: { name: "Name", relation: "Relation", phone: "Mobile number (10 digits)" },
    relationOptions: ["Son", "Daughter", "Grandson", "Granddaughter", "Nephew", "Niece", "Other"],
    autoAlertToggle: "Auto-Alert on High-Risk Threats",
    save: "Save",
    phoneError: "Please enter a valid 10-digit mobile number",
    savedNote: "Saved on this device",

    close: "Close",

    errorGeneric: "Sorry, Kavach could not check this right now. Please try again.",
    autoAlertNoContact:
      "⚠️ Auto-Alert is ON, but no Family Guard number is set. Open Family Guard settings to enable automatic alerts.",
    onboardConfirm:
      "Done! We'll chat in English from now on. 🛡️\nForward any suspicious message — or tap a sample below — and I'll check it for you.",
    changeLanguage: "Change language",
    menuAsk: "What would you like to change?",
    menuTip: "💡 You can change the language or your Family Guard anytime — just type menu.",
    guardSetupAsk: (n, r, p) =>
      `🛡️ One last step — your Family Guard is the person Kavach alerts on WhatsApp when a scam is detected. Right now that's ${n} (${r}), +91 ${p}.`,
    guardKeep: (n, r) => `✅ Keep ${n} (${r})`,
    guardKeepConfirm: (n, r) => `Done — alerts will go to ${n} (${r}) on WhatsApp. 🛡️`,
    guardUpdatedConfirm: (n, r, p) =>
      `Family Guard updated — alerts will now go to ${n} (${r}), +91 ${p}. 🛡️`,
    imgTooBig: "Image must be under 4 MB",
    imgTypeBad: "Only PNG, JPG or WebP images are supported",
    removeAttachment: "Remove attachment",

    verdictLabel: {
      HIGH_RISK: "HIGH-RISK SCAM",
      CAUTION: "CAUTION — VERIFY FIRST",
      LIKELY_SAFE: "LIKELY SAFE",
    },
  },

  Hindi: {
    subtitle: "ऑनलाइन",
    welcome:
      "कोई भी संदिग्ध SMS, WhatsApp संदेश या स्क्रीनशॉट क्लिक करने से पहले यहाँ भेजें। मैं आसान शब्दों में बताऊँगा कि यह सुरक्षित है या नहीं।",
    disclaimer: "यह एक डेमो है। कृपया अपने बैंक या परिवार से भी जाँच लें।",
    chipsTitle: "नमूना संदेश भेजकर देखें",
    inputPlaceholder: "संदिग्ध संदेश यहाँ पेस्ट करें...",
    analyzing: "कवच यह संदेश जाँच रहा है…",
    today: "आज",
    encryption:
      "🔒 इस डेमो चैट के संदेश आपके फ़ोन से बाहर नहीं जाते। सिर्फ़ जाँच के लिए भेजा गया टेक्स्ट ही जाँचा जाता है।",
    typing: "टाइप कर रहा है…",
    listening: "सुन रहा हूँ…",
    voiceUnsupported: "इस ब्राउज़र में वॉइस इनपुट नहीं चलता",
    menuLabel: "मेनू",
    guardSettings: "फैमिली गार्ड सेटिंग्स",
    clearChat: "चैट साफ़ करें",
    reset: "प्रोटोटाइप रीसेट करें",
    why: "क्यों?",
    doNow: "अब क्या करें",
    listen: "सुनें",
    stopListening: "रोकें",
    sendToGuard: (n) => `📤 यह ${n} को भेजें`,
    alertSentCaption: (n, r, p) => `${n} (${r}) · +91 ${p} को भेजा गया`,
    reportChakshu: "🌐 Chakshu पर रिपोर्ट करें",
    call1930: "📞 1930 कॉल करें",
    offlineNote: "कवच के बिल्ट-इन नियमों से जाँचा गया (ऑफ़लाइन मोड)",

    guardTitle: "फैमिली गार्ड",
    guardDesc:
      "अगर कवच कोई बड़ा ख़तरा पाता है, तो आपके भरोसेमंद व्यक्ति को WhatsApp पर शांत अलर्ट भेज सकता है।",
    fieldLabel: { name: "नाम", relation: "रिश्ता", phone: "मोबाइल नंबर (10 अंक)" },
    relationOptions: ["बेटा", "बेटी", "पोता", "पोती", "भतीजा", "भतीजी", "अन्य"],
    autoAlertToggle: "बड़े ख़तरे पर अपने-आप अलर्ट भेजें",
    save: "सेव करें",
    phoneError: "कृपया सही 10 अंकों का मोबाइल नंबर डालें",
    savedNote: "इस डिवाइस पर सेव हो गया",

    close: "बंद करें",

    errorGeneric: "माफ़ करें, कवच अभी यह जाँच नहीं कर पाया। कृपया फिर कोशिश करें।",
    autoAlertNoContact:
      "⚠️ ऑटो-अलर्ट चालू है, पर फैमिली गार्ड का नंबर सेट नहीं है। अपने-आप अलर्ट के लिए फैमिली गार्ड सेटिंग्स खोलें।",
    onboardConfirm:
      "हो गया! अब हम हिंदी में बात करेंगे। 🛡️\nकोई भी संदिग्ध संदेश भेजें — या नीचे नमूना आज़माएँ — मैं जाँच कर दूँगा।",
    changeLanguage: "भाषा बदलें",
    menuAsk: "आप क्या बदलना चाहेंगे?",
    menuTip: "💡 भाषा या फैमिली गार्ड कभी भी बदलें — बस menu टाइप करें।",
    guardSetupAsk: (n, r, p) =>
      `🛡️ एक आख़िरी कदम — फैमिली गार्ड वह व्यक्ति है जिसे कवच किसी घोटाले पर WhatsApp अलर्ट भेजता है। अभी वह है ${n} (${r}), +91 ${p}।`,
    guardKeep: (n, r) => `✅ ${n} (${r}) को ही रखें`,
    guardKeepConfirm: (n, r) => `हो गया — अलर्ट अब ${n} (${r}) को WhatsApp पर जाएँगे। 🛡️`,
    guardUpdatedConfirm: (n, r, p) =>
      `फैमिली गार्ड अपडेट — अलर्ट अब ${n} (${r}), +91 ${p} को जाएँगे। 🛡️`,
    imgTooBig: "तस्वीर 4 MB से छोटी होनी चाहिए",
    imgTypeBad: "सिर्फ़ PNG, JPG या WebP तस्वीरें चलेंगी",
    removeAttachment: "तस्वीर हटाएँ",

    verdictLabel: {
      HIGH_RISK: "उच्च-जोखिम घोटाला",
      CAUTION: "सावधानी — पहले जाँचें",
      LIKELY_SAFE: "संभवतः सुरक्षित",
    },
  },

  Marathi: {
    subtitle: "ऑनलाइन",
    welcome:
      "कोणताही संशयास्पद SMS, WhatsApp संदेश किंवा स्क्रीनशॉट क्लिक करण्यापूर्वी येथे पाठवा. साध्या शब्दांत सुरक्षित आहे की नाही ते मी सांगेन.",
    disclaimer: "हे एक डेमो आहे. कृपया तुमच्या बँकेकडे किंवा कुटुंबाकडेही एकदा तपासा.",
    chipsTitle: "नमुना संदेश पाठवून पहा",
    inputPlaceholder: "संशयास्पद संदेश येथे पेस्ट करा...",
    analyzing: "कवच हा संदेश तपासत आहे…",
    today: "आज",
    encryption:
      "🔒 या डेमो चॅटमधील संदेश तुमच्या फोनबाहेर जात नाहीत. तपासणीसाठी पाठवलेला मजकूरच तपासला जातो.",
    typing: "टाइप करत आहे…",
    listening: "ऐकत आहे…",
    voiceUnsupported: "या ब्राउझरमध्ये व्हॉइस इनपुट चालत नाही",
    menuLabel: "मेनू",
    guardSettings: "फॅमिली गार्ड सेटिंग्ज",
    clearChat: "चॅट साफ करा",
    reset: "प्रोटोटाइप रीसेट करा",
    why: "का?",
    doNow: "आता काय करावे",
    listen: "ऐका",
    stopListening: "थांबा",
    sendToGuard: (n) => `📤 हे ${n} यांना पाठवा`,
    alertSentCaption: (n, r, p) => `${n} (${r}) · +91 ${p} यांना पाठवले`,
    reportChakshu: "🌐 Chakshu वर रिपोर्ट करा",
    call1930: "📞 1930 कॉल करा",
    offlineNote: "कवचच्या अंतर्गत नियमांद्वारे तपासले गेले (ऑफलाइन मोड)",

    guardTitle: "फॅमिली गार्ड",
    guardDesc:
      "कवचला मोठा धोका आढळल्यास, तुमच्या विश्वासाच्या व्यक्तीला WhatsApp वर शांत अलर्ट पाठवू शकतो.",
    fieldLabel: { name: "नाव", relation: "नाते", phone: "मोबाइल क्रमांक (10 अंकी)" },
    relationOptions: ["मुलगा", "मुलगी", "नातू", "नात", "भाचा", "भाची", "इतर"],
    autoAlertToggle: "मोठ्या धोक्यावर आपोआप अलर्ट पाठवा",
    save: "सेव्ह करा",
    phoneError: "कृपया योग्य 10 अंकी मोबाइल क्रमांक टाका",
    savedNote: "या डिव्हाइसवर सेव्ह झाले",

    close: "बंद करा",

    errorGeneric: "क्षमस्व, कवच आत्ता हे तपासू शकले नाही. कृपया पुन्हा प्रयत्न करा.",
    autoAlertNoContact:
      "⚠️ ऑटो-अलर्ट चालू आहे, पण फॅमिली गार्डचा नंबर सेट नाही. आपोआप अलर्टसाठी फॅमिली गार्ड सेटिंग्ज उघडा.",
    onboardConfirm:
      "झाले! आता आपण मराठीत बोलू. 🛡️\nकोणताही संशयास्पद संदेश पाठवा — किंवा खालील नमुना पाहा — मी तपासतो.",
    changeLanguage: "भाषा बदला",
    menuAsk: "तुम्ही काय बदलू इच्छिता?",
    menuTip: "💡 भाषा किंवा फॅमिली गार्ड कधीही बदला — फक्त menu टाइप करा.",
    guardSetupAsk: (n, r, p) =>
      `🛡️ शेवटचे एक — फॅमिली गार्ड म्हणजे फसवणूक आढळल्यास कवच WhatsApp वर अलर्ट पाठवणारी व्यक्ती. सध्या ती ${n} (${r}), +91 ${p} आहे.`,
    guardKeep: (n, r) => `✅ ${n} (${r}) यांनाच ठेवा`,
    guardKeepConfirm: (n, r) => `झाले — अलर्ट आता ${n} (${r}) यांना WhatsApp वर जाणार आहेत. 🛡️`,
    guardUpdatedConfirm: (n, r, p) =>
      `फॅमिली गार्ड अपडेट झाले — अलर्ट आता ${n} (${r}), +91 ${p} यांना जाणार आहेत. 🛡️`,
    imgTooBig: "प्रतिमा 4 MB पेक्षा लहान असावी",
    imgTypeBad: "फक्त PNG, JPG किंवा WebP प्रतिमा चालतील",
    removeAttachment: "प्रतिमा काढा",

    verdictLabel: {
      HIGH_RISK: "उच्च-धोक्याची फसवणूक",
      CAUTION: "सावध — आधी तपासा",
      LIKELY_SAFE: "बहुधा सुरक्षित",
    },
  },

  Hinglish: {
    subtitle: "Online",
    welcome:
      "Koi bhi suspicious SMS, WhatsApp message ya screenshot click karne se pehle yahan forward karo. Main simple words mein bataunga ki ye safe hai ya nahi.",
    disclaimer: "Ye ek demo hai. Bank ya family se bhi ek baar check kar lena.",
    chipsTitle: "Sample message forward karke dekho",
    inputPlaceholder: "Suspicious message paste karo...",
    analyzing: "Kavach ye message check kar raha hai…",
    today: "AAJ",
    encryption:
      "🔒 Is demo chat ke messages aapke phone se bahar nahi jaate. Sirf check karne bheja gaya text hi analyze hota hai.",
    typing: "typing…",
    listening: "Sun raha hoon…",
    voiceUnsupported: "Is browser mein voice input nahi chalta",
    menuLabel: "Menu",
    guardSettings: "Family Guard settings",
    clearChat: "Chat clear karo",
    reset: "Prototype reset karo",
    why: "Kyun?",
    doNow: "Ab kya karein",
    listen: "Sunaiye",
    stopListening: "Rokein",
    sendToGuard: (n) => `📤 Ye ${n} ko bhejo`,
    alertSentCaption: (n, r, p) => `${n} (${r}) · +91 ${p} ko bheja`,
    reportChakshu: "🌐 Chakshu pe report karo",
    call1930: "📞 1930 dial karo",
    offlineNote: "Kavach ke built-in rules se check kiya gaya (offline mode)",

    guardTitle: "Family Guard",
    guardDesc:
      "Agar Kavach koi bada khatra paata hai, to aapke bharosemand insaan ko WhatsApp pe shaant alert bhej sakta hai.",
    fieldLabel: { name: "Naam", relation: "Rishta", phone: "Mobile number (10 digit)" },
    relationOptions: ["Beta", "Beti", "Pota", "Poti", "Bhatija", "Bhatiji", "Anya"],
    autoAlertToggle: "Bade khatre par apne-aap alert bhejo",
    save: "Save karo",
    phoneError: "Sahi 10 digit ka mobile number daalo",
    savedNote: "Is device par save ho gaya",

    close: "Band karo",

    errorGeneric: "Maaf karo, Kavach abhi ye check nahi kar paya. Phir se try karo.",
    autoAlertNoContact:
      "⚠️ Auto-Alert ON hai, par Family Guard ka number set nahi hai. Apne-aap alert ke liye Family Guard settings kholo.",
    onboardConfirm:
      "Ho gaya! Ab hum Hinglish mein baat karenge. 🛡️\nKoi bhi suspicious message bhejo — ya neeche sample try karo — main check kar dunga.",
    changeLanguage: "Language badlo",
    menuAsk: "Aap kya badalna chahenge?",
    menuTip: "💡 Language ya Family Guard kabhi bhi badlo — bas menu type karo.",
    guardSetupAsk: (n, r, p) =>
      `🛡️ Ek last step — Family Guard wo insaan hai jise Kavach scam milne par WhatsApp alert bhejta hai. Abhi wo ${n} (${r}), +91 ${p} hai.`,
    guardKeep: (n, r) => `✅ ${n} (${r}) ko hi rakho`,
    guardKeepConfirm: (n, r) => `Ho gaya — alerts ab ${n} (${r}) ko WhatsApp pe jayenge. 🛡️`,
    guardUpdatedConfirm: (n, r, p) =>
      `Family Guard update — alerts ab ${n} (${r}), +91 ${p} ko jayenge. 🛡️`,
    imgTooBig: "Image 4 MB se chhoti honi chahiye",
    imgTypeBad: "Sirf PNG, JPG ya WebP images chalengi",
    removeAttachment: "Image hatao",

    verdictLabel: {
      HIGH_RISK: "HIGH-RISK SCAM",
      CAUTION: "CAUTION — PEHLE VERIFY KARO",
      LIKELY_SAFE: "LIKELY SAFE",
    },
  },
};

/** Small colored dot shown before each verdict label. */
export const VERDICT_DOT: Record<"HIGH_RISK" | "CAUTION" | "LIKELY_SAFE", string> = {
  HIGH_RISK: "🔴",
  CAUTION: "🟡",
  LIKELY_SAFE: "🟢",
};
