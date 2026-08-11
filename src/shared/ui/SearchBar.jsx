import { useState, useRef, useEffect } from "react";
import { Search, X, Clock, TrendingUp } from "lucide-react";
import { cn } from "@/shared/utils/cn";

export default function SearchBar({
  placeholder = "Rechercher...",
  value,
  onChange,
  onSearch,
  onClear,
  recentSearches = [],
  suggestions = [],
  onSuggestionClick,
  onRecentClick,
  className,
  ...rest
}) {
  const [query, setQuery] = useState(value || "");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    onChange?.(val);
  };

  const handleClear = () => {
    setQuery("");
    onChange?.("");
    onClear?.();
    inputRef.current?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(query);
    setIsFocused(false);
  };

  const showDropdown =
    isFocused && (recentSearches.length > 0 || suggestions.length > 0);

  const filteredSuggestions = query
    ? suggestions.filter((s) =>
        s.toLowerCase().includes(query.toLowerCase())
      )
    : suggestions;

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-10 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-red-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-800/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-red-800 dark:focus:bg-gray-900"
          {...rest}
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      {showDropdown && (
        <div className="absolute top-full z-50 mt-1 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
          {recentSearches.length > 0 && !query && (
            <div className="p-2">
              <div className="flex items-center justify-between px-2 py-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  Recherches récentes
                </span>
              </div>
              {recentSearches.map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    onRecentClick?.(item);
                    setQuery(item);
                    onChange?.(item);
                    setIsFocused(false);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <Clock className="h-3.5 w-3.5 text-gray-400" />
                  {item}
                </button>
              ))}
            </div>
          )}
          {filteredSuggestions.length > 0 && (
            <div className="p-2">
              {query && (
                <div className="flex items-center justify-between px-2 py-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                    Suggestions
                  </span>
                </div>
              )}
              {filteredSuggestions.map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    onSuggestionClick?.(item);
                    setQuery(item);
                    onChange?.(item);
                    setIsFocused(false);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <TrendingUp className="h-3.5 w-3.5 text-red-700" />
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
