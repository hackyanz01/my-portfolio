import { Project, SkillCategory, Certificate, TimelineEvent, Article } from "./types";

export const UI_TRANSLATIONS = {
  en: {
    heroTitle: "Yazid Al Wafiy",
    heroSubtitle: "System Architect & UI/UX Designer",
    heroRoles: ["Linux Administrator", "Cloud Architect", "Ethical Hacker", "AI Enthusiast", "UI/UX Designer"],
    viewProjects: "View Projects",
    downloadCV: "Download CV",
    contactMe: "Contact Me",
    aboutTitle: "About Me",
    aboutSubtitle: "The Code & The Console",
    aboutStory1: "I am a high-performance Linux System Administrator, Security Specialist, and UI/UX Designer based in Indonesia. I bridge the gap between elegant design philosophies (Vercel-like precision) and hardened server orchestrations. Whether constructing secure AWS microservice grids, conducting vulnerability auditing via Kali Linux, or tuning Mikrotik firewalls, I strive for absolute technical and aesthetic excellence.",
    aboutStory2: "Currently building production systems and diving deep into Generative AI workflows, I approach technology with a hacker's curiosity and a designer's eye. My ultimate objective is to engineering mission-critical infrastructure for leading global innovators.",
    yearsLearning: "Years Learning",
    projectsCompleted: "Projects",
    certificatesEarned: "Certificates",
    hoursSystemd: "Console Hours",
    skillsTitle: "Core Competency Matrix",
    skillsSubtitle: "Vetted skill sectors & specialized toolsets",
    projectsTitle: "Selected Masterworks",
    projectsSubtitle: "A display of cloud topologies, security kernels, and high-fidelity frontends",
    filterAll: "All",
    certificatesTitle: "Credentials & Accreditations",
    certificatesSubtitle: "Verified technical achievements and standard validations",
    expTitle: "Operational Timeline",
    expSubtitle: "My career path, academic background, and major milestones",
    blogTitle: "System Logs & Tech Articles",
    blogSubtitle: "Weekly writings on terminal hacks, cloud scaling, and cybersecurity",
    contactTitle: "Initiate Secure Handshake",
    contactSubtitle: "Get in touch or query my system directly",
    contactName: "Your Identity (Name)",
    contactEmail: "Return Address (Email)",
    contactSubject: "Transmission Subject",
    contactMsg: "Payload (Message)",
    contactSend: "Transmit Message",
    contactSending: "Transmitting...",
    contactSuccess: "[SUCCESS] Handshake complete. Message queued successfully.",
    visitorCounter: "SECURE VISITS LOGGED",
    githubContribs: "System Commits",
    terminalTitle: "YAZID-OS v4.1 Terminal Console (Interactive AI Assistant Available)",
    terminalPlaceholder: "Type 'help' to view commands...",
    backToTop: "Return to Orbit",
    readLog: "Read Article",
    viewCredentials: "Verify Credential"
  },
  id: {
    heroTitle: "Yazid Al Wafiy",
    heroSubtitle: "Arsitek Sistem & Desainer UI/UX",
    heroRoles: ["Administrator Linux", "Arsitek Cloud", "Ethical Hacker", "Peminat AI", "Desainer UI/UX"],
    viewProjects: "Lihat Projek",
    downloadCV: "Unduh CV",
    contactMe: "Hubungi Saya",
    aboutTitle: "Tentang Saya",
    aboutSubtitle: "Kode & Konsol",
    aboutStory1: "Saya adalah Administrator Sistem Linux berkinerja tinggi, Spesialis Keamanan, dan Desainer UI/UX yang berbasis di Indonesia. Saya menjembatani celah antara filosofi desain yang elegan (presisi ala Vercel) dan orkestrasi server yang tangguh. Baik saat membangun jaringan microservices AWS yang aman, melakukan audit kerentanan via Kali Linux, atau menyetel firewall Mikrotik, saya selalu berupaya mencapai keunggulan teknis dan estetika.",
    aboutStory2: "Saat ini saya sedang membangun sistem produksi dan mendalami alur kerja Generative AI, saya mendekati teknologi dengan keingintahuan seorang peretas dan mata seorang desainer. Tujuan akhir saya adalah merekayasa infrastruktur penting untuk inovator global terkemuka.",
    yearsLearning: "Tahun Belajar",
    projectsCompleted: "Projek Selesai",
    certificatesEarned: "Sertifikat",
    hoursSystemd: "Jam Konsol",
    skillsTitle: "Matriks Kompetensi Inti",
    skillsSubtitle: "Sektor keahlian yang teruji & peralatan khusus",
    projectsTitle: "Karya Terpilih",
    projectsSubtitle: "Tampilan topologi cloud, kernel keamanan, dan frontend dengan ketelitian tinggi",
    filterAll: "Semua",
    certificatesTitle: "Kredensial & Akreditasi",
    certificatesSubtitle: "Pencapaian teknis terverifikasi dan validasi standar",
    expTitle: "Garis Waktu Operasional",
    expSubtitle: "Jalur karier saya, latar belakang akademis, dan tonggak pencapaian utama",
    blogTitle: "Log Sistem & Artikel Teknis",
    blogSubtitle: "Tulisan mingguan seputar peretasan terminal, penskalaan cloud, dan keamanan siber",
    contactTitle: "Inisiasi Handshake Aman",
    contactSubtitle: "Hubungi saya atau kirim kueri ke sistem saya secara langsung",
    contactName: "Identitas Anda (Nama)",
    contactEmail: "Alamat Balasan (Email)",
    contactSubject: "Subjek Transmisi",
    contactMsg: "Payload (Pesan)",
    contactSend: "Kirim Transmisi",
    contactSending: "Mengirimkan...",
    contactSuccess: "[SUKSES] Handshake selesai. Pesan berhasil diantrekan.",
    visitorCounter: "KUNJUNGAN AMAN TERCATAT",
    githubContribs: "Komit Sistem",
    terminalTitle: "Terminal Konsol YAZID-OS v4.1 (Asisten AI Interaktif Tersedia)",
    terminalPlaceholder: "Ketik 'help' untuk melihat perintah...",
    backToTop: "Kembali ke Atas",
    readLog: "Baca Artikel",
    viewCredentials: "Verifikasi Kredensial"
  }
};

