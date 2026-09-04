import { Search } from "lucide-react";
import { useState } from "react";

type SearchBarProps = {
  placeholder?: string;
  defaultValue?: string;
  suggestions?: string[];
  onSearch?: (query: string) => void;
  onQueryChange?: (query: string) => void;
  className?: string;
};

export default function SearchBar({
  placeholder = "Tìm kiếm...",
  defaultValue = "",
  suggestions = [],
  onSearch,
  onQueryChange,
  className = "",
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);

  const handleChange = (value: string) => {
    setQuery(value);
    onQueryChange?.(value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!query.trim()) return;

    onSearch?.(query.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`h-10 flex items-center gap-2 p-2 bg-white border rounded-sm focus-within:border-black focus-within:ring-2 focus-within:ring-black/20 transition ${className}`}
    >
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full outline-none"
      />
      <button
        type="submit"
        className="h-full w-auto px-4 rounded-sm flex items-center justify-center bg-primary-500 hover:bg-primary-600 transition-colors"
      >
        <Search size={16} className="text-white" />
      </button>
    </form>
  );
}
