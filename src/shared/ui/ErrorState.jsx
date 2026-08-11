import { AlertTriangle, RefreshCw } from "lucide-react";
import { cn } from "@/shared/utils/cn";

export default function ErrorState({
  title = "Une erreur est survenue",
  description,
  onRetry,
  className,
  ...rest
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 text-center",
        className
      )}
      {...rest}
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-700/10">
        <AlertTriangle className="h-8 w-8 text-red-700" />
      </div>
      <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="mb-6 max-w-sm text-sm text-gray-500 dark:text-gray-400">
        {description ||
          "Vérifiez votre connexion internet et réessayez."}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-xl bg-red-800 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-900"
        >
          <RefreshCw className="h-4 w-4" />
          Réessayer
        </button>
      )}
    </div>
  );
}
