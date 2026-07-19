import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Activity, 
  Sparkles, 
  Plus, 
  Layers, 
  Heart, 
  AlertCircle, 
  Zap,
  RotateCw
} from "lucide-react";

// ==========================================
// 1. Types & Data for Interactive Medicines
// ==========================================
export interface MedicineDetails {
  id: string;
  name: string;
  hindiName: string;
  formula: string;
  category: "Analgesic" | "Antibiotic" | "Vitamin" | "NSAID";
  categoryHindi: string;
  description: string;
  descriptionHindi: string;
  colorClass: string;
  accentColor: string; // Hex color for SVG gradients
  secondaryColor: string; // Hex color for SVG gradients
  pillType: "capsule" | "tablet" | "oval";
  particlesColor: string;
  benefits: string[];
  benefitsHindi: string[];
}

export const medicalDatabase: MedicineDetails[] = [
  {
    id: "para650",
    name: "Paracetamol 650mg",
    hindiName: "पैरासिटामोल 650mg",
    formula: "C₈H₉NO₂",
    category: "Analgesic",
    categoryHindi: "दर्द व बुखार निवारक",
    description: "An essential anti-pyretic and analgesic agent used globally to manage mild-to-moderate fever and body pain.",
    descriptionHindi: "बुखार और शरीर के दर्द को कम करने के लिए दुनिया भर में इस्तेमाल होने वाली आवश्यक सुरक्षित दवा।",
    colorClass: "from-cyan-400 to-teal-500",
    accentColor: "#22d3ee",
    secondaryColor: "#0d9488",
    pillType: "capsule",
    particlesColor: "cyan",
    benefits: ["Fever Reduction", "Fast Pain Relief", "Stomach Friendly"],
    benefitsHindi: ["तेज़ बुखार कम करे", "शरीर दर्द से राहत", "पेट के लिए सुरक्षित"]
  },
  {
    id: "amox500",
    name: "Amoxicillin 500mg",
    hindiName: "अमोक्सिसिलिन 500mg",
    formula: "C₁₆H₁₉N₃O₅S",
    category: "Antibiotic",
    categoryHindi: "एंटीबायोटिक",
    description: "A premium penicillin-class broad-spectrum antibiotic designed to combat bacterial infections safely.",
    descriptionHindi: "बैक्टीरियल संक्रमण और इन्फेक्शन से सुरक्षित रूप से लड़ने के लिए एक बेहतरीन ब्रॉड-स्पेक्ट्रम एंटीबायोटिक।",
    colorClass: "from-amber-400 to-rose-500",
    accentColor: "#fbbf24",
    secondaryColor: "#f43f5e",
    pillType: "capsule",
    particlesColor: "amber",
    benefits: ["Fights Infections", "High Bioavailability", "Bacterial Shield"],
    benefitsHindi: ["इन्फेक्शन खत्म करे", "तेज़ रिकवरी", "बैक्टीरिया से सुरक्षा"]
  },
  {
    id: "vitc1000",
    name: "Vitamin C (Ascorbic Acid)",
    hindiName: "विटामिन सी (एस्कॉर्बिक एसिड)",
    formula: "C₆H₈O₆",
    category: "Vitamin",
    categoryHindi: "इम्यूनिटी बूस्टर",
    description: "An organic compound of vital importance that strengthens the immune response, promotes tissue repair, and acts as an antioxidant.",
    descriptionHindi: "रोग प्रतिरोधक क्षमता बढ़ाने, त्वचा को स्वस्थ रखने और कोशिकाओं की मरम्मत के लिए सबसे शक्तिशाली एंटीऑक्सीडेंट विटामिन।",
    colorClass: "from-orange-400 to-amber-500",
    accentColor: "#fb923c",
    secondaryColor: "#f59e0b",
    pillType: "tablet",
    particlesColor: "orange",
    benefits: ["Immunity Booster", "Collagen Support", "Cell Antioxidant"],
    benefitsHindi: ["इम्यूनिटी मजबूत करे", "कोशिकाओं की मरम्मत", "त्वचा के लिए वरदान"]
  },
  {
    id: "ibu400",
    name: "Ibuprofen 400mg",
    hindiName: "आइबुप्रोफेन 400mg",
    formula: "C₁₃H₁₈O₂",
    category: "NSAID",
    categoryHindi: "सूजन व दर्द नाशक",
    description: "A nonsteroidal anti-inflammatory drug (NSAID) highly effective at reducing joint swelling, stiffness, and severe discomfort.",
    descriptionHindi: "सूजन, मांसपेशियों के खिंचाव, जोड़ों के दर्द और जकड़न को तुरंत दूर करने वाला शक्तिशाली एनएसएआईडी।",
    colorClass: "from-pink-500 to-indigo-500",
    accentColor: "#ec4899",
    secondaryColor: "#6366f1",
    pillType: "oval",
    particlesColor: "pink",
    benefits: ["Anti-Inflammatory", "Joint Pain Relief", "Swelling Control"],
    benefitsHindi: ["सूजन कम करे", "जोड़ों के दर्द में राहत", "मांसपेशियों का दर्द दूर"]
  }
];

