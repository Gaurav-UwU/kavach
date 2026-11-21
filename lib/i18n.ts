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
  why: string;
  doNow: string;
  listen: string;
  stopListening: string;
  sendAlert: string;
  banner: (name: string, relation: string) => string;
  viewAlert: string;
  offlineNote: string;

  guardTitle: string;
  guardDesc: string;
  fieldLabel: { name: string; relation: string; phone: string };
  relationOptions: string[];
  autoAlertToggle: string;
  save: string;
  phoneError: string;
  savedNote: string;

  alertModalTitle: string;
  alertTo: string;
  alertRedactedNote: string;
  openWhatsapp: string;
  close: string;

  errorGeneric: string;
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
    why: "Why?",
    doNow: "What to do now",
    listen: "Listen",
    stopListening: "Stop",
    sendAlert: "Send Alert on WhatsApp",
    banner: (name, relation) => `Family Alert triggered for ${name} (${relation})`,
    viewAlert: "View Alert",
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

    alertModalTitle: "Family Alert Preview",
    alertTo: "To",
    alertRedactedNote: "OTPs, PINs and account numbers were removed automatically.",
    openWhatsapp: "Open WhatsApp",
    close: "Close",

    errorGeneric: "Sorry, Kavach could not check this right now. Please try again.",
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
    why: "क्यों?",
    doNow: "अब क्या करें",
    listen: "सुनें",
    stopListening: "रोकें",
    sendAlert: "WhatsApp पर अलर्ट भेजें",
    banner: (name, relation) => `${name} (${relation}) के लिए फैमिली अलर्ट भेजा गया`,
    viewAlert: "अलर्ट देखें",
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

    alertModalTitle: "फैमिली अलर्ट — झलक",
    alertTo: "को",
    alertRedactedNote: "OTP, PIN और अकाउंट नंबर अपने-आप हटा दिए गए हैं।",
    openWhatsapp: "WhatsApp खोलें",
    close: "बंद करें",

    errorGeneric: "माफ़ करें, कवच अभी यह जाँच नहीं कर पाया। कृपया फिर कोशिश करें।",
    imgTooBig: "तस्वीर 4 MB से छोटी होनी चाहिए",
    imgTypeBad: "सिर्फ़ PNG, JPG या WebP तस्वीरें चलेंगी",
    removeAttachment: "तस्वीर हटाएँ",

    verdictLabel: {
      HIGH_RISK: "उच्च-जोखिम घोटाला",
      CAUTION: "सावधानी — पहले जाँचें",
      LIKELY_SAFE: "संभवतः सुरक्षित",
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
    why: "Kyun?",
    doNow: "Ab kya karein",
    listen: "Sunaiye",
    stopListening: "Rokein",
    sendAlert: "WhatsApp pe Alert bhejo",
    banner: (name, relation) => `${name} (${relation}) ke liye Family Alert trigger ho gaya`,
    viewAlert: "Alert dekho",
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

    alertModalTitle: "Family Alert — jhalak",
    alertTo: "Ko",
    alertRedactedNote: "OTP, PIN aur account number apne-aap hata diye gaye hain.",
    openWhatsapp: "WhatsApp kholo",
    close: "Band karo",

    errorGeneric: "Maaf karo, Kavach abhi ye check nahi kar paya. Phir se try karo.",
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
