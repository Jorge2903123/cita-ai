import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./partials/Navbar";
import { Sidebar } from "./partials/Sidebar";

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-72">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
