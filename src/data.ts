export interface LanguageDict {
  heroTagline: string;
  heroSub: string;
  heroBadge: string;
  freeBadge: string;
  downloadBtn: string;
  downloadApk: string;
  supportBtn: string;
  featuresTitle: string;
  featuresSub: string;
  howItWorksTitle: string;
  howItWorksSub: string;
  donationTitle: string;
  donationSub: string;
  contactTitle: string;
  contactSub: string;
  
  // Feature Cards
  featureBillingTitle: string;
  featureBillingDesc: string;
  featureKhataTitle: string;
  featureKhataDesc: string;
  featureBackupTitle: string;
  featureBackupDesc: string;
  featureStockTitle: string;
  featureStockDesc: string;

  // Simulator UI
  simBillingTitle: string;
  simBillingTotal: string;
  simBillingGenerate: string;
  simBillingSuccess: string;
  simKhataCustomer: string;
  simKhataBalance: string;
  simKhataAdd: string;
  simKhataReceive: string;
  simBackupSync: string;
  simBackupSuccess: string;
  simStockSearchPlaceholder: string;
  simStockLow: string;

  // Donation Card
  donChooseAmount: string;
  donCustomAmount: string;
  donUpiIdLabel: string;
  donUpiPlaceholder: string;
  donGenerateQr: string;
  donScanPay: string;
  donCopyUpi: string;
  donCopied: string;
  donText: string;

  // Contact / WhatsApp
  whatsappQueryPlaceholder: string;
  whatsappSendBtn: string;
  whatsappStatus: string;
  whatsappCardTitle: string;
  whatsappCardDesc: string;
  
  // Installer Steps
  installTitle: string;
  installStep1: string;
  installStep1Desc: string;
  installStep2: string;
  installStep2Desc: string;
  installStep3: string;
  installStep3Desc: string;
}

