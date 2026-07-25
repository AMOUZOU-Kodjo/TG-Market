import { Check } from "lucide-react";
import { cn } from "@/shared/utils/cn";

export default function StepIndicator({
  steps = [],
  currentStep = 0,
  className,
  ...rest
}) {
  return (
    <div className={cn("w-full", className)} {...rest}>
      <div className="flex items-center">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isLast = index === steps.length - 1;

          return (
            <div key={index} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                    isCompleted
                      ? "border-brand-800 bg-brand-800 text-white"
                      : isActive
                        ? "border-brand-800 bg-brand-50 text-brand-900 dark:bg-brand-800/10"
                        : "border-gray-300 bg-white text-gray-400 dark:border-gray-700 dark:bg-gray-900"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={cn(
                    "mt-2 text-center text-xs font-medium",
                    isActive
                      ? "text-brand-900 dark:text-brand-700"
                      : isCompleted
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-400 dark:text-gray-500"
                  )}
                >
                  {step.label || step}
                </span>
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "mx-2 mb-5 h-0.5 flex-1 rounded-full transition-colors",
                    index < currentStep
                      ? "bg-brand-800"
                      : "bg-gray-200 dark:bg-gray-800"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
