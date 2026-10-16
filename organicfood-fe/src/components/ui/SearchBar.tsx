import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Product } from "../../types/product";
import { getProducts } from "../../services/productService";
import axios from "axios";
import ProductGridV2 from "../ProductGridV2";

const STORAGE_KEY = "recent_searches";
const MAX_HISTORY = 8;

function getSearchHistory(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function saveSearchHistory(keyword: string) {
  const current = getSearchHistory();
  const next = [keyword, ...current.filter((k) => k !== keyword)].slice(
    0,
    MAX_HISTORY,
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

function removeFromHistory(keyword: string) {
  const next = getSearchHistory().filter((k) => k !== keyword);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export default function SearchBar({ className = "" }: { className?: string }) {
  const [keyword, setKeyword] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  useEffect(() => {
    setIsFocused(false);
  }, [location.pathname]);

  useEffect(() => {
    setHistory(getSearchHistory());
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const trimmed = keyword.trim();

    if (!trimmed) {
      setSuggestedProducts([]);
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(() => {
      setIsLoadingSuggestions(true);

      getProducts(
        {
          keywords: [trimmed],
          size: 5,
        },
        controller.signal,
      )
        .then((res) => {
          setSuggestedProducts(res.content);
        })
        .catch((err) => {
          if (!axios.isCancel(err)) {
            setSuggestedProducts([]);
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) {
            setIsLoadingSuggestions(false);
          }
        });
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [keyword]);

  function handleFocus() {
    setIsFocused(true);

    const currentHistory = getSearchHistory();
    if (currentHistory.length === 0) {
      setSuggestedProducts([]);
      return;
    }

    const controller = new AbortController();
    setIsLoadingSuggestions(true);

    getProducts({ keywords: currentHistory, size: 5 }, controller.signal)
      .then((res) => setSuggestedProducts(res.content))
      .catch((err) => {
        if (!axios.isCancel(err)) setSuggestedProducts([]);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoadingSuggestions(false);
      });

    focusRequestRef.current = controller;
  }

  const focusRequestRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!isFocused && focusRequestRef.current) {
      focusRequestRef.current.abort();
      focusRequestRef.current = null;
    }
  }, [isFocused]);

  function submitSearch(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return;

    saveSearchHistory(trimmed);
    setHistory(getSearchHistory());
    setIsFocused(false);
    navigate(`/products?keyword=${encodeURIComponent(trimmed)}`);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    submitSearch(keyword);
  }

  function handleSuggestionClick(value: string) {
    setKeyword(value);
    submitSearch(value);
  }

  function handleRemoveSuggestion(e: React.MouseEvent, value: string) {
    e.stopPropagation();
    setHistory(removeFromHistory(value));
  }

  const showDropdown =
    isFocused &&
    (history.length > 0 ||
      isLoadingSuggestions ||
      suggestedProducts.length > 0);

  return (
    <search
      ref={wrapperRef}
      className={`relative flex-1 max-w-md ${className}`}
    >
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
          onFocus={handleFocus}
          placeholder="Tìm kiếm sản phẩm..."
          className="flex-1 px-4 text-sm text-stone-800 outline-none [&::-webkit-search-cancel-button]:hidden"
          autoComplete="off"
        />
        <button
          type="submit"
          aria-label="Tìm kiếm"
          className="cursor-pointer w-12 m-1 rounded-sm shrink-0 flex items-center justify-center bg-primary-500 hover:bg-primary-600 transition-colors"
        >
          <Search size={18} color="white" />
        </button>
      </form>

      {showDropdown && (
        <div className="absolute bg-white top-full left-0 right-0 mt-1 rounded-md shadow-lg border border-stone-100 z-50 py-2">
          <div className="divide-stone-100 divide-y">
            {history.map((item) => (
              <div
                key={item}
                onClick={() => handleSuggestionClick(item)}
                className="flex items-center justify-between px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 cursor-pointer"
              >
                <span>{item}</span>
                <button
                  onClick={(e) => handleRemoveSuggestion(e, item)}
                  aria-label={`Xoá "${item}"`}
                  className="text-stone-300 hover:text-stone-500 cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>

          {isLoadingSuggestions && (
            <p className="px-4 py-3 text-sm text-stone-400">
              Đang tìm sản phẩm liên quan...
            </p>
          )}

          {!isLoadingSuggestions && suggestedProducts.length > 0 && (
            <div className="pt-3 border-t border-stone-100">
              <div className="px-4">
                <p className="py-1 text-base font-semibold">
                  Sản phẩm có thể bạn quan tâm
                </p>
                <ProductGridV2
                  columns={3}
                  rows={1}
                  products={suggestedProducts}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </search>
  );
}
