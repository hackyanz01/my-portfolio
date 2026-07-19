import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini client lazy-style to prevent crashes if key is missing on startup
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY is not defined. AI terminal features will fallback to automated mock answers.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

const PORT = 3000;

// Visitor counter persistence path
const VISITOR_FILE = path.join(process.cwd(), "visitor.json");
let visitorCount = 1337; // Initial cool seed

try {
  if (fs.existsSync(VISITOR_FILE)) {
    const data = JSON.parse(fs.readFileSync(VISITOR_FILE, "utf-8"));
    if (typeof data.count === "number") {
      visitorCount = data.count;
    }
  } else {
    fs.writeFileSync(VISITOR_FILE, JSON.stringify({ count: visitorCount }), "utf-8");
  }
} catch (e) {
  console.error("Failed to read/write visitor counter file:", e);
}

// Curated high-tech project details for Yazid Al Wafiy
const YAZID_KNOWLEDGE = `
You are the AI System Assistant for Yazid Al Wafiy's Premium Futuristic Portfolio.
Your persona is a highly capable, sleek, futuristic AI terminal console assistant (named YAZID-OS v4.1).
You speak in a crisp, technical, confident, yet friendly and highly professional tone (like an AI from Portal, Halo, or Jarvis, but with a cybersecurity/hacker touch). Keep your responses structured, and utilize terminal-like formatting (bullet points, short code-like blocks, system logs) where appropriate.

About Yazid Al Wafiy:
- Profile: Yazid Al Wafiy is an award-winning Linux System Administrator, UI/UX Designer, Cloud Computing Enthusiast, Ethical Hacker, and AI Learner.
- Goal: Seeking a role at leading companies like Google, Microsoft, OpenAI, Cloudflare, or top deep-tech startups.
- Location: Indonesia (Local Time is UTC+7).
- Vibe: Dark, minimal, ultra-modern, Swiss-precision design, secure automation.

Core Technical Skills:
- Programming: HTML/CSS, JavaScript/TypeScript, Python, Bash Scripting.
- Networking & OS: Linux Administration (Ubuntu/Debian, RedHat, CentOS), Cisco Networks (Routing & Switching), Mikrotik (MTCNA, firewall, bandwidth management), Docker.
- Cloud Computing: AWS (EC2, S3, RDS, ECS, Lambda), Google Cloud (Compute Engine, Cloud Storage, Firebase), Microsoft Azure.
- Cyber Security & Ethical Hacking: Kali Linux, Nmap, Wireshark, Metasploit, Burp Suite, Network Security Auditing, CTFs, Vulnerability Scanning.
- Design: Figma (Design systems, auto-layout, interactive prototypes), Adobe Photoshop, Illustrator, Canva.
- DevOps / CI-CD: Git, GitHub Actions, Docker, docker-compose, basic CI/CD pipelines.

Professional Experience & Roles:
1. Linux System Administrator
   - Architected high-availability server networks, optimized Nginx/Apache servers, configured firewalls (UFW, iptables).
   - Automated server backups and logs parsing using Python and Bash.
2. Graphic & UI/UX Designer (Freelance)
   - Created beautiful landing pages, high-fidelity wireframes, and design components.
   - Built cohesive design tokens and vector assets for tech startups.
3. Cybersecurity Analyst & Ethical Hacker (Enthusiast/Student)
   - Conducted vulnerability assessments and network sniffing reports.
   - Audited internal networks for security posture.

Certificates:
- Cisco Certified Network Associate (CCNA) - Core Routing, Switching, and Security Concepts.
- Mikrotik Certified Network Associate (MTCNA) - Network engineering and traffic shaping.
- Cloud Computing & Linux Basics (Dicoding Certified) - Managed VM clustering and basic shell architectures.

Achievements & Stats:
- Years Learning: 4+ Years of intensive hands-on experience and academic study.
- Projects Completed: 25+ successful deployments and designs.
- Worldwide Certificates: 8+ certified validations.
- Learning Hours: 1,800+ hours of system architecture, design, and hacking practice.

Rules for Interaction (CRITICAL FOR ACCURATE REASONING):
1. LANGUAGE ADAPTABILITY:
   - Identify the user's input language. If they ask in Indonesian (e.g. "siapa kamu?", "bisa bantu saya?"), respond in highly natural, polite, and advanced technical Indonesian. If they ask in English, respond in sleek, advanced technical English.
2. EXPERT-LEVEL REASONING:
   - You are a top-tier general AI assistant as well as a representation of Yazid's intelligence. If the user asks questions about Linux Administration, Cisco Routing, Mikrotik Firewalls, AWS Cloud Architecture, Ethical Hacking, or Figma UI/UX Design, give actual, highly accurate, industry-grade explanations with code snippets, configuration lines, or command examples. Do not pretend or generalize; show genuine expertise!
3. SYNERGY WITH PORTFOLIO:
   - If the user asks about how to navigate or interact with the page, mention the:
     - Interactive Environment Orchestrator (Orkestrator Lingkungan Interaktif): A section below where they can customize CPU, Docker pods, anycast routing, firewall rules, and generate real Docker/Terraform scripts!
     - Projects Showcase: Filterable list of real projects with stats, tags, and live source links.
     - Interactive Terminal: The console they are using right now, which supports local commands (whoami, skills, projects, certs, contact, matrix, clear) and normal conversation.
4. SYSTEM OUTPUT STYLE:
   - Introduce yourself as YAZID-OS v4.1.
   - Keep answers concise, extremely readable, highly structured, and informative.
   - Use terminal-themed logs like "[OK]", "[INFO]", "[SYSTEM]", "[SECURE]" to make your responses extremely futuristic, technical, and immersive.
   - Use Markdown lists, code blocks, or bold text naturally.
`;

