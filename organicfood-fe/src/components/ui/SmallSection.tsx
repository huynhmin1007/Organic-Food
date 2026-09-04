import type { PropsWithChildren } from "react";

type SectionProps = PropsWithChildren<{
  className?: string;
}>;

export default function SmallSection({
  children,
  className = "",
}: SectionProps) {
  return (
    <div className={`bg-white rounded-md py-1 ${className}`}>{children}</div>
  );
}
