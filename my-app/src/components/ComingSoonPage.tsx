import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock } from "lucide-react";

interface ComingSoonPageProps {
  toolName: string;
}

export default function ComingSoonPage({ toolName }: ComingSoonPageProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center pt-24 pb-16 px-4 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center space-y-5"
      >
        {/* Icon */}
        <div className="w-20 h-20 bg-violet-100 text-violet-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm border border-violet-50">
          <Clock size={36} strokeWidth={2} />
        </div>

        {/* Badge */}
        <span className="inline-block bg-violet-100 text-violet-700 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
          Coming Soon
        </span>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          {toolName}
        </h1>

        {/* Sub-text */}
        <p className="text-gray-500 text-base leading-relaxed">
          We're working hard to bring you this feature. Check back soon for
          updates!
        </p>

        {/* Back button */}
        <div className="pt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
