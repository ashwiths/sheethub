import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, FileStack, Sparkles, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Tools", href: "/#tools" },
  { label: "Features", href: "/#features" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        scrolled ? "pt-4 px-4 sm:px-6" : "pt-0 px-0"
      }`}
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`mx-auto transition-all duration-500 ease-in-out ${
          scrolled
            ? "max-w-5xl bg-white/75 backdrop-blur-xl shadow-[0_8px_32px_rgba(109,40,217,0.12)] border border-white/60 rounded-[2rem] px-5 sm:px-8"
            : "max-w-7xl bg-transparent border-transparent px-4 sm:px-6 lg:px-8"
        }`}
      >
        <div className={`flex items-center justify-between transition-all duration-500 ${scrolled ? "h-16 sm:h-20" : "h-24"}`}>

          {/* Logo */}
          <div className="flex-1 flex items-center justify-start">
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center justify-center transition-all duration-300 ${
                  scrolled 
                    ? "w-10 h-10 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-xl shadow-lg shadow-violet-500/30" 
                    : "w-11 h-11 bg-violet-600 rounded-xl shadow-md shadow-violet-200 group-hover:shadow-violet-400/50"
                }`}
              >
                <FileStack size={scrolled ? 20 : 22} className="text-white" strokeWidth={2.5} />
              </motion.div>
              <span className={`font-black tracking-tight transition-all duration-300 ${
                scrolled ? "text-xl text-gray-900" : "text-2xl text-gray-900"
              }`}>
                SheetHub
              </span>
            </Link>
          </div>

          {/* Desktop Nav (Center) */}
          <nav className={`hidden md:flex flex-none items-center justify-center gap-6 transition-all duration-300 ${scrolled ? "bg-gray-50/80 backdrop-blur-md p-1.5 rounded-2xl border border-gray-100/50 gap-1.5" : ""}`}>
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`relative text-[14px] font-bold rounded-xl transition-all duration-300 hover:text-violet-700 ${
                  scrolled 
                    ? "px-5 py-2.5 text-gray-600 hover:bg-white hover:shadow-sm" 
                    : "px-2 py-2 text-gray-500 hover:text-gray-900"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Side CTA */}
          <div className="hidden md:flex flex-1 items-center justify-end">
            <Link
              to="/#tools"
              className="group relative inline-flex items-center gap-2 px-6 py-2.5 text-[14px] font-semibold rounded-full transition-all duration-300 shadow-[0_4px_14px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 bg-[#0F172A] hover:bg-[#1E293B] text-white"
            >
              <span>Get Started Free</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className={`p-2.5 rounded-xl transition-colors ${
                scrolled ? "bg-white text-gray-900 shadow-sm border border-gray-100" : "text-gray-600 hover:bg-gray-100"
              }`}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:hidden absolute top-[calc(100%+1rem)] left-4 right-4 bg-white/95 backdrop-blur-2xl border border-white/60 shadow-2xl shadow-violet-900/10 rounded-3xl p-4 flex flex-col gap-2 z-50"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="flex items-center px-4 py-3.5 text-[15px] font-bold text-gray-700 hover:text-violet-600 hover:bg-violet-50 rounded-2xl transition-all"
              >
                {link.label}
              </a>
            ))}
            <div className="h-px bg-gray-100/80 my-2" />
            <Link
              to="/#tools"
              className="flex items-center justify-center gap-2.5 w-full py-4 bg-[#0F172A] hover:bg-[#1E293B] transition-colors text-white text-[15px] font-bold rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] group"
            >
              <span>Get Started Free</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
