import { cn } from "@/shared/utils/cn";

const variants = {
  text: "h-4 w-3/4 rounded",
  card: "h-48 w-full rounded-2xl",
  avatar: "h-10 w-10 rounded-full",
  image: "h-64 w-full rounded-2xl",
};

export default function Skeleton({
  variant = "text",
  className,
  count = 1,
  ...rest
}) {
  return (
    <div className="space-y-2" {...rest}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "animate-pulse bg-gray-200 dark:bg-gray-800",
            variants[variant],
            className
          )}
        />
      ))}
    </div>
  );
}
