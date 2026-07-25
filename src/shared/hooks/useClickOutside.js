import { useEffect, useRef } from "react";

export function useClickOutside(handler, enabled = true) {
  const ref = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        handler(event);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && ref.current && !ref.current.contains(event.target)) {
        handler(event);
      }
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handler, enabled]);

  return ref;
}
