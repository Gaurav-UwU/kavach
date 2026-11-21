# Indian SMS/WhatsApp Scam Typologies 2023–2026 — Research Dossier
**Purpose:** source documentation for a defensive scam-detection prompt targeting elders.
**Compiled:** 21 Nov 2026. All verbatim quotes are attributed; reconstructed phrasings are marked "typical template".

---

## 0. Direct answers to the three questions

### Q1. Categories the Chakshu portal lets users report (VERBATIM, fetched from sancharsaathi.gov.in FAQ)
Chakshu ("Report Suspected Fraud Communication / UCC (Spam)") is at `https://sancharsaathi.gov.in/sfc/`. The FAQ states suspected fraud communications are "related to frauds in the name of the following" — the portal's exact category list:

1. **Investment, Stock Market and Trading.**
2. **Impersonation as DoT / TRAI.**
3. **Impersonation as Police, CBI, Customs, Aadhaar, RBI etc.**
4. **Impersonation as a relative / friend.**
5. **KYC and Payment related to Bank / Electricity / Gas / Insurance etc.**
6. **Fake Customer Care Helpline.**
7. **Online job/ gift/ lottery / loans offers.**
8. **IVR / Robo Calls.**
9. **Sextortion.**
10. **Suspected link/ website.**
11. **Any Other Suspected Fraud.**

Other verbatim Chakshu/Sanchar Saathi text:
- "Chakshu facilitates citizens to report the suspected fraud communications with the intention of defrauding telecom service users for cyber-crime, financial frauds, non-bonafide purpose like impersonation or any other misuse through Call, SMS or WhatsApp. Few examples of suspected fraud communications are communication related to impersonation as DoT / TRAI, police, Government official, suspected investment & trading, KYC & Payment related to Bank / Electricity / Gas / Insurance etc."
- "It may be noted that 'Chakshu' is not a facility for reporting about financial fraud or cyber-crime cases. In case, someone has already lost money due to financial fraud or is a victim of cyber-crime, it is suggested to report at cyber-crime helpline number 1930 or website https://www.cybercrime.gov.in."
- Portal live counters (fetched 21 Nov 2026): Chakshu "Inputs Received — 13.99 lakh", "Action Taken — 61.54 lakh".
- The portal's "Keep Yourself Aware" advisory set (DoT PDFs, each verbatim-mined below): **Sextortion, Jump Deposit Fraud, UPI Fraud, Fraud Loan Apps, Investment Scam, Credit Card Scam, SMS Bombarding, Loan Scam, Undeliverable Parcel Scam, Fake Job Calls, Fake Traffic Challans.**

### Q2. What RBI lists as the most common digital fraud patterns
RBI's *BE(A)WARE — A Booklet on Modus Operandi of Financial Frauds* (released 7 Mar 2022; press release 2021-2022/1817) documents, from Ombudsman/CEPC complaints:

**Part A — Banks:** 1. Phishing links · 2. Vishing calls · 3. Frauds using online sales platforms (UPI "request money" reversal trick) · 4. Unknown/unverified mobile apps · 5. ATM card skimming · 6. Screen sharing app / Remote access · 7. SIM swap / SIM cloning · 8. Compromising credentials through search engines (fake customer-care numbers) · 9. Scam through QR code scan · 10. Impersonation on social media · 11. Juice jacking · 12. Lottery frauds · 13. Online job frauds · 14. Money mules.
**Part B — NBFCs:** 1. Fake advertisements for grant of loans · 2. SMS/Email/Instant Messaging/Call scam · 3. OTP-based frauds · 4. Fake loan websites/App frauds · 5. Money circulation/Ponzi/MLM schemes · 6. Loans with forged documents.
(RBI press release verbatim: "The booklet elaborates on safeguards against commonly used fraudulent techniques, such as, SIM swaps, vishing/phishing links, lottery, etc., including fake loan websites and digital apps.")

