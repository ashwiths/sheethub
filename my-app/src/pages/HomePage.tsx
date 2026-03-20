import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Zap,
  Shield,
  Globe,
  Layers,
  Star,
  UploadCloud,
  Settings,
  Download,
  Plus,
  Minus,
  Beaker,
  Heart,
  Search,
  X
} from "lucide-react";
import ToolCard from "../components/ToolCard";
import CategoryTabs from "../components/CategoryTabs";
import { tools, categories, type Category } from "../data/tools";

// ─── Hero Search Bar ─────────────────────────────────────────────────────────
function HeroSearchBar() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const results = query.trim().length > 0
    ? tools.filter((t) =>
        t.name.toLowerCase().includes(query.toLowerCase()) ||
        t.description.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  // Close on outside click
  useState(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  });

  function handleSelect(path: string) {
    setQuery("");
    setOpen(false);
    navigate(path);
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
      className="relative w-full max-w-lg mx-auto mb-6"
    >
      {/* Glow effect behind the bar */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-400/20 via-purple-300/20 to-fuchsia-400/20 blur-xl -z-10 scale-110" />

      <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md border border-white/60 shadow-[0_8px_32px_rgba(109,40,217,0.12)] rounded-2xl px-5 py-3.5 transition-all duration-300 focus-within:shadow-[0_8px_40px_rgba(109,40,217,0.22)] focus-within:border-violet-200">
        <Search size={18} className="text-violet-400 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Search any tool — merge, compress, convert…"
          className="flex-1 bg-transparent text-[15px] font-medium text-gray-700 placeholder-gray-400 outline-none"
        />
        {query && (
          <button onClick={() => { setQuery(""); setOpen(false); }} className="text-gray-300 hover:text-gray-500 transition-colors">
            <X size={15} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full mt-3 left-0 right-0 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-violet-200/40 border border-gray-100 overflow-hidden z-50"
          >
            {results.map((tool, i) => {
              const Icon = tool.icon;
              return (
                <motion.button
                  key={tool.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleSelect(tool.path)}
                  className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-violet-50 transition-colors text-left group"
                >
                  <div className={`w-9 h-9 rounded-xl ${tool.bgColor} flex items-center justify-center shrink-0`}>
                    <Icon size={16} className={tool.color} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-semibold text-gray-800 group-hover:text-violet-700 transition-colors">{tool.name}</p>
                    <p className="text-[12px] text-gray-400 truncate">{tool.description}</p>
                  </div>
                  <ArrowRight size={14} className="text-gray-300 group-hover:text-violet-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-24 overflow-hidden isolate flex flex-col items-center text-center">
      {/* Background blobs simulating the soft gradient glow */}
      <div className="absolute top-10 right-0 w-[500px] h-[500px] bg-fuchsia-100/60 rounded-full blur-[120px] -z-10 mix-blend-multiply" />
      <div className="absolute top-32 left-0 w-[500px] h-[500px] bg-violet-100/50 rounded-full blur-[120px] -z-10 mix-blend-multiply" />
      
      {/* Clean Light Grid Pattern exactly as shown */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center">
        
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-50/50 border border-violet-100 mb-6 sm:mb-8"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
          <span className="text-[10px] font-bold text-violet-600 tracking-widest uppercase">Trusted by 2M+ users</span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="text-[40px] sm:text-[56px] lg:text-[68px] font-extrabold text-[#111827] leading-[1.05] tracking-tight mb-4"
        >
          Do more with your PDFs,
          <br />
          <span className="relative inline-block mt-1 sm:mt-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-500 to-fuchsia-500">
              effortlessly.
            </span>
            <svg className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-3 sm:h-4 text-fuchsia-400 opacity-60" viewBox="0 0 300 12" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.5 9.5C80.5 3.5 167.5 1.5 297.5 9.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="text-[16px] sm:text-[18px] text-gray-500 max-w-2xl text-center leading-relaxed mt-8 mb-8"
        >
          Merge, split, compress, convert, and secure your files in seconds.
          <span className="block font-bold text-gray-900 mt-1">100% free. No signup.</span>
        </motion.p>

        {/* Hero Search Bar */}
        <HeroSearchBar />

        {/* Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="flex justify-center w-full"
        >
          <a
            href="#tools"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-full font-bold text-[16px] transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:-translate-y-1"
          >
            Get Started Free <ArrowRight size={18} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Trusted Partners ────────────────────────────────────────────────────────
function TrustedPartners() {
  return (
    <section className="py-8 border-y border-gray-100 bg-gray-50/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm font-semibold text-gray-400 mb-6 uppercase tracking-wider">Trusted by innovative teams worldwide</p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
          {/* Mock Logos done with text for simplicity but stylized */}
          <a href="https://www.bluelabtech.space/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-2xl font-black text-gray-900 tracking-tighter hover:text-blue-600 transition-colors"><Beaker size={24} className="text-blue-600" /> Bluelabtech</a>
          <div className="flex items-center gap-1 text-2xl font-extrabold text-violet-900"><Zap size={20} fill="currentColor"/> verter</div>
          <div className="flex items-center gap-1 text-xl font-bold text-slate-800"><Shield size={20}/> secure flow</div>
          <a href="https://www.ilovepdf.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-2xl font-bold text-red-600 tracking-tight group-hover:text-red-500 transition-colors hover:text-red-700"><Heart size={24} fill="currentColor" /> ilovepdf</a>
        </div>
      </div>
    </section>
  );
}

// ─── Tools Section (Uniform Horizontal Grid) ─────────────────────────────────
function ToolsSection() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const filtered =
    activeCategory === "All"
      ? tools
      : tools.filter((t) => t.category === activeCategory);

  return (
    <section id="tools" className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 bg-white -z-10" />
      
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">Popular PDF Tools</h2>
            <p className="text-[15px] sm:text-base text-gray-500">
              Stop juggling multiple apps. We have every tool you need to process PDFs directly in your browser.
            </p>
          </div>
          <CategoryTabs
            categories={categories}
            active={activeCategory}
            onChange={setActiveCategory}
          />
        </div>

        {/* Uniform Grid designed for the new horizontal 'Split PDF' style cards */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
        >
          {filtered.map((tool) => (
            <motion.div
              key={tool.id}
              layout
            >
              <ToolCard tool={tool} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── How it Works ────────────────────────────────────────────────────────────
function HowItWorksSection() {
  const steps = [
    {
      icon: <UploadCloud size={24} />,
      title: "1. Upload File",
      desc: "Drag and drop your PDF right into our secure browser environment.",
      color: "from-blue-500 to-cyan-400"
    },
    {
      icon: <Settings size={24} />,
      title: "2. We Process It",
      desc: "Our lightning-fast engine applies your requested changes instantly.",
      color: "from-violet-500 to-indigo-500"
    },
    {
      icon: <Download size={24} />,
      title: "3. Download",
      desc: "Get your finished file immediately. No waiting, no watermarks.",
      color: "from-fuchsia-500 to-pink-500"
    }
  ];

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="py-24 bg-gray-50 rounded-[3rem] mx-4 sm:mx-8 mb-20 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center" ref={ref}>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4"
        >
          How SheetHub Works
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="text-[15px] sm:text-base text-gray-500 max-w-2xl mx-auto mb-16"
        >
          Three simple steps to accomplish what used to take specialized software and endless tutorials. All processed safely in your browser.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-10 lg:gap-16">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.15 }}
              className="relative flex flex-col items-center"
            >
              <div className={`w-20 h-20 rounded-[1.5rem] bg-gradient-to-br ${step.color} flex items-center justify-center text-white mb-6 shadow-xl shadow-gray-200 hover:-translate-y-1 transition-transform`}>
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-500 text-[15px] max-w-[260px] leading-relaxed">{step.desc}</p>
              
              {/* Connector lines (skip on last) */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[calc(50%+40px)] w-[calc(100%-80px)] h-[2px] bg-gradient-to-r from-gray-200 to-transparent pointer-events-none" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


// ─── Work Your Way ───────────────────────────────────────────────────────────
const workFeatures = [
  {
    icon: <Zap size={24} />,
    title: "Lightning Fast",
    description: "Cloud-powered engine processes your huge files in seconds, not minutes. Perfect for batch processing.",
  },
  {
    icon: <Shield size={24} />,
    title: "Bank-Level Security",
    description: "All uploads are encrypted with AES-256. Files are automatically permanently deleted after exactly 2 hours.",
  },
  {
    icon: <Globe size={24} />,
    title: "Works Everywhere",
    description: "No downloads, no installations, no plugins. SheetHub runs flawlessly in any modern web browser.",
  },
  {
    icon: <Layers size={24} />,
    title: "Batch Processing",
    description: "Why do it one by one? Handle dozens of complex files at exactly the same time with a single click.",
  },
];

function WorkYourWaySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="features" className="pb-32 pt-10 relative isolate overflow-hidden">
      <div className="absolute inset-0 bg-white -z-10" />
      
      {/* Decorative Side Elements */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-32 h-64 bg-violet-100 rounded-r-full blur-3xl opacity-50" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-32 h-64 bg-indigo-100 rounded-l-full blur-3xl opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:w-1/3"
          >
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-5 leading-tight">
              Work the way <br />
              <span className="text-violet-600">you want to.</span>
            </h2>
            <p className="text-[15px] sm:text-base text-gray-500 mb-8 leading-relaxed">
              Designed for uncompromising individuals, hyper-productive teams, and global enterprises who need reliable tools that just work immediately.
            </p>
            <button className="flex items-center gap-2 text-violet-600 font-bold text-sm hover:text-indigo-700 transition-colors group">
              Read about our security <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          <div className="lg:w-2/3 grid sm:grid-cols-2 gap-5 w-full">
            {workFeatures.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-[1.5rem] p-7 border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-10px_rgba(109,40,217,0.1)] hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-indigo-50 rounded-xl flex items-center justify-center mb-5 text-violet-600 shadow-inner">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed text-[14px]">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ────────────────────────────────────────────────────────────
const testimonials = [
  {
    quote: "SheetHub has replaced 4 different PDF tools for our entire remote team. It's incredibly fast, totally reliable, and the user experience is just exceptional from start to finish.",
    author: "Aisha Singh",
    role: "Head of Operations, Finova",
    initials: "AS"
  },
  {
    quote: "I use this daily for university. The fact that I don't need to log in, deal with ads, or pay a ridiculous subscription to merge my research papers is an absolute lifesaver.",
    author: "Marcus Chen",
    role: "Student, MIT",
    initials: "MC"
  },
  {
    quote: "Client security is our top priority. Knowing that our highly sensitive legal documents are processed locally right in our browsers gives our firm ultimate peace of mind.",
    author: "Sarah Jenkins",
    role: "Legal Partner, O&W Law",
    initials: "SJ"
  }
];

function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="py-24 relative bg-violet-900 border-y overflow-hidden mx-4 sm:mx-8 rounded-[3rem] mb-20 isolate">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900 via-indigo-900 to-gray-900 -z-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-fuchsia-600/20 rounded-full blur-[100px] -z-10 mix-blend-screen" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-30 -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight">Loved by people worldwide</h2>
          <p className="text-violet-200 text-[15px] sm:text-base max-w-2xl mx-auto font-medium">Join millions of users who rely exclusively on our tool suite every single day.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              ref={ref}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15, ease: "easeOut" }}
              className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-[2rem] text-white
                hover:bg-white/15 hover:-translate-y-1.5 transition-all duration-300 shadow-2xl shadow-black/20 flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={16} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-lg font-medium leading-relaxed mb-8 text-white/95">"{t.quote}"</blockquote>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center font-bold text-sm shadow-inner shrink-0">
                  {t.initials}
                </div>
                <div>
                  <p className="font-bold text-sm">{t.author}</p>
                  <p className="text-xs text-violet-200/80 font-medium">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ Section ─────────────────────────────────────────────────────────────
const faqs = [
  {
    question: "Is SheetHub really 100% free?",
    answer: "Yes! SheetHub is completely free to use. There are no restrictive limits, watermarks, or hidden subscriptions. We believe essential PDF tools should be accessible to everyone."
  },
  {
    question: "Are my documents secure?",
    answer: "Absolutely. Most of our tools process files directly in your web browser (locally), meaning your sensitive data never even touches our servers. For cloud-processed tools, files are securely encrypted and permanently deleted automatically within 2 hours."
  },
  {
    question: "Do I need to download or install anything?",
    answer: "No. SheetHub is a modern web application that runs flawlessly inside any browser including Chrome, Safari, Edge, and Firefox. It works on Windows, Mac, Linux, and mobile devices."
  },
  {
    question: "Can I use SheetHub on my mobile phone?",
    answer: "Yes, our user interface is completely responsive. You can merge, split, and compress PDFs right from your iPhone, iPad, or Android device."
  },
  {
    question: "Is there a limit to the file size I can upload?",
    answer: "Our platform is designed to handle large files efficiently. Currently, you can process files up to 100MB completely free, without any compromise in processing speed."
  },
  {
    question: "Will my processed PDFs have watermarks?",
    answer: "Never. We don't believe in holding your documents hostage. Any file you process with SheetHub will be 100% watermark-free, preserving your original document's integrity."
  },
  {
    question: "What languages do your tools support?",
    answer: "Our tools can process PDFs containing text in any language, supporting full Unicode character sets, making it perfect for international teams and localized documents."
  },
  {
    question: "Can I use SheetHub offline?",
    answer: "Currently, SheetHub requires an internet connection since we use advanced cloud-based processing for a few complex tools. However, for most tasks that process locally in your browser, the data usage is minimal once the app initially loads."
  },
  {
    question: "Do you keep a backup copy of my processed files?",
    answer: "No. Files processed locally in your browser never leave your device. If a tool utilizes our cloud servers, the file is securely encrypted, temporarily processed, and instantly scheduled for permanent deletion within 2 hours."
  },
  {
    question: "How can I suggest a new feature or PDF tool?",
    answer: "We'd love to hear from you! We are constantly expanding SheetHub based on user feedback. Feel free to contact our support team with your ideas and feature requests."
  }
];

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="pb-32 pt-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-500 text-[15px] sm:text-base">Everything you need to know about the product and billing.</p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1 }}
                className={`border border-gray-100 rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? "bg-white shadow-lg shadow-gray-100/50" : "bg-gray-50 hover:bg-gray-100/70"}`}
              >
                <button
                  className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                >
                  <span className={`font-semibold text-base transition-colors ${isOpen ? "text-violet-700" : "text-gray-900"}`}>{faq.question}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shrink-0 ${isOpen ? "bg-violet-100 text-violet-600" : "bg-white text-gray-400 border border-gray-200"}`}>
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                  </div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 text-gray-500 text-[15px] leading-relaxed border-t border-gray-50 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Banner ──────────────────────────────────────────────────────────────
function CTABanner() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="pb-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative rounded-[3rem] p-10 sm:p-16 lg:p-20 text-center overflow-hidden border border-gray-100 shadow-2xl shadow-gray-200/50 bg-white"
        >
          {/* Decorative glows inside card */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-violet-100/60 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-100/60 rounded-full blur-3xl -z-10 -translate-x-1/3 translate-y-1/3" />

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-5 tracking-tight">
              Ready to simplify <br className="hidden sm:block" />
              your documents?
            </h2>
            <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto font-medium">
              Join millions of users doing it completely free. No credit card, no account required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/#tools"
                className="inline-flex items-center justify-center gap-2 px-9 py-4 bg-gray-900 text-white font-bold rounded-full text-[15px] shadow-xl hover:shadow-2xl hover:bg-gray-800 hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto"
              >
                Explore All Tools <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className="flex-1 bg-white font-sans selection:bg-violet-200 selection:text-violet-900">
      <Hero />
      <TrustedPartners />
      <ToolsSection />
      <HowItWorksSection />
      <WorkYourWaySection />
      <TestimonialsSection />
      <FAQSection />
      <CTABanner />
    </div>
  );
}
