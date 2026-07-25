import { forwardRef, useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/shared/utils/cn";

const Select = forwardRef(
  (
    {
      label,
      error,
      placeholder = "Select an option",
      options = [],
      value,
      onChange,
      className,
      containerClassName,
      disabled = false,
      id,
      ...rest
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(value);
    const containerRef = useRef(null);
    const selectId = id || `select-${label?.toLowerCase().replace(/\s+/g, "-")}`;

    useEffect(() => {
      setSelected(value);
    }, [value]);

    useEffect(() => {
      const handleClickOutside = (e) => {
        if (containerRef.current && !containerRef.current.contains(e.target)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (option) => {
      setSelected(option.value);
      onChange?.(option.value);
      setIsOpen(false);
    };

    const selectedOption = options.find((o) => o.value === selected);

    return (
      <div className={cn("w-full", containerClassName)} ref={containerRef}>
        {label && (
          <label
            htmlFor={selectId}
            className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <button
            ref={ref}
            id={selectId}
            type="button"
            disabled={disabled}
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "flex w-full items-center justify-between rounded-xl border bg-white px-4 py-2.5 text-left text-sm transition-colors duration-200",
              "focus:border-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-800/20",
              "disabled:cursor-not-allowed disabled:opacity-50",
              isOpen && "border-brand-800 ring-2 ring-brand-800/20",
              error
                ? "border-red-700 focus:border-red-700 focus:ring-red-700/20"
                : "border-gray-300 dark:border-gray-700",
              "bg-white dark:bg-gray-900",
              className
            )}
            {...rest}
          >
            <span
              className={cn(
                "truncate",
                selectedOption
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-400 dark:text-gray-500"
              )}
            >
              {selectedOption?.label || placeholder}
            </span>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-gray-400 transition-transform duration-200",
                isOpen && "rotate-180"
              )}
            />
          </button>

          {isOpen && (
            <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
              <div className="max-h-60 overflow-y-auto p-1">
                {options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    disabled={option.disabled}
                    onClick={() => handleSelect(option)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                      option.value === selected
                        ? "bg-brand-50 text-brand-900 dark:bg-brand-800/10 dark:text-brand-700"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
                      option.disabled && "cursor-not-allowed opacity-50"
                    )}
                  >
                    <span className="flex-1 truncate">{option.label}</span>
                    {option.value === selected && (
                      <Check className="h-4 w-4 shrink-0 text-brand-800" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-xs text-red-700 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
