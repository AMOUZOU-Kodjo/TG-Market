import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/shared/utils/cn";

export default function Tabs({
  tabs = [],
  defaultTab,
  value,
  onChange,
  className,
  ...rest
}) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  const currentTab = value !== undefined ? value : activeTab;

  const handleChange = (id) => {
    setActiveTab(id);
    onChange?.(id);
  };

  return (
    <div className={cn("w-full", className)} {...rest}>
      <div className="relative flex gap-1 overflow-x-auto border-b border-gray-200 dark:border-gray-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleChange(tab.id)}
            className={cn(
              "relative flex items-center gap-2 whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors",
              currentTab === tab.id
                ? "text-brand-800"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            )}
          >
            {tab.icon && <tab.icon className="h-4 w-4" />}
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                  currentTab === tab.id
                    ? "bg-brand-200 text-brand-900 dark:bg-brand-800/15 dark:text-brand-700"
                    : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                )}
              >
                {tab.count}
              </span>
            )}
            {currentTab === tab.id && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-brand-800"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
      <div className="py-4">
        {tabs.find((t) => t.id === currentTab)?.content}
      </div>
    </div>
  );
}