### Q3. Top-loss categories I4C flagged in 2024–2025
- **Jan–Apr 2024 (I4C CEO Rajesh Kumar, via Indian Express/The Wire):** trading scam **₹1,420.48 crore** (biggest), investment ₹222.58 cr, digital arrest ₹120.30 cr, romance/dating ₹13.23 cr.
- **Full-year 2024 (I4C, via ThePrint):** digital arrest was the fastest-growing: **1,23,672 cases, ₹1,918 crore** (+103% cases, +465% losses YoY).
- **2025 (I4C data via Indian Express, 2 Jan 2026):** of **₹19,812.96 crore** lost — **77% investment schemes, 8% digital arrest, 7% credit-card fraud, 4% sextortion, 3% e-commerce, 1% app/malware**. CFCFRMS complaint mix: 36% investment, 27% credit card, 18% sextortion, 10% e-commerce, 6% digital arrest, 3% app/malware; **45% of complaints originated from Cambodia, Myanmar and Laos**.

---

## 1. "Digital arrest" / fake law-enforcement impersonation (incl. courier-parcel trigger)

1. **Name:** "Digital Arrest" scam; courier impersonation variant ("FedEx parcel scam", "CBI/Customs drug parcel scam").
2. **Channel & escalation:** Pre-recorded IVR call or SMS (spoofed numbers) → live caller claiming parcel contains drugs / Aadhaar-linked crime → "transfers" to fake CBI/NCB/ED/Police on **Skype or WhatsApp video** → victim kept on camera for hours ("digital confinement", fake police-station backdrop) → escalating payment demands "for verification/security deposit/case closure".
3. **Verbatim openings:**
   - BBC (18 May 2026), quoting victim's call: *"Hello ma'am, I'm calling from FedEx. We've been alerted by police that a courier you sent to Iraq contains drugs."*
   - Official I4C advisory TAU/ADV/003 (6 Mar 2025) — modus operandi, verbatim: "Scammer calls potential victims posing himself as member/representative of various Government agencies e.g. Mumbai Police, Delhi Police, Central Bureau of Investigation (CBI), Narcotics Department, Reserve Bank of India (RBI), Telecom Department or Enforcement Directorate. These numbers often spoofed." … "alleges potential victim of involvement in illegal activities, such as sending or receiving contraband items like drugs or fake passports or SIM cards through FedEx or DHL, use of their Aadhaar card and registered mobile number in illegal activities, illegal money deposited into account from a drug dealer, involvement in Money Laundering, terrorist activities, etc." … "Some victims are subjected to 'digital arrest,' where they are forced to stay on video calls often over Skype and WhatsApp… These scammers create a fake setup of police station to make the victim believe that they are actual law enforcement officers."
   - I4C key line, verbatim: **"There is no concept of Digital Arrest under any Indian Laws."**
4. **Psychological hook:** authority + fear of police, seeded personal details (Aadhaar/PAN from leaked data), isolation (no family contact allowed), time pressure and staged legal paperwork.
5. **Victim asked to do:** stay on video call; share Aadhaar/bank statements; "verify" transactions (i.e., transfer money through RTGS/UPI to "RBI escrow"/"safe accounts"); keep paying as "new evidence emerges".
6. **Statistics:** 2022: 39,925 cases / ₹91 cr → 2023: 60,676 / ₹339 cr → **2024: 1,23,672 cases / ₹1,918 cr** → 2025: 17,264 / ₹644 cr (I4C via ThePrint, 18 Feb 2026). Jan–Apr 2024: ₹120.30 cr (I4C). 2026: 21,900 complaints / ₹647 cr Jan 1–Aug 31, 2026 per I4C-MHA status report to Supreme Court (secondary: thefoxdaily.com). PM Modi's Mann Ki Baat (27 Oct 2024): no government agency "threatens people over phone and demands money" (Hindustan Times via The Wire).
7. **Sources:** https://i4c.mha.gov.in/theme/resources/advisories/ADVISORYTAU-ADV-003DigitalArrest06.03.2025.pdf · https://www.bbc.com/news/articles/cevp1lvzd8ko · https://theprint.in/india/governance/after-465-spike-in-2024-mha-data-shows-digital-arrest-scams-are-on-a-decline-in-india/2857002/ · https://thewire.in/tech/indians-lost-nearly-rs-2000-crore-to-digital-arrest-scams-in-2024-report

**Courier sub-variant stats:** NCRP recorded "over 45,000 complaints tagged as specifically 'courier-impersonation fraud' in 2024, where a 1,200-crore loss was registered in that category" (CyberPeace blog — secondary, treat with care). Kerala senior citizen case: ₹1.04 crore, CBI probe (Free Press Journal, 29 Apr 2025). Mumbai victim lost ₹58 crore to CBI/ED impersonation Aug–Oct 2025 (secondary: LinkedIn analysis).

