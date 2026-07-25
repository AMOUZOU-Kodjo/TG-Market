import { Quote } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import Avatar from "@/shared/ui/Avatar";
import Rating from "@/shared/ui/Rating";

export default function TestimonialCard({
  avatar,
  name,
  rating,
  text,
  date,
  className,
  ...rest
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900",
        className
      )}
      {...rest}
    >
      <Quote className="mb-3 h-6 w-6 text-red-300 dark:text-red-800/30" />
      <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        "{text}"
      </p>
      <div className="flex items-center gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
        <Avatar src={avatar} name={name} size="sm" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {name}
          </p>
          {date && (
            <p className="text-xs text-gray-400 dark:text-gray-500">{date}</p>
          )}
        </div>
        {rating !== undefined && <Rating value={rating} size="sm" />}
      </div>
    </div>
  );
}
