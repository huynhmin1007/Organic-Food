import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";

const spinnerStyles = cva(
  "animate-spin rounded-full border-solid border-current border-t-transparent",
  {
    variants: {
      size: {
        sm: "h-4 w-4 border-2",
        md: "h-6 w-6 border-2",
        lg: "h-10 w-10 border-[3px]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

interface SpinnerProps extends VariantProps<typeof spinnerStyles> {
  className?: string;
  text?: string;
}

export default function Spinner({
  size,
  className,
  text = "Đang tải",
}: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label={text}
      className={clsx("flex flex-col items-center justify-center")}
    >
      <div
        aria-hidden="true"
        className={clsx(
          spinnerStyles({ size }),
          className ?? "text-primary-500",
        )}
      />

      {text && (
        <span className="mt-2 text-base italic text-stone-500">
          {text}
          <span
            className="inline-block w-5 text-left animate-loading-dots"
            aria-hidden="true"
          />
        </span>
      )}
    </div>
  );
}
