import clsx from "clsx";

export interface SaleBadeProps {
  text: string;
  className?: string;
}

export default function SaleBadge({ text, className }: SaleBadeProps) {
  return (
    <span
      className={clsx(
        "bg-sale text-white text-[10px] font-bold px-1.5 py-0.5 rounded",
        className,
      )}
    >
      {text}
    </span>
  );
}
