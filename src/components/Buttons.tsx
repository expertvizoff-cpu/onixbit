import Link from "next/link";
import { ArrowRight } from "lucide-react";

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

export function LeadButton({
  children,
  variant = "primary",
  className = "",
}: Omit<ButtonProps, "href">) {
  return (
    <a
      className={`ob-btn ob-btn--${variant} ${className}`}
      href="#lead"
      data-obx-lead-open
    >
      <span>{children}</span>
      <ArrowRight size={18} aria-hidden="true" />
    </a>
  );
}

export function ButtonLink({
  children,
  href = "#",
  variant = "secondary",
  className = "",
}: ButtonProps) {
  return (
    <Link className={`ob-btn ob-btn--${variant} ${className}`} href={href}>
      <span>{children}</span>
      <ArrowRight size={18} aria-hidden="true" />
    </Link>
  );
}
