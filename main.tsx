import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Terminal as TerminalIcon, Sparkles, CornerDownLeft } from "lucide-react";

interface TerminalProps {
  onToggleMatrix: () => void;
  lang: "en" | "id";
}

interface LogLine {
  text: string;
  type: "input" | "output" | "error" | "success" | "ai" | "system" | "code" | "bullet" | "empty";
}

export default function Terminal({ onToggleMatrix, lang }: TerminalProps) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<LogLine[]>([]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiChatHistory, setAiChatHistory] = useState<{ role: "user" | "model"; text: string }[]>([]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Auto-scroll to bottom on output or loading state changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history, isProcessing]);

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    focusInput();
  }, []);

  // Set initial welcome messages based on selected language
  useEffect(() => {
    if (lang === "id") {
      setHistory([
        { text: "YAZID-OS [Versi 4.1.137] Node Kernel Aman diinisialisasi.", type: "system" },
        { text: "Ketik 'help' untuk melihat perintah sistem terminal yang tersedia atau tanyakan langsung apa saja kepada AI asisten.", type: "output" },
        { text: "Sistem Online. [STATUS: AMAN]", type: "success" }
      ]);
    } else {
      setHistory([
        { text: "YAZID-OS [Version 4.1.137] Secure Kernel Node initialized.", type: "system" },
        { text: "Type 'help' to view available system terminal commands or ask any questions directly to the AI assistant.", type: "output" },
        { text: "System Online. [STATUS: SECURE]", type: "success" }
      ]);
    }
  }, [lang]);

  // Parse markdown from AI responses into individual styled console lines
  const parseAiMarkdown = (text: string): LogLine[] => {
    const lines = text.split("\n");
    const parsedLines: LogLine[] = [];
    let inCodeBlock = false;
    let codeContent = "";

    for (let line of lines) {
      const trimmed = line.trim();
      
      // Handle markdown code blocks
      if (trimmed.startsWith("```")) {
        if (inCodeBlock) {
          parsedLines.push({ text: codeContent, type: "code" });
          codeContent = "";
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        continue;
      }

      if (inCodeBlock) {
        codeContent += (codeContent ? "\n" : "") + line;
        continue;
      }

      if (trimmed === "") {
        parsedLines.push({ text: "", type: "empty" });
        continue;
      }

      // Handle markdown bullet lists
      if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
        parsedLines.push({ text: "  • " + trimmed.substring(2), type: "bullet" });
        continue;
      }

      // Handle markdown numbered lists
      const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
      if (numMatch) {
        parsedLines.push({ text: `  ${numMatch[1]}. ${numMatch[2]}`, type: "bullet" });
        continue;
      }

      // Handle markdown headings as system headers
      if (trimmed.startsWith("#")) {
        const depth = (trimmed.match(/^#+/) || [""])[0].length;
        const titleText = trimmed.replace(/^#+\s*/, "");
        parsedLines.push({ text: `${"═".repeat(depth)} ${titleText.toUpperCase()} ${"═".repeat(depth)}`, type: "system" });
        continue;
      }

      // Default to regular AI output line
      parsedLines.push({ text: line, type: "ai" });
    }

    if (inCodeBlock && codeContent) {
      parsedLines.push({ text: codeContent, type: "code" });
    }

    return parsedLines;
  };

  // High-contrast rendering for inline code wrapped in backticks
  const renderFormattedText = (text: string) => {
    if (!text.includes("`")) return text;
    
    const parts = text.split("`");
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return (
          <code key={index} className="px-1.5 py-0.5 mx-0.5 rounded bg-zinc-900/90 text-cyan-400 border border-zinc-800/80 font-mono text-[11px] font-semibold select-text">
            {part}
          </code>
        );
      }
      return part;
    });
  };

  // Dedicated AI assistant query execution handler
  const executeAiQuery = async (queryText: string, currentHistory: LogLine[]) => {
    setIsProcessing(true);
    try {
      // Build proper rich context history
      const historyPayload = aiChatHistory.map(h => ({
        role: h.role,
        text: h.text
      })).slice(-6); // Retain last 6 dialogue turns for optimal system memory

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: queryText, history: historyPayload }),
      });

      if (!response.ok) {
        throw new Error(`Server returned code ${response.status}`);
      }

      const data = await response.json();
      const replyText = data.text || "[EMPTY NODE RESPONSE]";

      // Parse the reply into structured console lines
      const parsedReply = parseAiMarkdown(replyText);

      setHistory([
        ...currentHistory,
        ...parsedReply
      ]);

      // Update dedicated client-side memory
      setAiChatHistory(prev => [
        ...prev,
        { role: "user", text: queryText },
        { role: "model", text: replyText }
      ]);
    } catch (e: any) {
      console.error("AI Communication Failure:", e);
      setHistory([
        ...currentHistory,
        { 
          text: lang === "id"
            ? `[GAGAL] Tidak dapat sinkronisasi dengan Node AI Gemini: ${e?.message || e}`
            : `[FAILED] Unable to synchronize with Gemini AI Node: ${e?.message || e}`, 
          type: "error" 
        }
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCommand = async (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    // Add to cmdHistory for up/down arrow usage
    const newCmdHistory = [...cmdHistory, trimmed];
    setCmdHistory(newCmdHistory);
    setHistoryIndex(-1);

    const newLines = [...history, { text: `yazid@portfolio:~$ ${trimmed}`, type: "input" as const }];
    setHistory(newLines);
    setInput("");

    const parts = trimmed.split(" ");
    const primary = parts[0].toLowerCase();
    const args = parts.slice(1).join(" ");

    const validCommands = ["help", "whoami", "skills", "projects", "certs", "contact", "matrix", "clear", "ai"];

    switch (primary) {
      case "help":
        if (lang === "id") {
          setHistory([
            ...newLines,
            { text: "PERINTAH SISTEM YANG TERSEDIA:", type: "system" },
            { text: "  whoami      - Profil lengkap & dossier Yazid Al Wafiy", type: "output" },
            { text: "  skills      - Lihat matriks keahlian teknologi", type: "output" },
            { text: "  projects    - Tinjau proyek cloud & jaringan yang dideploy", type: "output" },
            { text: "  certs       - Tampilkan sertifikasi jaringan global", type: "output" },
            { text: "  contact     - Tampilkan kontak komunikasi cepat", type: "output" },
            { text: "  matrix      - Aktifkan efek latar belakang aliran biner Matrix", type: "output" },
            { text: "  ai <query>  - Ajukan pertanyaan ke Jaringan Saraf AI Gemini", type: "ai" },
            { text: "  clear       - Bersihkan layar terminal", type: "output" },
            { text: "  *INFO*      - Anda juga bisa mengetik pertanyaan langsung tanpa awalan 'ai'!", type: "success" }
          ]);
        } else {
          setHistory([
            ...newLines,
            { text: "AVAILABLE SYSTEM COMMANDS:", type: "system" },
            { text: "  whoami      - Detailed dossier of Yazid Al Wafiy", type: "output" },
            { text: "  skills      - Query verified technology matrix", type: "output" },
            { text: "  projects    - Review deployed cloud networks and frontends", type: "output" },
            { text: "  certs       - Display global network credentials", type: "output" },
            { text: "  contact     - Reveal high-speed communication routes", type: "output" },
            { text: "  matrix      - Trigger real-time background Matrix stream", type: "output" },
            { text: "  ai <query>  - Query Yazid's Neural Network (powered by Gemini)", type: "ai" },
            { text: "  clear       - Wipe log buffers", type: "output" },
            { text: "  *INFO*      - You can also type any questions directly without the 'ai' prefix!", type: "success" }
          ]);
        }
        break;

      case "whoami":
        if (lang === "id") {
          setHistory([
            ...newLines,
            { text: "DOSSIER: YAZID AL WAFIY", type: "system" },
            { text: "----------------------------------------", type: "output" },
            { text: "Peran: Linux System Administrator & UI/UX Designer", type: "output" },
            { text: "Fokus: Arsitektur server tangguh, perutean aman, & estetika Glassmorphic.", type: "output" },
            { text: "Lokasi: Indonesia [UTC+7]", type: "output" },
            { text: "Persona: Engineer antusias yang terobsesi dengan otomasi, firewall, & tipografi premium.", type: "output" },
            { text: "Status: Sedang mengaudit layanan cloud & mengeksplorasi AI Generatif Google.", type: "success" }
          ]);
        } else {
          setHistory([
            ...newLines,
            { text: "DOSSIER: YAZID AL WAFIY", type: "system" },
            { text: "----------------------------------------", type: "output" },
            { text: "Role: Linux System Administrator & UI/UX Designer", type: "output" },
            { text: "Focus: Hardened server architecture, Secure routing, and Glassmorphic aesthetics.", type: "output" },
            { text: "Location: Indonesia [UTC+7]", type: "output" },
            { text: "Persona: Enthusiastic engineer obsessed with automation, firewalls, and premium typography.", type: "output" },
            { text: "Status: Currently auditing cloud services and exploring Google Generative AI workflows.", type: "success" }
          ]);
        }
        break;

      case "skills":
        if (lang === "id") {
          setHistory([
            ...newLines,
            { text: "MATRIKS KOMPETENSI [TERVERIFIKASI]", type: "system" },
            { text: "----------------------------------------", type: "output" },
            { text: "● PEMROGRAMAN : Python | JavaScript/TypeScript | Bash Scripting", type: "output" },
            { text: "● OS & JARINGAN: Admin Linux (Ubuntu/Arch) | Cisco CCNA | Mikrotik MTCNA", type: "output" },
            { text: "● CLOUD       : AWS (ECS, EC2, S3) | GCP VM | Cloudflare DNS", type: "output" },
            { text: "● KEAMANAN    : Audit paket Wireshark | Pengujian penetrasi Kali Linux | Nmap API", type: "output" },
            { text: "● DESAIN      : Figma (Auto-layout, token desain) | Adobe Photoshop | Illustrator", type: "output" },
            { text: "● DEVOPS      : Docker | docker-compose | Git & GitHub Actions", type: "output" }
          ]);
        } else {
          setHistory([
            ...newLines,
            { text: "COMPETENCY MATRIX [VERIFIED]", type: "system" },
            { text: "----------------------------------------", type: "output" },
            { text: "● PROGRAMMING : Python | JavaScript/TypeScript | Bash Scripting", type: "output" },
            { text: "● OS & NETWORK: Linux SysAdmin (Ubuntu/Arch) | Cisco CCNA | Mikrotik MTCNA", type: "output" },
            { text: "● CLOUD       : AWS (ECS, EC2, S3) | GCP VM | Cloudflare DNS", type: "output" },
            { text: "● SECURITY    : Wireshark packet audits | Kali Linux penetration testing | Nmap API", type: "output" },
            { text: "● DESIGN      : Figma (Auto-layout, design tokens) | Adobe Photoshop | Illustrator", type: "output" },
            { text: "● DEVOPS      : Docker | docker-compose | Git & GitHub Actions", type: "output" }
          ]);
        }
        break;

      case "projects":
        if (lang === "id") {
          setHistory([
            ...newLines,
            { text: "DEPLOYMENT AKTIF [LINK AMAN TERSEDIA DI BAGIAN PROYEK DI BAWAH]", type: "system" },
            { text: "----------------------------------------", type: "output" },
            { text: "[1] SentinelGuard Security Audit Tool (Python + Nmap)", type: "output" },
            { text: "[2] CloudScale AWS ECS Microservice Cluster (Terraform)", type: "output" },
            { text: "[3] AuraOS Customized Zsh & Tmux Environment", type: "output" },
            { text: "[4] Nexa Router Log AI Analyzer (Gemini 3.5 API)", type: "output" },
            { text: "[5] Aether Fluid Figma Design System Library", type: "output" }
          ]);
        } else {
          setHistory([
            ...newLines,
            { text: "ACTIVE DEPLOYMENTS [SECURE LINKS AVAILABLE IN PROJECTS SECTION]", type: "system" },
            { text: "----------------------------------------", type: "output" },
            { text: "[1] SentinelGuard Security Audit Tool (Python + Nmap)", type: "output" },
            { text: "[2] CloudScale AWS ECS Microservice Cluster (Terraform)", type: "output" },
            { text: "[3] AuraOS Customized Zsh & Tmux Environment", type: "output" },
            { text: "[4] Nexa Router Log AI Analyzer (Gemini 3.5 API)", type: "output" },
            { text: "[5] Aether Fluid Figma Design System Library", type: "output" }
          ]);
        }
        break;

      case "certs":
        if (lang === "id") {
          setHistory([
            ...newLines,
            { text: "LOG SERTIFIKASI [TERVERIFIKASI]", type: "system" },
            { text: "----------------------------------------", type: "output" },
            { text: "[CCNA] Cisco Certified Network Associate - Routing, Switching, & Core Security", type: "success" },
            { text: "[MTCNA] Mikrotik Certified Network Associate - Advanced Bandwidth & Firewall Tuning", type: "success" },
            { text: "[LINUX] Sertifikat Administrasi Sistem Linux (Dicoding Terdaftar)", type: "success" },
            { text: "[CLOUD] Sertifikat Dasar Cloud Computing (Dicoding Terdaftar)", type: "success" }
          ]);
        } else {
          setHistory([
            ...newLines,
            { text: "CREDENTIAL LOGS [VERIFIED]", type: "system" },
            { text: "----------------------------------------", type: "output" },
            { text: "[CCNA] Cisco Certified Network Associate - Routing, Switching, & Core Security", type: "success" },
            { text: "[MTCNA] Mikrotik Certified Network Associate - Advanced Bandwidth & Firewall Tuning", type: "success" },
            { text: "[LINUX] Linux Professional System Admin Certificate (Dicoding Authorized)", type: "success" },
            { text: "[CLOUD] Cloud Computing Fundamentals Certificate (Dicoding Authorized)", type: "success" }
          ]);
        }
        break;

      case "contact":
        if (lang === "id") {
          setHistory([
            ...newLines,
            { text: "SALURAN KOMUNIKASI [AKTIF]", type: "system" },
            { text: "----------------------------------------", type: "output" },
            { text: "● Email    : yazidalwafiy122@gmail.com", type: "output" },
            { text: "● WhatsApp : Tombol langsung di bawah desain kontak", type: "output" },
            { text: "● Lokasi   : Indonesia [UTC+7]", type: "output" },
            { text: "● Jabat Tangan: Isi formulir Transmisi Aman di bawah untuk sinkronisasi cepat.", type: "success" }
          ]);
        } else {
          setHistory([
            ...newLines,
            { text: "COMMUNICATION HOOKS [ACTIVE]", type: "system" },
            { text: "----------------------------------------", type: "output" },
            { text: "● Email    : yazidalwafiy122@gmail.com", type: "output" },
            { text: "● WhatsApp : Direct button below contact layout", type: "output" },
            { text: "● Location : Indonesia [UTC+7]", type: "output" },
            { text: "● Handshake: Fill out the Secure Transmission terminal below for rapid sync.", type: "success" }
          ]);
        }
        break;

      case "matrix":
        onToggleMatrix();
        setHistory([
          ...newLines,
          { 
            text: lang === "id" 
              ? "[OK] Mengaktifkan aliran biner Matrix pada lapisan grid latar belakang." 
              : "[OK] Toggling Matrix binary stream in background grid layer.", 
            type: "success" 
          }
        ]);
        break;

      case "clear":
        setHistory([]);
        break;

      case "ai":
        if (!args) {
          setHistory([
            ...newLines,
            { 
              text: lang === "id" 
                ? "[ERROR] Query model AI memerlukan parameter pesan. Penggunaan: ai <pertanyaan Anda>" 
                : "[ERROR] AI model queries require a prompt parameter. Usage: ai <your question>", 
              type: "error" 
            }
          ]);
          break;
        }
        await executeAiQuery(args, newLines);
        break;

      default:
        // Automatically route unmatched inputs to the AI Core!
        // This makes it act as a highly intelligent assistant "like general AIs"
        const fallbackLines = [
          ...newLines,
          { 
            text: lang === "id"
              ? `[SISTEM]: Perintah '${primary}' tidak dikenali. Menghubungkan langsung ke Pusat Kognitif AI Gemini...`
              : `[SYSTEM]: Local command '${primary}' not found. Routing query directly to Gemini Cognitive Core...`,
            type: "output" as const
          }
        ];
        setHistory(fallbackLines);
        await executeAiQuery(trimmed, fallbackLines);
        break;
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const newIndex = historyIndex === -1 ? cmdHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setInput(cmdHistory[newIndex]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (cmdHistory.length === 0 || historyIndex === -1) return;
      const newIndex = historyIndex + 1;
      if (newIndex >= cmdHistory.length) {
        setHistoryIndex(-1);
        setInput("");
      } else {
        setHistoryIndex(newIndex);
        setInput(cmdHistory[newIndex]);
      }
    }
  };

  return (
    <div
      id="terminal_container"
      onClick={focusInput}
      className="w-full rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950/80 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-blue-500/30"
    >
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-900 bg-zinc-950 select-none">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full bg-green-500/70" />
          <span className="ml-2 font-mono text-xs text-zinc-500 flex items-center gap-1.5">
            <TerminalIcon className="w-3.5 h-3.5" />
            yazid@yazid-os:~
          </span>
        </div>
        <div className="flex items-center gap-1 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 animate-pulse">
          <Sparkles className="w-3 h-3 text-violet-400" />
          <span className="font-mono text-[10px] text-zinc-400 tracking-wider">GEMINI ASSISTANT ACTIVE</span>
        </div>
      </div>

      {/* Terminal Body */}
      <div
        ref={containerRef}
        className="h-96 overflow-y-auto p-4 font-mono text-xs leading-relaxed text-zinc-300 bg-black/40 scrollbar-thin scrollbar-thumb-zinc-800"
      >
        {history.map((line, idx) => (
          <div
            key={idx}
            className={`mb-1.5 whitespace-pre-wrap ${
              line.type === "input"
                ? "text-white font-medium"
                : line.type === "system"
                ? "text-blue-400 font-semibold"
                : line.type === "success"
                ? "text-emerald-400"
                : line.type === "error"
                ? "text-red-400 font-semibold"
                : line.type === "ai"
                ? "text-violet-300 border-l-2 border-violet-500/40 pl-3 py-0.5 my-1"
                : line.type === "code"
                ? "bg-zinc-950/90 text-cyan-400 font-mono text-[11px] p-3 rounded-lg border border-zinc-900 my-2 overflow-x-auto whitespace-pre font-semibold select-text shadow-inner"
                : line.type === "bullet"
                ? "text-zinc-200 border-l border-zinc-800/80 pl-4 py-0.5"
                : line.type === "empty"
                ? "h-2"
                : "text-zinc-400"
            }`}
          >
            {line.type === "code" ? line.text : renderFormattedText(line.text)}
          </div>
        ))}

        {isProcessing && (
          <div className="flex items-center gap-2 text-violet-400 italic animate-pulse mt-2 pl-1">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
            [YAZID-OS PROCESSING INTELLECTUAL STREAM...]
          </div>
        )}
      </div>

      {/* Terminal Command Input */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-zinc-900 bg-zinc-950/60 font-mono text-xs">
        <span className="text-emerald-400 font-bold shrink-0">yazid@portfolio:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-white border-none outline-none caret-blue-500 min-w-0"
          placeholder={lang === "en" ? "Ask AI anything or type terminal commands..." : "Tanya AI apa saja atau ketik perintah terminal..."}
          disabled={isProcessing}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
        />
        <button
          onClick={() => handleCommand(input)}
          className="flex items-center justify-center p-1 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-500 hover:text-white transition-all shrink-0 cursor-pointer"
          title="Execute Command"
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
