import { Compass, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";

export function NotFoundView() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white">
          <Compass className="h-7 w-7" />
        </div>
        <p className="mt-5 text-sm font-semibold uppercase tracking-widest text-gray-500">
          Error 404
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">
          Esta página no existe
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
          La ruta que buscas no está habilitada para este negocio o fue movida.
        </p>
        <Button
          className="mt-6"
          leftIcon={<Home className="h-4 w-4" />}
          onClick={() => navigate("/")}
        >
          Volver al inicio
        </Button>
      </div>
    </div>
  );
}