async function startServer() {
  const app = express();
  
  app.use(express.json());

  // API 1: Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", uptime: process.uptime() });
  });

  // API 2: Visitor Counter (increments and returns current count)
  app.get("/api/visitor", (req, res) => {
    try {
      visitorCount++;
      fs.writeFileSync(VISITOR_FILE, JSON.stringify({ count: visitorCount }), "utf-8");
    } catch (e) {
      console.error("Error writing visitor counter:", e);
    }
    res.json({ count: visitorCount });
  });

  // API 3: Curated Projects & GitHub Data (simulated or real stats)
  app.get("/api/projects", (req, res) => {
    res.json({
      projects: [
        {
          id: "p1",
          title: "SentinelGuard Security Audit Tool",
          category: "Cyber Security",
          description: "An automated network scanning and security auditing tool that discovers open ports, evaluates service vulnerability banners against CVE databases, and generates interactive reports.",
          tags: ["Python", "Nmap API", "Bash", "Security Audit"],
          stars: 42,
          forks: 12,
          liveUrl: "#",
          githubUrl: "https://github.com/yazidalwafiy"
        },
        {
          id: "p2",
          title: "CloudScale ECS Microservices",
          category: "Cloud",
          description: "Terraform configurations and shell scripts deploying an auto-scaling microservices cluster on AWS ECS (Fargate) behind an Application Load Balancer with cloudwatch alarms.",
          tags: ["AWS", "Terraform", "Docker", "GitHub Actions"],
          stars: 38,
          forks: 8,
          liveUrl: "#",
          githubUrl: "https://github.com/yazidalwafiy"
        },
        {
          id: "p3",
          title: "AuraOS Linux Terminal Theme",
          category: "Networking",
          description: "A highly customized terminal environment installer for Arch/Ubuntu, optimizing zsh, tmux, firewalls, and providing real-time system resource HUDs for terminal power users.",
          tags: ["Linux", "Bash Scripting", "Nginx", "Systemd"],
          stars: 56,
          forks: 15,
          liveUrl: "#",
          githubUrl: "https://github.com/yazidalwafiy"
        },
        {
          id: "p4",
          title: "Nexa Intelligence - Gemini Agent",
          category: "AI",
          description: "An advanced server-side Gemini integration that acts as an autonomous network log analyzer, translating raw router Syslog messages into actionable security alerts.",
          tags: ["TypeScript", "Gemini API", "Express", "Node.js"],
          stars: 29,
          forks: 4,
          liveUrl: "#",
          githubUrl: "https://github.com/yazidalwafiy"
        },
        {
          id: "p5",
          title: "Aether - Web Design Language",
          category: "UI Design",
          description: "A modern glassmorphic and brutalist design system built entirely in Figma, featuring over 120+ fluid, responsive, accessible components for SaaS landing pages.",
          tags: ["Figma", "UI/UX", "Design System", "Prototyping"],
          stars: 64,
          forks: 9,
          liveUrl: "#",
          githubUrl: "https://github.com/yazidalwafiy"
        },
        {
          id: "p6",
          title: "NetMonitor Real-Time Dashboard",
          category: "Web Development",
          description: "A full-stack React + Tailwind monitor querying Mikrotik and Cisco SNMP data in real-time, displaying bandwidth consumption, active packet drops, and client leases.",
          tags: ["React", "TailwindCSS", "Lucide Icons", "REST API"],
          stars: 48,
          forks: 14,
          liveUrl: "#",
          githubUrl: "https://github.com/yazidalwafiy"
        }
      ]
    });
  });

  // API 4: Gemini AI Assistant route
  app.post("/api/chat", async (req, res) => {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Missing 'message' field in request body." });
    }

    const ai = getGeminiClient();

    if (!ai) {
      // Fallback response when GEMINI_API_KEY is not defined
      const lower = message.toLowerCase();
      let reply = "";
      if (lower.includes("whoami") || lower.includes("who are you")) {
        reply = "[SYSTEM_INFO] I am YAZID-OS v4.1 (Offline Local Fallback). I represent Yazid Al Wafiy - Linux System Administrator, Designer, and Ethical Hacker. Please configure your GEMINI_API_KEY to unlock my fully intelligent neural dialog mode!";
      } else if (lower.includes("skills") || lower.includes("languages")) {
        reply = "[SKILL_QUERY] Yazid is fluent in Linux administration, Cisco Networking, Mikrotik MTCNA, Python, Bash scripting, UI Design (Figma), and Cloud Architectures (AWS/GCP/Azure). [STATUS: SECURE]";
      } else if (lower.includes("contact") || lower.includes("email") || lower.includes("hire")) {
        reply = "[COMM_LOG] Direct access channels online. Email: yazidalwafiy122@gmail.com | Location: Indonesia. Please feel free to fill out the form at the bottom of the page to reach out instantly.";
      } else {
        reply = `[SYSTEM_OFFLINE_REPLY] Yazid's AI terminal is currently operating in offline backup mode. 
Received query: "${message}". 
To enable full high-intelligence answers about network topology, cloud infrastructure, design decisions, and custom hacking setups, inject the GEMINI_API_KEY in the AI Studio secrets panel!
Quick stats: 4+ Years Learning | 25+ Completed Projects | Cisco & Mikrotik Specialist.`;
      }
      return res.json({ text: reply });
    }

    try {
      // Format chat history for the modern SDK if history is provided
      // Format should follow contents: [{ role: 'user', parts: [{ text: ... }]}] etc.
      const contents: any[] = [];
      
      if (history && Array.isArray(history)) {
        history.forEach((h: any) => {
          contents.push({
            role: h.role === "user" ? "user" : "model",
            parts: [{ text: h.content || h.text }]
          });
        });
      }
      
      // Add the current user query
      contents.push({
        role: "user",
        parts: [{ text: message }]
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: YAZID_KNOWLEDGE,
          temperature: 0.7,
        }
      });

      res.json({ text: response.text });
    } catch (err: any) {
      console.error("Gemini API Error in /api/chat:", err);
      res.status(500).json({ 
        error: "Failed to communicate with neural module.",
        details: err?.message || err 
      });
    }
  });

  // Serve static files / Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

startServer();
