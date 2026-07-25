import { cn } from "@/shared/utils/cn";
import { Check, ShieldCheck } from "lucide-react";

const sizes = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
  xl: "h-20 w-20 text-lg",
};

const statusSizes = {
  xs: "h-2 w-2 border",
  sm: "h-2.5 w-2.5 border",
  md: "h-3 w-3 border-2",
  lg: "h-3.5 w-3.5 border-2",
  xl: "h-4 w-4 border-2",
};

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const colors = [
  "bg-red-800",
  "bg-red-700",
  "bg-green-700",
  "bg-red-400",
  "bg-green-700",
  "bg-red-800",
  "bg-indigo-500",
];

function getColor(name) {
  if (!name) return colors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function Avatar({
  src,
  alt,
  name,
  size = "md",
  online,
  verified = false,
  className,
  ...rest
}) {
  const initials = getInitials(name);
  const color = getColor(name);

  return (
    <div className={cn("relative inline-flex shrink-0", className)} {...rest}>
      {src ? (
        <img
          src={src}
          alt={alt || name || "Avatar"}
          className={cn(
            "rounded-full object-cover ring-2 ring-white dark:ring-gray-900",
            sizes[size]
          )}
        />
      ) : (
        <div
          className={cn(
            "flex items-center justify-center rounded-full font-semibold text-white ring-2 ring-white dark:ring-gray-900",
            color,
            sizes[size]
          )}
        >
          {initials}
        </div>
      )}
      {online !== undefined && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full",
            online ? "bg-green-700" : "bg-gray-400",
            statusSizes[size]
          )}
          style={{ borderColor: "white" }}
        />
      )}
      {verified && (
        <div className="absolute -bottom-0.5 -right-0.5 rounded-full bg-white dark:bg-gray-900">
          <ShieldCheck
            className={cn(
              "text-red-700",
              size === "xs" && "h-3 w-3",
              size === "sm" && "h-3.5 w-3.5",
              size === "md" && "h-4 w-4",
              size === "lg" && "h-5 w-5",
              size === "xl" && "h-6 w-6"
            )}
          />
        </div>
      )}
    </div>
  );
}
