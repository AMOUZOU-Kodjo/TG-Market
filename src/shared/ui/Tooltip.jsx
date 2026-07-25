import { useState } from "react";
import { cn } from "@/shared/utils/cn";

export default function Tooltip({
  children,
  content,
  position = "top",
  className,
  ...rest
}) {
  const [show, setShow] = useState(false);

  const positions = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      {...rest}
    >
      {children}
      {show && content && (
        <div
          role="tooltip"
          className={cn(
            "absolute z-50 whitespace-nowrap rounded-lg bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-white shadow-lg dark:bg-gray-700",
            positions[position],
            className
          )}
        >
          {content}
          <div
            className={cn(
              "absolute h-2 w-2 rotate-45 bg-gray-900 dark:bg-gray-700",
              position === "top" && "bottom-[-4px] left-1/2 -translate-x-1/2",
              position === "bottom" && "top-[-4px] left-1/2 -translate-x-1/2",
              position === "left" && "right-[-4px] top-1/2 -translate-y-1/2",
              position === "right" && "left-[-4px] top-1/2 -translate-y-1/2"
            )}
          />
        </div>
      )}
    </div>
  );
}