export const translations: Record<'en' | 'hi', LanguageDict> = {
  en: {
    heroBadge: "100% Free & No Ads — Forever",
    heroTagline: "Make Your Medical Store Digital with PharmaCare",
    heroSub: "The ultimate offline-first mobile assistant for smart pharmacists. Create automated bills, securely backup data to your own Google Drive, manage medicine inventory, and keep track of customer credits (Udhari Khata) in one neat app.",
    freeBadge: "Zero Cost, Zero Advertisements, Fully Offline & Safe",
    downloadBtn: "Download App",
    downloadApk: "Download PharmaCare APK",
    supportBtn: "Support Developer",
    featuresTitle: "Powering Your Pharmacy with Advanced Features",
    featuresSub: "Designed to be incredibly fast, super reliable, and fully offline. Explore the interactive simulators below to see how PharmaCare works!",
    howItWorksTitle: "How to Install PharmaCare App?",
    howItWorksSub: "Deploy your app on GitHub and install it on any Android device in seconds.",
    donationTitle: "Support the Developer",
    donationSub: "PharmaCare is 100% Free and ad-free. It is built to help small pharmacy owners digitize their business without paying heavy monthly fees. If you love this project, please consider donating to support active development!",
    contactTitle: "Direct WhatsApp Support",
    contactSub: "Got questions? Want custom features or face any issues? Get in touch with the developer directly on WhatsApp.",
    
    // Feature Cards
    featureBillingTitle: "Automatic Billing",
    featureBillingDesc: "Create clean receipts in seconds. Automatically computes totals, discounts, and item breakdowns. Ready to share on WhatsApp or print over Bluetooth.",
    featureKhataTitle: "Udhari Khata Ledger",
    featureKhataDesc: "Never forget a single penny. Record credits, send reminders, track payment histories, and maintain separate customer ledgers effortlessly.",
    featureBackupTitle: "Google Drive Backup",
    featureBackupDesc: "Your data stays strictly under your control. Backup and restore all your database files directly to your own personal Google Drive account in one click.",
    featureStockTitle: "Medicine Inventory",
    featureStockDesc: "Keep your shelves updated. Quick medicine searching, automated stock counters, expiration alerts, and rack placement indexers.",

    // Simulator UI
    simBillingTitle: "Live Billing Simulator",
    simBillingTotal: "Total Bill Amount",
    simBillingGenerate: "Generate Digital Receipt",
    simBillingSuccess: "Receipt generated successfully! Ready to print.",
    simKhataCustomer: "Customer Name",
    simKhataBalance: "Due Balance",
    simKhataAdd: "Add New Record",
    simKhataReceive: "Receive Payment",
    simBackupSync: "Sync with Google Drive",
    simBackupSuccess: "Database backed up successfully to GDrive!",
    simStockSearchPlaceholder: "Search medicine (e.g., Paracetamol)...",
    simStockLow: "Low Stock Alert",

    // Donation Card
    donChooseAmount: "Choose Support Amount",
    donCustomAmount: "Or enter custom amount (₹)",
    donUpiIdLabel: "Developer UPI ID",
    donUpiPlaceholder: "Enter UPI ID",
    donGenerateQr: "Generate Secure UPI QR",
    donScanPay: "Scan with Google Pay, PhonePe, Paytm, or any UPI App to Pay",
    donCopyUpi: "Copy UPI ID",
    donCopied: "Copied!",
    donText: "Your support keeps PharmaCare 100% Free, safe, and regularly updated with new features.",

    // Contact / WhatsApp
    whatsappQueryPlaceholder: "Write your message or question here...",
    whatsappSendBtn: "Send WhatsApp Message",
    whatsappStatus: "Direct Whatsapp helpline is active",
    whatsappCardTitle: "Message the Developer",
    whatsappCardDesc: "Direct assistance with installation, features, and database restores.",

    // Installer Steps
    installTitle: "3-Step Easy Installation Guide",
    installStep1: "1. Download the APK",
    installStep1Desc: "Click the download button to grab the latest official APK from our secure server or GitHub releases.",
    installStep2: "2. Allow Unknown Sources",
    installStep2Desc: "If prompted, enable 'Install from unknown sources' in your Android security settings.",
    installStep3: "3. Open and Get Started!",
    installStep3Desc: "Open PharmaCare, set up your store name, link your Google Drive for automatic backups, and start billing."
  },
  hi: {
    heroBadge: "100% फ्री और विज्ञापन मुक्त — हमेशा के लिए",
    heroTagline: "PharmaCare के साथ अपने मेडिकल स्टोर को बनाएं डिजिटल",
    heroSub: "स्मार्ट फार्मासिस्टों के लिए बेहतरीन ऑफलाइन-फर्स्ट मोबाइल असिस्टेंट। ऑटोमैटिक बिल बनाएं, अपने स्वयं के Google Drive पर सुरक्षित बैकअप लें, दवाओं के स्टॉक का प्रबंधन करें और ग्राहकों के उधारी खाता का आसान रिकॉर्ड रखें।",
    freeBadge: "बिना किसी शुल्क, विज्ञापन-मुक्त, पूरी तरह ऑफलाइन और सुरक्षित",
    downloadBtn: "ऐप डाउनलोड करें",
    downloadApk: "PharmaCare APK डाउनलोड करें",
    supportBtn: "डेवलपर को सपोर्ट करें",
    featuresTitle: "एडवांस्ड फीचर्स से अपने मेडिकल स्टोर को गति दें",
    featuresSub: "अत्यंत तेज, विश्वसनीय और पूरी तरह से ऑफलाइन डिजाइन। नीचे दिए गए इंटरैक्टिव सिमुलेटर के साथ देखें कि PharmaCare कैसे काम करता है!",
    howItWorksTitle: "PharmaCare ऐप कैसे इंस्टॉल करें?",
    howItWorksSub: "गिटहब या नीचे दिए बटन से ऐप डाउनलोड करें और किसी भी एंड्रॉइड डिवाइस पर मिनटों में इंस्टॉल करें।",
    donationTitle: "डेवलपर को आर्थिक योगदान दें (Donation)",
    donationSub: "PharmaCare 100% फ्री और विज्ञापन-मुक्त है। इसे इसलिए बनाया गया है ताकि छोटे फार्मेसी और मेडिकल स्टोर मालिक बिना किसी मासिक शुल्क के अपने बिजनेस को डिजिटल बना सकें। यदि आपको यह काम पसंद आया, तो कृपया प्रोजेक्ट को जारी रखने के लिए डोनेशन दें!",
    contactTitle: "सीधा व्हाट्सएप सपोर्ट (Helpline)",
    contactSub: "कोई प्रश्न है? अपनी पसंद का कोई फीचर चाहते हैं या कोई समस्या आ रही है? सीधे व्हाट्सएप पर डेवलपर से संपर्क करें।",
    
    // Feature Cards
    featureBillingTitle: "ऑटोमैटिक बिलिंग",
    featureBillingDesc: "सेकंडों में साफ और सुंदर रसीदें बनाएं। कुल योग, डिस्काउंट और आइटम ब्रेकडाउन स्वचालित रूप से कैलकुलेट करें। व्हाट्सएप पर शेयर या ब्लूटूथ प्रिंट के लिए तैयार।",
    featureKhataTitle: "उधारी खाता लेजर",
    featureKhataDesc: "एक-एक पैसे का हिसाब रखें। उधारी दर्ज करें, पेमेंट हिस्ट्री देखें, और बिना किसी कागजी झंझट के हर ग्राहक का अलग डिजिटल बहीखाता मेंटेन करें।",
    featureBackupTitle: "गूगल ड्राइव बैकअप",
    featureBackupDesc: "आपका डेटा पूरी तरह आपके नियंत्रण में है। एक क्लिक में अपने व्यक्तिगत गूगल ड्राइव अकाउंट पर डेटाबेस फाइलों को सुरक्षित बैकअप और रीस्टोर करें।",
    featureStockTitle: "दवाइयों का स्टॉक",
    featureStockDesc: "अलमारियों को हमेशा अपडेट रखें। त्वरित मेडिसिन सर्च, ऑटोमैटिक स्टॉक काउंट, एक्सपायरी अलर्ट और रैक लोकेशन इंडेक्सर का लाभ उठाएं।",

    // Simulator UI
    simBillingTitle: "लाइव बिलिंग सिमुलेटर",
    simBillingTotal: "कुल बिल राशि",
    simBillingGenerate: "डिजिटल रसीद बनाएं",
    simBillingSuccess: "रसीद सफलतापूर्वक बन गई है! प्रिंट के लिए तैयार।",
    simKhataCustomer: "ग्राहक का नाम",
    simKhataBalance: "बाकी उधारी राशि",
    simKhataAdd: "नया रिकॉर्ड जोड़ें",
    simKhataReceive: "उधारी भुगतान प्राप्त करें",
    simBackupSync: "गूगल ड्राइव से सिंक करें",
    simBackupSuccess: "डेटाबेस आपके गूगल ड्राइव पर सुरक्षित सेव हो गया है!",
    simStockSearchPlaceholder: "दवा सर्च करें (जैसे Paracetamol)...",
    simStockLow: "कम स्टॉक चेतावनी (Low Stock)",

    // Donation Card
    donChooseAmount: "सपोर्ट राशि चुनें",
    donCustomAmount: "या अपनी पसंद की राशि डालें (₹)",
    donUpiIdLabel: "डेवलपर का UPI ID",
    donUpiPlaceholder: "UPI ID दर्ज करें",
    donGenerateQr: "सुरक्षित UPI QR कोड बनाएं",
    donScanPay: "भुगतान के लिए Google Pay, PhonePe, Paytm या किसी भी UPI ऐप से स्कैन करें",
    donCopyUpi: "UPI ID कॉपी करें",
    donCopied: "कॉपी हो गया!",
    donText: "आपका योगदान PharmaCare को हमेशा 100% फ्री, सुरक्षित और नए फीचर्स के साथ अपडेट रखने में मदद करता है।",

    // Contact / WhatsApp
    whatsappQueryPlaceholder: "अपनी समस्या या सवाल यहाँ लिखें...",
    whatsappSendBtn: "व्हाट्सएप पर संदेश भेजें",
    whatsappStatus: "व्हाट्सएप हेल्प डेस्क सक्रिय है",
    whatsappCardTitle: "डेवलपर से संपर्क करें",
    whatsappCardDesc: "ऐप इंस्टॉल करने, सेटअप करने और डेटा रीस्टोर करने में सीधी सहायता पाएं।",

    // Installer Steps
    installTitle: "3-चरणों में आसान इंस्टॉलेशन गाइड",
    installStep1: "1. APK डाउनलोड करें",
    installStep1Desc: "नीचे दिए गए डाउनलोड बटन पर क्लिक करके सुरक्षित सर्वर या गिटहब रिलीज से लेटेस्ट APK प्राप्त करें।",
    installStep2: "2. अज्ञात स्रोत (Unknown Sources) चालू करें",
    installStep2Desc: "यदि पूछा जाए, तो अपने फोन की सेटिंग्स में 'अज्ञात स्रोतों से ऐप इंस्टॉल करने' की अनुमति दें।",
    installStep3: "3. ऐप खोलें और इस्तेमाल करें!",
    installStep3Desc: "PharmaCare खोलें, अपने मेडिकल स्टोर का नाम दर्ज करें, गूगल ड्राइव लिंक करें और तुरंत बिल बनाना शुरू करें।"
  }
};

