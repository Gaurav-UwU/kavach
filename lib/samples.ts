export interface SampleMessage {
  emoji: string;
  label: string;
  text: string;
}

/** Pre-loaded quick-test chips shown above the input bar. */
export const SAMPLE_MESSAGES: SampleMessage[] = [
  {
    emoji: "⚡",
    label: "Electricity Bill Cut",
    text: "Dear customer your electricity power will be disconnected tonight 9:30 PM. Call officer 9876543210 immediately.",
  },
  {
    emoji: "🏦",
    label: "SBI KYC (.apk)",
    text: "Your SBI YONO account is blocked. Install SBI_KYC_Update.apk to reactivate immediately.",
  },
  {
    emoji: "🚨",
    label: "Digital Arrest",
    text: "Mumbai Crime Branch: A FedEx parcel with your Aadhaar has illegal drugs. Join video call now or face Digital Arrest.",
  },
  {
    emoji: "✅",
    label: "Real Bank Alert",
    text: "Rs. 450.00 debited from A/c XX1234 via UPI to ZOMATO on 21-11-26. Not you? Call 1800-202-6161.",
  },
];