export const PROJECTS_DATA: Project[] = [
  {
    id: "p1",
    title: "SentinelGuard Security Audit",
    category: "Cyber Security",
    description: {
      en: "An automated network scanning and security auditing tool that discovers open ports, evaluates service vulnerability banners against CVE databases, and generates interactive reports.",
      id: "Alat pemindaian jaringan dan audit keamanan otomatis yang menemukan port terbuka, mengevaluasi spanduk kerentanan layanan terhadap database CVE, dan menghasilkan laporan interaktif."
    },
    tags: ["Python", "Nmap API", "Bash Script", "CVE DB"],
    stars: 42,
    forks: 12,
    liveUrl: "#",
    githubUrl: "https://github.com/hackyanz01"
  },
  {
    id: "p2",
    title: "CloudScale AWS ECS Cluster",
    category: "Cloud",
    description: {
      en: "Terraform configurations and shell scripts deploying an auto-scaling microservices cluster on AWS ECS (Fargate) behind an Application Load Balancer with CloudWatch alerts.",
      id: "Konfigurasi Terraform dan skrip shell untuk menerapkan kluster mikroservis auto-scaling di AWS ECS (Fargate) di balik Application Load Balancer dengan peringatan CloudWatch."
    },
    tags: ["AWS ECS", "Terraform", "Docker", "GitActions"],
    stars: 38,
    forks: 8,
    liveUrl: "#",
    githubUrl: "https://github.com/hackyanz01"
  },
  {
    id: "p3",
    title: "AuraOS Optimized Zsh & Theme",
    category: "Networking",
    description: {
      en: "A highly customized terminal environment installer for Arch/Ubuntu, optimizing zsh, tmux, firewalls, and providing real-time system resource HUDs for terminal power users.",
      id: "Penginstal lingkungan terminal yang sangat disesuaikan untuk Arch/Ubuntu, mengoptimalkan zsh, tmux, firewall, dan menyediakan HUD sumber daya sistem waktu nyata untuk pengguna konsol."
    },
    tags: ["Zsh", "Linux OS", "Tmux", "Network Tuner"],
    stars: 56,
    forks: 15,
    liveUrl: "#",
    githubUrl: "https://github.com/hackyanz01"
  },
  {
    id: "p4",
    title: "Nexa Syslog AI Analyzer",
    category: "AI",
    description: {
      en: "An advanced server-side Gemini integration that acts as an autonomous network log analyzer, translating raw router Syslog messages into actionable security alerts.",
      id: "Integrasi Gemini sisi server canggih yang bertindak sebagai penganalisis log jaringan otonom, menerjemahkan pesan Syslog router mentah menjadi peringatan keamanan."
    },
    tags: ["TypeScript", "Gemini API", "Express", "Node.js"],
    stars: 29,
    forks: 4,
    liveUrl: "#",
    githubUrl: "https://github.com/hackyanz01"
  },
  {
    id: "p5",
    title: "Aether Glassmorphic System",
    category: "UI Design",
    description: {
      en: "A modern glassmorphic and brutalist design system built entirely in Figma, featuring over 120+ fluid, responsive, accessible components for SaaS landing pages.",
      id: "Sistem desain glassmorphic dan brutalist modern yang dibangun seluruhnya di Figma, menampilkan lebih dari 120+ komponen yang responsif dan dapat diakses."
    },
    tags: ["Figma", "UI/UX Design", "Auto-Layout", "Design Tokens"],
    stars: 64,
    forks: 9,
    liveUrl: "#",
    githubUrl: "https://github.com/hackyanz01"
  },
  {
    id: "p6",
    title: "NetMonitor SNMP Dashboard",
    category: "Web Development",
    description: {
      en: "A full-stack React + Tailwind monitor querying Mikrotik and Cisco SNMP data in real-time, displaying bandwidth consumption, active packet drops, and client leases.",
      id: "Dasbor pemantau React + Tailwind full-stack yang mengkueri data SNMP Mikrotik dan Cisco secara real-time, menampilkan konsumsi bandwidth dan penurunan paket aktif."
    },
    tags: ["React", "Tailwind v4", "SNMP Protocol", "Recharts"],
    stars: 48,
    forks: 14,
    liveUrl: "#",
    githubUrl: "https://github.com/hackyanz01"
  }
];

