import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Globe, Users, ShieldCheck, Heart } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// ─── Hero Section ─────────────────────────────────────────────────────────────
function AboutHero() {
  return (
    <section className="relative pt-32 pb-24 overflow-hidden border-b border-gray-100">
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-l from-violet-200/50 via-indigo-100/40 to-transparent rounded-full blur-3xl opacity-70 -z-10" />
      <div className="absolute top-20 left-10 w-64 h-64 bg-rose-200/30 rounded-full blur-3xl -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-900">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-8"
        >
          Making document management
          <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            effortless for everyone
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto"
        >
          At SheetHub, our mission is to empower professionals, students, and businesses by providing an accessible, lightning-fast, and deeply secure ecosystem for managing PDF documents without the frustration of paywalls or complex software.
        </motion.p>
      </div>
    </section>
  );
}

// ─── Our Story ────────────────────────────────────────────────────────────────
function OurStory() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 bg-white" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              SheetHub started in 2026 with a simple observation: manipulating PDF files was incredibly frustrating. Consumers were forced to choose between expensive desktop software subscriptions, or shady web apps that uploaded their private documents to unknown servers.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              We decided there had to be a better way. By leveraging modern WebAssembly and cutting-edge browser technologies, we built a suite of 29 powerful document tools that process files locally on your own machine. We completely eliminated the server round-trip, resulting in unmatched speed and absolute privacy.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-3xl overflow-hidden shadow-2xl relative"
          >
            {/* Placeholder for an office or abstract team image */}
            <div className="aspect-[4/3] bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center p-12">
              <div className="grid grid-cols-2 gap-4 w-full h-full opacity-50">
                <div className="bg-violet-200 rounded-2xl animate-pulse" />
                <div className="bg-indigo-300 rounded-2xl animate-pulse" style={{ animationDelay: '0.5s'}} />
                <div className="bg-purple-200 rounded-2xl animate-pulse" style={{ animationDelay: '1s'}} />
                <div className="bg-rose-200 rounded-2xl animate-pulse" style={{ animationDelay: '1.5s'}} />
              </div>
            </div>
            <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Core Values ──────────────────────────────────────────────────────────────
const values = [
  {
    icon: <ShieldCheck size={28} />,
    title: "Privacy First",
    desc: "We believe your data is yours. Using Local-First browser processing, we ensure we literally never see or hold your documents on our servers.",
  },
  {
    icon: <Globe size={28} />,
    title: "Accessible to All",
    desc: "Essential digital tools shouldn't be a luxury. Our entirely free tier handles 99% of workflows to support students and developing nations.",
  },
  {
    icon: <Heart size={28} />,
    title: "User Obsessed",
    desc: "We prioritize clean, frictionless experiences over dark patterns and intrusive ads. Beautiful UI leads to productive, happy work.",
  },
  {
    icon: <Users size={28} />,
    title: "Open Collaboration",
    desc: "We closely listen to our active community of 2 million users, shipping features and bug fixes transparently.",
  },
];

function CoreValues() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 bg-gray-50 border-t border-b border-gray-100" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            These four pillars drive every product decision, feature launch, and interface design we make.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 bg-violet-100 text-violet-600 rounded-2xl flex items-center justify-center mb-6">
                {v.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{v.title}</h3>
              <p className="text-gray-600 leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Banner ───────────────────────────────────────────────────────────────
function AboutCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-3xl p-12 sm:p-20 text-center relative overflow-hidden"
        >
          {/* Subtle glows */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-violet-600/30 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/30 rounded-full blur-[100px]" />

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to simplify your workflow?
            </h2>
            <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
              Join millions of professionals experiencing lightning-fast, secure, and beautiful document management.
            </p>
            <Link
              to="/#tools"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-950 font-semibold rounded-2xl hover:scale-105 transition-all duration-200 shadow-xl shadow-white/10"
            >
              Start Using Our Tools <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <AboutHero />
        <OurStory />
        <CoreValues />
        <AboutCTA />
      </main>
      <Footer />
    </div>
  );
}
