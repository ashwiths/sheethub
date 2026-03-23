import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Tool } from "../data/tools";

interface ToolCardProps {
  tool: Tool;
  featured?: boolean; // Prop kept for compatibility but visual distinction removed as per request
}

export default function ToolCard({ tool }: ToolCardProps) {
  const Icon = tool.icon;

  const cardContent = (
    <motion.div
      whileHover={tool.comingSoon ? {} : { y: -4 }}
      whileTap={tool.comingSoon ? {} : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`group bg-white rounded-[2rem] p-6 sm:p-7 
        border-2 border-violet-50/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)]
        ${tool.comingSoon ? "opacity-75 grayscale-[20%]" : "hover:shadow-[0_20px_50px_-10px_rgba(109,40,217,0.15)] hover:border-violet-100 cursor-pointer"}
        transition-all duration-300 h-full flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br from-violet-50/0 to-transparent ${tool.comingSoon ? "" : "group-hover:from-violet-50/40"} transition-colors duration-500 pointer-events-none`} />

      <div
        className={`w-24 h-24 sm:w-28 sm:h-28 shrink-0 ${tool.bgColor} rounded-[2rem] flex items-center justify-center
          shadow-sm ${tool.comingSoon ? "" : "group-hover:scale-105"} transition-transform duration-300 relative z-10`}
      >
        <div className={`absolute inset-0 ${tool.bgColor} rounded-[2rem] blur-xl opacity-0 ${tool.comingSoon ? "" : "group-hover:opacity-40"} transition-opacity duration-300`} />
        <Icon size={40} className={`${tool.color} relative z-10`} strokeWidth={2.5} />
      </div>

      <div className="flex flex-col justify-center h-full relative z-10 text-center sm:text-left flex-1 py-1">
        <h3 className={`text-[22px] font-bold text-gray-900 mb-2.5 tracking-tight ${tool.comingSoon ? "" : "group-hover:text-violet-700"} transition-colors`}>
          {tool.name}
        </h3>
        <p className="text-[15px] text-gray-500 leading-relaxed mb-6 font-medium max-w-[280px] sm:max-w-none mx-auto sm:mx-0">
          {tool.description}
        </p>

        <div className="mt-auto flex justify-center sm:justify-start">
          {tool.comingSoon ? (
            <div className="inline-flex items-center justify-center min-w-[140px] px-6 py-3 bg-gray-50 text-gray-400 font-bold text-[15px] rounded-2xl border-2 border-dashed border-gray-200 cursor-not-allowed">
              Coming soon
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-semibold text-[15px] rounded-2xl shadow-md hover:shadow-lg transition-all duration-200">
              Try it now <ArrowRight size={18} />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  if (tool.comingSoon) {
    return <div className="block h-full">{cardContent}</div>;
  }

  return (
    <Link to={tool.path} className="block h-full">
      {cardContent}
    </Link>
  );
}