## 2. Investment / trading scams (WhatsApp–Telegram "professor" groups, fake apps)

1. **Name:** WhatsApp/Telegram trading & investment scam; "VIP trading group" scam; IPO-allocation scam.
2. **Channel & escalation:** SMS/RCS/WhatsApp message with short link from unknown 10-digit number → added to WhatsApp "stock forum" group → "professor"/"admin" posts daily picks + dummy members post profit screenshots → APK or link to fake trading app → small wins displayed → victim deposits big → withdrawal blocked with "taxes/charges".
3. **Verbatim (DoT Sanchar Saathi "Investment Scam" advisory, dated 14.05.2026):** "Victims receive messages from unknown 10-digit numbers with short links promising high returns or investment opportunities… The link redirects victims to a whatsapp group… Dummy users share fake profit screenshots to lure victims into investing. Admins share fake investment apps and dashboards with promises of high and consistent returns. Scammers pose as fake admins, so-called professors, and dummy users to create a false sense of credibility… Sharing APK files or links to unregistered investment platforms… Victims keep investing until they attempt to withdraw their money. Scammers then demand repeated charges, leading to realization of fraud and significant financial loss." Key warning signs listed: "Promises of high returns with little or no risk"; "Requests to transfer money to personal bank accounts, UPI IDs, or digital wallets".
   - Press verbatim (Free Press Journal): gang operated a WhatsApp group called **"K05-IIFL Securities Limited"** and a fake app **"IIFL Markets"** promising "block trades and IPOs" (₹18 crore fraud); another case promised "high returns of up to 84%"; victims "were prevented from withdrawing funds and asked to pay extra 'taxes'".
4. **Psychological hook:** greed + social proof (fake screenshots, deepfake videos of news anchors and market experts), sunk-cost escalation.
5. **Victim asked to do:** download APK/sideload app outside Play Store, transfer to personal UPI/bank accounts, pay "30% tax"/"release fee" to withdraw.
6. **Statistics:** Jan–Apr 2024: ₹1,420.48 cr (I4C). Mumbai Jan–Sep 2025: 665 of 3,372 cyber cases = share-market fraud, ~₹400 crore lost (Mumbai Police via FPJ, 29 Oct 2025). Case studies: Mumbai man ₹10.98 crore (NDTV, Dec 2025–Jan 2026); Thane man shown fake ₹34-cr portfolio lost ₹6.44 cr (TOI); 70-year-old ₹1.29 cr via WhatsApp group (ET).
7. **Sources:** DoT PDF https://www.sancharsaathi.gov.in/SancharSaathiDocuments/KeepYourselfAwareDocuments/InvestmentScam.pdf · https://www.freepressjournal.in/mumbai/from-lawyers-to-teens-how-fraudsters-stole-millions-from-665-mumbaikars-in-share-market-scams · https://www.ndtv.com/india-news/fake-app-fabricated-profits-how-mumbai-man-lost-11-crores-to-trading-scam-10850671 · https://timesofindia.indiatimes.com/city/mumbai/thane-man-shown-fake-34-cr-trading-portfolio-loses-6-44cr-in-whatsapp-investment-scam/articleshow/125465013.cms

## 3. Part-time job / "task" scams (Telegram/WhatsApp)

1. **Name:** Online task scam; "prepaid task" work-from-home scam; part-time job scam.
2. **Channel & escalation:** SMS/WhatsApp/Telegram message offering easy money for rating hotels, liking videos, boosting YouTube subscribers → small payouts credited first ("prepaid tasks") → asked to "upgrade" to VIP paid tasks with own money → account "frozen", told to pay more to release earnings.
3. **Verbatim / typical template:** Business Standard: "part-time job involving simple online tasks, such as rating reviews and liking" (Mumbai electrician, ₹10 lakh). Typical template (reconstructed from cases): *"Earn ₹3,000–₹8,000 daily working 30 min/day from home! Pay ₹199 registration, get paid per completed task. Join: [Telegram link]"*.
4. **Psychological hook:** small real payouts build trust (classic pig-butchering on-ramp); then sunk cost — "your ₹2 lakh commission is frozen, pay ₹50,000 to unlock".
5. **Victim asked to do:** pay "registration/training/merchant-top-up" fees via UPI to strangers' accounts, recruit friends.
6. **Statistics:** Pune residents lost **₹27.23 crore to task frauds since March 2023** (Pune Cyber Cell via Business Standard, May 2024); Delhi Jan 2023: "30,000 people defrauded of ₹200 crore" (Business Standard, as reported); case studies: Bengaluru ₹44.8 lakh (TOI), ₹57.75 lakh (India Today, Dec 2024).
7. **Sources:** https://www.business-standard.com/finance/personal-finance/mumbai-women-lose-rs-53-lakh-to-task-fraud-latest-scam-decoded-124052100319_1.html · https://timesofindia.indiatimes.com/city/bengaluru/fake-work-from-home-task-leaves-bengaluru-man-poorer-by-rs-44-8-lakh/articleshow/133407383.cms · https://www.indiatoday.in/technology/news/story/27-year-old-man-loses-rs-57-lakh-in-part-time-job-scam-2655724-2024-12-26

