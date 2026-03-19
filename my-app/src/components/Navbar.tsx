import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, FileStack } from "lucide-react";
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
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <header
      className={`absolute top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-100"
          : "bg-transparent border-b border-transparent"
        }`}
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="w-1/3 flex justify-start">
            <Link to="/" className="flex items-center gap-2.5 group">
              <motion.div 
                whileHover={{ rotate: 5, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 bg-violet-600 rounded-[10px] flex items-center justify-center shadow-md shadow-violet-200 transition-shadow group-hover:shadow-violet-400/50"
              >
                <FileStack size={16} className="text-white" strokeWidth={2.5} />
              </motion.div>
              <span className="text-xl font-extrabold text-gray-900 tracking-tight">
                SheetHub
              </span>
            </Link>
          </div>

          {/* Desktop Nav (Center) */}
          <nav className="w-1/3 hidden md:flex items-center justify-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="group relative text-[13px] font-semibold text-gray-500 hover:text-gray-900 transition-colors"
              >
                {link.label}
                <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-violet-600 group-hover:w-full group-hover:left-0 transition-all duration-300 rounded-full" />
              </a>
            ))}
          </nav>

          {/* Desktop CTA (Right) */}
          <div className="w-1/3 hidden md:flex items-center justify-end">
            <motion.a
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              href="/#tools"
              className="px-6 py-2.5 text-sm font-semibold text-white bg-violet-600 rounded-full hover:bg-violet-700 hover:shadow-lg hover:shadow-violet-300/50 transition-colors"
            >
              Start using tools
            </motion.a>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-b border-gray-100 shadow-lg px-4 pb-4 pt-2"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-3 flex flex-col gap-2">
              <a
                href="/#tools"
                className="px-4 py-3 text-sm font-semibold text-center text-white bg-violet-600 rounded-full"
              >
                Start using tools
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
