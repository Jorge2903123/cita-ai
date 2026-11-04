import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

export type BadgeTone =
  | "neutral"
  | "brand"
  | "success"
  | "warning"
  | "danger"
  | "info";

const TONES: Record<BadgeTone, string> = {
  neutral: "bg-slate-100 text-slate-600 ring-slate-200",
  brand: "bg-gray-100 text-gray-700 ring-gray-200",
  success: "bg-gray-100 text-gray-700 ring-gray-200",
  warning: "bg-gray-50 text-gray-700 ring-gray-300",
  danger: "bg-gray-200 text-gray-900 ring-gray-300",
  info: "bg-gray-50 text-gray-600 ring-gray-200",
};

export interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
  dot?: boolean;
}

export function Badge({
  children,
  tone = "neutral",
  className,
  dot = false,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        TONES[tone],
        className,
      )}
    >
      {dot ? <span className="h-1.5 w-1.5 rounded-full bg-current" /> : null}
      {children}
    </span>
  );
}