// ==========================================
// 2. Individual SVG Assets (Molecules, Pill, etc.)
// ==========================================

// Spinning Capsule Component
const AnimatedCapsule: React.FC<{ accent: string; secondary: string; isHovered: boolean }> = ({ accent, secondary, isHovered }) => (
  <motion.svg
    width="160"
    height="160"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    animate={{ 
      rotate: isHovered ? [0, 360] : [0, 15, -15, 0],
      y: [0, -4, 4, 0]
    }}
    transition={{
      rotate: {
        repeat: Infinity,
        duration: isHovered ? 4 : 10,
        ease: "linear"
      },
      y: {
        repeat: Infinity,
        duration: 4,
        ease: "easeInOut"
      }
    }}
    className="drop-shadow-[0_10px_15px_rgba(15,118,110,0.25)] filter"
  >
    <defs>
      <linearGradient id="capGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={accent} />
        <stop offset="100%" stopColor={secondary} />
      </linearGradient>
      <linearGradient id="capGradRight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.6" />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    {/* Capsule Outer Glow */}
    <ellipse cx="50" cy="50" rx="36" ry="14" transform="rotate(-45 50 50)" fill={accent} opacity="0.15" filter="url(#glow)" />
    
    {/* Capsule Left Half */}
    <path 
      d="M32 32 C21 43 21 61 32 72 L50 54 L32 32 Z" 
      fill="url(#capGradLeft)" 
      stroke={secondary}
      strokeWidth="1.5"
    />
    
    {/* Capsule Right Half */}
    <path 
      d="M68 68 C79 57 79 39 68 28 L50 46 L68 68 Z" 
      fill="url(#capGradRight)" 
      stroke="#94a3b8"
      strokeWidth="1"
    />
    
    {/* Shiny highlight overlay */}
    <path 
      d="M35 35 C42 28 58 28 65 35" 
      stroke="white" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      opacity="0.3" 
    />
    
    {/* Band around the middle */}
    <line x1="38" y1="62" x2="62" y2="38" stroke={secondary} strokeWidth="2.5" opacity="0.6" />
  </motion.svg>
);

// Spinning Tablet Component
const AnimatedTablet: React.FC<{ accent: string; secondary: string; isHovered: boolean }> = ({ accent, secondary, isHovered }) => (
  <motion.svg
    width="160"
    height="160"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    animate={{ 
      rotate: isHovered ? [0, 360] : [0, 360],
      y: [0, -6, 6, 0]
    }}
    transition={{
      rotate: {
        repeat: Infinity,
        duration: isHovered ? 5 : 12,
        ease: "linear"
      },
      y: {
        repeat: Infinity,
        duration: 4.5,
        ease: "easeInOut"
      }
    }}
    className="drop-shadow-[0_10px_20px_rgba(251,146,60,0.25)] filter"
  >
    <defs>
      <linearGradient id="tabGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={accent} />
        <stop offset="60%" stopColor={secondary} />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
    </defs>
    
    {/* Shadow / Outer glow Ring */}
    <circle cx="50" cy="50" r="38" fill={accent} opacity="0.1" />
    
    {/* Main Tablet Circle */}
    <circle cx="50" cy="50" r="32" fill="url(#tabGrad)" stroke="#b45309" strokeWidth="1.5" />
    
    {/* Tablet Score Line (center groove) */}
    <line x1="22" y1="22" x2="78" y2="78" stroke="white" strokeWidth="2" opacity="0.5" strokeLinecap="round" />
    
    {/* Outer border highlight */}
    <circle cx="50" cy="50" r="28" stroke="white" strokeWidth="1" opacity="0.2" />
    
    {/* Glossy reflection crescent */}
    <path d="M22 40 A28 28 0 0 1 60 22" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
  </motion.svg>
);

