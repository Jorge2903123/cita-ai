import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Algo salió mal",
  message = "No pudimos cargar la información. Intenta de nuevo en unos segundos.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-base font-semibold text-slate-900">{title}</h2>
        <p className="mt-1.5 text-sm text-slate-500">{message}</p>
        {onRetry ? (
          <Button
            className="mt-5"
            variant="outline"
            leftIcon={<RefreshCcw className="h-4 w-4" />}
            onClick={onRetry}
          >
            Reintentar
          </Button>
        ) : null}
      </div>
    </div>
  );
}
