import { forwardRef } from "react";
import { cn } from "@/shared/utils/cn";

const Textarea = forwardRef(
  (
    {
      label,
      error,
      maxLength,
      showCount = false,
      placeholder,
      rows = 4,
      className,
      containerClassName,
      disabled = false,
      id,
      value,
      onChange,
      ...rest
    },
    ref
  ) => {
    const textareaId =
      id || `textarea-${label?.toLowerCase().replace(/\s+/g, "-")}`;
    const charCount = typeof value === "string" ? value.length : 0;

    return (
      <div className={cn("w-full", containerClassName)}>
        {label && (
          <label
            htmlFor={textareaId}
            className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          placeholder={placeholder}
          rows={rows}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          disabled={disabled}
          className={cn(
            "w-full resize-none rounded-xl border bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors duration-200",
            "placeholder:text-gray-400",
            "focus:border-red-800 focus:outline-none focus:ring-2 focus:ring-red-800/20",
            "dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500",
            "dark:focus:border-red-800 dark:focus:ring-red-800/20",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error
              ? "border-red-700 focus:border-red-700 focus:ring-red-700/20 dark:border-red-700"
              : "border-gray-300 dark:border-gray-700",
            className
          )}
          {...rest}
        />
        <div className="mt-1.5 flex items-center justify-between">
          {error ? (
            <p className="text-xs text-red-700 dark:text-red-400">{error}</p>
          ) : (
            <span />
          )}
          {showCount && (
            <p
              className={cn(
                "text-xs text-gray-400",
                maxLength && charCount >= maxLength && "text-red-800"
              )}
            >
              {charCount}
              {maxLength && `/${maxLength}`}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