// Spinning Oval Pill Component
const AnimatedOval: React.FC<{ accent: string; secondary: string; isHovered: boolean }> = ({ accent, secondary, isHovered }) => (
  <motion.svg
    width="160"
    height="160"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    animate={{ 
      rotate: isHovered ? [0, -360] : [15, 35, 15, -5, 15],
      y: [0, -5, 5, 0]
    }}
    transition={{
      rotate: {
        repeat: Infinity,
        duration: isHovered ? 4 : 15,
        ease: "easeInOut"
      },
      y: {
        repeat: Infinity,
        duration: 5,
        ease: "easeInOut"
      }
    }}
    className="drop-shadow-[0_12px_22px_rgba(236,72,153,0.25)] filter"
  >
    <defs>
      <linearGradient id="ovalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={accent} />
        <stop offset="50%" stopColor="#db2777" />
        <stop offset="100%" stopColor={secondary} />
      </linearGradient>
    </defs>
    
    <ellipse cx="50" cy="50" rx="38" ry="24" transform="rotate(30 50 50)" fill="url(#ovalGrad)" stroke="#4f46e5" strokeWidth="1.5" />
    
    {/* Tablet division */}
    <path d="M35 30 L65 70" stroke="white" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
    
    {/* Top gloss highlight */}
    <path d="M22 45 C28 30 48 24 64 30" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
    
    <circle cx="50" cy="50" r="12" fill="white" opacity="0.1" />
  </motion.svg>
);

// Particle interface
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  angle: number;
  speed: number;
}

