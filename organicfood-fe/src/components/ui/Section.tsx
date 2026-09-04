import type { PropsWithChildren } from "react";

type SectionProps = PropsWithChildren<{
  className?: string;
  title?: string;
}>;

export default function Section({
  children,
  className = "",
  title,
}: SectionProps) {
  return (
    <section className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
      {title && (
        <div className="border-b border-neutral-200 pb-2 mb-4">
          <h2 className="text-2xl font-bold text-primary-500">{title}</h2>
        </div>
      )}
      {children}
    </section>
  );
}
