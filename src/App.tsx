import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Minus, 
  Heart, 
  Smartphone, 
  CheckCircle2, 
  QrCode, 
  Printer, 
  Download, 
  MessageSquare, 
  Share2, 
  Search, 
  Database, 
  BookOpen, 
  Users, 
  Check, 
  Copy, 
  X, 
  Languages, 
  Activity, 
  Info, 
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  Sparkles,
  FileText,
  Trash2,
  RotateCcw,
  Sliders
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  translations, 
  sampleMedicines, 
  sampleCustomers, 
  billingMedicinesList, 
  LanguageDict 
} from "./data";

export default function App() {
  const [lang, setLang] = useState<'en' | 'hi'>('hi'); // Defaulting to Hindi as requested
  const t: LanguageDict = translations[lang];

  // Active Simulator Tab ('billing' | 'khata' | 'backup' | 'stock')
  const [activeSimTab, setActiveSimTab] = useState<'billing' | 'khata' | 'backup' | 'stock'>('billing');
  const [selectedScreen, setSelectedScreen] = useState<string>("a4-invoice");

  // Interactive Billing State
  const [billItems, setBillItems] = useState<{ id: string; name: string; price: number; qty: number }[]>([
    { id: "b1", name: "Paracetamol 650mg", price: 2.5, qty: 10 },
    { id: "b3", name: "Pantocid 40mg", price: 11.5, qty: 5 },
  ]);
  const [selectedBillItem, setSelectedBillItem] = useState("b2");
  const [billGenerated, setBillGenerated] = useState(false);

  // Interactive Udhari Khata State
  const [customers, setCustomers] = useState(sampleCustomers);
  const [selectedCustomerId, setSelectedCustomerId] = useState("c1");
  const [khataAmountInput, setKhataAmountInput] = useState("500");
  const [khataAction, setKhataAction] = useState<'receive' | 'add'>('add');
  const [khataMessage, setKhataMessage] = useState("");

  // Interactive Google Drive Sync State
  const [backupSyncing, setBackupSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<string>("Never");
  const [syncCount, setSyncCount] = useState(0);

  // Interactive Stock Search State
  const [stockSearchQuery, setStockSearchQuery] = useState("");
  const [medicinesList, setMedicinesList] = useState(sampleMedicines);

  // Donation State
  const [donationAmount, setDonationAmount] = useState<number>(500);
  const [customAmountText, setCustomAmountText] = useState("");
  const [upiId, setUpiId] = useState("9696971627@ptyes"); // Pre-filled with user number's UPI
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Customizable Shop details for Billing Header
  const [shopName, setShopName] = useState("PHARMACARE MEDICAL STORE");
  const [shopAddress, setShopAddress] = useState("Main Road, Opp. Civil Hospital, Lucknow, UP");
  const [drugLicense, setDrugLicense] = useState("20B-UP12345, 21B-UP12346");
  const [pharmacistName, setPharmacistName] = useState("Dr. R. K. Sharma (Regd. Pharmacist - 45201)");

  // WhatsApp Query State
  const [whatsappMsg, setWhatsappMsg] = useState("");

  // Auto-generate QR code when amount or UPI changes
  useEffect(() => {
    const finalAmount = donationAmount;
    // UPI payment deep link format
    const upiLink = `upi://pay?pa=${upiId}&pn=PharmaCare%20Developer&am=${finalAmount}&cu=INR&tn=Support%20PharmaCare%20App`;
    const encodedUpi = encodeURIComponent(upiLink);
    // Secure QR code API
    setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodedUpi}&color=0f766e&margin=10`);
  }, [donationAmount, upiId]);

  // Handle Billing Add Item
  const handleAddBillItem = () => {
    const med = billingMedicinesList.find(m => m.id === selectedBillItem);
    if (!med) return;
    
    const existing = billItems.find(item => item.id === med.id);
    if (existing) {
      setBillItems(billItems.map(item => item.id === med.id ? { ...item, qty: item.qty + 5 } : item));
    } else {
      setBillItems([...billItems, { id: med.id, name: med.name, price: med.price, qty: 10 }]);
    }
    setBillGenerated(false);
  };

  // Adjust billing quantities
  const updateQty = (id: string, delta: number) => {
    setBillItems(billItems.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }).filter(item => item.qty > 0));
    setBillGenerated(false);
  };

  // Billing math
  const subtotal = billItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const discount = subtotal * 0.1; // 10% auto-discount
  const cgst = (subtotal - discount) * 0.06; // 6% CGST
  const sgst = (subtotal - discount) * 0.06; // 6% SGST
  const totalBill = Math.round((subtotal - discount + cgst + sgst) * 100) / 100;

  // Handle Khata action
  const handleKhataTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(khataAmountInput);
    if (isNaN(amount) || amount <= 0) return;

    setCustomers(customers.map(c => {
      if (c.id === selectedCustomerId) {
        let newBalance = c.balance;
        if (khataAction === 'add') {
          newBalance += amount;
        } else {
          newBalance = Math.max(0, c.balance - amount);
        }
        return {
          ...c,
          balance: newBalance,
          lastTransaction: "Just Now"
        };
      }
      return c;
    }));

    const activeCustomer = customers.find(c => c.id === selectedCustomerId);
    if (activeCustomer) {
      const actText = khataAction === 'add' ? (lang === 'hi' ? "उधारी जोड़ी गई" : "Credit added") : (lang === 'hi' ? "भुगतान प्राप्त हुआ" : "Payment received");
      setKhataMessage(`✅ ₹${amount} ${actText} - ${activeCustomer.name}`);
      setTimeout(() => setKhataMessage(""), 4000);
    }
    setKhataAmountInput("");
  };

  // Simulating GDrive Backup Sync
  const handleBackupSync = () => {
    setBackupSyncing(true);
    setTimeout(() => {
      setBackupSyncing(false);
      const now = new Date();
      setLastSynced(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setSyncCount(prev => prev + 1);
    }, 2000);
  };

  // Handle preset donation amount clicks
  const handlePresetDonation = (amount: number) => {
    setDonationAmount(amount);
    setCustomAmountText("");
  };

  // Handle custom donation text changes
  const handleCustomDonationChange = (val: string) => {
    setCustomAmountText(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setDonationAmount(num);
    } else {
      setDonationAmount(0);
    }
  };

  // Copy UPI to Clipboard
  const copyUpiToClipboard = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  // Launch pre-filled WhatsApp message
  const handleWhatsAppSend = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMsg = encodeURIComponent(whatsappMsg || "Hello! I am interested in the PharmaCare App.");
    const url = `https://wa.me/919696971627?text=${cleanMsg}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen text-slate-100 font-sans selection:bg-teal-500 selection:text-white transition-colors duration-300">
      {/* Floating Sparkle background effects */}
      <div className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none -z-10 h-[800px]">
        <div className="absolute top-[10%] left-[5%] w-72 h-72 rounded-full bg-emerald-500/20 blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-[35%] right-[8%] w-96 h-96 rounded-full bg-teal-500/20 blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* HEADER SECTION */}
      <nav className="sticky top-0 z-50 bg-slate-950/40 backdrop-blur-xl border-b border-white/10 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8.5 h-8.5 sm:w-10 sm:h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-600/20">
              <span className="font-sans font-extrabold text-lg sm:text-xl">+</span>
            </div>
            <div>
              <span className="text-lg sm:text-xl font-bold tracking-tight bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                PharmaCare
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-semibold uppercase">
                Free
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Quick Navigation Links for Large Screens */}
            <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-300 mr-2">
              <a href="#features" className="hover:text-teal-400 transition-colors">
                {lang === 'hi' ? 'विशेषताएं' : 'Features'}
              </a>
              <a href="#simulator" className="hover:text-teal-400 transition-colors">
                {lang === 'hi' ? 'डेमो' : 'Interactive Demo'}
              </a>
              <a href="#donation" className="hover:text-teal-400 transition-colors">
                {lang === 'hi' ? 'सपोर्ट (Donation)' : 'Donation'}
              </a>
              <a href="#install" className="hover:text-teal-400 transition-colors">
                {lang === 'hi' ? 'स्थापना गाइड' : 'How to Install'}
              </a>
            </div>

            {/* Language Selection Toggle */}
            <button 
              id="language-toggle"
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg sm:rounded-xl border border-white/10 bg-white/5 shadow-sm hover:bg-white/10 hover:border-teal-500/50 hover:text-teal-400 transition-all text-xs sm:text-sm font-semibold cursor-pointer"
            >
              <Languages className="w-3.5 h-3.5 text-teal-400" />
              <span>{lang === 'en' ? 'हिंदी' : 'English'}</span>
            </button>

            {/* Download CTA Button */}
            <a 
              id="nav-download-cta"
              href="#install" 
              className="hidden sm:flex items-center space-x-2 px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-sm transition-all hover:shadow-md cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{t.downloadBtn}</span>
            </a>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-4 pb-10 sm:pt-8 sm:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 shadow-sm animate-pulse">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] sm:text-sm font-bold tracking-wide">
                  {t.heroBadge}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                {t.heroTagline}
              </h1>

              <p className="text-xs sm:text-base md:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-sans">
                {t.heroSub}
              </p>

              {/* Unique Features quick list badges */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-1.5 sm:gap-3 pt-1">
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] sm:text-sm font-medium">
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>100% Free App</span>
                </span>
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] sm:text-sm font-medium">
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>No Ads Always</span>
                </span>
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] sm:text-sm font-medium">
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>Offline Ledger</span>
                </span>
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] sm:text-sm font-medium">
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>Drive Auto Backup</span>
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <a 
                  id="hero-download-apk"
                  href="#install" 
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white hover:from-teal-700 hover:to-emerald-700 font-bold text-sm sm:text-lg shadow-lg shadow-teal-600/20 hover:shadow-xl hover:shadow-teal-600/30 hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  <Download className="w-4.5 h-4.5 animate-bounce" />
                  <span>{t.downloadApk}</span>
                </a>
                
                <a 
                  id="hero-support-dev"
                  href="#donation" 
                  className="w-full sm:w-auto flex items-center justify-center space-x-1.5 px-5 py-3 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 hover:border-teal-500/50 text-slate-200 hover:text-white hover:bg-white/10 font-bold text-sm sm:text-lg transition-all cursor-pointer"
                >
                  <Heart className="w-4.5 h-4.5 text-rose-500 fill-rose-500" />
                  <span>{t.supportBtn}</span>
                </a>
              </div>

              <div className="pt-1 text-slate-400 text-[10px] sm:text-sm flex items-center justify-center lg:justify-start space-x-1.5 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Clean & Secure APK | 100% Virus Free</span>
              </div>
            </div>

            {/* Right Interactive Donation Card Column (Support PharmaCare) */}
            <div id="donation" className="lg:col-span-5 flex justify-center animate-fade-in">
              <div className="w-full bg-slate-900/60 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-white/10 shadow-2xl space-y-4 text-white">
                <div className="space-y-1 text-left">
                  <span className="px-2.5 py-0.5 bg-rose-500/10 text-rose-300 border border-rose-500/20 rounded-full font-mono text-[9px] font-bold uppercase tracking-wider inline-block">
                    ❤️ Support PharmaCare Project
                  </span>
                  <h3 className="text-sm sm:text-lg font-bold text-white">
                    {lang === 'hi' ? 'प्रोजेक्ट को सपोर्ट करें' : 'Support the Developer'}
                  </h3>
                  <p className="text-xs text-slate-300 font-sans">
                    {lang === 'hi' 
                      ? 'PharmaCare 100% फ्री है। यदि यह उपयोगी है, तो आप सहयोग कर सकते हैं।' 
                      : 'Help us keep PharmaCare 100% free with no ads. Your support matters!'}
                  </p>
                </div>

                <div className="space-y-3.5 text-left">
                  <div className="flex items-center justify-between">
                    <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wide">
                      {lang === 'hi' ? 'सहयोग राशि चुनें:' : 'Select Amount:'}
                    </label>
                    <span className="text-[8px] bg-teal-950 text-teal-400 border border-teal-900/30 px-1.5 py-0.5 rounded font-mono font-bold">
                      UPI QR Active
                    </span>
                  </div>

                  {/* Presets Grid */}
                  <div className="grid grid-cols-5 gap-1.5">
                    {[100, 200, 500, 1000, 2000].map(amt => (
                      <button 
                        key={amt}
                        onClick={() => handlePresetDonation(amt)}
                        className={`py-1.5 rounded-lg border text-center font-mono font-bold text-xs transition-all cursor-pointer ${
                          donationAmount === amt && customAmountText === ""
                          ? 'bg-teal-600 border-teal-600 text-white' 
                          : 'bg-slate-950/80 border-white/10 text-slate-300 hover:border-teal-500 hover:text-white'
                        }`}
                      >
                        ₹{amt}
                      </button>
                    ))}
                  </div>

                  {/* Custom Input */}
                  <div>
                    <input 
                      type="number"
                      placeholder={lang === 'hi' ? 'अन्य राशि (₹)' : 'Or Enter Custom Amount (₹)'}
                      value={customAmountText}
                      onChange={(e) => handleCustomDonationChange(e.target.value)}
                      className="w-full bg-slate-950/80 text-xs px-3 py-2 rounded-xl border border-white/10 text-white font-mono font-semibold focus:outline-none focus:border-teal-500 placeholder-slate-500 text-center"
                    />
                  </div>

                  {/* QR Code Area */}
                  <div className="bg-slate-950/80 rounded-xl p-2.5 border border-white/5 text-center flex flex-col items-center justify-center space-y-1.5">
                    {donationAmount > 0 ? (
                      <>
                        <div className="relative inline-block bg-white p-1 rounded-md">
                          {qrCodeUrl ? (
                            <img 
                              src={qrCodeUrl} 
                              alt="Support UPI QR" 
                              className="w-20 h-20 sm:w-24 sm:h-24 mx-auto"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto flex items-center justify-center text-slate-500 text-[10px]">
                              Generating...
                            </div>
                          )}
                        </div>
                        <p className="text-[10px] font-bold text-teal-400 font-mono">
                          {lang === 'hi' ? `स्कैन करें: ₹${donationAmount}` : `Scan: ₹${donationAmount}`}
                        </p>
                      </>
                    ) : (
                      <div className="py-4 text-slate-500 text-[10px] font-medium italic">
                        {lang === 'hi' ? 'सहयोग राशि चुनें या दर्ज करें।' : 'Please specify support amount.'}
                      </div>
                    )}
                  </div>

                  {/* Copyable UPI ID */}
                  <div className="bg-slate-950 border border-teal-500/40 p-2.5 rounded-xl flex items-center justify-between text-xs shadow-inner">
                    <div className="flex items-center space-x-1.5 min-w-0">
                      <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider">UPI ID:</span>
                      <span className="font-mono text-xs sm:text-[13px] font-black text-amber-300 select-all truncate max-w-[130px] sm:max-w-[180px] tracking-wider">
                        {upiId}
                      </span>
                    </div>
                    <button 
                      onClick={copyUpiToClipboard}
                      className="text-[10px] font-black text-teal-400 hover:text-teal-300 shrink-0 border border-teal-500/40 px-2.5 py-1 rounded bg-teal-500/10 flex items-center space-x-1 cursor-pointer transition-all active:scale-95"
                    >
                      {copiedUpi ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* DETAILED INTERACTIVE SECTION & BENTO GRID */}
      <section id="features" className="py-8 sm:py-20 border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-2 mb-6 sm:space-y-4 sm:mb-16">
            <h2 className="text-xl sm:text-4xl font-extrabold text-white tracking-tight">
              {t.featuresTitle}
            </h2>
            <div className="h-1 w-16 sm:h-1.5 sm:w-24 bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full mx-auto"></div>
            <p className="text-xs sm:text-lg text-slate-300">
              {t.featuresSub}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            
            {/* CARD 1: Automated Billing */}
            <div 
              onClick={() => setActiveSimTab('billing')}
              className={`group p-3 sm:p-6 rounded-2xl sm:rounded-3xl border text-left backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer ${
                activeSimTab === 'billing' 
                ? 'bg-white/10 border-teal-500/80 shadow-teal-500/10' 
                : 'bg-white/5 border-white/10 hover:border-teal-500/50 hover:bg-white/10'
              }`}
            >
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 font-bold mb-2.5 sm:mb-5 group-hover:scale-110 transition-transform">
                <Printer className="w-4.5 h-4.5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-xs sm:text-xl font-bold text-white mb-1 sm:mb-2 group-hover:text-teal-400 transition-colors">
                {t.featureBillingTitle}
              </h3>
              <p className="text-[10px] sm:text-sm text-slate-300 leading-relaxed font-sans mb-2 sm:mb-4 line-clamp-3 sm:line-clamp-none">
                {t.featureBillingDesc}
              </p>
            </div>

            {/* CARD 2: Udhari Khata */}
            <div 
              onClick={() => setActiveSimTab('khata')}
              className={`group p-3 sm:p-6 rounded-2xl sm:rounded-3xl border text-left backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer ${
                activeSimTab === 'khata' 
                ? 'bg-white/10 border-amber-500/80 shadow-amber-500/10' 
                : 'bg-white/5 border-white/10 hover:border-amber-500/50 hover:bg-white/10'
              }`}
            >
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold mb-2.5 sm:mb-5 group-hover:scale-110 transition-transform">
                <Users className="w-4.5 h-4.5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-xs sm:text-xl font-bold text-white mb-1 sm:mb-2 group-hover:text-amber-400 transition-colors">
                {t.featureKhataTitle}
              </h3>
              <p className="text-[10px] sm:text-sm text-slate-300 leading-relaxed font-sans mb-2 sm:mb-4 line-clamp-3 sm:line-clamp-none">
                {t.featureKhataDesc}
              </p>
            </div>

            {/* CARD 3: Medicine Inventory */}
            <div 
              onClick={() => setActiveSimTab('stock')}
              className={`group p-3 sm:p-6 rounded-2xl sm:rounded-3xl border text-left backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer ${
                activeSimTab === 'stock' 
                ? 'bg-white/10 border-emerald-500/80 shadow-emerald-500/10' 
                : 'bg-white/5 border-white/10 hover:border-emerald-500/50 hover:bg-white/10'
              }`}
            >
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold mb-2.5 sm:mb-5 group-hover:scale-110 transition-transform">
                <Search className="w-4.5 h-4.5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-xs sm:text-xl font-bold text-white mb-1 sm:mb-2 group-hover:text-emerald-400 transition-colors">
                {t.featureStockTitle}
              </h3>
              <p className="text-[10px] sm:text-sm text-slate-300 leading-relaxed font-sans mb-2 sm:mb-4 line-clamp-3 sm:line-clamp-none">
                {t.featureStockDesc}
              </p>
            </div>

            {/* CARD 4: Google Drive Backup */}
            <div 
              onClick={() => setActiveSimTab('backup')}
              className={`group p-3 sm:p-6 rounded-2xl sm:rounded-3xl border text-left backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer ${
                activeSimTab === 'backup' 
                ? 'bg-white/10 border-sky-500/80 shadow-sky-500/10' 
                : 'bg-white/5 border-white/10 hover:border-sky-500/50 hover:bg-white/10'
              }`}
            >
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 font-bold mb-2.5 sm:mb-5 group-hover:scale-110 transition-transform">
                <Database className="w-4.5 h-4.5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-xs sm:text-xl font-bold text-white mb-1 sm:mb-2 group-hover:text-sky-400 transition-colors">
                {t.featureBackupTitle}
              </h3>
              <p className="text-[10px] sm:text-sm text-slate-300 leading-relaxed font-sans mb-2 sm:mb-4 line-clamp-3 sm:line-clamp-none">
                {t.featureBackupDesc}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* HIGH-FIDELITY APP SCREENSHOT REPLICAS SHOWCASE */}
      <section id="simulator" className="py-8 sm:py-20 border-b border-white/5 bg-slate-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-2 mb-8 sm:space-y-4 sm:mb-16">
            <span className="px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-300 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider border border-teal-500/20">
              {lang === 'hi' ? 'स्मार्ट ऐप यूआई शोकेस' : 'Interactive App Screen Showcase'}
            </span>
            <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
              {lang === 'hi' ? 'PharmaCare ऐप के स्क्रीनशॉट्स और लाइव इंटरफ़ेस' : 'PharmaCare App Screenshots & Live UI Interface'}
            </h2>
            <p className="text-xs sm:text-lg text-slate-300 leading-relaxed">
              {lang === 'hi' 
                ? 'हमारे प्रीमियम ऐप के वास्तविक स्क्रीनशॉट लेआउट को यहाँ लाइव देखें।' 
                : 'Preview the pixel-perfect screens and layouts of the PharmaCare Android App below.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Column: Screen Selector Tabs */}
            <div className="lg:col-span-4 flex flex-col justify-start space-y-2.5">
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-400 uppercase tracking-widest pl-1 mb-2">
                {lang === 'hi' ? 'स्क्रीन का चयन करें' : 'Select App View'}
              </h3>
              
              {/* Desktop/Vertical Sidebar & Mobile/Horizontal Pills */}
              <div className="flex lg:flex-col gap-2 overflow-x-auto pb-3 lg:pb-0 scrollbar-none snap-x touch-pan-x">
                {[
                  { id: "a4-invoice", nameHi: "📄 संयुक्त बिल (A4 Print)", nameEn: "📄 Combined Bill (A4)", icon: FileText, descHi: "व्हाट्सएप और पीडीएफ शेयर के लिए फुल-पेज बिल", descEn: "Full-page printable bill for A4 printers", color: "text-teal-400 bg-teal-400/5 border-teal-400/20" },
                  { id: "billing-gen", nameHi: "📱 मोबाइल बिलिंग", nameEn: "📱 Billing Generator", icon: Smartphone, descHi: "दवाइयां और खरीदार जोड़ने की लाइव स्क्रीन", descEn: "Live checkout and mobile billing dialog", color: "text-emerald-400 bg-emerald-400/5 border-emerald-400/20" },
                  { id: "thermal-studio", nameHi: "📟 थर्मल बिल स्टूडियो", nameEn: "📟 Thermal Bill", icon: Printer, descHi: "ब्लूटूथ प्रिंटर और रसीद का प्रीव्यू", descEn: "Bluetooth print status & 58mm/80mm receipt", color: "text-purple-400 bg-purple-400/5 border-purple-400/20" },
                  { id: "app-config", nameHi: "⚙️ सेटिंग्स और बैकअप", nameEn: "⚙️ App Config & Sync", icon: Database, descHi: "दुकान विवरण और गूगल ड्राइव बैकअप", descEn: "Store profile & Google Drive secure sync", color: "text-blue-400 bg-blue-400/5 border-blue-400/20" },
                  { id: "inventory-stock", nameHi: "📦 दवाइयों का स्टॉक", nameEn: "📦 Stock & Inventory", icon: Sliders, descHi: "सर्च बार, बैच डिटेल्स और एक्सपायरी चेतावनी", descEn: "Search medicines, batches & expiry alerts", color: "text-rose-400 bg-rose-400/5 border-rose-400/20" },
                  { id: "borrowers-khata", nameHi: "👥 उधारी खाता (लेजर)", nameEn: "👥 Udhar Khata Ledger", icon: Users, descHi: "बाकी बकाया लिस्ट और पेमेंट ट्रांजैक्शन", descEn: "Track credit logs & clear customer payments", color: "text-amber-400 bg-amber-400/5 border-amber-400/20" },
                  { id: "pharmacists-docs", nameHi: "🩺 फार्मासिस्ट और डॉक्टर", nameEn: "🩺 Pharmacists Database", icon: BookOpen, descHi: "ड्रग लाइसेंस और पंजीकृत खरीदार विवरण", descEn: "Database of registered medical buyers", color: "text-cyan-400 bg-cyan-400/5 border-cyan-400/20" },
                  { id: "deleted-restore", nameHi: "♻️ डिलीट रिकवरी ट्रैश", nameEn: "♻️ Safe Trash Restore", icon: RotateCcw, descHi: "10-दिन की सुरक्षा रिटेंशन पॉलिसी सूची", descEn: "10-day safety retention & backup restore", color: "text-orange-400 bg-orange-400/5 border-orange-400/20" }
                ].map(scr => {
                  const IconComponent = scr.icon;
                  const isActive = selectedScreen === scr.id;
                  return (
                    <button
                      key={scr.id}
                      onClick={() => setSelectedScreen(scr.id)}
                      className={`snap-center flex-shrink-0 text-left px-4 py-3.5 rounded-xl border transition-all duration-300 flex items-center space-x-3.5 select-none cursor-pointer ${
                        isActive 
                          ? 'bg-gradient-to-r from-teal-500/15 to-emerald-500/10 border-teal-500 text-white shadow-lg shadow-teal-500/5' 
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                      style={{ minWidth: "220px" }}
                    >
                      <div className={`p-2 rounded-lg ${isActive ? 'bg-teal-500/20 text-teal-300' : 'bg-white/5 text-slate-400'}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="hidden lg:block">
                        <p className="font-bold text-xs sm:text-sm">{lang === 'hi' ? scr.nameHi : scr.nameEn}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed font-sans">{lang === 'hi' ? scr.descHi : scr.descEn}</p>
                      </div>
                      <div className="lg:hidden text-center w-full">
                        <p className="font-bold text-xs">{lang === 'hi' ? scr.nameHi.split(" ")[1] || scr.nameHi : scr.nameEn.split(" ")[1] || scr.nameEn}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Screen Display Container */}
            <div className="lg:col-span-8 flex justify-center items-center">
              
              <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden flex flex-col justify-center min-h-[500px]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-bl-[150px] pointer-events-none"></div>
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedScreen}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                    className="w-full flex justify-center"
                  >
                    
                    {/* 1. COMBINED A4 INVOICE */}
                    {selectedScreen === "a4-invoice" && (
                      <div className="w-full bg-white text-slate-900 rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-2xl font-sans relative border border-slate-200 overflow-hidden leading-snug">
                        {/* Diagonal Repeating Watermark Background */}
                        <div className="absolute inset-0 pointer-events-none select-none flex flex-col justify-around items-center overflow-hidden opacity-[0.04]">
                          <div className="rotate-[-25deg] text-teal-900 text-[35px] sm:text-[50px] font-black uppercase tracking-widest whitespace-nowrap font-sans">
                            PHARMA CARE APP • PHARMA CARE APP
                          </div>
                          <div className="rotate-[-25deg] text-teal-900 text-[35px] sm:text-[50px] font-black uppercase tracking-widest whitespace-nowrap font-sans">
                            PHARMA CARE APP • PHARMA CARE APP
                          </div>
                          <div className="rotate-[-25deg] text-teal-900 text-[35px] sm:text-[50px] font-black uppercase tracking-widest whitespace-nowrap font-sans">
                            PHARMA CARE APP • PHARMA CARE APP
                          </div>
                        </div>

                        {/* Invoice Header */}
                        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between border-b border-slate-200 pb-4">
                          <div className="text-left">
                            <h4 className="text-base sm:text-2xl font-black text-teal-700 tracking-tight font-sans">
                              PHARMA CARE MEDICAL STORE
                            </h4>
                            <p className="text-[10px] sm:text-xs text-slate-500 font-semibold mt-1 font-sans">
                              Professional Medical Inventory Management System - Combined Bill
                            </p>
                          </div>
                          <div className="text-left sm:text-right mt-1 sm:mt-0 text-[10px] sm:text-xs text-slate-500 font-mono">
                            Date & Time: 10-07-2026 15:37:44
                          </div>
                        </div>

                        {/* Top Green Bar */}
                        <div className="h-1 bg-teal-600 my-2.5"></div>

                        {/* Metadata Details (2 Columns) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left text-[10px] sm:text-xs border-b border-slate-200 pb-4 pt-1 font-sans">
                          <div className="space-y-1 text-slate-700">
                            <p><span className="text-slate-500 font-semibold">Invoice Number:</span> <strong className="text-slate-900">DIS56611</strong></p>
                            <p><span className="text-slate-500 font-semibold">Store Operator:</span> <strong className="text-slate-900">Prabhat Singh (+91 9696971627)</strong></p>
                            <p className="leading-tight"><span className="text-slate-500 font-semibold">Drug Licence No:</span> <strong className="text-slate-900 font-mono text-[9px] sm:text-[10px]">RLF20UP2025003840/RLF21UP2025003812</strong></p>
                            <p className="flex items-center space-x-1">
                              <span className="text-slate-500 font-semibold">Billing Status:</span> 
                              <span className="px-1.5 py-0.5 bg-teal-50 border border-teal-200 text-teal-700 font-bold rounded text-[8px] sm:text-[9.5px]">PAID / SAVED</span>
                            </p>
                            <p><span className="text-slate-500 font-semibold">Shop Address:</span> <strong className="text-slate-900">Anjhi station,Shahabad,Hardoi</strong></p>
                          </div>
                          
                          <div className="space-y-1 text-slate-700 sm:border-l sm:pl-4 border-slate-200">
                            <h5 className="font-extrabold text-slate-900 uppercase tracking-wider text-[9px] sm:text-[11px] mb-1.5">PHARMACIST / DR. DETAILS</h5>
                            <p><span className="text-slate-500 font-semibold">Pharm/Dr. Name:</span> <strong className="text-slate-900">dellep kumar</strong></p>
                            <p><span className="text-slate-500 font-semibold">Contact No:</span> <strong className="text-slate-900">9005372548</strong></p>
                            <p><span className="text-slate-500 font-semibold">Shop Name:</span> <strong className="text-slate-900">pharmacare</strong></p>
                            <p><span className="text-slate-500 font-semibold">Shop Address:</span> <strong className="text-slate-900">anjhi station Shahabad</strong></p>
                            <p><span className="text-slate-500 font-semibold">Drug License:</span> <strong className="text-slate-900 font-mono">737373ye</strong></p>
                          </div>
                        </div>

                        {/* Product Items Table */}
                        <div className="overflow-x-auto mt-4 font-sans">
                          <table className="w-full text-left border-collapse text-[10px] sm:text-xs">
                            <thead>
                              <tr className="border-b border-slate-300 text-[9px] sm:text-[11px] font-bold text-slate-900 uppercase">
                                <th className="py-2 pr-2">S.N.</th>
                                <th className="py-2">PRODUCT NAME</th>
                                <th className="py-2">BATCH</th>
                                <th className="py-2">EXPIRY</th>
                                <th className="py-2 text-right">MRP</th>
                                <th className="py-2 text-right">DISC%</th>
                                <th className="py-2 text-right">RATE</th>
                                <th className="py-2 text-center">STOK QTY</th>
                                <th className="py-2 text-right">AMOUNT</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 text-slate-800">
                              <tr>
                                <td className="py-2.5 pr-2">1</td>
                                <td className="py-2.5 font-bold text-slate-900">moxikind cv 625 gen</td>
                                <td className="py-2.5 font-mono">zhye73</td>
                                <td className="py-2.5">01/27</td>
                                <td className="py-2.5 text-right">₹295.0</td>
                                <td className="py-2.5 text-right font-bold text-teal-600">79%</td>
                                <td className="py-2.5 text-right">₹60.0</td>
                                <td className="py-2.5 text-center font-mono">1*10</td>
                                <td className="py-2.5 text-right font-bold">₹60.00</td>
                              </tr>
                              <tr>
                                <td className="py-2.5 pr-2">2</td>
                                <td className="py-2.5 font-bold text-slate-900">calpol 500</td>
                                <td className="py-2.5 font-mono">dyh37</td>
                                <td className="py-2.5">01/27</td>
                                <td className="py-2.5 text-right">₹25.0</td>
                                <td className="py-2.5 text-right font-bold text-teal-600">60%</td>
                                <td className="py-2.5 text-right">₹10.0</td>
                                <td className="py-2.5 text-center font-mono">1*10</td>
                                <td className="py-2.5 text-right font-bold">₹10.00</td>
                              </tr>
                              <tr>
                                <td className="py-2.5 pr-2">3</td>
                                <td className="py-2.5 font-bold text-slate-900">paracetamol</td>
                                <td className="py-2.5 font-mono">shyd7337</td>
                                <td className="py-2.5">01/27</td>
                                <td className="py-2.5 text-right">₹14.0</td>
                                <td className="py-2.5 text-right font-bold text-teal-600">28%</td>
                                <td className="py-2.5 text-right">₹10.0</td>
                                <td className="py-2.5 text-center font-mono">1*10</td>
                                <td className="py-2.5 text-right font-bold">₹10.00</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        {/* Bill Totals Summary block */}
                        <div className="mt-6 flex flex-col items-end border-t border-slate-200 pt-3 font-sans">
                          <div className="w-full sm:w-64 bg-slate-50 rounded-xl p-3 border border-slate-200/80 space-y-1.5 text-left text-[10px] sm:text-xs">
                            <div className="flex justify-between text-slate-600">
                              <span>Total MRP Value:</span>
                              <span className="font-bold font-mono">₹334.00</span>
                            </div>
                            <div className="flex justify-between text-teal-700">
                              <span>Total Discount Saved:</span>
                              <span className="font-bold font-mono">₹254.00 (76%)</span>
                            </div>
                            <div className="h-px bg-slate-200 my-1"></div>
                            <div className="flex justify-between text-[#0f766e] text-xs sm:text-sm font-extrabold uppercase">
                              <span>GRAND TOTAL:</span>
                              <span className="font-mono">₹80.00</span>
                            </div>
                            <div className="h-px bg-slate-200 my-1"></div>
                            <div className="text-[9px] sm:text-[10px] text-slate-500 text-center">
                              Invoiced Items: 3
                            </div>
                          </div>
                        </div>

                        {/* Invoice Footer note */}
                        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center border-t border-slate-200 pt-4 gap-4 font-sans">
                          <p className="text-[10px] sm:text-xs font-bold text-teal-600">
                            Thank you for choosing Pharma Care!
                          </p>
                          <div className="text-center sm:text-right space-y-1 shrink-0 w-36 sm:w-48">
                            <div className="h-px bg-slate-300 w-full mb-1"></div>
                            <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider">Authorized Seal / Sign</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* MOBILE DEVICE FRAME TEMPLATE */}
                    {selectedScreen !== "a4-invoice" && (
                      <div className="w-[280px] sm:w-[310px] bg-slate-950 border-[6px] border-slate-800 rounded-[35px] shadow-2xl relative overflow-hidden flex flex-col font-sans text-white aspect-[9/18]">
                        {/* Notch */}
                        <div className="absolute top-0 inset-x-0 h-5 bg-black flex items-center justify-center z-30">
                          <div className="w-20 h-3.5 bg-black rounded-b-xl flex items-center justify-between px-2 text-[7px] font-mono font-bold text-slate-400">
                            <span>15:37</span>
                            <div className="flex items-center space-x-1">
                              <span className="text-[6.5px]">4.5G</span>
                              <div className="w-2.5 h-1.5 bg-emerald-400 rounded-sm"></div>
                            </div>
                          </div>
                        </div>

                        {/* Top App Bar Spacer */}
                        <div className="h-5 bg-slate-900 shrink-0"></div>

                        {/* 2. MOBILE BILLING SCREEN */}
                        {selectedScreen === "billing-gen" && (
                          <div className="flex-1 bg-slate-900 text-slate-200 p-3 flex flex-col justify-between text-left text-[11px] leading-tight overflow-y-auto">
                            <div className="space-y-2.5">
                              {/* Title */}
                              <div className="flex items-center space-x-1.5 border-b border-white/10 pb-2">
                                <FileText className="w-4 h-4 text-teal-400 shrink-0" />
                                <h4 className="font-extrabold text-xs text-white">Billing & Invoice Generator</h4>
                              </div>

                              {/* Buyer Select */}
                              <div className="bg-slate-950/60 p-2 rounded-xl border border-white/5 space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <span className="text-[9px] text-slate-400">Buyer</span>
                                  <span className="text-[8px] bg-teal-500/10 text-teal-300 px-1 py-0.2 rounded font-mono font-bold">dellep kumar</span>
                                </div>
                                <div className="flex items-center space-x-1 bg-slate-900/60 rounded px-1.5 py-1 text-[9px] text-slate-400">
                                  <Search className="w-2.5 h-2.5 shrink-0" />
                                  <span>Search Buyer / Dr...</span>
                                </div>
                                <div className="text-[8px] text-slate-400 font-semibold">
                                  DL: 737373ye | pharmacare
                                </div>
                              </div>

                              {/* Medicine List */}
                              <div className="space-y-1.5">
                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Items Added (2)</span>
                                
                                {/* Item 1 */}
                                <div className="bg-slate-950/40 p-2 rounded-lg border border-white/5 space-y-1 text-[10px]">
                                  <div className="flex justify-between items-start">
                                    <span className="font-bold text-white">moxikind cv 625 gen</span>
                                    <span className="text-[8px] text-rose-400 bg-rose-400/10 px-1 rounded">5 Pks</span>
                                  </div>
                                  <p className="text-[8px] text-slate-500 font-mono">MRP: 295.0 • Buy: 60.0</p>
                                  <div className="flex justify-between items-center text-[9px] pt-1 border-t border-white/5">
                                    <span>Packs: <strong className="text-white">- 1 +</strong></span>
                                    <span>Disc: <strong className="text-teal-400">0%</strong></span>
                                    <span className="font-mono font-bold text-teal-300">₹60.00</span>
                                  </div>
                                </div>

                                {/* Item 2 */}
                                <div className="bg-slate-950/40 p-2 rounded-lg border border-white/5 space-y-1 text-[10px]">
                                  <div className="flex justify-between items-start">
                                    <span className="font-bold text-white">calpol 500</span>
                                    <span className="text-[8px] text-teal-400 bg-teal-400/10 px-1 rounded">20 Pks</span>
                                  </div>
                                  <p className="text-[8px] text-slate-500 font-mono">MRP: 25.0 • Buy: 10.0</p>
                                  <div className="flex justify-between items-center text-[9px] pt-1 border-t border-white/5">
                                    <span>Packs: <strong className="text-white">- 1 +</strong></span>
                                    <span>Disc: <strong className="text-teal-400">0%</strong></span>
                                    <span className="font-mono font-bold text-teal-300">₹10.00</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Bottom CTA Block */}
                            <div className="space-y-1.5 pt-3 border-t border-white/10 mt-3">
                              <button className="w-full py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-[10px] text-center flex items-center justify-center space-x-1 cursor-pointer">
                                <Share2 className="w-3 h-3" />
                                <span>WhatsApp Bill</span>
                              </button>
                              <div className="grid grid-cols-2 gap-1.5 text-[9px]">
                                <button className="py-1 rounded bg-teal-600 hover:bg-teal-700 text-white font-bold flex items-center justify-center space-x-1 cursor-pointer">
                                  <Printer className="w-2.5 h-2.5" />
                                  <span>PDF Print</span>
                                </button>
                                <button className="py-1 rounded bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center justify-center space-x-1 cursor-pointer">
                                  <Printer className="w-2.5 h-2.5" />
                                  <span>Thermal Print</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 3. MOBILE THERMAL RECEIPT PREVIEW */}
                        {selectedScreen === "thermal-studio" && (
                          <div className="flex-1 bg-slate-900 text-slate-200 p-3 flex flex-col justify-between text-left text-[11px] leading-tight overflow-y-auto">
                            <div className="space-y-2.5 flex-1 flex flex-col">
                              {/* Header */}
                              <div className="flex items-center space-x-1.5 border-b border-white/10 pb-2">
                                <Printer className="w-4 h-4 text-purple-400 shrink-0" />
                                <h4 className="font-extrabold text-xs text-white">Thermal Bill Studio</h4>
                              </div>

                              {/* Printer Status */}
                              <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 p-1.5 rounded-lg text-[8px] sm:text-[9px] font-bold text-center flex items-center justify-center space-x-1 animate-pulse">
                                <span>⚠️ Printer Status: Bluetooth turned OFF</span>
                              </div>

                              {/* receipt layout */}
                              <div className="flex-1 bg-white text-slate-900 rounded-lg p-2.5 font-mono text-[8px] border-l-2 border-slate-300 shadow-inner flex flex-col justify-between select-none">
                                <div className="text-center space-y-0.5 border-b border-dashed border-slate-300 pb-1">
                                  <p className="font-extrabold text-[9px] uppercase tracking-tighter text-slate-950">PHARMACARE STORE</p>
                                  <p className="text-[6.5px] text-slate-500 leading-tight">DL: RLF20UP2025003840/RLF21UP2025003812</p>
                                  <div className="flex justify-between text-[6px] text-slate-500 mt-1">
                                    <span>INV: VHF26392</span>
                                    <span>10/07/26 15:37</span>
                                  </div>
                                </div>

                                <div className="py-1 border-b border-dashed border-slate-300 text-[6.5px] space-y-0.5">
                                  <div className="flex justify-between text-slate-500 font-bold">
                                    <span>ITEM</span>
                                    <span>EXP QTY RATE DISC TOT</span>
                                  </div>
                                  <div className="flex justify-between font-bold">
                                    <span>MOXIKIND CV 625</span>
                                    <span>01/27 1Tab 29.5 - 29.50</span>
                                  </div>
                                </div>

                                <div className="pt-1 text-[7px] font-bold text-right text-slate-950">
                                  GRAND TOTAL: Rs29.50
                                </div>
                                <p className="text-[6.5px] text-slate-400 text-center mt-1 border-t border-dashed border-slate-200 pt-1">THANK YOU! VISIT AGAIN.</p>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="space-y-1.5 pt-3 border-t border-white/10 mt-3 shrink-0">
                              <button className="w-full py-1.5 rounded bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-[10px] text-center flex items-center justify-center space-x-1 cursor-pointer">
                                <Printer className="w-3.5 h-3.5" />
                                <span>Print Bluetooth</span>
                              </button>
                              <div className="grid grid-cols-2 gap-1.5 text-[9px]">
                                <button className="py-1 rounded bg-teal-600 hover:bg-teal-700 text-white font-bold flex items-center justify-center space-x-1 cursor-pointer">
                                  <Copy className="w-2.5 h-2.5" />
                                  <span>Copy Text</span>
                                </button>
                                <button className="py-1 rounded bg-slate-800 text-slate-300 font-bold flex items-center justify-center cursor-pointer">
                                  <span>Close</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 4. MOBILE CONFIG & DRIVE BACKUP */}
                        {selectedScreen === "app-config" && (
                          <div className="flex-1 bg-slate-900 text-slate-200 p-3 flex flex-col justify-between text-left text-[11px] leading-tight overflow-y-auto">
                            <div className="space-y-3 font-sans">
                              {/* Header */}
                              <div className="border-b border-white/10 pb-2">
                                <h4 className="font-extrabold text-xs text-white">Billing Configurations</h4>
                                <p className="text-[8px] text-slate-400">Settings Manager v1.5</p>
                              </div>

                              {/* Menu options list */}
                              <div className="space-y-1.5 font-sans">
                                {[
                                  { name: "Edit Bill Settings", icon: FileText },
                                  { name: "Edit Shop Address", icon: Search },
                                  { name: "Themes Manager", icon: Sparkles },
                                  { name: "System Settings", icon: Sliders }
                                ].map((opt, idx) => {
                                  const OptIcon = opt.icon;
                                  return (
                                    <div key={idx} className="p-2 bg-slate-950/40 rounded-xl border border-white/5 flex items-center justify-between text-[10px] hover:bg-slate-950/60 transition-all cursor-pointer">
                                      <div className="flex items-center space-x-2">
                                        <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400">
                                          <OptIcon className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="font-bold text-white">{opt.name}</span>
                                      </div>
                                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Drive sync card */}
                              <div className="bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10 space-y-2 font-sans">
                                <div className="flex items-center space-x-1.5 text-[9px] text-emerald-400 font-extrabold uppercase tracking-wide">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                                  <span>Google Drive: Connected</span>
                                </div>
                                <p className="text-[8px] text-slate-400 leading-snug">
                                  Backup database files actively linked with: <br/>
                                  <span className="font-mono font-bold text-slate-200">prabhat683899@gmail.com</span>
                                </p>
                                <button className="w-full py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-[9px] text-center flex items-center justify-center space-x-1 cursor-pointer">
                                  <Database className="w-2.5 h-2.5" />
                                  <span>Backup / Restore settings</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 5. MOBILE INVENTORY STOCK VIEW */}
                        {selectedScreen === "inventory-stock" && (
                          <div className="flex-1 bg-slate-900 text-slate-200 p-3 flex flex-col justify-between text-left text-[11px] leading-tight overflow-y-auto">
                            <div className="space-y-3 font-sans">
                              {/* Header */}
                              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                                <span className="font-extrabold text-xs text-white">Stock & Inventory</span>
                                <span className="text-[8px] font-bold bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded-full border border-rose-500/30">
                                  Low Stock Alert
                                </span>
                              </div>

                              {/* Search */}
                              <div className="flex items-center space-x-1 bg-slate-950/60 rounded-xl px-2 py-1.5 border border-white/5 text-[9px] text-slate-400">
                                <Search className="w-3 h-3 shrink-0" />
                                <span>Search medicines by name...</span>
                              </div>

                              {/* Filter buttons */}
                              <div className="grid grid-cols-3 gap-1">
                                <div className="text-[8px] font-bold text-center p-1 bg-teal-500/10 text-teal-300 rounded border border-teal-500/25">All Med (3)</div>
                                <div className="text-[8px] font-bold text-center p-1 bg-white/5 text-slate-400 rounded">Active (3)</div>
                                <div className="text-[8px] font-bold text-center p-1 bg-white/5 text-slate-400 rounded">Expiry Alerts (0)</div>
                              </div>

                              {/* Stock entries list */}
                              <div className="space-y-1.5">
                                {[
                                  { name: "moxikind cv 625 gen", batch: "zhye73", exp: "01/27", stock: "5 Packs", stockColor: "text-rose-400 bg-rose-400/5 border-rose-500/20", disc: "79% Off" },
                                  { name: "calpol 500", batch: "dyh37", exp: "01/27", stock: "20 Packs", stockColor: "text-teal-400 bg-teal-400/5 border-teal-500/20", disc: "60% Off" },
                                  { name: "paracetamol", batch: "shyd7337", exp: "01/27", stock: "10 Packs", stockColor: "text-teal-400 bg-teal-400/5 border-teal-500/20", disc: "28% Off" }
                                ].map((item, idx) => (
                                  <div key={idx} className="p-2 bg-slate-950/40 rounded-xl border border-white/5 space-y-1">
                                    <div className="flex justify-between items-center text-[10px]">
                                      <span className="font-bold text-white">{item.name}</span>
                                      <span className="text-[8px] font-extrabold text-teal-400 font-mono bg-teal-500/10 px-1 rounded">{item.disc}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[8px] text-slate-400">
                                      <span>Batch: {item.batch} • Exp: {item.exp}</span>
                                      <span className={`px-1.5 py-0.2 rounded font-bold border ${item.stockColor}`}>{item.stock}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Floating button */}
                            <div className="flex justify-end pt-2">
                              <div className="w-8 h-8 rounded-full bg-teal-500 hover:bg-teal-600 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-teal-500/20 cursor-pointer">
                                <Plus className="w-5 h-5" />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 6. MOBILE BORROWERS LEDGER (KHATA) */}
                        {selectedScreen === "borrowers-khata" && (
                          <div className="flex-1 bg-slate-900 text-slate-200 p-3 flex flex-col justify-between text-left text-[11px] leading-tight overflow-y-auto">
                            <div className="space-y-2.5 font-sans">
                              {/* Header */}
                              <div className="border-b border-white/10 pb-2">
                                <h4 className="font-extrabold text-xs text-white font-sans">Udhar Khata Ledger</h4>
                                <div className="flex justify-between text-[8px] text-slate-400 mt-1 font-sans">
                                  <span>Total Outstanding: <strong className="text-rose-400 font-mono text-[9px]">₹164.00</strong></span>
                                  <span>2 Borrowers</span>
                                </div>
                              </div>

                              {/* Search */}
                              <div className="flex items-center space-x-1 bg-slate-950/60 rounded-xl px-2 py-1 border border-white/5 text-[9px] text-slate-400 font-sans">
                                <Search className="w-3 h-3 shrink-0" />
                                <span>Search borrower...</span>
                              </div>

                              {/* Borrowers cards list */}
                              <div className="space-y-1.5 font-sans">
                                {[
                                  { name: "Akash Kumar", bal: "₹85.00", phone: "9696971627", update: "10-Jul", note: "asthakind DX" },
                                  { name: "shubham", bal: "₹79.00", phone: "9696971627", update: "10-Jul", note: "aceclopera syrup" }
                                ].map((item, idx) => (
                                  <div key={idx} className="p-2.5 bg-slate-950/40 rounded-xl border border-white/5 space-y-1 text-[9px]">
                                    <div className="flex justify-between items-center">
                                      <span className="font-extrabold text-white text-[10px]">{item.name}</span>
                                      <span className="font-mono font-bold text-rose-400 text-[10px]">{item.bal}</span>
                                    </div>
                                    <p className="text-[8px] text-slate-400 font-sans">Phone: {item.phone} • Updated: {item.update}</p>
                                    <p className="text-[8px] text-slate-500 italic mt-0.5 font-sans">Note: {item.note}</p>
                                    <div className="flex justify-between pt-1.5 border-t border-white/5 text-[8px] gap-1 font-sans">
                                      <button className="flex-1 py-0.5 rounded bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/20 font-bold flex items-center justify-center space-x-0.5 cursor-pointer">
                                        <Share2 className="w-2.5 h-2.5" /> <span>Share</span>
                                      </button>
                                      <button className="flex-1 py-0.5 rounded bg-teal-500/15 text-teal-400 hover:bg-teal-500/20 font-bold flex items-center justify-center cursor-pointer">
                                        Clear Pay
                                      </button>
                                      <button className="px-1 py-0.5 rounded bg-white/5 text-slate-400 hover:bg-white/10 cursor-pointer">
                                        <Trash2 className="w-2.5 h-2.5" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* FAB */}
                            <div className="flex justify-end pt-2">
                              <div className="px-2.5 py-1 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center space-x-1 font-bold text-[8.5px] shadow-lg shadow-rose-500/25 cursor-pointer font-sans">
                                <Plus className="w-3 h-3" />
                                <span>Add Borrower</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 7. MOBILE PHARMACISTS & DOCTORS */}
                        {selectedScreen === "pharmacists-docs" && (
                          <div className="flex-1 bg-slate-900 text-slate-200 p-3 flex flex-col justify-between text-left text-[11px] leading-tight overflow-y-auto">
                            <div className="space-y-3 font-sans">
                              {/* Header */}
                              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                                <span className="font-extrabold text-xs text-white">Pharmacists & Doctors</span>
                                <div className="px-1.5 py-0.5 bg-teal-500 text-slate-950 font-bold text-[8px] rounded cursor-pointer">+ Add</div>
                              </div>

                              {/* Search */}
                              <div className="flex items-center space-x-1 bg-slate-950/60 rounded-xl px-2 py-1.5 border border-white/5 text-[9px] text-slate-400">
                                <Search className="w-3 h-3 shrink-0" />
                                <span>Search by name, contact, shop...</span>
                              </div>

                              {/* Registree Cards list */}
                              <div className="space-y-1.5 font-sans">
                                {[
                                  { name: "dellep kumar", shop: "pharmacare", phone: "9005372548", dl: "737373ye", addr: "anjhi station Shahabad" }
                                ].map((item, idx) => (
                                  <div key={idx} className="p-2.5 bg-slate-950/40 rounded-xl border border-white/5 space-y-1 text-[9px]">
                                    <div className="flex justify-between items-center text-[10px]">
                                      <span className="font-extrabold text-white">{item.name}</span>
                                      <span className="text-[8px] text-teal-400 bg-teal-500/10 px-1.5 py-0.2 rounded font-semibold">{item.shop}</span>
                                    </div>
                                    <p className="text-slate-400">Phone: {item.phone}</p>
                                    <p className="text-slate-400 font-mono font-bold">DL No: {item.dl}</p>
                                    <p className="text-slate-500 italic">Address: {item.addr}</p>
                                    <div className="flex justify-end space-x-2 pt-1 border-t border-white/5 text-[8.5px]">
                                      <button className="text-teal-400 font-bold">Edit Detail</button>
                                      <span className="text-slate-700">|</span>
                                      <button className="text-rose-400 font-bold">Delete</button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 8. MOBILE DELETED & RETENTION SAFETY POLICY */}
                        {selectedScreen === "deleted-restore" && (
                          <div className="flex-1 bg-slate-900 text-slate-200 p-3 flex flex-col justify-between text-left text-[11px] leading-tight overflow-y-auto">
                            <div className="space-y-2.5 font-sans">
                              {/* Header */}
                              <div className="border-b border-white/10 pb-2">
                                <h4 className="font-extrabold text-xs text-white">Deleted items recovery</h4>
                                <p className="text-[8px] text-rose-400 mt-0.5">10-Day Retention Safety Policy</p>
                              </div>

                              {/* Warn alert */}
                              <div className="p-2 bg-blue-500/5 rounded-xl border border-blue-500/15 text-[8px] text-slate-300 leading-snug space-y-1 font-sans">
                                <div className="flex items-center space-x-1 text-blue-400 font-bold uppercase">
                                  <Info className="w-3 h-3 shrink-0" />
                                  <span>Safety cloud sync</span>
                                </div>
                                <p>Recently deleted entries are securely synced. Items will be deleted permanently after 10 days.</p>
                              </div>

                              {/* Tabs */}
                              <div className="grid grid-cols-2 gap-1 border-b border-white/5 pb-1 font-sans">
                                <span className="text-center font-bold text-[8.5px] text-teal-400 border-b border-teal-400 pb-0.5 select-none">Items (4)</span>
                                <span className="text-center font-bold text-[8.5px] text-slate-500 pb-0.5 select-none">Customers (0)</span>
                              </div>

                              {/* Deleted Items list */}
                              <div className="space-y-1.5 font-sans">
                                {[
                                  { name: "preaching aceclopera", batch: "uyr55677tr", mrp: "₹900.0", left: "9 days left" },
                                  { name: "dhdu37g", batch: "7r7h", mrp: "₹85.0", left: "9 days left" },
                                  { name: "testing 3", batch: "ehe763", mrp: "₹959.0", left: "9 days left" }
                                ].map((item, idx) => (
                                  <div key={idx} className="p-2 bg-slate-950/40 rounded-xl border border-white/5 flex items-center justify-between text-[9px]">
                                    <div className="space-y-0.5">
                                      <span className="font-bold text-white text-[9.5px] block">{item.name}</span>
                                      <span className="text-slate-400 text-[8px]">Batch: {item.batch} • MRP: {item.mrp}</span>
                                      <span className="text-[8px] text-orange-400 font-semibold block">{item.left}</span>
                                    </div>
                                    <button className="px-2 py-0.5 rounded bg-teal-600 text-white font-bold text-[8px] hover:bg-teal-700 cursor-pointer">
                                      Restore
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Android Bottom Nav Bar */}
                        <div className="h-7 bg-slate-950 flex items-center justify-around text-slate-400 text-[8px] border-t border-white/5 shrink-0 select-none">
                          <div className="flex flex-col items-center">
                            <Database className="w-3.5 h-3.5" />
                            <span className="scale-90">Inventory</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <Users className="w-3.5 h-3.5" />
                            <span className="scale-90">Khata</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <BookOpen className="w-3.5 h-3.5 text-teal-400" />
                            <span className="scale-90 text-teal-400 font-bold">Pharmacists</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span className="scale-90">Deleted</span>
                          </div>
                        </div>

                      </div>
                    )}
                    
                  </motion.div>
                </AnimatePresence>
                
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECURE PERSISTENCE & GOOGLE DRIVE INTEGRATION BANNER */}
      <section className="py-8 sm:py-16 border-b border-white/5 relative overflow-hidden bg-teal-950/10 backdrop-blur-md">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-500/10 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
            
            <div className="lg:col-span-8 space-y-3 sm:space-y-5 text-center lg:text-left">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider border border-emerald-500/20">
                {lang === 'hi' ? 'डेटा सुरक्षा गारंटी' : 'Data Privacy Guaranteed'}
              </span>
              <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white">
                {lang === 'hi' 
                  ? 'आपका डेटा केवल आपके पास रहेगा, हमारे सर्वर पर नहीं!' 
                  : 'Your Data is strictly yours. No cloud database servers involved!'}
              </h2>
              <p className="text-xs sm:text-base text-slate-300 max-w-3xl mx-auto lg:mx-0 leading-relaxed">
                {lang === 'hi'
                  ? 'PharmaCare पूरी तरह से ऑफलाइन ऐप है। आपकी दवाइयों, बहीखाता की सभी रिकॉर्ड आपके फोन में सुरक्षित रहती हैं। बैकअप के लिए आप इसे सीधे गूगल ड्राइव से कनेक्ट कर सकते हैं।'
                  : 'PharmaCare operates completely offline. All stock records and credit logs are saved locally on your phone. To keep files safe, you can sync securely using your personal Google Drive account.'}
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 pt-1">
                <div className="flex items-center space-x-1.5 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-slate-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>100% Secure SSL</span>
                </div>
                <div className="flex items-center space-x-1.5 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-slate-200">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span>GDrive Storage</span>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-4 flex justify-center">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6 w-full max-w-sm text-center space-y-3 shadow-2xl">
                <div className="w-11 h-11 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center mx-auto">
                  <Database className="w-5.5 h-5.5" />
                </div>
                <h3 className="font-bold text-sm sm:text-lg text-white">{lang === 'hi' ? 'ड्राइव सिंक टेस्ट करें' : 'Simulate Drive Sync'}</h3>
                <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                  {lang === 'hi' 
                    ? 'नीचे बटन दबाकर देखें कि ऑटोमैटिक सिंक कैसे सुरक्षित काम करता है।'
                    : 'Click below to simulate how automatic encryption sync updates database backup files.'}
                </p>
                <button 
                  onClick={handleBackupSync}
                  disabled={backupSyncing}
                  className="w-full py-2 sm:py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 font-bold text-xs sm:text-sm text-white transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-teal-700/20"
                >
                  {backupSyncing ? (
                    <>
                      <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span>Syncing Files...</span>
                    </>
                  ) : (
                    <>
                      <Database className="w-3.5 h-3.5" />
                      <span>{t.simBackupSync}</span>
                    </>
                  )}
                </button>
                {syncCount > 0 && (
                  <p className="text-xs text-emerald-400 font-semibold font-mono">
                    {lang === 'hi' ? 'सिंक पूरा हुआ! पिछली रसीदें सेव हो गई हैं।' : 'Last synced successfully! Check simulated.'}
                  </p>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* EASY INSTALLATION STEP-BY-STEP GUIDE */}
      <section id="install" className="py-8 sm:py-16 bg-slate-100 border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-2 mb-6 sm:space-y-4 sm:mb-12">
            <span className="px-2.5 py-1 rounded-full bg-teal-100 text-teal-800 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider border border-teal-200/50">
              Download and Deploy
            </span>
            <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t.installTitle}
            </h2>
            <p className="text-xs sm:text-base text-slate-600">
              {t.howItWorksSub}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-md relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 bg-teal-500/10 rounded-bl-[50px] flex items-center justify-center font-mono font-black text-teal-700 text-base sm:text-xl pl-3 pb-3 sm:pl-4 sm:pb-4">
                01
              </div>
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                  <Download className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-sm sm:text-lg font-bold text-slate-900">
                  {t.installStep1}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                  {t.installStep1Desc}
                </p>
              </div>
              <div className="pt-4 sm:pt-6">
                <a 
                  id="install-step1-btn"
                  href={`https://wa.me/919696971627?text=Hello!%20Please%20send%20me%20the%20latest%20apk%20file%20of%20PharmaCare.`}
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-bold text-teal-600 hover:text-teal-700"
                >
                  <span>{lang === 'hi' ? 'APK व्हाट्सएप पर पाएं' : 'Get APK over WhatsApp'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-md relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 bg-teal-500/10 rounded-bl-[50px] flex items-center justify-center font-mono font-black text-teal-700 text-base sm:text-xl pl-3 pb-3 sm:pl-4 sm:pb-4">
                02
              </div>
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                  <ShieldCheck className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-sm sm:text-lg font-bold text-slate-900">
                  {t.installStep2}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                  {t.installStep2Desc}
                </p>
              </div>
              <div className="pt-4 sm:pt-6">
                <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                  {lang === 'hi' ? 'अज्ञात स्रोत चालू' : 'Unknown Sources Enabled'}
                </span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-md relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 bg-teal-500/10 rounded-bl-[50px] flex items-center justify-center font-mono font-black text-teal-700 text-base sm:text-xl pl-3 pb-3 sm:pl-4 sm:pb-4">
                03
              </div>
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                  <Smartphone className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-sm sm:text-lg font-bold text-slate-900">
                  {t.installStep3}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                  {t.installStep3Desc}
                </p>
              </div>
              <div className="pt-4 sm:pt-6">
                <a 
                  id="install-step3-btn"
                  href="#simulator" 
                  className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-bold text-teal-600 hover:text-teal-700 cursor-pointer"
                >
                  <span>{lang === 'hi' ? 'सिमुलेटर देखें' : 'Review Live Simulator'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Large Deployment APK download center */}
          <div className="mt-6 sm:mt-12 bg-white rounded-2xl p-4 sm:p-8 border border-slate-200 shadow-xl text-center space-y-4 max-w-4xl mx-auto">
            <h3 className="text-sm sm:text-xl font-black text-slate-900">
              {lang === 'hi' ? 'PharmaCare v1.2 APK फाइल डाउनलोड करने के लिए तैयार है' : 'PharmaCare v1.2 APK File is Ready for Download'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
              {lang === 'hi' 
                ? 'यह 100% फ्री, एड-फ्री और पूरी तरह ऑफलाइन काम करने वाला ऐप है। नीचे बटन से APK फाइल डाउनलोड करें या व्हाट्सएप पर मैसेज करें।' 
                : 'Free, open source, secure, and offline billing app. Grab the raw build APK directly or request over WhatsApp.'}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-1">
              <a 
                id="footer-download-apk-direct"
                href="https://github.com/mrprabhat000-code/PHARMACARE-APK/releases/download/Apk/Pharma.Care.apk"
                target="_blank" 
                rel="noreferrer"
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs sm:text-sm shadow-md cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{lang === 'hi' ? 'लेटेस्ट APK डाउनलोड करें' : 'Download Official APK'}</span>
              </a>

              <a 
                id="footer-whatsapp-chat-apk"
                href="https://wa.me/919696971627?text=Mujhe%20PharmaCare%20App%20chahiye" 
                target="_blank" 
                rel="noreferrer"
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs sm:text-sm cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>{lang === 'hi' ? 'व्हाट्सएप से लें' : 'Request over WhatsApp'}</span>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* DIRECT DEVELOPER WHATSAPP LINE AT THE VERY BOTTOM */}
      <section id="developer-support" className="py-8 sm:py-16 bg-slate-900 border-t border-slate-800 text-white relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 sm:space-y-8">
          <div className="space-y-2 max-w-2xl mx-auto">
            <span className="px-2.5 py-1 bg-teal-500/10 text-teal-300 border border-teal-500/20 rounded-full font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider inline-block">
              📩 Direct Developer Line
            </span>
            <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
              {t.whatsappCardTitle}
            </h2>
            <p className="text-xs sm:text-base text-slate-300 font-sans">
              {t.whatsappCardDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-stretch max-w-4xl mx-auto">
            {/* Developer Info Card */}
            <div className="md:col-span-5 bg-slate-950 rounded-2xl p-6 border border-slate-800 shadow-2xl flex flex-col items-center justify-between text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-bl-[100px] pointer-events-none"></div>
              
              <div className="space-y-4 flex flex-col items-center w-full">
                {/* Photo frame with glowing effect */}
                <div className="relative mt-2">
                  <div className="absolute -inset-1.5 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full blur-sm opacity-70 group-hover:opacity-100 transition duration-300"></div>
                  <img 
                    src="https://raw.githubusercontent.com/mrprabhat000-code/app-images/main/profile.jpg" 
                    alt="Developer Prabhat" 
                    className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-slate-950 shadow-inner"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-950 rounded-full animate-pulse" title="Online Developer"></span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-extrabold text-white tracking-wide">Prabhat Singh</h3>
                  <p className="text-xs font-semibold text-teal-400 font-mono uppercase tracking-wider">
                    {lang === 'hi' ? 'मुख्य डेवलपर और संस्थापक' : 'Lead Developer & Founder'}
                  </p>
                  <p className="text-[10px] text-slate-400 max-w-xs font-sans leading-relaxed pt-1">
                    {lang === 'hi' 
                      ? 'फार्माकेयर के मुख्य निर्माता। किसी भी प्रकार के कस्टमाइजेशन या सहायता के लिए सीधे संपर्क करें।' 
                      : 'Creator of PharmaCare. Reach out for custom build requirements, setup queries, or direct cooperation.'}
                  </p>
                </div>
              </div>

              {/* Quick direct details */}
              <div className="w-full pt-4 border-t border-slate-900 space-y-2 text-xs text-left mt-4">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-mono text-[9px] uppercase">Response:</span>
                  <span className="text-emerald-400 font-semibold">{lang === 'hi' ? 'कम समय में (अति-शीघ्र)' : 'Within minutes'}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-mono text-[9px] uppercase">Support Code:</span>
                  <span className="text-slate-300 font-mono">#PharmaCareSupport</span>
                </div>
              </div>
            </div>

            {/* Inquiry Form Card */}
            <div className="md:col-span-7 bg-slate-950 rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-2xl flex flex-col justify-between">
              <form onSubmit={handleWhatsAppSend} className="space-y-4 text-left h-full flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">
                      {lang === 'hi' ? 'डेवलपर को डायरेक्ट मैसेज भेजें:' : 'Send message to Developer:'}
                    </span>
                    <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/20 uppercase tracking-wide">
                      WhatsApp Chat
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <textarea 
                      rows={4}
                      value={whatsappMsg}
                      onChange={(e) => setWhatsappMsg(e.target.value)}
                      placeholder={lang === 'hi' ? "नमस्ते डेवलपर! मुझे फार्माकेयर ऐप इंस्टॉल करने में मदद चाहिए..." : t.whatsappQueryPlaceholder}
                      className="w-full bg-slate-900 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-800 text-slate-100 focus:outline-none focus:border-teal-500 font-medium placeholder-slate-500"
                      required
                    ></textarea>
                  </div>

                  <div className="bg-emerald-950/20 rounded-lg p-2.5 border border-emerald-800/30 text-[10px] sm:text-xs text-emerald-300 flex items-start space-x-2 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>
                      {lang === 'hi' 
                        ? 'संदेश भेजें बटन पर क्लिक करने से सीधे आपके फोन का व्हाट्सएप खुल जाएगा।' 
                        : 'Submitting will directly launch WhatsApp with your pre-filled inquiry text.'}
                    </span>
                  </div>
                </div>

                <button 
                  id="submit-whatsapp-message-bottom"
                  type="submit"
                  className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-teal-700/20 mt-4"
                >
                  <MessageSquare className="w-4.5 h-4.5" />
                  <span>{t.whatsappSendBtn}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            <div className="md:col-span-5 space-y-4 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-3 text-white">
                <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center font-bold text-lg shadow">
                  +
                </div>
                <span className="text-lg font-bold tracking-tight">PharmaCare Website</span>
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                {lang === 'hi' 
                  ? 'फार्माकेयर ऐप को छोटे और मध्यम आकार के मेडिकल स्टोर्स, फार्मेसियों और क्लीनिकों को सशक्त बनाने के लिए मुफ्त में विकसित किया गया है। हम कोई डेटा एकत्र नहीं करते हैं।' 
                  : 'PharmaCare was constructed to enable community chemists and pharmacists in digitizing records. All ledger features, bill generation, and inventory metrics are entirely free.'}
              </p>
            </div>

            <div className="md:col-span-3 space-y-3 text-center md:text-left">
              <h4 className="text-white text-xs font-bold uppercase tracking-wider">Features</h4>
              <ul className="space-y-1.5 text-xs">
                <li><a href="#simulator" className="hover:text-white transition-colors">{lang === 'hi' ? 'ऑटो बिलिंग सिमुलेटर' : 'Live Billing Tool'}</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">{lang === 'hi' ? 'उधारी बहीखाता' : 'Customer Ledger'}</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">{lang === 'hi' ? 'गूगल ड्राइव बैकअप' : 'GDrive Auto Storage'}</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">{lang === 'hi' ? 'मेडिसिन स्टॉक' : 'Medicine Expiry Index'}</a></li>
              </ul>
            </div>

            <div className="md:col-span-4 space-y-3 text-center md:text-left">
              <h4 className="text-white text-xs font-bold uppercase tracking-wider">Contact & Support</h4>
              <ul className="space-y-1.5 text-xs">
                <li className="flex items-center justify-center md:justify-start space-x-2">
                  <span>Helpline:</span>
                  <a href="tel:9696971627" className="text-teal-400 hover:underline">+91 9696971627</a>
                </li>
                <li className="flex items-center justify-center md:justify-start space-x-2">
                  <span>WhatsApp:</span>
                  <a href="https://wa.me/919696971627" className="text-teal-400 hover:underline">+91 9696971627</a>
                </li>
                <li className="flex items-center justify-center md:justify-start space-x-2">
                  <span>Email:</span>
                  <span className="text-slate-300">pharmacaremedicalstore@gmail.com</span>
                </li>
              </ul>
            </div>

          </div>

          <div className="border-t border-slate-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px] font-mono">
            <p>© {new Date().getFullYear()} PharmaCare App. Developed for community healthcare stores.</p>
            <div className="flex space-x-4">
              <span>{lang === 'hi' ? '100% फ्री और विज्ञापन मुक्त' : '100% Free & No Ads Always'}</span>
              <span>•</span>
              <a href="#donation" className="text-rose-400 hover:underline">{lang === 'hi' ? 'डेवलपर सपोर्ट' : 'Support Developer'}</a>
            </div>
          </div>

        </div>
      </footer>

      {/* FLOATING WHATSAPP CHAT BADGE */}
      <a 
        id="floating-whatsapp-badge"
        href="https://wa.me/919696971627?text=Hi,%20I%20visited%20the%20PharmaCare%20website%20and%20need%20the%20App%20installation%20guide."
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
        title="Contact on WhatsApp"
      >
        <MessageSquare className="w-6 h-6 animate-pulse" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-white"></span>
      </a>

    </div>
  );
}