// ====================================================================
// A. FLOATING MEDICAL BACKGROUND ELEMENTS (Parallax / Floating Particles)
// ====================================================================
export const FloatingMedicalBackground: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Highly professional medical and biotech elements for background immersion
  const elements = [
    // 1. Beautiful Translucent Teal Capsule (Top Left)
    {
      id: "bg-capsule-1",
      delay: 0,
      duration: 22,
      left: "8%",
      top: "14%",
      scale: 1.1,
      style: { opacity: 0.12 },
      content: (
        <svg width="70" height="70" viewBox="0 0 100 100" fill="none" className="rotate-12 filter drop-shadow-[0_8px_16px_rgba(20,184,166,0.2)]">
          <rect x="35" y="15" width="30" height="70" rx="15" fill="url(#capsuleGrad1)" stroke="#14b8a6" strokeWidth="2" />
          <path d="M35 50 C35 35, 65 35, 65 50 L65 85 C65 85, 35 85, 35 85 Z" fill="#14b8a6" fillOpacity="0.3" />
          <line x1="35" y1="50" x2="65" y2="50" stroke="#14b8a6" strokeWidth="3" />
          <path d="M42 22 L42 42" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
          <defs>
            <linearGradient id="capsuleGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.05" />
            </linearGradient>
          </defs>
        </svg>
      )
    },
    // 2. Translucent Rose & Amber Capsule (Top Right)
    {
      id: "bg-capsule-2",
      delay: 4,
      duration: 26,
      left: "85%",
      top: "20%",
      scale: 1.2,
      style: { opacity: 0.09 },
      content: (
        <svg width="80" height="80" viewBox="0 0 100 100" fill="none" className="-rotate-45 filter drop-shadow-[0_8px_16px_rgba(244,63,94,0.15)]">
          <rect x="35" y="15" width="30" height="70" rx="15" fill="url(#capsuleGrad2)" stroke="#f43f5e" strokeWidth="2" />
          <path d="M35 15 L65 15 L65 50 C65 50, 35 50, 35 50 Z" fill="#f43f5e" fillOpacity="0.25" />
          <line x1="35" y1="50" x2="65" y2="50" stroke="#f43f5e" strokeWidth="3" />
          <path d="M42 25 L42 40" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
          <defs>
            <linearGradient id="capsuleGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.05" />
            </linearGradient>
          </defs>
        </svg>
      )
    },
    // 3. Translucent Heartbeat Activity pulse line (Center Bottom)
    {
      id: "bg-pulse-line",
      delay: 2,
      duration: 15,
      left: "25%",
      top: "72%",
      scale: 1.3,
      style: { opacity: 0.15 },
      content: (
        <svg width="220" height="70" viewBox="0 0 200 80" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" className="filter drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]">
          <path d="M 10 40 H 45 L 55 15 L 65 65 L 75 5 L 88 75 L 98 32 L 108 48 L 118 40 H 190" strokeDasharray="400" strokeDashoffset="0">
            <animate attributeName="strokeDashoffset" values="400;0" dur="4s" repeatCount="indefinite" />
          </path>
        </svg>
      )
    },
    // 4. Bio-molecular Chemical Ring (Center Left)
    {
      id: "bg-molecule-1",
      delay: 1,
      duration: 28,
      left: "5%",
      top: "48%",
      scale: 1,
      style: { opacity: 0.08 },
      content: (
        <svg width="110" height="110" viewBox="0 0 120 120" fill="none" stroke="#10b981" strokeWidth="1.5">
          {/* Hexagon chemical rings */}
          <polygon points="60,20 90,37 90,72 60,90 30,72 30,37" fill="rgba(16,185,129,0.03)" />
          <polygon points="60,10 100,33 100,80 60,103 20,80 20,33" strokeDasharray="3 3" />
          {/* Atomic nodes */}
          <circle cx="60" cy="20" r="4.5" fill="#10b981" />
          <circle cx="90" cy="37" r="4.5" fill="#10b981" />
          <circle cx="90" cy="72" r="4.5" fill="#10b981" />
          <circle cx="60" cy="90" r="4.5" fill="#10b981" />
          <circle cx="30" cy="72" r="4.5" fill="#10b981" />
          <circle cx="30" cy="37" r="4.5" fill="#10b981" />
          {/* Connection lines to sub-atoms */}
          <line x1="60" y1="20" x2="60" y2="5" />
          <circle cx="60" cy="5" r="3" fill="#34d399" />
          <line x1="90" y1="37" x2="105" y2="28" />
          <circle cx="105" cy="28" r="3" fill="#34d399" />
        </svg>
      )
    },
    // 5. Translucent Round Tablet Pill with score line (Center Right)
    {
      id: "bg-tablet-1",
      delay: 5,
      duration: 24,
      left: "64%",
      top: "42%",
      scale: 1,
      style: { opacity: 0.12 },
      content: (
        <svg width="65" height="65" viewBox="0 0 100 100" fill="none" className="rotate-45 filter drop-shadow-[0_6px_12px_rgba(6,182,212,0.15)]">
          <circle cx="50" cy="50" r="35" fill="url(#tabGradBg)" stroke="#06b6d4" strokeWidth="2" />
          <line x1="25" y1="25" x2="75" y2="75" stroke="#06b6d4" strokeWidth="2" opacity="0.5" />
          <path d="M25 50 A25 25 0 0 1 50 25" stroke="white" strokeWidth="2.5" opacity="0.3" strokeLinecap="round" />
          <defs>
            <linearGradient id="tabGradBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#0891b2" stopOpacity="0.02" />
            </linearGradient>
          </defs>
        </svg>
      )
    },
    // 6. Medical Cross Sparkle (Far Right Mid)
    {
      id: "bg-cross-sparkle",
      delay: 3,
      duration: 18,
      left: "92%",
      top: "55%",
      scale: 0.9,
      style: { opacity: 0.15 },
      content: (
        <div className="text-teal-400 flex flex-col items-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="animate-pulse">
            <path d="M19 10.5H13.5V5C13.5 4.17 12.83 3.5 12 3.5C11.17 3.5 10.5 4.17 10.5 5V10.5H5C4.17 10.5 3.5 11.17 3.5 12C3.5 12.83 4.17 13.5 5 13.5H10.5V19C10.5 19.83 11.17 20.5 12 20.5C12.83 20.5 13.5 19.83 13.5 19V13.5H19C19.83 13.5 20.5 12.83 20.5 12C20.5 11.17 19.83 10.5 19 10.5Z" />
          </svg>
        </div>
      )
    },
    // 7. Light Floating Biotech Bubbles/Particles
    {
      id: "bg-bubble-1",
      delay: 1.5,
      duration: 14,
      left: "18%",
      top: "38%",
      scale: 0.8,
      style: { opacity: 0.12 },
      content: (
        <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-400/40 animate-ping" style={{ animationDuration: '3s' }} />
      )
    },
    {
      id: "bg-bubble-2",
      delay: 4.5,
      duration: 16,
      left: "78%",
      top: "65%",
      scale: 0.7,
      style: { opacity: 0.1 },
      content: (
        <div className="w-5 h-5 rounded-full bg-teal-500/20 border border-teal-400/30 animate-ping" style={{ animationDuration: '4s' }} />
      )
    }
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {elements.map((el) => (
        <motion.div
          key={el.id}
          className="absolute"
          style={{
            left: el.left,
            top: el.top,
            ...el.style,
          }}
          initial={{ opacity: 0, scale: el.scale * 0.8 }}
          animate={{
            opacity: [el.style.opacity * 0.6, el.style.opacity, el.style.opacity * 0.6],
            scale: [el.scale, el.scale * 1.1, el.scale],
            y: [0, -20, 20, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: el.duration,
            repeat: Infinity,
            delay: el.delay,
            ease: "easeInOut",
          }}
        >
          {el.content}
        </motion.div>
      ))}

      {/* Premium ambient radial mesh background lighting */}
      <div className="absolute top-[5%] left-[2%] w-[45vw] h-[45vw] rounded-full bg-teal-500/5 blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute top-[25%] right-[2%] w-[45vw] h-[45vw] rounded-full bg-emerald-500/5 blur-[130px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
      <div className="absolute bottom-[10%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-indigo-500/5 blur-[110px] pointer-events-none" />
    </div>
  );
};


