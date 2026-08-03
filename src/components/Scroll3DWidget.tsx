import React, { useState, useEffect } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowUp, ArrowDown, Sparkles, Cloud, ShieldCheck } from "lucide-react";

interface Scroll3DWidgetProps {
  lang: 'en' | 'hi';
}

export const Scroll3DWidget: React.FC<Scroll3DWidgetProps> = ({ lang }) => {
  const [scrollPercent, setScrollPercent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  // Motion scroll progress
  const { scrollYProgress } = useScroll();
  const scaleProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollPercent(Math.round(currentProgress));
        setIsVisible(window.scrollY > 150);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 30; // -15deg to +15deg
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -30; // -15deg to +15deg
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToNextSection = () => {
    const sections = ["features", "simulator", "donation", "install"];
    const currentY = window.scrollY;
    
    for (const secId of sections) {
      const el = document.getElementById(secId);
      if (el) {
        const top = el.offsetTop - 70;
        if (top > currentY + 50) {
          window.scrollTo({ top, behavior: "smooth" });
          return;
        }
      }
    }
    // If at bottom, scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isVisible) return null;

  // SVG Circumference calculation for progress ring
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollPercent / 100) * circumference;

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        className="relative group"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          perspective: 1000,
        }}
      >
        {/* 3D Glassmorphic Floating Container */}
        <motion.div
          animate={{
            rotateX: mousePos.y,
            rotateY: mousePos.x,
            y: isHovered ? [0, -4, 0] : [0, -8, 0],
          }}
          transition={{
            rotateX: { type: "spring", stiffness: 300, damping: 20 },
            rotateY: { type: "spring", stiffness: 300, damping: 20 },
            y: { repeat: Infinity, duration: 3, ease: "easeInOut" }
          }}
          className="relative bg-slate-900/85 backdrop-blur-2xl border border-teal-500/40 rounded-3xl p-2.5 shadow-[0_20px_50px_rgba(15,118,110,0.35)] flex flex-col items-center space-y-2 select-none"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Glowing Ambient Light Layer */}
          <div 
            className="absolute inset-0 rounded-3xl bg-gradient-to-b from-teal-500/20 to-emerald-500/10 blur-md pointer-events-none"
            style={{ transform: "translateZ(-10px)" }}
          />

          {/* Top 3D Badge Tooltip on Hover */}
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ 
              opacity: isHovered ? 1 : 0, 
              y: isHovered ? -45 : 0,
              scale: isHovered ? 1 : 0.9
            }}
            transition={{ duration: 0.2 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-950 border border-teal-500/50 px-3 py-1 rounded-full text-[10px] font-mono font-bold text-teal-300 shadow-xl pointer-events-none flex items-center space-x-1.5"
            style={{ transform: "translateZ(30px) translateX(-50%)" }}
          >
            <Cloud className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span>{lang === 'hi' ? '100% फ्री + अनलिमिटेड क्लाउड' : '100% Free + Unlimited Cloud'}</span>
          </motion.div>

          {/* 3D Scroll Progress Circle with Scroll Up Button */}
          <div 
            className="relative w-12 h-12 flex items-center justify-center cursor-pointer group/top"
            onClick={scrollToTop}
            title={lang === 'hi' ? 'ऊपर स्क्रॉल करें (Scroll to Top)' : 'Scroll to Top'}
            style={{ transform: "translateZ(20px)" }}
          >
            {/* SVG Progress Ring */}
            <svg className="w-12 h-12 transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="3.5"
                fill="transparent"
              />
              <circle
                cx="24"
                cy="24"
                r={radius}
                className="stroke-teal-400 transition-all duration-150"
                strokeWidth="3.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Up Arrow Icon in Center */}
            <div className="absolute inset-0 flex items-center justify-center text-teal-300 group-hover/top:text-white group-hover/top:scale-110 transition-transform">
              <ArrowUp className="w-5 h-5 animate-bounce-short" />
            </div>

            {/* Scroll percentage indicator overlay */}
            <span className="absolute -bottom-1 text-[8px] font-mono font-black text-slate-300 bg-slate-950 px-1 rounded border border-white/10">
              {scrollPercent}%
            </span>
          </div>

          <div className="w-8 h-[1px] bg-white/10" />

          {/* 3D Scroll Down Button */}
          <button
            onClick={scrollToNextSection}
            title={lang === 'hi' ? 'अगले सेक्शन पर जाएं' : 'Scroll Down'}
            className="w-9 h-9 rounded-2xl bg-teal-500/10 hover:bg-teal-500/25 border border-teal-500/30 flex items-center justify-center text-emerald-400 hover:text-white transition-all cursor-pointer group/down active:scale-90"
            style={{ transform: "translateZ(15px)" }}
          >
            <ArrowDown className="w-4 h-4 group-hover/down:translate-y-0.5 transition-transform" />
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};