## 4. TRAI / DoT mobile-disconnection impersonation

1. **Name:** TRAI disconnection scam / fake "mobile numbers will be blocked" robocall.
2. **Channel:** pre-recorded IVR call claiming to be TRAI/DoT; sometimes WhatsApp messages with forged TRAI letterheads.
3. **Verbatim (TRAI Press Release No. 55/2024, 21 Aug 2024):** "It has been brought to the notice of Telecom Regulatory Authority of India (TRAI) that lot of pre-recorded calls are being made to the citizens claiming to be from TRAI. Citizens are threatened that their numbers will be blocked soon, and they are asked to give certain personal information." … "any form of communication (call, message, or notice) claiming to be from TRAI and threatening mobile number disconnection should be considered a potential fraudulent attempt and must not be entertained."
   - Typical robocall template (reconstructed from PIB Fact Check/timesnow coverage): *"Your mobile numbers registered in your name will be disconnected in 2 hours. Press 9 to speak to a TRAI officer."*
4. **Hook:** fear of losing one's number (elder's lifeline to family) + authority.
5. **Victim asked to do:** share Aadhaar/KYC details, OTPs, or "verify bank account" — feeding into KYC/OTP fraud or digital-arrest chain (scam calls get "escalated" to fake Mumbai police).
6. **Statistics:** DoT action on related telecom-misuse: TRAI/DoT "jointly disconnect over 1 crore 'fraud' mobile numbers" (2024–25 press reports). No single loss figure; typically a lead-in to other frauds.
7. **Sources:** https://trai.gov.in/sites/default/files/2024-10/PR_No.55of2024.pdf · https://pib.gov.in/PressReleasePage.aspx?PRID=2119782 · https://economictimes.indiatimes.com/industry/telecom/telecom-news/telecom-regulator-asks-public-not-to-fall-prey-to-fraudulent-calls-claiming-to-be-from-trai/articleshow/112686750.cms

## 5. Electricity/utility bill & KYC-disconnection scams

1. **Name:** "Electricity bill disconnection" scam; "electricity KYC update" scam (also gas/insurance/bank KYC).
2. **Channel:** SMS/WhatsApp: "your power will be cut tonight" → call from "electricity officer" → remote-install APK or UPI "request".
3. **Verbatim (Economic Times):** "Citizens reported some cases of fraudsters using SMS & WhatsApp messages related to electricity KYC updates and malicious APK files to manipulate and gain control over victims' devices. These messages ask people to update their KYC details in order to prevent their electricity from being disconnected."
   - Typical template (reconstructed): *"Dear Consumer, your electricity will be disconnected tonight at 9:00 PM as your bill was not updated. Please contact electricity officer: 92XXXXXX01. BESCOM."*
4. **Hook:** fear of disconnection on a hot evening; utility "officer" callback credibility.
5. **Victim asked to do:** call the number, download an APK ("update form"), or approve a UPI request ("pay ₹10 verification that will be refunded").
6. **Statistics:** DoT, June 2024: blocked **392 handsets** and ordered re-verification of **31,740 mobile connections** linked to the "electricity KYC update" scam (CyberDefence/DoT). SBI issued a formal warning (Moneycontrol, Nov 2025). Case: 77-year-old doctor lost ₹3 lakh (ET, Mar 2024).
7. **Sources:** https://economictimes.indiatimes.com/wealth/save/electricity-bill-kyc-update-scam-what-is-the-scam-govt-measures-to-safeguard-users/electricity-bill-kyc-update-scam/slideshow/111106105.cms · https://cyberdefence.org.in/blog/electricity-bill-disconnection-sms-scam/ · https://www.moneycontrol.com/news/business/what-is-electricity-bill-scam-sbi-warns-against-fake-calls-kyc-messages-and-payment-links-here-s-how-to-stay-safe-14081031.html

