import { useState, useRef, useEffect } from "react";
import { cn } from "@/shared/utils/cn";

export default function Dropdown({
  trigger,
  children,
  align = "left",
  className,
  ...rest
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const alignment = {
    left: "left-0",
    right: "right-0",
    center: "left-1/2 -translate-x-1/2",
  };

  return (
    <div ref={ref} className="relative inline-block" {...rest}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div
          className={cn(
            "absolute z-50 mt-2 min-w-[200px] overflow-hidden rounded-xl border border-gray-200 bg-white py-1.5 shadow-lg dark:border-gray-700 dark:bg-gray-900",
            alignment[align],
            className
          )}
        >
          {typeof children === "function"
            ? children({ onClose: () => setIsOpen(false) })
            : children}
        </div>
      )}
    </div>
  );
}

export function DropdownItem({
  icon: Icon,
  children,
  onClick,
  danger = false,
  disabled = false,
  className,
  ...rest
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className={cn(
        "flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm transition-colors",
        danger
          ? "text-red-800 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-700/10"
          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
      {...rest}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0" />}
      <span className="flex-1">{children}</span>
    </button>
  );
}

export function DropdownDivider({ className }) {
  return (
    <div
      className={cn("my-1.5 border-t border-gray-100 dark:border-gray-800", className)}
    />
  );
}

export function DropdownGroup({ label, children, className }) {
  return (
    <div className={cn("py-1.5", className)}>
      {label && (
        <div className="px-3.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          {label}
        </div>
      )}
      {children}
    </div>
  );
}
