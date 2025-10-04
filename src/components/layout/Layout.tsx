// src/components/layout/Layout.tsx
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../layout/Sidebar";
import Header from "../layout/Header";
import LogoHeader from "./LogoHeader";
import PatientDetailsDashboard from "../../pages/PatientDetailsDashboard";

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    text: string;
    color: "green" | "red";
  } | null>(null);

  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
      setMobileOpen((prev) => !prev);
    } else {
      setCollapsed((prev) => !prev);
    }
  };

  const logoHeaderHeight = 60;
  const topHeaderHeight = 64;
  const totalFixedHeader = logoHeaderHeight + topHeaderHeight;
  const sidebarWidth = collapsed ? 64 : 256;

  useEffect(() => {
    const listener = () => toggleSidebar();
    window.addEventListener("toggleSidebar", listener);
    return () => window.removeEventListener("toggleSidebar", listener);
  }, []);

  return (
    <div className="h-screen w-screen bg-[#ebf0f4] overflow-hidden">
      {/* Top Headers */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <LogoHeader />
        <Header onMenuClick={toggleSidebar} setStatusMessage={setStatusMessage} />
      </div>

      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content */}
      <main
        className="transition-all duration-300 overflow-y-auto"
        style={{
          marginLeft: window.innerWidth >= 768 ? `${sidebarWidth}px` : "0px",
          marginTop: `${totalFixedHeader}px`,
          padding: "16px",
          height: `calc(100vh - ${totalFixedHeader}px)`,
          boxSizing: "border-box",
        }}
      >
        <div className="min-h-full">
          {statusMessage ? (
            <PatientDetailsDashboard statusMessage={statusMessage} />
          ) : (
            <Outlet />
          )}
        </div>
      </main>
    </div>
  );
}
