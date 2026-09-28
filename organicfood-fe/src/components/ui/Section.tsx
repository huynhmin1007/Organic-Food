import clsx from "clsx";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface SectionProps {
  title?: string;
  to?: string;
  className?: string;
  children?: ReactNode;
}

export default function Section({
  title,
  to,
  className,
  children,
}: SectionProps) {
  return (
    <div className={clsx("flex flex-col bg-white rounded-md p-3", className)}>
      {title && (
        <h2 className="font-semibold text-primary-500 text-[22px] border-b border-stone-200 pb-3 mb-3 cursor-pointer">
          {to ? (
            <Link to={to} className="hover:text-primary-700 ">
              {title}
            </Link>
          ) : (
            title
          )}
        </h2>
      )}

      {children}
    </div>
  );
}
