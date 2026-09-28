import clsx from "clsx";
import type { InputHTMLAttributes } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function FormField({
  label,
  error,
  id,
  className,
  ...props
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-bold">
          {label}
        </label>
      )}
      <input
        id={id}
        className={clsx(
          "rounded-md border py-2 px-4 outline-none transition-colors bg-white",
          error
            ? "border-red-400 focus:border-red-500"
            : "border-stone-200 focus:border-primary-500",
          className,
        )}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