## 6. "Jumped deposit" / UPI collect-request scam

1. **Name:** Jumped deposit scam (DoT advisory); UPI "request money" scam (RBI).
2. **Channel:** UPI + phone call.
3. **Verbatim (DoT "Beware of Jumped Deposit Alert" PDF):** "A stranger sends a small amount – ₹10, ₹50 or more – to your bank account through UPI… The caller claims the money was sent by mistake and urgently asks you to return it… A UPI collect request arrives for a much larger amount, disguised as the 'refund'… You enter your UPI PIN thinking you are returning the money. That approves the larger payment." Key warning signs: "Unsolicited deposit requests; Demands for immediate fund transfers; Requests for sensitive account details; Use of unfamiliar payment links; Pressure to act without verification."
   - RBI Be(A)ware verbatim: "Instead of paying money to the seller, they use the 'request money' option through the Unified Payments Interface (UPI) app and insist that the seller approve the request by entering UPI PIN. Once the seller enters the PIN, money is transferred to the fraudster's account." and "there is no need to enter PIN / password anywhere to receive money."
   - DoT UPI Fraud Alert PDF verbatim: **"Your UPI PIN is only for SENDING money. You never need it to RECEIVE money. If anyone asks for your PIN or OTP to 'send you money' or 'refund' — it is a fraud."** Also: scammers send "an unexpected payment request or QR code — often saying 'pay to receive your refund' — and push you to approve it quickly."
4. **Hook:** honesty/guilt ("you got my money by mistake") + small real deposit as proof.
5. **Victim asked to do:** "return" the ₹50 by approving a collect request of ₹5,000 (or scan QR).
6. **Statistics:** part of the UPI-fraud family; QR-code + collect-request scams listed by RBI among most common. (UPI-enabled frauds are within the ₹22,845 crore 2024 national cyber-fraud loss total, I4C/MHA.)
7. **Sources:** https://www.sancharsaathi.gov.in/SancharSaathiDocuments/KeepYourselfAwareDocuments/JumpDepositFraud.pdf · https://www.sancharsaathi.gov.in/SancharSaathiDocuments/KeepYourselfAwareDocuments/UPIFraudAlert.pdf · RBI BE(A)WARE (https://rbidocs.rbi.org.in/rdocs/content/pdfs/BEAWARE07032022.pdf)

## 7. Sextortion (WhatsApp/video-call)

1. **Name:** Sextortion fraud (DoT advisory; I4C 2025 category).
2. **Channel:** WhatsApp video call from stranger (often dressed female "wrong number"), screen recording → threats → blackmail via WhatsApp.
3. **Verbatim (DoT "Beware of Sextortion" PDF):** stages: "ONLINE APPROACH — A stranger connects through social media or video calls… GAINING TRUST — They build trust using fake identities or friendly conversations… PRIVATE CONTENT CAPTURED — They obtain or secretly record intimate photos or videos… THREATS — They threaten to share the content with family and friends… DEMANDS MONEY — They demand money or more explicit content." Warning signs: "Requests for private images; Pressure to respond immediately; Repeated demands after payment; Threats to expose private content; Demands for money; Promises to delete content after payment."
4. **Hook:** shame/fear of reputational ruin — especially potent for elders.
5. **Victim asked to do:** pay repeatedly ("repeated demands after payment"); share more content.
6. **Statistics:** 2025: 4% of ₹19,812 crore national loss = sextortion; 18% of CFCFRMS complaints (I4C via Indian Express).
7. **Sources:** https://www.sancharsaathi.gov.in/SancharSaathiDocuments/KeepYourselfAwareDocuments/SextortionAlert.pdf · https://indianexpress.com/article/india/indians-lost-rs-53000-crore-fraud-cheating-cases-six-years-maharashtra-2025-10452185/

## 8. Malicious APK/links via WhatsApp — "wedding invitation", KYC APKs, suspected links

