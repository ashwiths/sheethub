import { Link } from "react-router-dom";
import { FileStack, Twitter, Github, Linkedin } from "lucide-react";

const products = [
  { label: "Merge PDF", path: "/merge-pdf" },
  { label: "Split PDF", path: "/split-pdf" },
  { label: "Compress PDF", path: "/compress-pdf" },
  { label: "Rotate PDF", path: "/rotate-pdf" },
  { label: "PDF to Word", path: "/pdf-to-word" },
  { label: "Word to PDF", path: "/word-to-pdf" },
  { label: "PDF to JPG", path: "/pdf-to-image" },
  { label: "JPG to PDF", path: "/jpg-to-pdf" },
  { label: "Watermark PDF", path: "/watermark-pdf" },
  { label: "Protect PDF", path: "/protect-pdf" },
  { label: "Unlock PDF", path: "/unlock-pdf" },
  { label: "Sign PDF", path: "/sign-pdf" },
];

export default function Footer() {
  return (
    <footer className="relative bg-[#0a0a0f] text-gray-400 mt-auto border-t border-gray-900 overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
      <div className="absolute top-0 right-[-10%] w-[300px] h-[300px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-violet-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10 relative z-10">
        <div className="flex flex-col md:flex-row gap-12 mb-14">

          {/* Brand Column */}
          <div className="md:w-72 shrink-0 space-y-6">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
                <FileStack size={22} className="text-white" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                Sheet<span className="text-violet-400">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed font-medium">
              The world's most beautiful and secure PDF toolkit. Process documents blazingly fast in your browser without ever sending data to our servers.
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: Twitter, href: "#" },
                { icon: Github, href: "https://github.com/ashwiths", target: "_blank" },
                { icon: Linkedin, href: "https://www.linkedin.com/in/infant-ashil-a-b88a39361/", target: "_blank" },
              ].map((Social, i) => (
                <a
                  key={i}
                  href={Social.href}
                  target={Social.target}
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-violet-600 hover:border-violet-500 text-gray-400 hover:text-white transition-all duration-300 hover:-translate-y-1"
                >
                  <Social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Products Column */}
          <div className="flex-1">
            <h4 className="text-sm font-bold text-white mb-6 tracking-wide">Products</h4>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-3">
              {products.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-sm text-gray-500 hover:text-violet-300 transition-colors font-medium hover:underline underline-offset-4 decoration-violet-500"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/10">
          <p className="text-xs text-gray-600 font-medium">
            © {new Date().getFullYear()} SheetHub Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
