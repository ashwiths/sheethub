import { motion } from "framer-motion";
import type { Category } from "../data/tools";

interface CategoryTabsProps {
  categories: Category[];
  active: Category;
  onChange: (category: Category) => void;
}

export default function CategoryTabs({ categories, active, onChange }: CategoryTabsProps) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${active === cat
              ? "text-violet-700"
              : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            }`}
        >
          {active === cat && (
            <motion.span
              layoutId="active-tab"
              className="absolute inset-0 bg-violet-100 rounded-xl"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{cat}</span>
        </button>
      ))}
    </div>
  );
}