1. **Name:** Wedding-invitation APK scam; also "traffic challan APK", "KYC APK", APK-based banking malware.
2. **Channel:** WhatsApp message with `.apk` attachment or short link, dressed as digital wedding card / e-challan / KYC form.
3. **Verbatim/press:** Economic Times: "The scam involves sending fake wedding invitations via malicious APK files. Once downloaded, these files install malware on the victim's device, giving hackers access to personal data, control over messaging, and the ability to conduct financial fraud." TOI: "These invitations, distributed as APK files via WhatsApp, can compromise Android phones." News18: "A trader near Ahmedabad lost over Rs. 6 lakh after opening a fake invitation file on WhatsApp."
   - DoT parcel advisory verbatim (related call-forwarding trick): "Genuine Delivery Service Provider NEVER ask to Dial *21*number#" — advises dialing *#21# to check call forwarding and ##002# to deactivate.
   - Typical template (reconstructed): *"🙏 Hello uncle, sharing our wedding card 💌. Please install to view: bit.ly/3xYz (Wedding_Invite.apk)"*.
4. **Hook:** social/family event, emotion; access to ALL SMS/OTPs.
5. **Victim asked to do:** enable "install from unknown sources", open APK (accessibility+SMS permissions), then OTPs get harvested and WhatsApp contacts get spammed too.
6. **Statistics:** 2025: 1% of national losses "app/malware based" per I4C (₹~198 crore) — but APKs are also the enabler of many credit-card/UPI frauds.
7. **Sources:** https://economictimes.indiatimes.com/magazines/panache/whatsapp-fake-wedding-scam-can-steal-all-your-money-with-one-message-how-it-works-and-how-to-stay-safe/articleshow/115266324.cms · https://timesofindia.indiatimes.com/business/cybersecurity/wedding-invite-scam-cybercrooks-use-fake-apk-files-to-hijack-phones-steal-bank-data/articleshow/121468949.cms · https://www.news18.com/tech/whatsapp-wedding-invite-apk-file-scam-bank-account-how-to-stay-safe-10365774.html

## 9. Fake customer care / search-engine number fraud

1. **Name:** Fake customer-care helpline scam (Chakshu category 6; RBI Be(A)ware ch. 8).
2. **Channel:** victim searches Google for "SBI customer care" → calls fraudster number listed in ads/SEO → call back or "helpline" from SMS/WhatsApp.
3. **Verbatim (RBI BE(A)WARE):** "Customers use search engines to obtain contact details / customer care numbers of their bank, insurance company, Aadhaar updation centre, etc. These contact details on search engines often do NOT belong to the respective entity but are made to appear as such by fraudsters… Once the customers call on these contact numbers, the imposters ask the customers to share their card credentials / details for verification." Also: "customer care numbers are never in the form of mobile numbers."
4. **Hook:** elder's habit of "calling the bank" rather than using apps.
5. **Victim asked to do:** read out OTP/CVV/UPI PIN "for verification", or install "support app" (screen share).
6. **Statistics:** screen-sharing app fraud is RBI ch. 6; no single national figure; part of credit-card fraud (7% of 2025 losses).
7. **Sources:** RBI BE(A)WARE PDF (above) · https://www.csb.bank.in/pdf/BEAWARE.pdf (mirror)

## 10. Lottery / gift / prize scams

1. **Name:** Lottery fraud (RBI), "online gift offers" (Chakshu category 7).
2. **Channel:** SMS/WhatsApp "You have won ₹25,00,000 in [KBC/Shri Balaji] lucky draw" → call → fees.
3. **Verbatim (RBI BE(A)WARE):** "Fraudsters send emails or make phone calls that a customer has won a huge lottery. However, in order to receive the money, the fraudsters ask the customers to confirm their identity by entering their bank account / credit card details on a website from which data is captured… Fraudsters also ask the customers to pay taxes/ forex charges / upfront or pay the shipping charges, processing / handling fee, etc." RBI adds: "RBI never opens accounts of members of public or takes deposits from them… RBI never asks for personal / bank details… Never respond to messages offering / promising prize money, government aid and KYC updation to receive prize money."
   - Typical template (reconstructed): *"Congratulations! Your mobile no. has won ₹25,00,000.00 in KBC Lucky Draw 2024. Send your Aadhaar & account details to claim. Manager: +91 9XXXXXXXXX"*.
