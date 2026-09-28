import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import type { SelectHTMLAttributes } from "react";

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  placeholder: string;
  options: { value: string | number; label: string }[];
  error?: string;
}

export default function SelectField({
  placeholder,
  options,
  error,
  className,
  ...props
}: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="relative">
        <select
          className={clsx(
            "cursor-pointer w-full appearance-none rounded-md border py-3 pl-3 pr-10 outline-none bg-white transition-colors",
            "disabled:bg-stone-100 disabled:text-stone-400 disabled:cursor-not-allowed",
            error
              ? "border-red-400 focus:border-red-500"
              : "border-stone-200 focus:border-primary-500",
            className,
          )}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={18}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"
        />
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
