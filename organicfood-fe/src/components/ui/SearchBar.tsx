import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar({ className = "" }: { className?: string }) {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!keyword.trim()) return;

    navigate(`/products?keyword=${encodeURIComponent(keyword.trim())}`);
  };

  return (
    <search className={`flex-1 max-w-md ${className}`}>
      <form
        onSubmit={handleSubmit}
        className="flex items-stretch h-10 rounded-sm bg-white overflow-hidden focus-within:ring-1 focus-within:ring-black  focus-within:ring-offset-2 focus-within:ring-offset-primary-500 transition-all border border-stone-200"
      >
        <label className="sr-only" htmlFor="search-input">
          Tìm kiếm sản phẩm
        </label>
        <input
          id="search-input"
          type="search"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Tìm kiếm sản phẩm..."
          className="flex-1 px-4 text-sm text-stone-800 outline-none [&::-webkit-search-cancel-button]:hidden"
        />
        <button
          type="submit"
          aria-label="Tìm kiếm"
          className="cursor-pointer w-12 m-1 rounded-sm shrink-0 flex items-center justify-center bg-primary-500 hover:bg-primary-600 transition-colors"
        >
          <Search size={18} color="white" />
        </button>
      </form>
    </search>
  );
}
