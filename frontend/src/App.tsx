import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { TenantProvider } from "@/context/TenantContext";
import { AppRouter } from "@/router/AppRouter";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TenantProvider>
          <AppRouter />
        </TenantProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