4. **Hook:** windfall greed; tiny "fee" vs huge prize.
5. **Victim asked to do:** pay "GST/transfer fee" in advance; share account/card details.
6. **Statistics:** among RBI's listed top complaints (BE(A)WARE); subsumed in "Other" categories of 2025 data.
7. **Sources:** RBI BE(A)WARE PDF · Sanchar Saathi FAQ ("fake customer services / lottery offer / loan offer / job offer…")

## 11. Fake loan apps / loan scams

1. **Name:** Fraudulent loan apps; instant-loan scams (DoT "Fraud Loan Apps"/"Loan Scam" advisories; RBI Part B ch. 1 & 4).
2. **Channel:** SMS "₹5 lakh loan approved in 5 minutes, no documents" → APK/app → excessive permissions → data + contact-list access.
3. **Verbatim (RBI BE(A)WARE, fake loan websites/apps):** fraudsters circulate "certain app links, masked to appear similar to the existing apps of authorised entities… Once the malicious application is downloaded, the fraudster gains complete access to the customer's device. These include confidential details stored on the device and messages / OTPs received before / after installation of such apps."
   - Typical template (reconstructed): *"Get instant loan ₹10,000–₹5,00,000! No salary slip. 2-min approval. Download: [link]"*.
4. **Hook:** credit hunger; then harassment (contact-list scraping, morphed images) to extort repayments of loans never fully disbursed.
5. **Victim asked to do:** install APK, allow all permissions, pay "processing fee" upfront.
6. **Statistics:** RBI press release (Mar 2022) explicitly names "fake loan websites and digital apps" among top techniques. Indian Express 2026: smaller cities/rural seeing uptick "particularly in fraudulent loan apps". Loss figures folded into app/malware + credit-card categories.
7. **Sources:** https://rbidocs.rbi.org.in/rdocs/content/pdfs/BEAWARE07032022.pdf · https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=53372 · https://www.sancharsaathi.gov.in/SancharSaathiDocuments/KeepYourselfAwareDocuments/FraudLoanApps.pdf

## 12. Fake traffic e-challan

1. **Name:** Fake traffic challan scam (DoT advisory).
2. **Channel:** SMS/WhatsApp "e-challan" with payment link.
3. **Verbatim (DoT "Fake Traffic Challan Scam" PDF):** headline quote in the advisory itself: **"Unpaid Challan? Pay immediately" — "IT'S A SCAM!!"**; and "Traffic Police NEVER send direct payment links via SMS, WhatsApp, or Email"; "Do Not Download APKs and click on suspicious links"; verify only on "mParivahan / Official e-Challan portal".
   - Typical template (reconstructed): *"Your vehicle DL-3CAXXXXX has a pending challan of ₹500. Pay now: https://echallan-parivahan[.]xyz"*.
4. **Hook:** minor legal fear; low-value link normalizes clicking.
5. **Victim asked to do:** open link (card details or APK).
6. **Statistics:** no national figure isolated; covered under phishing/suspected-link category.
7. **Source:** https://www.sancharsaathi.gov.in/SancharSaathiDocuments/KeepYourselfAwareDocuments/FakeTrafficChallan.pdf

## 13. Impersonation as relative/friend (WhatsApp "Dad, I lost my phone")

1. **Name:** Friend/relative impersonation (Chakshu category 4; RBI "Impersonation on social media").
2. **Channel:** WhatsApp message from "son/daughter" claiming new/lost number: needs urgent money for emergency.
3. **Verbatim (RBI BE(A)WARE):** "Fraudsters create fake accounts using details of the users of social media platforms… send a request to the users' friends asking for money for urgent medical purposes, payments, etc." Precaution: "Always verify the genuineness of a fund request from a friend / relative by confirming through a phone call / physical meeting."
   - Typical template (reconstructed): *"Hi Mom, this is my new number, my phone got damaged. I'm in a small emergency, transfer ₹40,000 to this account quickly, will explain later."* BBC notes AI voice-cloning versions: "They also use AI to clone voices and impersonate people or send emotional pleas to extort money."
4. **Hook:** love/urgency; elder doesn't want to disturb "busy" child with a call.
5. **Victim asked to do:** UPI/bank transfer before verification.
6. **Statistics:** romance/dating ₹13.23 cr Jan–Apr 2024 (I4C) — adjacent category; impersonation cases not separately totaled.
7. **Sources:** RBI BE(A)WARE · Chakshu FAQ (sancharsaathi.gov.in) · https://www.bbc.com/news/articles/cevp1lvzd8ko

