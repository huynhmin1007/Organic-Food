// src/components/ui/Button.tsx
import { Link } from "react-router-dom";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import Spinner from "./Spinner";

const buttonStyles = cva(
  "inline-flex items-center justify-center gap-2 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary:
          "bg-primary-500 text-white border border-transparent hover:bg-primary-700",

        outline:
          "bg-white text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white",

        ghost:
          "bg-transparent text-stone-700 border border-transparent hover:bg-stone-100",

        danger:
          "bg-red-600 text-white border border-transparent hover:bg-red-700",
      },
      size: {
        sm: "text-sm px-3 py-1.5",
        md: "text-sm px-5 py-2.5",
        lg: "text-base px-6 py-3",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

interface ButtonBaseProps extends VariantProps<typeof buttonStyles> {
  children: ReactNode;
  className?: string;
  isLoading?: boolean;
  to?: string;
}

type ButtonProps = ButtonBaseProps & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  children,
  variant,
  size,
  className,
  isLoading = false,
  to,
  disabled,
  ...props
}: ButtonProps) {
  const classes = clsx(
    buttonStyles({ variant, size }),
    className,
    "cursor-pointer",
  );

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} disabled={disabled || isLoading} {...props}>
      {isLoading && <Spinner size="sm" className="text-current" />}
      {children}
    </button>
  );
}