export const SKILLS_DATA: SkillCategory[] = [
  {
    name: { en: "Programming", id: "Pemrograman" },
    iconName: "Code2",
    skills: [
      { name: "HTML / CSS", level: 95 },
      { name: "JavaScript / TS", level: 88 },
      { name: "Python", level: 85 },
      { name: "Bash Scripting", level: 90 }
    ]
  },
  {
    name: { en: "Networking & OS", id: "Jaringan & OS" },
    iconName: "Network",
    skills: [
      { name: "Linux Administration", level: 92 },
      { name: "Cisco Routing/Switching", level: 86 },
      { name: "Mikrotik (MTCNA)", level: 89 },
      { name: "Docker Orchestration", level: 84 }
    ]
  },
  {
    name: { en: "Cloud Platforms", id: "Platform Cloud" },
    iconName: "Cloud",
    skills: [
      { name: "AWS Services", level: 82 },
      { name: "Google Cloud Platform", level: 80 },
      { name: "Microsoft Azure", level: 75 }
    ]
  },
  {
    name: { en: "Cyber Security", id: "Keamanan Siber" },
    iconName: "ShieldAlert",
    skills: [
      { name: "Kali Linux & Penetration Testing", level: 86 },
      { name: "Nmap Network Mapping", level: 92 },
      { name: "Wireshark Packet Analysis", level: 88 },
      { name: "Metasploit Audit Framework", level: 80 }
    ]
  },
  {
    name: { en: "UI/UX Design", id: "Desain UI/UX" },
    iconName: "Palette",
    skills: [
      { name: "Figma Prototyping", level: 94 },
      { name: "Photoshop & Illustrator", level: 82 },
      { name: "Canva Studio", level: 90 }
    ]
  },
  {
    name: { en: "AI Tools", id: "Peralatan AI" },
    iconName: "BrainCircuit",
    skills: [
      { name: "ChatGPT Prompting", level: 95 },
      { name: "Gemini Integration", level: 90 },
      { name: "Claude API Orchestration", level: 88 },
      { name: "Cursor AI Workflows", level: 92 }
    ]
  },
  {
    name: { en: "DevOps & CI/CD", id: "DevOps & Komit" },
    iconName: "Workflow",
    skills: [
      { name: "Git & Version Control", level: 90 },
      { name: "GitHub Enterprise", level: 88 },
      { name: "Docker Compose", level: 85 },
      { name: "GitHub Actions Automation", level: 80 }
    ]
  }
];