## 14. Credit-card / OTP / vishing frauds

1. **Name:** Credit card fraud (DoT advisory; 2025 I4C category), vishing (RBI ch. 2), OTP-based fraud (RBI Part B ch. 3).
2. **Channel:** call/SMS "unusual transaction on your card, press 1 / share OTP to block".
3. **Verbatim (DoT "Credit Card Scam" PDF warning signs):** "Requests action outside official apps; Asks for sensitive information; Unexpected call or message about card issue; Sends suspicious link or form; Impersonating bank officials."
   - RBI verbatim: "Bank officials / financial institutions / RBI / any genuine entity never ask customers to share confidential information such as username / password / card details / CVV / OTP. Never share these confidential details with anyone, even your own family members, and friends."
4. **Hook:** panic about money already "being stolen".
5. **Victim asked to do:** share OTP/CVV or approve collect request to "stop the debit".
6. **Statistics:** 7% of ₹19,812 crore 2025 losses = credit-card fraud (I4C); RBI FY2024-25 Annual Report (as reported by Vishvas News): ~24,000 bank-fraud cases, ~₹36,000 crore involved, of which card/internet frauds were 56.5% of cases involving ~₹520 crore.
7. **Sources:** https://www.sancharsaathi.gov.in/SancharSaathiDocuments/KeepYourselfAwareDocuments/CreditCardScam.pdf · RBI BE(A)WARE · https://www.vishvasnews.com/english/explainer/vishvas-news-analysis-₹23000-crore-loss-in-2024-digital-arrest-will-be-the-face-of-cyber-fraud-in-2025/

---

## National scale dashboard (for prompt calibration)

| Metric | Value | Source |
|---|---|---|
| NCRP complaints 2021 / 2022 / 2023 | 4.52L / 9.66L / 15.56L | I4C via The Wire (Oct 2024) |
| Complaints Jan 1–Apr 30 2024 | 7.4 lakh | I4C via The Wire |
| Total cyber-fraud loss 2024 | ₹22,845 crore (MHA); ₹22,849.49 cr (NCRP) | ThePrint; Indian Express |
| Total cyber-fraud loss 2025 | ₹22,495 crore (MHA); ₹19,812.96 cr (NCRP) | ThePrint; Indian Express |
| Six-year (2020–2025) loss | ₹52,976 crore | I4C via Indian Express |
| 2025 loss mix | 77% investment, 8% digital arrest, 7% credit card, 4% sextortion, 3% e-commerce, 1% app/malware | I4C via Indian Express |
| Digital arrest 2024 | 1,23,672 cases / ₹1,918 crore | I4C via ThePrint |
| Digital arrest 2025 | 17,264 cases / ₹644 crore (−86% cases) | I4C via ThePrint |
| Cross-border origin (2025) | 45% of CFCFRMS complaints from Cambodia, Myanmar, Laos | Indian Express / I4C |
| NCRB 2023–24 | cybercrime +18% YoY; >₹220 billion lost; 101,928 cases registered 2024 | NCRB via BBC |
| Golden-hour money blocking | 6% (2021) → 19% (2026) | MHA via ThePrint |
| Victim rate (HM Amit Shah, Nov 2025 event) | "one person falls prey every 3.5 seconds; 97–100 people every hour" | ThePrint |
| Helplines | 1930 · cybercrime.gov.in · Chakshu (sancharsaathi.gov.in/sfc) · DoT int'l-call report 1963 | Govt portals |

## Gaps / caveats
- **cybercrime.gov.in internal category tree**: the portal 403-blocks automated fetches and no desktop browser was attached in this session; its complaint-flow categories (Financial Fraud, etc.) could not be captured verbatim. Verified instead: the I4C advisory's references to NCRP and the Sanchar Saathi text directing fraud victims to cybercrime.gov.in/1930.
- RBI FY2024-25 annual-report figures quoted via Vishvas News (secondary). PIB release PRID=2153153 (TRAI advisory, later wave) and PIB PRID=2119782 pages were 403-blocked; TRAI PR No. 55/2024 PDF was used verbatim instead.
- "Courier-impersonation 45,000 complaints/₹1,200 crore 2024" is from CyberPeace blog citing NCRP — secondary; cross-check before publication.
- Figures mixing MHA (₹22,845 cr) and NCRP-cheating (₹22,849 cr) totals for 2024 differ slightly by counting method; cited per outlet.
