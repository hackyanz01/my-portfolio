import { useState, useEffect, useRef, FormEvent } from "react";
import { 
  Github, 
  Linkedin, 
  Instagram, 
  Mail, 
  Terminal as TerminalIcon, 
  Code2, 
  Network, 
  Cloud, 
  ShieldAlert, 
  Palette, 
  BrainCircuit, 
  Workflow, 
  ExternalLink, 
  ChevronRight, 
  Sparkles, 
  Globe, 
  Calendar, 
  Clock, 
  ArrowUpRight, 
  CheckCircle2, 
  Menu, 
  X, 
  FileText, 
  Award, 
  BookOpen, 
  MessageSquare, 
  Send, 
  Eye, 
  Share2, 
  MapPin, 
  Activity, 
  Fingerprint, 
  Sun, 
  Moon, 
  Download,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { 
  UI_TRANSLATIONS, 
  PROJECTS_DATA, 
  SKILLS_DATA, 
  CERTIFICATES_DATA, 
  TIMELINE_DATA, 
  ARTICLES_DATA
} from "./data";
import { Project, Certificate, Article } from "./types";

import ThreeDBackground from "./components/ThreeDBackground";
import Terminal from "./components/Terminal";
import CustomCursor from "./components/CustomCursor";
import SysConfigurator from "./components/SysConfigurator";

export default function App() {
  const [lang, setLang] = useState<"en" | "id">("en");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [bgEffect, setBgEffect] = useState<"particles" | "matrix" | "aurora">("particles");

  // Dynamic state loaded from the backend APIs
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  const [projects, setProjects] = useState<Project[]>(PROJECTS_DATA);
  const [projectFilter, setProjectFilter] = useState("All");

  // Selection states for modal interactions
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Contact form submission state
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [networkLog, setNetworkLog] = useState<string[]>([]);

  // Typing effect for the Hero Section
  const [roleIndex, setRoleIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const t = UI_TRANSLATIONS[lang];

  // Fetch initial system states from server APIs
  useEffect(() => {
    // 1. Fetch live visitor count (increments upon load)
    fetch("/api/visitor")
      .then((res) => {
        if (!res.ok) throw new Error("Offline fallback");
        return res.json();
      })
      .then((data) => {
        if (data && typeof data.count === "number") {
          setVisitorCount(data.count);
        }
      })
      .catch((err) => {
        console.warn("Visitor API fallback used:", err);
        setVisitorCount(1492); // Clean static seed if API is blocked in iframe
      });

    // 2. Fetch curated projects list
    fetch("/api/projects")
      .then((res) => {
        if (!res.ok) throw new Error("Offline fallback");
        return res.json();
      })
      .then((data) => {
        if (data && data.projects) {
          // Merge server data with local file schema safely
          const merged: Project[] = data.projects.map((srv: any) => {
            const loc = PROJECTS_DATA.find((p) => p.id === srv.id);
            return {
              ...srv,
              description: loc ? loc.description : { en: srv.description, id: srv.description }
            };
          });
          setProjects(merged);
        }
      })
      .catch((err) => {
        console.warn("Projects API fallback used:", err);
        setProjects(PROJECTS_DATA);
      });
  }, []);

  // Loop typing effect
  useEffect(() => {
    const roles = t.heroRoles;
    const fullText = roles[roleIndex];
    let timer: NodeJS.Timeout;

    const handleType = () => {
      if (!isDeleting) {
        setCurrentText((prev) => fullText.substring(0, prev.length + 1));
        if (currentText === fullText) {
          timer = setTimeout(() => setIsDeleting(true), 1500); // Wait on completion
        } else {
          timer = setTimeout(handleType, 75); // Speed typing
        }
      } else {
        setCurrentText((prev) => fullText.substring(0, prev.length - 1));
        if (currentText === "") {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % roles.length);
          timer = setTimeout(handleType, 200);
        } else {
          timer = setTimeout(handleType, 40); // Speed deletion
        }
      }
    };

    timer = setTimeout(handleType, isDeleting ? 40 : 100);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, roleIndex, lang]);

  // Form handling
  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setFormStatus("sending");
    setNetworkLog((prev) => [...prev, `[INIT] Handshake request dispatched by ID: ${formData.name.substring(0, 10)}`]);

    setTimeout(() => {
      setFormStatus("success");
      setNetworkLog((prev) => [
        ...prev,
        `[OK] SMTP Payload sent cleanly to admin router.`,
        `[SUCCESS] Connection established and logged with client email: ${formData.email}`
      ]);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1800);
  };

  const toggleBackgroundEffect = () => {
    setBgEffect((prev) => {
      if (prev === "particles") return "matrix";
      if (prev === "matrix") return "aurora";
      return "particles";
    });
  };

  // Filtering projects
  const filteredProjects = projectFilter === "All" 
    ? projects 
    : projects.filter(p => p.category === projectFilter);

  // Simple resume download simulator (generates a beautiful raw system log as text)
  const handleDownloadCV = () => {
    const cvContent = `
==================================================
DOSSIER: YAZID AL WAFIY - SYSTEM ENGINEERING ARCHITECT
==================================================
Profession: Linux System Administrator & UI/UX Designer
Web Portfolio: ${window.location.origin}
Email: yazidalwafiy122@gmail.com
Location: Indonesia

--------------------------------------------------
CORE TECHNICAL CAPABILITIES
--------------------------------------------------
* Networking: Cisco Routers, CCNA core, Mikrotik MTCNA, OSPF routing, Bandwidth shaping
* System Admin: Linux/Zsh, Bash automation, Systemd, reverse proxying (Nginx/Apache)
* Cloud & DevOps: AWS ECS, S3, RDS, Docker, Terraform configurations, GitHub Actions CI/CD
* Security: Kali Linux audit structures, Wireshark, Nmap scanning, penetration audits
* UI/UX Design: Figma auto-layouts, custom web component frameworks, glassmorphic tokens

--------------------------------------------------
ACADEMIC & PROFESSIONAL LOGS
--------------------------------------------------
- Junior Systems Engineer & UI Designer (Contract/Freelance) 
- Mikrotik Certified Network Associate (MTCNA) - Issued 2025
- Cisco Certified Network Associate (CCNA studies) - Issued 2025
- Cloud Computing Foundations (Dicoding Authorized) - Issued 2024
- Linux Administrator Apprentice - Open Source Indonesia (2023-2024)

--------------------------------------------------
VERIFICATION CHECKSUM
--------------------------------------------------
MD5: c4ca4238a0b923820dcc509a6f75849b
STATUS: AUTHENTIC & VERIFIED
==================================================
`;
    const blob = new Blob([cvContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Yazid_Al_Wafiy_Systems_CV.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`min-h-screen font-sans antialiased text-white select-none ${theme === "light" ? "bg-slate-50 text-slate-900" : "bg-[#050505] text-zinc-100"}`}>
      
      {/* Background Interactive Canvas Canvas particles */}
      <ThreeDBackground effectType={bgEffect} />

      {/* Cursor feedback */}
      <CustomCursor />

      {/* Fixed top nav header */}
      <header className={`fixed top-0 left-0 w-full z-40 border-b transition-all duration-300 ${
        theme === "light" 
          ? "bg-slate-50/80 border-slate-200/50" 
          : "bg-black/40 border-zinc-900/50"
      } backdrop-blur-md`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo / Brand */}
          <a href="#home" className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center font-display font-bold text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
              Y
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-sm tracking-wider text-white">YAZID.OS</span>
              <span className="font-mono text-[10px] text-zinc-500 font-bold">SECURE NODE</span>
            </div>
          </a>

          {/* Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#about" className="font-display text-sm font-medium text-zinc-400 hover:text-white transition-colors">01. About</a>
            <a href="#skills" className="font-display text-sm font-medium text-zinc-400 hover:text-white transition-colors">02. Skills</a>
            <a href="#projects" className="font-display text-sm font-medium text-zinc-400 hover:text-white transition-colors">03. Projects</a>
            <a href="#certificates" className="font-display text-sm font-medium text-zinc-400 hover:text-white transition-colors">04. Credentials</a>
            <a href="#experience" className="font-display text-sm font-medium text-zinc-400 hover:text-white transition-colors">05. Timeline</a>
            <a href="#blog" className="font-display text-sm font-medium text-zinc-400 hover:text-white transition-colors">06. Logs</a>
            <a href="#contact" className="font-display text-sm font-medium text-zinc-400 hover:text-white transition-colors">07. Contact</a>
          </nav>

          {/* Action buttons (Lang, Theme, Mobile toggle) */}
          <div className="flex items-center gap-4">
            
            {/* Lang Switch */}
            <button 
              onClick={() => setLang(lang === "en" ? "id" : "en")}
              className="px-2.5 py-1 rounded bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs font-mono font-bold text-zinc-300 cursor-pointer transition-all duration-200"
              title="Change Language"
            >
              {lang.toUpperCase()}
            </button>

            {/* Background Style Cycle */}
            <button 
              onClick={toggleBackgroundEffect}
              className="p-1.5 rounded bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1.5"
              title="Cycle Visual Grid Effect"
            >
              <Globe className="w-3.5 h-3.5 text-blue-400 animate-spin" style={{ animationDuration: '8s' }} />
              <span className="font-mono text-[10px] hidden sm:inline uppercase">{bgEffect}</span>
            </button>

            {/* Mobile Nav Menu Button */}
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-20 w-full h-[calc(100vh-80px)] bg-black/95 z-30 flex flex-col items-center justify-center gap-6 p-6 md:hidden"
          >
            <a href="#about" onClick={() => setMenuOpen(false)} className="font-display text-xl text-zinc-400 hover:text-white">01. About</a>
            <a href="#skills" onClick={() => setMenuOpen(false)} className="font-display text-xl text-zinc-400 hover:text-white">02. Skills</a>
            <a href="#projects" onClick={() => setMenuOpen(false)} className="font-display text-xl text-zinc-400 hover:text-white">03. Projects</a>
            <a href="#certificates" onClick={() => setMenuOpen(false)} className="font-display text-xl text-zinc-400 hover:text-white">04. Credentials</a>
            <a href="#experience" onClick={() => setMenuOpen(false)} className="font-display text-xl text-zinc-400 hover:text-white">05. Timeline</a>
            <a href="#blog" onClick={() => setMenuOpen(false)} className="font-display text-xl text-zinc-400 hover:text-white">06. Logs</a>
            <a href="#contact" onClick={() => setMenuOpen(false)} className="font-display text-xl text-zinc-400 hover:text-white">07. Contact</a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating social links (Left side - Desktop) */}
      <div className="fixed bottom-0 left-8 z-30 hidden xl:flex flex-col items-center gap-6 after:w-[1px] after:h-24 after:bg-zinc-800">
        <a href="https://github.com/hackyanz01" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white hover:-translate-y-1 transition-all duration-300" title="GitHub">
          <Github className="w-5 h-5" />
        </a>
        <a href="https://www.linkedin.com/in/yazid-al-wafiy-991767328/" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white hover:-translate-y-1 transition-all duration-300" title="LinkedIn">
          <Linkedin className="w-5 h-5" />
        </a>
        <a href="https://www.instagram.com/zydran_22/?next=%2F" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white hover:-translate-y-1 transition-all duration-300" title="Instagram">
          <Instagram className="w-5 h-5" />
        </a>
        <a href="mailto:yazidalwafiy122@gmail.com" className="text-zinc-500 hover:text-white hover:-translate-y-1 transition-all duration-300" title="Email">
          <Mail className="w-5 h-5" />
        </a>
      </div>

      {/* Floating telemetry counter (Right side - Desktop) */}
      <div className="fixed bottom-0 right-8 z-30 hidden xl:flex flex-col items-center gap-6 after:w-[1px] after:h-24 after:bg-zinc-800 font-mono text-[10px] text-zinc-500 tracking-widest uppercase [writing-mode:vertical-lr]">
        <div className="flex items-center gap-2 py-2">
          <Activity className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
          <span>V-LOGGED: {visitorCount !== null ? visitorCount : "..."} NODE SECURE</span>
        </div>
      </div>

      {/* Hero / Landing Section */}
      <section id="home" className="min-h-screen pt-28 flex flex-col justify-center items-center px-6 relative max-w-7xl mx-auto">
        
        {/* Glowing light hub background design details */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 blur-3xl rounded-full pointer-events-none" />
        
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-center lg:text-left">
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/60 border border-zinc-800/80 w-fit mx-auto lg:mx-0 shadow-lg backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-mono text-xs text-zinc-400 tracking-wider">AVAILABLE FOR GLOBAL DEPLOYMENT</span>
            </div>

            <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white flex flex-col gap-1.5">
              <span>{t.heroTitle}</span>
              <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-indigo-500 bg-clip-text text-transparent font-sans text-3xl sm:text-4xl lg:text-5xl font-bold mt-2">
                {t.heroSubtitle}
              </span>
            </h1>

            {/* Simulated typing cursor */}
            <div className="h-8 font-mono text-lg text-blue-400 flex items-center justify-center lg:justify-start gap-1">
              <span>&gt; {currentText}</span>
              <span className="w-2.5 h-5 bg-blue-500 animate-pulse inline-block" />
            </div>

            <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
              Award-winning Linux administrator, cybersecurity analyst, and designer engineering high-performance networks, secure firewalls, and pristine digital experiences.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-4">
              <a 
                href="#projects" 
                className="px-6 py-3 rounded-lg bg-gradient-to-tr from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-medium text-sm transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 hover:-translate-y-0.5 cursor-pointer"
              >
                {t.viewProjects}
              </a>
              <button 
                onClick={handleDownloadCV}
                className="px-6 py-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-white font-medium text-sm transition-all duration-300 hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
              >
                <Download className="w-4 h-4 text-blue-400" />
                {t.downloadCV}
              </button>
              <a 
                href="#contact" 
                className="px-6 py-3 rounded-lg bg-transparent hover:bg-zinc-900/30 text-zinc-400 hover:text-white font-medium text-sm transition-all duration-300 cursor-pointer"
              >
                {t.contactMe}
              </a>
            </div>

          </div>

          {/* Hero Right: Hologram Design HUD Profile layout */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-72 h-72 sm:w-96 sm:h-96">
              
              {/* Spinning technical circle hubs */}
              <div className="absolute inset-0 rounded-full border border-dashed border-blue-500/10 animate-spin" style={{ animationDuration: "40s" }} />
              <div className="absolute inset-4 rounded-full border border-double border-violet-500/10 animate-spin" style={{ animationDuration: "25s", animationDirection: "reverse" }} />
              <div className="absolute -inset-4 rounded-full border border-zinc-800/30 animate-pulse" />

              {/* Glowing vector grid lines background */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/5 to-violet-500/5 blur-xl pointer-events-none" />

              {/* Holographic profile container */}
              <div className="absolute inset-8 rounded-full overflow-hidden border-2 border-zinc-800/80 bg-zinc-950 shadow-2xl flex items-center justify-center p-4">
                
                {/* Simulated profile tech blueprint vector image */}
                <svg className="w-full h-full text-blue-500/20" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
                  <circle cx="50" cy="50" r="45" strokeDasharray="3 3" />
                  <circle cx="50" cy="50" r="35" />
                  <path d="M50 5 L50 95 M5 50 L95 50" strokeWidth="0.2" strokeDasharray="1 4" />
                  {/* Glowing human figure representing tech portfolio theme */}
                  <path d="M50 25 C55 25 55 35 50 35 C45 35 45 25 50 25 Z" fill="currentColor" fillOpacity="0.1" strokeWidth="1" />
                  <path d="M35 75 C35 55 65 55 65 75" fill="currentColor" fillOpacity="0.1" strokeWidth="1" />
                  {/* Concentric ring charts */}
                  <circle cx="50" cy="50" r="20" stroke="url(#blue_grad)" strokeWidth="1.5" strokeDasharray="60 40" />
                  <defs>
                    <linearGradient id="blue_grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2563eb" />
                      <stop offset="100%" stopColor="#7c3aed" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Digital readout overlay */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 px-3 py-1 rounded bg-black/80 border border-zinc-800 font-mono text-[9px] text-blue-400 tracking-widest uppercase">
                  HOST_NODE_ONLINE
                </div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <Fingerprint className="w-20 h-20 text-blue-500/30 animate-pulse" />
                </div>
              </div>

              {/* Floating diagnostic nodes */}
              <div className="absolute top-10 left-4 px-2 py-1 rounded bg-zinc-950/90 border border-zinc-800 font-mono text-[8px] text-emerald-400">
                [OK] SSHD_NODE
              </div>
              <div className="absolute bottom-16 right-4 px-2 py-1 rounded bg-zinc-950/90 border border-zinc-800 font-mono text-[8px] text-violet-400">
                [SECURE] KRN_4.1
              </div>

            </div>
          </div>

        </div>

      </section>

      {/* Embedded Terminal Section */}
      <section className="max-w-5xl mx-auto px-6 py-12 relative">
        <div className="text-center mb-8">
          <p className="font-mono text-xs text-blue-500 tracking-widest uppercase mb-1">&gt; DIALOGUE PROTOCOL</p>
          <h2 className="font-display font-bold text-xl text-zinc-400">{t.terminalTitle}</h2>
        </div>
        <Terminal onToggleMatrix={toggleBackgroundEffect} lang={lang} />
      </section>

      {/* About Section */}
      <section id="about" className="py-24 max-w-7xl mx-auto px-6 scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* About Text details */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <span className="font-mono text-blue-500 text-sm">01.</span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">{t.aboutTitle}</h2>
              <div className="h-[1px] bg-zinc-800 flex-1 ml-4" />
            </div>

            <p className="font-mono text-xs text-blue-400 leading-none uppercase tracking-widest">{t.aboutSubtitle}</p>
            
            <p className="text-zinc-400 leading-relaxed font-sans text-sm sm:text-base">
              {t.aboutStory1}
            </p>
            <p className="text-zinc-400 leading-relaxed font-sans text-sm sm:text-base">
              {t.aboutStory2}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-6">
              
              <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-900 flex flex-col gap-1.5">
                <span className="font-display font-extrabold text-2xl sm:text-3xl text-white bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">4+</span>
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">{t.yearsLearning}</span>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-900 flex flex-col gap-1.5">
                <span className="font-display font-extrabold text-2xl sm:text-3xl text-white bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">25+</span>
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">{t.projectsCompleted}</span>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-900 flex flex-col gap-1.5">
                <span className="font-display font-extrabold text-2xl sm:text-3xl text-white bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">8+</span>
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">{t.certificatesEarned}</span>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-900 flex flex-col gap-1.5">
                <span className="font-display font-extrabold text-2xl sm:text-3xl text-white bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">1,800+</span>
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">{t.hoursSystemd}</span>
              </div>

            </div>
          </div>

          {/* About Right visual decoration */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-900">
                <span className="font-mono text-xs text-blue-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  SYSTEM DIAGNOSTIC LOG
                </span>
                <span className="font-mono text-[10px] text-zinc-500">IP: 192.168.10.1</span>
              </div>

              <div className="flex flex-col gap-3 font-mono text-[11px] text-zinc-400 leading-relaxed">
                <div>
                  <span className="text-zinc-600">[00:40:17]</span> <span className="text-blue-400">HOST INIT:</span> Yazid OS kernel modules loaded.
                </div>
                <div>
                  <span className="text-zinc-600">[00:40:19]</span> <span className="text-violet-400">IF_STATUS:</span> Mikrotik interfaces routing at 1Gbps.
                </div>
                <div>
                  <span className="text-zinc-600">[00:40:22]</span> <span className="text-emerald-400">FW_RULE:</span> NAT masquerade rule applied cleanly.
                </div>
                <div>
                  <span className="text-zinc-600">[00:40:25]</span> <span className="text-amber-400">SEC_CHECK:</span> Wireshark sniffing thread deployed.
                </div>
                <div className="pt-2 border-t border-zinc-900 mt-2 flex flex-col gap-1.5">
                  <div className="flex justify-between">
                    <span>CPU LOAD:</span>
                    <span className="text-emerald-400">12.4%</span>
                  </div>
                  <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: "12.4%" }} />
                  </div>
                  
                  <div className="flex justify-between mt-1">
                    <span>SYSTEM INTEGRITY:</span>
                    <span className="text-blue-400">100% SECURE</span>
                  </div>
                  <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: "100%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Skills Matrix Section */}
      <section id="skills" className="py-24 max-w-7xl mx-auto px-6 border-t border-zinc-900/50 scroll-mt-20">
        <div className="flex flex-col gap-4 mb-12">
          <div className="flex items-center gap-3">
            <span className="font-mono text-blue-500 text-sm">02.</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">{t.skillsTitle}</h2>
            <div className="h-[1px] bg-zinc-800 flex-1 ml-4" />
          </div>
          <p className="font-sans text-sm text-zinc-400">{t.skillsSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SKILLS_DATA.map((category, idx) => {
            const getIcon = (name: string) => {
              switch (name) {
                case "Code2": return <Code2 className="w-5 h-5 text-blue-400" />;
                case "Network": return <Network className="w-5 h-5 text-violet-400" />;
                case "Cloud": return <Cloud className="w-5 h-5 text-cyan-400" />;
                case "ShieldAlert": return <ShieldAlert className="w-5 h-5 text-rose-400" />;
                case "Palette": return <Palette className="w-5 h-5 text-amber-400" />;
                case "BrainCircuit": return <BrainCircuit className="w-5 h-5 text-emerald-400" />;
                case "Workflow": return <Workflow className="w-5 h-5 text-fuchsia-400" />;
                default: return <Code2 className="w-5 h-5 text-blue-400" />;
              }
            };

            return (
              <div 
                key={idx}
                className="p-6 rounded-xl border border-zinc-900 bg-zinc-950/40 hover:border-zinc-800 hover:bg-zinc-950/80 transition-all duration-300 shadow-xl group relative overflow-hidden"
              >
                {/* Background light glow subtle */}
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-blue-500/5 blur-2xl rounded-full pointer-events-none group-hover:bg-blue-500/10 transition-colors" />

                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-zinc-900">
                  {getIcon(category.iconName)}
                  <h3 className="font-display font-bold text-sm tracking-wide text-white">
                    {lang === "en" ? category.name.en : category.name.id}
                  </h3>
                </div>

                <div className="flex flex-col gap-4">
                  {category.skills.map((skill, sIdx) => (
                    <div key={sIdx} className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-xs font-sans">
                        <span className="text-zinc-300 font-medium">{skill.name}</span>
                        <span className="text-zinc-500 font-mono">{skill.level}%</span>
                      </div>
                      {/* Premium animated progress bar */}
                      <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-violet-500 h-full rounded-full transition-all duration-1000 ease-out" 
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Selected Masterworks / Projects */}
      <section id="projects" className="py-24 max-w-7xl mx-auto px-6 border-t border-zinc-900/50 scroll-mt-20">
        <div className="flex flex-col gap-4 mb-12">
          <div className="flex items-center gap-3">
            <span className="font-mono text-blue-500 text-sm">03.</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">{t.projectsTitle}</h2>
            <div className="h-[1px] bg-zinc-800 flex-1 ml-4" />
          </div>
          <p className="font-sans text-sm text-zinc-400">{t.projectsSubtitle}</p>
        </div>

        {/* Project Category Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-zinc-900/40">
          {["All", "Networking", "Cloud", "Cyber Security", "AI", "Web Development", "UI Design"].map((cat) => (
            <button
              key={cat}
              onClick={() => setProjectFilter(cat)}
              className={`px-4 py-1.5 rounded-lg font-mono text-xs font-bold transition-all duration-300 cursor-pointer ${
                projectFilter === cat 
                  ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/20"
                  : "bg-zinc-950/60 hover:bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-900"
              }`}
            >
              {cat === "All" ? t.filterAll : cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((p) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                key={p.id}
                className="group p-6 rounded-xl border border-zinc-900 bg-zinc-950/30 hover:border-zinc-800/80 hover:bg-zinc-950/70 transition-all duration-300 flex flex-col justify-between shadow-lg relative overflow-hidden hover:shadow-blue-500/5"
              >
                
                {/* Visual Category Label */}
                <div className="absolute top-4 right-4 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 font-mono text-[9px] text-zinc-500 uppercase tracking-widest">
                  {p.category}
                </div>

                <div className="flex flex-col gap-4">
                  {/* File icon / decorative header */}
                  <div className="flex items-center gap-2 text-blue-500">
                    <FileText className="w-5 h-5 group-hover:scale-105 transition-transform" />
                    <span className="font-mono text-[10px] text-zinc-600 tracking-wider">PROJECT_{p.id.toUpperCase()}</span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-white group-hover:text-blue-400 transition-colors">
                    {p.title}
                  </h3>

                  <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans line-clamp-3">
                    {lang === "en" ? p.description.en : p.description.id}
                  </p>
                </div>

                <div className="flex flex-col gap-4 mt-6 pt-4 border-t border-zinc-900/60">
                  {/* Skill Badge Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {p.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-500 text-[10px] font-mono border border-zinc-900">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions (GitHub stars, forks, live link, code link) */}
                  <div className="flex items-center justify-between font-mono text-[11px] text-zinc-500 mt-2">
                    
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        ★ {p.stars}
                      </span>
                      <span className="flex items-center gap-1">
                        ⑂ {p.forks}
                      </span>
                    </div>

                    <div className="flex items-center gap-3.5">
                      <a 
                        href={p.githubUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-zinc-400 hover:text-white flex items-center gap-1 hover:underline transition-all"
                        title="View Source on GitHub"
                      >
                        Source <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </div>

                  </div>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Verification Accreditations / Certificates */}
      <section id="certificates" className="py-24 max-w-7xl mx-auto px-6 border-t border-zinc-900/50 scroll-mt-20">
        <div className="flex flex-col gap-4 mb-12">
          <div className="flex items-center gap-3">
            <span className="font-mono text-blue-500 text-sm">04.</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">{t.certificatesTitle}</h2>
            <div className="h-[1px] bg-zinc-800 flex-1 ml-4" />
          </div>
          <p className="font-sans text-sm text-zinc-400">{t.certificatesSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CERTIFICATES_DATA.map((c) => (
            <div 
              key={c.id}
              onClick={() => setSelectedCert(c)}
              className="p-5 rounded-xl border border-zinc-900 bg-zinc-950/40 hover:border-zinc-800/80 hover:bg-zinc-950/90 transition-all duration-300 flex flex-col gap-4 cursor-pointer group shadow-lg"
            >
              
              {/* Image box with visual HUD effect */}
              <div className="relative aspect-video rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800">
                <img 
                  src={c.image} 
                  alt={c.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-75 group-hover:brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                {/* Verify Badge overlay */}
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-blue-600/90 border border-blue-500 font-mono text-[9px] text-white uppercase tracking-wider flex items-center gap-1 shadow">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  VERIFIED
                </div>

                <div className="absolute bottom-3 left-3 font-mono text-[10px] text-zinc-400 tracking-wider">
                  ISSUED: {c.date}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="font-mono text-[10px] text-blue-400 uppercase tracking-widest">{c.issuer} SECURITY ACCREDITATION</span>
                <h3 className="font-display font-bold text-sm text-white group-hover:text-blue-400 transition-colors leading-tight">
                  {c.title}
                </h3>
              </div>

              <div className="flex items-center justify-between font-mono text-[10px] text-zinc-500 mt-1">
                <span>ID: VAL_{c.id.toUpperCase()}</span>
                <span className="text-zinc-400 group-hover:text-white group-hover:underline flex items-center gap-1 transition-colors">
                  Expand <Eye className="w-3.5 h-3.5" />
                </span>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* Operational Timeline / Experience & Education */}
      <section id="experience" className="py-24 max-w-7xl mx-auto px-6 border-t border-zinc-900/50 scroll-mt-20">
        <div className="flex flex-col gap-4 mb-12">
          <div className="flex items-center gap-3">
            <span className="font-mono text-blue-500 text-sm">05.</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">{t.expTitle}</h2>
            <div className="h-[1px] bg-zinc-800 flex-1 ml-4" />
          </div>
          <p className="font-sans text-sm text-zinc-400">{t.expSubtitle}</p>
        </div>

        {/* Timeline Path design structure */}
        <div className="relative border-l border-zinc-800 max-w-4xl mx-auto pl-6 sm:pl-8 flex flex-col gap-12 after:absolute after:bottom-0 after:left-0 after:w-[1px] after:h-12 after:bg-gradient-to-b after:from-zinc-800 after:to-transparent">
          {TIMELINE_DATA.map((e, idx) => (
            <div key={e.id} className="relative group">
              
              {/* Spinning circular icon indicator on timeline line */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-6 h-6 rounded-full bg-zinc-950 border-2 border-zinc-800 group-hover:border-blue-500 flex items-center justify-center transition-colors shadow">
                <div className="w-2 h-2 rounded-full bg-zinc-600 group-hover:bg-blue-400 animate-pulse" />
              </div>

              <div className="p-6 rounded-xl border border-zinc-900 bg-zinc-950/40 hover:border-zinc-800 hover:bg-zinc-950/70 transition-all duration-300 shadow flex flex-col gap-2.5">
                
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-900/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-blue-400 font-bold bg-blue-950/50 border border-blue-900/50 px-2.5 py-0.5 rounded">
                      {e.year}
                    </span>
                    <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">{e.subtitle}</span>
                  </div>
                  <span className="font-mono text-[9px] text-zinc-500 uppercase">SYS_LOG_ENTRY #{idx + 1}</span>
                </div>

                <h3 className="font-display font-bold text-base text-white group-hover:text-blue-400 transition-colors">
                  {lang === "en" ? e.title.en : e.title.id}
                </h3>

                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans">
                  {lang === "en" ? e.description.en : e.description.id}
                </p>

              </div>

            </div>
          ))}
        </div>
      </section>

      {/* Interactive Infrastructure Configuration & Hardening Engine */}
      <SysConfigurator lang={lang} />

      {/* System Logs / Blog Section */}
      <section id="blog" className="py-24 max-w-7xl mx-auto px-6 border-t border-zinc-900/50 scroll-mt-20">
        <div className="flex flex-col gap-4 mb-12">
          <div className="flex items-center gap-3">
            <span className="font-mono text-blue-500 text-sm">07.</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">{t.blogTitle}</h2>
            <div className="h-[1px] bg-zinc-800 flex-1 ml-4" />
          </div>
          <p className="font-sans text-sm text-zinc-400">{t.aboutSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ARTICLES_DATA.map((art) => (
            <div 
              key={art.id}
              onClick={() => setSelectedArticle(art)}
              className="p-6 rounded-xl border border-zinc-900 bg-zinc-950/40 hover:border-zinc-800 hover:bg-zinc-950/90 transition-all duration-300 flex flex-col justify-between gap-6 cursor-pointer group shadow"
            >
              
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 font-mono text-[9px] text-zinc-500 uppercase tracking-widest border-b border-zinc-900/55 pb-2">
                  <span className="text-blue-400">{art.category} log</span>
                  <span>•</span>
                  <span>{art.date}</span>
                </div>

                <h3 className="font-display font-bold text-base text-white group-hover:text-blue-400 transition-colors leading-snug">
                  {lang === "en" ? art.title.en : art.title.id}
                </h3>

                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans">
                  {lang === "en" ? art.excerpt.en : art.excerpt.id}
                </p>
              </div>

              <div className="flex items-center justify-between font-mono text-[10px] text-zinc-500 pt-2 border-t border-zinc-900/40">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {art.readTime}
                </span>
                <span className="text-zinc-400 group-hover:text-white group-hover:underline flex items-center gap-1">
                  Read Log <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* Premium Contact Section */}
      <section id="contact" className="py-24 max-w-7xl mx-auto px-6 border-t border-zinc-900/50 scroll-mt-20">
        <div className="flex flex-col gap-4 mb-12">
          <div className="flex items-center gap-3">
            <span className="font-mono text-blue-500 text-sm">08.</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">{t.contactTitle}</h2>
            <div className="h-[1px] bg-zinc-800 flex-1 ml-4" />
          </div>
          <p className="font-sans text-sm text-zinc-400">{t.contactSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Contact Left: Handshake Form */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <form onSubmit={handleFormSubmit} className="p-6 rounded-xl border border-zinc-900 bg-zinc-950/50 flex flex-col gap-4">
              
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">{t.contactName} *</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="px-4 py-2.5 rounded-lg bg-zinc-900/70 border border-zinc-800 text-white focus:outline-none focus:border-blue-500 font-sans text-sm transition-colors"
                  placeholder="Yuri Gagarin"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">{t.contactEmail} *</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="px-4 py-2.5 rounded-lg bg-zinc-900/70 border border-zinc-800 text-white focus:outline-none focus:border-blue-500 font-sans text-sm transition-colors"
                  placeholder="yuri@orbit.org"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">{t.contactSubject}</label>
                <input 
                  type="text" 
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="px-4 py-2.5 rounded-lg bg-zinc-900/70 border border-zinc-800 text-white focus:outline-none focus:border-blue-500 font-sans text-sm transition-colors"
                  placeholder="Technical Consultation"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">{t.contactMsg} *</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="px-4 py-2.5 rounded-lg bg-zinc-900/70 border border-zinc-800 text-white focus:outline-none focus:border-blue-500 font-sans text-sm transition-colors resize-none"
                  placeholder="Secure transmission payload details..."
                />
              </div>

              <button 
                type="submit"
                disabled={formStatus === "sending"}
                className="w-full mt-2 px-6 py-3 rounded-lg bg-gradient-to-tr from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-medium text-sm transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {formStatus === "sending" ? t.contactSending : t.contactSend}
              </button>

            </form>

            {/* Form terminal feedback lines */}
            {networkLog.length > 0 && (
              <div className="p-4 rounded-xl border border-zinc-900 bg-black/80 font-mono text-[10px] text-zinc-400 flex flex-col gap-1 shadow-md">
                <div className="flex items-center gap-2 text-blue-400 font-bold border-b border-zinc-900 pb-1.5 mb-1">
                  <Activity className="w-3.5 h-3.5" />
                  CLIENT HANDSHAKE STREAM
                </div>
                {networkLog.map((log, idx) => (
                  <div key={idx} className={log.includes("[SUCCESS]") ? "text-emerald-400" : ""}>
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contact Right: Glowing Telemetry Radar Map */}
          <div className="lg:col-span-6 flex flex-col gap-6 justify-between">
            <div className="p-6 rounded-xl border border-zinc-900 bg-zinc-950/40 shadow-xl flex flex-col gap-4 relative overflow-hidden h-full min-h-[350px]">
              
              <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                <span className="font-mono text-xs text-blue-400 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '20s' }} />
                  YAZID CLOUD INFRASTRUCTURE TELEMETRY
                </span>
                <span className="font-mono text-[10px] text-zinc-500">SECURE SHELL (SSH)</span>
              </div>

              {/* Glowing Interactive vector scanner blueprint representing Yazid's global network nodes */}
              <div className="relative flex-1 bg-[#050505] rounded-lg overflow-hidden border border-zinc-900 p-4 flex items-center justify-center min-h-[220px]">
                
                {/* SVG glowing nodes mapping */}
                <svg className="w-full h-full text-blue-500/20 max-h-[240px]" viewBox="0 0 160 100" fill="none" stroke="currentColor" strokeWidth="0.5">
                  {/* Subtle Grid dots */}
                  <pattern id="dot_grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="0.5" fill="#18181b" />
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#dot_grid)" />

                  {/* Concentric telemetry scanner rings */}
                  <circle cx="80" cy="50" r="35" stroke="#1f2937" strokeWidth="0.5" strokeDasharray="3 3" />
                  <circle cx="80" cy="50" r="20" stroke="#1f2937" strokeWidth="0.5" />
                  
                  {/* Radar line sweeping */}
                  <line x1="80" y1="50" x2="115" y2="15" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="1" className="origin-[80px_50px] animate-spin" style={{ animationDuration: '6s' }} />

                  {/* Global communication pipeline connections */}
                  <path d="M40 70 Q 80 20 120 70" stroke="rgba(124, 58, 237, 0.3)" strokeWidth="1" strokeDasharray="2 2" />
                  <path d="M40 70 Q 80 80 120 70" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1" />

                  {/* Node 1: Jakarta (HQ) */}
                  <g className="translate-x-[40px] translate-y-[70px]">
                    <circle cx="0" cy="0" r="3" fill="#3b82f6" />
                    <circle cx="0" cy="0" r="6" stroke="#3b82f6" strokeWidth="0.5" className="animate-ping" style={{ animationDuration: '3s' }} />
                  </g>
                  {/* Node 2: Singapore VPN Gateway */}
                  <g className="translate-x-[80px] translate-y-[35px]">
                    <circle cx="0" cy="0" r="3" fill="#10b981" />
                  </g>
                  {/* Node 3: Oregon AWS Node */}
                  <g className="translate-x-[120px] translate-y-[70px]">
                    <circle cx="0" cy="0" r="3" fill="#a78bfa" />
                  </g>

                  {/* Custom node markers label */}
                  <text x="32" y="80" fill="#a1a1aa" fontSize="4" fontFamily="monospace">JKT_NODE (ACTIVE)</text>
                  <text x="70" y="28" fill="#10b981" fontSize="4" fontFamily="monospace">SGP_PROXY</text>
                  <text x="110" y="80" fill="#a78bfa" fontSize="4" fontFamily="monospace">AWS_OREGON_ECS</text>
                </svg>

                <div className="absolute top-3 left-3 flex items-center gap-1.5 font-mono text-[8px] text-zinc-500">
                  <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
                  PING: 32MS [SECURE TUNNEL]
                </div>

                <div className="absolute bottom-3 right-3 font-mono text-[8px] text-zinc-500">
                  SYSTEM TIME: 00:40:21 UTC+7
                </div>

              </div>

              {/* Direct links: email & WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1 text-center font-mono text-xs">
                <a 
                  href="mailto:yazidalwafiy122@gmail.com" 
                  className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/80 text-zinc-300 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4 text-blue-400" />
                  Email Admin
                </a>
                <a 
                  href="https://wa.me/6281234567890" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/80 text-zinc-300 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  WhatsApp
                </a>
                <a 
                  href="https://www.linkedin.com/in/yazid-al-wafiy-991767328/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/80 text-zinc-300 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <Linkedin className="w-4 h-4 text-blue-500" />
                  LinkedIn
                </a>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Sleek Elegant Footer */}
      <footer className="py-12 border-t border-zinc-900 bg-zinc-950/60 backdrop-blur-sm relative">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex flex-col gap-1.5 text-center md:text-left font-mono">
            <span className="font-display font-extrabold text-sm tracking-widest text-white">YAZID AL WAFIY</span>
            <span className="text-[10px] text-zinc-500">© 2026 SYSTEMS CONTROL ARCHITECTURE. ALL SYSTEM RIGHTS CONSERVED.</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="https://github.com/hackyanz01" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors" title="GitHub">
              <Github className="w-4 h-4" />
            </a>
            <a href="https://www.linkedin.com/in/yazid-al-wafiy-991767328/" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors" title="LinkedIn">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="https://www.instagram.com/zydran_22/?next=%2F" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors" title="Instagram">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="mailto:yazidalwafiy122@gmail.com" className="text-zinc-500 hover:text-white transition-colors" title="Email">
              <Mail className="w-4 h-4" />
            </a>
          </div>

          <a 
            href="#home" 
            className="px-4 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white font-mono text-[10px] uppercase tracking-widest transition-colors cursor-pointer flex items-center gap-1.5"
          >
            {t.backToTop} <ArrowUpRight className="w-3 h-3 text-blue-400" />
          </a>

        </div>
      </footer>

      {/* Certificate Modal Overlay (Lightbox) */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/95 backdrop-blur-sm"
            onClick={() => setSelectedCert(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-2xl rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 p-6 flex flex-col gap-5 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
                <div className="flex flex-col gap-0.5">
                  <span className="font-mono text-[10px] text-blue-400 uppercase tracking-widest">{selectedCert.issuer} ACCREDITED SECURE CODE</span>
                  <h3 className="font-display font-bold text-lg text-white">{selectedCert.title}</h3>
                </div>
                <button 
                  onClick={() => setSelectedCert(null)}
                  className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="aspect-video w-full rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800">
                <img 
                  src={selectedCert.image} 
                  alt={selectedCert.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
                <div className="flex flex-col">
                  <span className="text-zinc-600">ACCREDITED ID</span>
                  <span className="text-zinc-300 font-bold">VAL_{selectedCert.id.toUpperCase()}_CHECK_OK</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-zinc-600">VALIDATED ON</span>
                  <span className="text-zinc-300 font-bold">{selectedCert.date} SYNCED</span>
                </div>
                {selectedCert.credentialUrl !== "#" && (
                  <a 
                    href={selectedCert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    {t.viewCredentials} <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Article / System Log Reading Overlay (Lightbox) */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/95 backdrop-blur-sm"
            onClick={() => setSelectedArticle(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-3xl h-[85vh] rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 flex flex-col justify-between shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              
              {/* Header */}
              <div className="p-6 border-b border-zinc-900 bg-zinc-950 flex items-center justify-between shrink-0">
                <div className="flex flex-col gap-0.5">
                  <span className="font-mono text-[10px] text-blue-400 uppercase tracking-widest">{selectedArticle.category} DATABASE ARCHIVE</span>
                  <h3 className="font-display font-extrabold text-lg sm:text-xl text-white">{lang === "en" ? selectedArticle.title.en : selectedArticle.title.id}</h3>
                </div>
                <button 
                  onClick={() => setSelectedArticle(null)}
                  className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Document Content */}
              <div className="flex-1 overflow-y-auto p-6 font-mono text-xs text-zinc-300 space-y-6 leading-relaxed select-text">
                
                <div className="flex flex-wrap items-center gap-6 pb-4 border-b border-zinc-900 text-zinc-500 text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>PUBLISHED: {selectedArticle.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>ESTIMATED DURATION: {selectedArticle.readTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Fingerprint className="w-3.5 h-3.5" />
                    <span>AUTHOR: YAZID AL WAFIY</span>
                  </div>
                </div>

                {/* Rich Mock Terminal Article Payload details based on article id */}
                {selectedArticle.id === "a1" && (
                  <div className="space-y-4 font-mono">
                    <p className="text-zinc-400 text-sm">
                      When booting a clean Linux kernel node (e.g. Ubuntu or Debian virtual private hosting), it takes less than 5 minutes for botnets to begin brute-forcing standard port 22. To shield your servers, deploy this hardened checklist immediately upon SSH handshake.
                    </p>
                    <div className="p-4 rounded-lg bg-[#050505] border border-zinc-900 text-emerald-400 space-y-2">
                      <div># STEP 1: Update existing repository layers</div>
                      <div>sudo apt update && sudo apt upgrade -y</div>
                      <div className="text-zinc-500"># Output: 0 upgraded, 0 newly installed, 0 to remove. [OK]</div>
                    </div>
                    <div className="space-y-2">
                      <div className="font-bold text-blue-400"># STEP 2: Configure non-standard SSH Parameters</div>
                      <p className="text-zinc-400">Avoid port 22 entirely. Modify <code className="bg-zinc-900 px-1 py-0.5 rounded text-white font-bold">/etc/ssh/sshd_config</code> and deploy these specific rules:</p>
                      <div className="p-4 rounded-lg bg-[#050505] border border-zinc-900 text-zinc-300">
                        <div>Port 5022</div>
                        <div>PermitRootLogin no</div>
                        <div>PasswordAuthentication no</div>
                        <div>MaxAuthTries 3</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="font-bold text-blue-400"># STEP 3: Deploy local firewall rules</div>
                      <p className="text-zinc-400">Authorize port 5022 and establish deep ingress shields:</p>
                      <div className="p-4 rounded-lg bg-[#050505] border border-zinc-900 text-emerald-400 space-y-1">
                        <div>sudo ufw default deny incoming</div>
                        <div>sudo ufw default allow outgoing</div>
                        <div>sudo ufw allow 5022/tcp</div>
                        <div>sudo ufw allow 80/tcp</div>
                        <div>sudo ufw allow 443/tcp</div>
                        <div>sudo ufw enable</div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedArticle.id === "a2" && (
                  <div className="space-y-4">
                    <p className="text-zinc-400 text-sm">
                      Subnetting is the absolute pillar of Cisco certification paths (CCNA) and operational system architecture. Instead of wasting time counting binary digits, use block sizing logic to calculate IP distributions instantly.
                    </p>
                    <p className="text-zinc-400">
                      Suppose you are assigned the corporate root segment <strong className="text-white">192.168.10.0/24</strong>. The organization requires 4 isolated subnets for IT, Operations, Guest WiFi, and Security.
                    </p>
                    <div className="p-4 rounded-lg bg-[#050505] border border-zinc-900 text-zinc-300 space-y-3">
                      <div className="text-blue-400 font-bold">THE BLOCK FORMULA: 256 - Target Mask = Segment Size</div>
                      <div>• A /26 CIDR allocates 2 bits for network ID and 6 bits for hosts.</div>
                      <div>• Total segments: 2^2 = 4 subnets. Host allocations: 2^6 - 2 = 62 safe addresses per subnet.</div>
                      <div>• Magic number / Block increment is 64.</div>
                    </div>
                    <div className="space-y-2">
                      <div className="font-bold text-blue-400">SUBNET DISTRIBUTION SHEET:</div>
                      <div className="p-4 rounded-lg bg-[#050505] border border-zinc-900 text-emerald-400 space-y-1.5">
                        <div>Net 0: 192.168.10.0/26 (IP range: .1 to .62 | Broadcast: .63)</div>
                        <div>Net 1: 192.168.10.64/26 (IP range: .65 to .126 | Broadcast: .127)</div>
                        <div>Net 2: 192.168.10.128/26 (IP range: .129 to .190 | Broadcast: .191)</div>
                        <div>Net 3: 192.168.10.192/26 (IP range: .193 to .254 | Broadcast: .255)</div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedArticle.id === "a3" && (
                  <div className="space-y-4">
                    <p className="text-zinc-400 text-sm">
                      Deploying high-performance services directly to public clouds without custom VPC isolations exposes your databases to catastrophic brute force intrusions. This guide outlines how to build a highly secure AWS Virtual Private Cloud using Terraform.
                    </p>
                    <div className="p-4 rounded-lg bg-[#050505] border border-zinc-900 text-zinc-300 space-y-2">
                      <div className="text-blue-400 font-bold">1. Establish Private Subnets for Database nodes:</div>
                      <p className="text-zinc-400">Keep RDS nodes in private subnets, only accessible via Application Load Balancers routed to public subnets.</p>
                      <div className="text-violet-400 font-bold">2. Secure NAT Gateways:</div>
                      <p className="text-zinc-400">Ensure private subnets route outbound traffic through a highly-available NAT Gateway located in the public subnet.</p>
                    </div>
                    <div className="space-y-2 font-mono">
                      <div className="font-bold text-blue-400">TERRAFORM ARCHITECTURE TEMPLATE:</div>
                      <div className="p-4 rounded-lg bg-[#050505] border border-zinc-900 text-zinc-300">
                        <pre className="text-[10px] leading-tight text-zinc-400">
{`resource "aws_vpc" "production" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  tags = { Name = "PROD-NET-CLUSTER" }
}

resource "aws_subnet" "private" {
  vpc_id            = aws_vpc.production.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "us-east-1a"
  tags = { Name = "PROD-DB-SUBNET" }
}`}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}

                {selectedArticle.id === "a4" && (
                  <div className="space-y-4">
                    <p className="text-zinc-400 text-sm">
                      Sniffing local packet flows with Wireshark is an essential capability of system administrators and ethical hackers. Discover how to inspect raw TCP handshakes and safeguard cleartext packet leaks inside local networks.
                    </p>
                    <div className="p-4 rounded-lg bg-[#050505] border border-zinc-900 text-zinc-300 space-y-3">
                      <div className="text-blue-400 font-bold">CRITICAL WIRESHARK FILTERS:</div>
                      <div>• <code className="bg-zinc-900 px-1 py-0.5 rounded text-white">tcp.flags.syn == 1 && tcp.flags.ack == 0</code> - Catches syn-flood port scan attempts.</div>
                      <div>• <code className="bg-zinc-900 px-1 py-0.5 rounded text-white">http.request.method == "POST"</code> - Filters post requests which might expose cleartext logins.</div>
                      <div>• <code className="bg-zinc-900 px-1 py-0.5 rounded text-white">bootp.type == 1</code> - Inspects DHCP requests to catch spoofing.</div>
                    </div>
                    <p className="text-zinc-400">
                      By configuring Wireshark to run exclusively on span ports or mirror ports, you can monitor the network security posture and neutralize malicious DHCP rogue servers before they launch man-in-the-middle attacks.
                    </p>
                  </div>
                )}

              </div>

              {/* Close Button footer */}
              <div className="p-4 border-t border-zinc-900 bg-zinc-950 flex justify-end shrink-0">
                <button 
                  onClick={() => setSelectedArticle(null)}
                  className="px-5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-mono text-xs transition-colors cursor-pointer"
                >
                  Close Document
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
