import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/shared/utils/cn";

const Input = forwardRef(
  (
    {
      label,
      placeholder,
      error,
      helperText,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      prefix,
      suffix,
      type = "text",
      className,
      containerClassName,
      id,
      disabled = false,
      ...rest
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, "-")}`;

    return (
      <div className={cn("w-full", containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {LeftIcon && (
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <LeftIcon className="h-5 w-5" />
            </div>
          )}
          {prefix && (
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">
              {prefix}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={isPassword && showPassword ? "text" : type}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors duration-200",
              "placeholder:text-gray-400",
              "focus:border-red-800 focus:outline-none focus:ring-2 focus:ring-red-800/20",
              "dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500",
              "dark:focus:border-red-800 dark:focus:ring-red-800/20",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error
                ? "border-red-700 focus:border-red-700 focus:ring-red-700/20 dark:border-red-700"
                : "border-gray-300 dark:border-gray-700",
              LeftIcon && "pl-10",
              (RightIcon || isPassword) && "pr-10",
              prefix && "pl-12",
              suffix && "pr-12",
              className
            )}
            {...rest}
          />
          {suffix && (
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">
              {suffix}
            </div>
          )}
          {RightIcon && !isPassword && (
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <RightIcon className="h-5 w-5" />
            </div>
          )}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          )}
        </div>
        {error && <p className="mt-1.5 text-xs text-red-700 dark:text-red-400">{error}</p>}
        {!error && helperText && (
          <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