export const CERTIFICATES_DATA: Certificate[] = [
  {
    id: "c1",
    title: "Cisco Certified Network Associate (CCNA)",
    issuer: "Cisco",
    date: "2025",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400",
    credentialUrl: "https://www.cisco.com/"
  },
  {
    id: "c2",
    title: "Mikrotik Certified Network Associate (MTCNA)",
    issuer: "Mikrotik",
    date: "2025",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=400",
    credentialUrl: "https://mikrotik.com/"
  },
  {
    id: "c3",
    title: "Linux System Administration Professional",
    issuer: "Dicoding",
    date: "2024",
    image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&q=80&w=400",
    credentialUrl: "https://www.dicoding.com/"
  },
  {
    id: "c4",
    title: "AWS Cloud Practitioner & Architect Path",
    issuer: "Cloud",
    date: "2025",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400",
    credentialUrl: "https://aws.amazon.com/"
  },
  {
    id: "c5",
    title: "Ethical Hacking & Penetration Testing Basics",
    issuer: "Cyber Security",
    date: "2024",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=400",
    credentialUrl: "#"
  },
  {
    id: "c6",
    title: "Digital Network Infrastructure Engineer Certificate",
    issuer: "Telkom",
    date: "2024",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=400",
    credentialUrl: "#"
  }
];

export const TIMELINE_DATA: TimelineEvent[] = [
  {
    id: "t1",
    year: "2025 — Present",
    title: {
      en: "Freelance UI/UX Designer & System Admin",
      id: "Desainer UI/UX & Admin Sistem Freelance"
    },
    subtitle: "Remote Contracts",
    description: {
      en: "Drafted custom modern design systems in Figma and deployed secure Ubuntu VPS platforms for digital agency operations. Achieved 98% network uptime and pristine user testing scores.",
      id: "Merancang sistem desain modern kustom di Figma dan menyebarkan platform VPS Ubuntu yang aman untuk operasi agensi digital. Mencapai 98% uptime jaringan dan nilai pengujian pengguna yang sangat baik."
    },
    type: "experience"
  },
  {
    id: "t2",
    year: "2024",
    title: {
      en: "Cisco & Mikrotik Systems Integration trainee",
      id: "Siswa Integrasi Sistem Cisco & Mikrotik"
    },
    subtitle: "Network Systems Lab",
    description: {
      en: "Configured OSPF routing protocols, advanced bandwidth management, NAT rules, and firewall security matrices across complex multi-branch network environments.",
      id: "Mengonfigurasi protokol perutean OSPF, manajemen bandwidth lanjutan, aturan NAT, dan matriks keamanan firewall di berbagai lingkungan jaringan multi-cabang."
    },
    type: "education"
  },
  {
    id: "t3",
    year: "2023 — 2024",
    title: {
      en: "Linux Administrator Apprentice",
      id: "Magang Administrator Linux"
    },
    subtitle: "Open Source Club Indonesia",
    description: {
      en: "Maintained community file-servers, automated system updates with cron scripts, optimized storage arrays, and set up secure reverse proxies with Nginx.",
      id: "Memelihara file-server komunitas, mengotomatiskan pembaruan sistem dengan skrip cron, mengoptimalkan penyimpanan, dan menyiapkan proksi terbalik yang aman dengan Nginx."
    },
    type: "experience"
  },
  {
    id: "t4",
    year: "2023",
    title: {
      en: "First Place: Local Network Security Challenge",
      id: "Juara Pertama: Kompetisi Keamanan Jaringan Lokal"
    },
    subtitle: "Cybersecurity League",
    description: {
      en: "Led a 3-member team to scan, harden, and defend an unpatched server infrastructure against automated exploit scripts within a 6-hour real-time exercise.",
      id: "Memimpin tim beranggotakan 3 orang untuk memindai, memperkuat, dan mempertahankan infrastruktur server yang rentan terhadap skrip eksploitasi otomatis dalam latihan 6 jam."
    },
    type: "achievement"
  }
];