// ====================================================================
// B. INTERACTIVE MEDICINE SYNTHESIZER LAB (Main Interactive Component)
// ====================================================================
interface SynthesizerProps {
  lang: "en" | "hi";
}

export const InteractiveMedicineSynthesizer: React.FC<SynthesizerProps> = ({ lang }) => {
  const [selectedMedId, setSelectedMedId] = useState<string>("para650");
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [pillsSynthesized, setPillsSynthesized] = useState<number>(14);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showFormulaDetails, setShowFormulaDetails] = useState(false);
  const [isHoveringPill, setIsHoveringPill] = useState(false);

  const activeMed = medicalDatabase.find(m => m.id === selectedMedId) || medicalDatabase[0];

  // Particle generator on synthesize action
  const handleSynthesize = () => {
    if (isSynthesizing) return;
    setIsSynthesizing(true);

    // Create custom flying chemical particles
    const newParticles: Particle[] = Array.from({ length: 24 }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 5;
      return {
        id: Date.now() + i,
        x: 0,
        y: 0,
        size: 3 + Math.random() * 6,
        color: activeMed.accentColor,
        angle,
        speed
      };
    });
    setParticles(newParticles);

    // Increment pill synthesized tracker
    setTimeout(() => {
      setPillsSynthesized(prev => prev + 1);
      setIsSynthesizing(false);
      // Clean up particles
      setParticles([]);
    }, 1500);
  };

  return (
    <div className="w-full bg-slate-900/60 backdrop-blur-xl rounded-3xl p-4 sm:p-6 border border-white/10 shadow-2xl relative overflow-hidden text-white font-sans">
      
      {/* Decorative Glowing Bio-Reactor Background Grid */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px] pointer-events-none" />
      <div className="absolute top-2 right-2 flex items-center space-x-1.5 z-10">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400 font-bold">
          {lang === 'hi' ? 'दवा लैब सक्रिय' : 'Biochem Lab Active'}
        </span>
      </div>

      <div className="relative z-10 space-y-4">
        
        {/* Title and Intro */}
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-1 rounded-lg bg-teal-500/15 border border-teal-500/30 text-teal-400">
              <Activity className="w-4 h-4 animate-pulse" />
            </span>
            <h4 className="text-sm sm:text-base font-extrabold text-white tracking-tight uppercase">
              {lang === 'hi' ? 'इंटरएक्टिव मेडिसिन लैब' : 'Interactive Medicine Visualizer'}
            </h4>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed max-w-lg">
            {lang === 'hi' 
              ? 'दवा चुनें, रासायनिक सूत्रों को समझें और लाइव 3D एनिमेशन सिमुलेशन का अनुभव करें।' 
              : 'Choose a medicine to inspect chemical structures, active ingredients, and spin live high-fidelity visualizers.'}
          </p>
        </div>

        {/* Medicine Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {medicalDatabase.map(med => (
            <button
              key={med.id}
              onClick={() => {
                setSelectedMedId(med.id);
                setShowFormulaDetails(false);
              }}
              className={`p-2 rounded-xl text-center border text-[11px] font-bold tracking-tight transition-all cursor-pointer flex flex-col justify-center items-center ${
                selectedMedId === med.id 
                  ? 'bg-gradient-to-b from-teal-500/10 to-teal-500/20 border-teal-400/80 text-white shadow-lg shadow-teal-950/40' 
                  : 'bg-slate-950/60 border-white/5 text-slate-300 hover:bg-slate-950/90 hover:border-teal-500/30'
              }`}
            >
              <span className="truncate max-w-[120px]">
                {lang === 'hi' ? med.hindiName.split(' ')[0] : med.name.split(' ')[0]}
              </span>
              <span className="text-[9px] font-mono text-slate-500 font-medium">
                {med.formula}
              </span>
            </button>
          ))}
        </div>

        {/* Interactive Lab Screen */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-slate-950/80 rounded-2xl p-4 border border-white/5 relative items-center">
          
          {/* Left Column: Visual 3D Reactor Display */}
          <div className="md:col-span-5 flex flex-col items-center justify-center py-4 relative bg-slate-900/40 rounded-xl border border-white/5 overflow-hidden min-h-[220px]">
            
            {/* Pulsing light rings in reactor */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div 
                className="w-36 h-36 rounded-full border border-teal-500/10"
                animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div 
                className="w-44 h-44 rounded-full border border-teal-500/5"
                animate={{ scale: [1.2, 0.9, 1.2], opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>

            {/* Main Interactive Pill Visualizer */}
            <div 
              className="relative cursor-grab active:cursor-grabbing"
              onMouseEnter={() => setIsHoveringPill(true)}
              onMouseLeave={() => setIsHoveringPill(false)}
            >
              {activeMed.pillType === "capsule" && (
                <AnimatedCapsule 
                  accent={activeMed.accentColor} 
                  secondary={activeMed.secondaryColor} 
                  isHovered={isHoveringPill || isSynthesizing} 
                />
              )}
              {activeMed.pillType === "tablet" && (
                <AnimatedTablet 
                  accent={activeMed.accentColor} 
                  secondary={activeMed.secondaryColor} 
                  isHovered={isHoveringPill || isSynthesizing} 
                />
              )}
              {activeMed.pillType === "oval" && (
                <AnimatedOval 
                  accent={activeMed.accentColor} 
                  secondary={activeMed.secondaryColor} 
                  isHovered={isHoveringPill || isSynthesizing} 
                />
              )}

              {/* Exploding Particles on synthesis */}
              <AnimatePresence>
                {isSynthesizing && particles.map((p) => (
                  <motion.div
                    key={p.id}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                      backgroundColor: p.color,
                      width: p.size,
                      height: p.size,
                      left: "50%",
                      top: "50%",
                    }}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    animate={{
                      x: Math.cos(p.angle) * p.speed * 18,
                      y: Math.sin(p.angle) * p.speed * 18,
                      opacity: 0,
                      scale: 0.1
                    }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Interactive Hints & Stats */}
            <div className="absolute bottom-2 text-center">
              <p className="text-[9px] font-mono text-slate-500 tracking-wider">
                {isSynthesizing 
                  ? (lang === 'hi' ? "संश्लेषण सक्रिय..." : "SYNTHESIZING AGENT...")
                  : (lang === 'hi' ? "घुमाने के लिए कर्सर लाएं" : "HOVER OVER PILL TO SPIN")}
              </p>
            </div>

          </div>

          {/* Right Column: Medicine Chemistry & Stats Info */}
          <div className="md:col-span-7 space-y-3">
            
            {/* Header Info */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2">
              <div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-gradient-to-r ${activeMed.colorClass} text-slate-950`}>
                  {lang === 'hi' ? activeMed.categoryHindi : activeMed.category}
                </span>
                <h5 className="text-base sm:text-lg font-bold text-white tracking-tight mt-1">
                  {lang === 'hi' ? activeMed.hindiName : activeMed.name}
                </h5>
              </div>
              
              <div className="text-right font-mono text-xs text-teal-400">
                <span className="text-slate-500 font-sans font-medium text-[10px] block">Formula</span>
                <strong className="text-sm tracking-wide font-black">{activeMed.formula}</strong>
              </div>
            </div>

            {/* Description Paragraph */}
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {lang === 'hi' ? activeMed.descriptionHindi : activeMed.description}
            </p>

            {/* Interactive Benefits list (Staggered or Pill badges) */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block">
                {lang === 'hi' ? 'विशेष प्रभाव और लाभ:' : 'Key Therapeutic Benefits:'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(lang === 'hi' ? activeMed.benefitsHindi : activeMed.benefits).map((b, idx) => (
                  <span 
                    key={idx} 
                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-teal-950/40 border border-teal-900/30 text-[10px] sm:text-xs text-teal-300 font-semibold"
                  >
                    <span className="w-1 h-1 rounded-full bg-emerald-400" />
                    <span>{b}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Science Compound Expansion Tab */}
            <div className="bg-slate-900/80 border border-white/5 rounded-xl p-2.5 space-y-2">
              <div 
                className="flex items-center justify-between cursor-pointer select-none"
                onClick={() => setShowFormulaDetails(!showFormulaDetails)}
              >
                <div className="flex items-center space-x-1.5 text-[10px] sm:text-xs text-slate-300 font-bold">
                  <Layers className="w-3.5 h-3.5 text-teal-400" />
                  <span>{lang === 'hi' ? 'रासायनिक संरचना व विवरण' : 'Show Molecular Breakdown'}</span>
                </div>
                <span className="text-xs text-teal-400 font-bold font-mono">
                  {showFormulaDetails ? "[-]" : "[+]"}
                </span>
              </div>

              {showFormulaDetails && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="pt-1.5 border-t border-white/5 space-y-1.5 text-[10px] sm:text-xs text-slate-400 font-mono"
                >
                  <p className="leading-relaxed">
                    {lang === 'hi' 
                      ? `इस रासायनिक यौगिक का आणविक भार (Molecular weight) बहुत संतुलित है। यह शरीर के रिसेप्टर्स के साथ तुरंत जुड़कर राहत प्रदान करता है।`
                      : `The compound molecular structure of ${activeMed.formula} binds perfectly with neurological receptor pathways for rapid bioavailability.`}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-[9px] pt-1">
                    <span className="bg-slate-950 px-2 py-0.5 rounded border border-white/5">
                      Type: Synthetic Organic
                    </span>
                    <span className="bg-slate-950 px-2 py-0.5 rounded border border-white/5">
                      Bio-Half-Life: 2-3 Hours
                    </span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Bottom Actions Row (Synthesize Button + Lab Stats) */}
            <div className="flex items-center justify-between gap-3 pt-1">
              
              {/* Stats synthesized */}
              <div className="text-left font-mono">
                <span className="text-[9px] text-slate-500 block leading-none uppercase">Synthesized</span>
                <span className="text-sm font-black text-white">
                  {pillsSynthesized} {lang === 'hi' ? 'टेबलेट्स' : 'Pills'}
                </span>
              </div>

              {/* Dispense/Synthesize Button */}
              <button
                onClick={handleSynthesize}
                disabled={isSynthesizing}
                className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-black tracking-tight uppercase flex items-center space-x-1.5 cursor-pointer select-none transition-all active:scale-95 ${
                  isSynthesizing 
                    ? 'bg-slate-800 text-slate-500 border border-slate-700' 
                    : 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 hover:shadow-lg hover:shadow-teal-500/25'
                }`}
              >
                {isSynthesizing ? (
                  <>
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    <span>{lang === 'hi' ? 'संश्लेषण...' : 'Synthesizing...'}</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>{lang === 'hi' ? 'दवा बनाएं' : 'Synthesize Pill'}</span>
                  </>
                )}
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
