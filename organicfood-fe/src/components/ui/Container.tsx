import type { PropsWithChildren } from "react";

type ContainerProps = PropsWithChildren<{
  className?: string;
}>;

export default function Container({
  children,
  className = "",
}: ContainerProps) {
  return (
    <section className={`w-full max-w-[1140px] mx-auto ${className}`}>
      {children}
    </section>
  );
}