export const sampleMedicines = [
  { id: 1, name: "Paracetamol 650mg", stock: 120, rack: "A-4", expiry: "12/2027", price: 2.5 },
  { id: 2, name: "Amoxicillin 500mg", stock: 14, rack: "B-2", expiry: "10/2026", price: 8.0 },
  { id: 3, name: "Cetirizine 10mg", stock: 240, rack: "C-1", expiry: "04/2028", price: 1.2 },
  { id: 4, name: "Metformin 500mg", stock: 4, rack: "A-2", expiry: "09/2026", price: 3.5 },
  { id: 5, name: "Atorvastatin 10mg", stock: 85, rack: "D-3", expiry: "02/2027", price: 12.4 },
  { id: 6, name: "Ibuprofen 400mg", stock: 0, rack: "B-5", expiry: "Expired", price: 4.0 },
];

export const sampleCustomers = [
  { id: "c1", name: "Ramesh Kumar", balance: 1450, phone: "9876543210", lastTransaction: "2 days ago" },
  { id: "c2", name: "Anil Sharma", balance: 350, phone: "9812345678", lastTransaction: "Today" },
  { id: "c3", name: "Vijay Singh", balance: 2200, phone: "9988776655", lastTransaction: "1 week ago" },
  { id: "c4", name: "Dr. Alok Maurya", balance: 0, phone: "9450123456", lastTransaction: "3 weeks ago" },
];

export const billingMedicinesList = [
  { id: "b1", name: "Paracetamol 650mg", price: 2.5, stripSize: 10 },
  { id: "b2", name: "Amoxicillin 500mg", price: 8.0, stripSize: 6 },
  { id: "b3", name: "Pantocid 40mg", price: 11.5, stripSize: 15 },
  { id: "b4", name: "Cetirizine 10mg", price: 1.2, stripSize: 10 },
  { id: "b5", name: "Combiflam", price: 3.8, stripSize: 10 },
];