export const ARTICLES_DATA: Article[] = [
  {
    id: "a1",
    title: {
      en: "Hardening Linux Servers: First 10 Minutes on a Fresh VPS",
      id: "Memperkuat Server Linux: 10 Menit Pertama pada VPS Baru"
    },
    excerpt: {
      en: "A step-by-step terminal checklist covering SSH keys, customized firewalls, fail2ban setup, and automated system alerts.",
      id: "Panduan langkah demi langkah terminal yang mencakup kunci SSH, firewall khusus, pengaturan fail2ban, dan sistem peringatan otomatis."
    },
    category: "Linux",
    date: "July 12, 2026",
    readTime: "5 min read",
    slug: "hardening-linux-vps-checklist"
  },
  {
    id: "a2",
    title: {
      en: "Demystifying CCNA Subnetting: Master IP V4 Like a Router",
      id: "Memahami Subnetting CCNA: Kuasai IP V4 Seperti Router"
    },
    excerpt: {
      en: "No more mental fatigue. Learn the magic of CIDR notation, fast block math, and clean system subnet boundaries.",
      id: "Tidak ada lagi kelelahan mental. Pelajari keajaiban notasi CIDR, matematika blok cepat, dan batas subnet sistem yang rapi."
    },
    category: "Networking",
    date: "June 28, 2026",
    readTime: "7 min read",
    slug: "ccna-subnetting-magic"
  },
  {
    id: "a3",
    title: {
      en: "Configuring a Resilient AWS VPC: Gateways, Subnets, & Route Tables",
      id: "Mengonfigurasi AWS VPC yang Tangguh: Gateway, Subnet, & Tabel Rute"
    },
    excerpt: {
      en: "Architect an isolation blueprint for your web clusters using private app subnets, resilient NAT gateways, and explicit route tables.",
      id: "Rancang cetak biru isolasi untuk kluster web Anda menggunakan subnet aplikasi privat, gateway NAT yang tangguh, dan tabel rute eksplisit."
    },
    category: "Cloud",
    date: "May 19, 2026",
    readTime: "9 min read",
    slug: "resilient-aws-vpc-architecture"
  },
  {
    id: "a4",
    title: {
      en: "Sniffing Protocols: Advanced Wireshark Techniques For Securing LANs",
      id: "Mengendus Protokol: Teknik Wireshark Lanjutan Untuk Mengamankan LAN"
    },
    excerpt: {
      en: "Trace suspicious TCP handshakes, filter malicious DHCP lease requests, and identify cleartext password leaks inside local LAN packets.",
      id: "Lacak jabat tangan TCP yang mencurigakan, filter permintaan sewa DHCP yang berbahaya, dan identifikasi kebocoran kata sandi teks biasa dalam paket LAN lokal."
    },
    category: "Cyber Security",
    date: "April 02, 2026",
    readTime: "6 min read",
    slug: "wireshark-sniffing-lan-security"
  }
];
