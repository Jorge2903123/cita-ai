import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/utils/cn";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  hint?: string;
  error?: string;
  leadingIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input(
    {
      className,
      id,
      label,
      hint,
      error,
      leadingIcon,
      required,
      ...props
    },
    ref,
  ) {
    const autoId = useId();
    const inputId = id ?? autoId;
    const describedBy = error
      ? `${inputId}-error`
      : hint
        ? `${inputId}-hint`
        : undefined;

    return (
      <div className="w-full">
        {label ? (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            {label}
            {required ? <span className="ml-0.5 text-gray-500">*</span> : null}
          </label>
        ) : null}
        <div className="relative">
          {leadingIcon ? (
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
              {leadingIcon}
            </span>
          ) : null}
          <input
            ref={ref}
            id={inputId}
            required={required}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            className={cn(
              "h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400",
              "focus:border-gray-500 focus:ring-2 focus:ring-gray-200",
              "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500",
              Boolean(leadingIcon) && "pl-9",
              error && "border-gray-400 focus:border-gray-500 focus:ring-gray-200",
              className,
            )}
            {...props}
          />
        </div>
        {error ? (
          <p id={`${inputId}-error`} className="mt-1.5 text-xs text-gray-700">
            {error}
          </p>
        ) : hint ? (
          <p id={`${inputId}-hint`} className="mt-1.5 text-xs text-slate-500">
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);
