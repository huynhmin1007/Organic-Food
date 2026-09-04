import { type ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  loading?: boolean;
};

export default function Button({
  variant = "solid",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        // Base – luôn có
        "inline-flex items-center justify-center gap-2 font-medium rounded-md transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1",
        "disabled:opacity-50 disabled:cursor-not-allowed",

        // Variant
        variant === "solid" && [
          "bg-primary-500 text-white",
          "hover:bg-primary-600 active:bg-primary-700",
        ],
        variant === "outline" && [
          "border border-primary-500 text-primary-500 bg-transparent",
          "hover:bg-primary-50 active:bg-primary-100",
        ],
        variant === "ghost" && [
          "text-primary-500 bg-transparent",
          "hover:bg-primary-50 active:bg-primary-100",
        ],

        // Size
        size === "sm" && "text-xs px-3 py-1.5",
        size === "md" && "text-sm px-4 py-2",
        size === "lg" && "text-base px-6 py-3",

        // Full width
        fullWidth && "w-full",

        className,
      )}
      {...rest}
    >
      {/* Loading spinner */}
      {loading && (
        <svg
          className="animate-spin h-4 w-4 flex-shrink-0"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
