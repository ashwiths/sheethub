import { Link } from "react-router-dom";
import { FileStack, Twitter, Github, Linkedin, ArrowUpRight } from "lucide-react";

const links = {
  Products: ["Merge PDF", "Split PDF", "Compress PDF", "Convert to Word", "Watermark PDF"],
  Company: ["About Us", "Customer Stories", "Careers", "Security", "Press"],
  Resources: ["Help Center", "Blog", "API Documentation", "Community", "Status"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR Compliance"],
};

export default function Footer() {
  return (
    <footer className="relative bg-[#0a0a0f] text-gray-400 mt-auto border-t border-gray-900 overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
      <div className="absolute top-0 right-[-10%] w-[300px] h-[300px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-violet-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12 lg:gap-8 mb-20">
          
          {/* Brand Column (Spans 2 on large) */}
          <div className="col-span-2 lg:col-span-2 space-y-8">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20 shadow-inner">
                <FileStack size={22} className="text-white" />
              </div>
              <span className="text-2xl font-black text-white px-0 tracking-tight">
                Sheet<span className="text-violet-400">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm font-medium">
              The world's most beautiful and secure PDF toolkit. Process documents blazingly fast in your browser without ever sending data to our servers.
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: Twitter, href: "#" }, 
                { icon: Github, href: "#" }, 
                { icon: Linkedin, href: "#" }
              ].map((Social, i) => (
                <a
                  key={i}
                  href={Social.href}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-violet-600 hover:border-violet-500 text-gray-400 hover:text-white transition-all duration-300 hover:-translate-y-1 shadow-sm"
                >
                  <Social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section} className="col-span-1">
              <h4 className="text-sm font-bold text-white mb-6 tracking-wide">{section}</h4>
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="group inline-flex items-center gap-1 text-sm text-gray-500 hover:text-violet-300 transition-colors font-medium decoration-violet-500 decoration-2 underline-offset-4 hover:underline"
                    >
                      {item}
                      {item.includes("API") && (
                        <ArrowUpRight size={12} className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/10">
          <div className="flex items-center gap-6 text-xs text-gray-600 font-medium">
            <p>© {new Date().getFullYear()} SheetHub Inc. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-6 text-xs text-gray-500 font-medium">
            <a href="#" className="hover:text-white transition-colors">System Status</a>
            <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
            <span>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
