import { useEffect, useState } from "react";
import Sidebar from "../layout/Sidebar";
import Header from "../layout/Header";
import LogoHeader from "./LogoHeader";
import { cn } from "../../utils/cn";
import PatientDetailsDashboard from "../../pages/PatientDetailsDashboard";

export default function Layout({
  children,
}: {
  children: (activeTab: "patient" | "doctor") => React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState<"patient" | "doctor">("patient");
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

  const handleSettingsClick = () => {
    console.log("Settings clicked");
  };

  useEffect(() => {
    const listener = () => toggleSidebar();
    window.addEventListener("toggleSidebar", listener);
    return () => window.removeEventListener("toggleSidebar", listener);
  }, []);

  const logoHeaderHeight = 60;
  const topHeaderHeight = 64;
  const totalFixedHeader = logoHeaderHeight + topHeaderHeight;
  const sidebarWidth = collapsed ? 64 : 256;

  return (
    <div className="h-screen w-screen bg-[#ebf0f4] overflow-hidden">
      {/* 🔹 Fixed Top Headers */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <LogoHeader />
        <Header
          onMenuClick={toggleSidebar}
          setStatusMessage={setStatusMessage}
        />
      </div>

      {/* 🔹 Fixed Sidebar - always shown in desktop view */}
      <div
        className={cn(
          "fixed top-[124px] left-0 bottom-0 z-40 transition-all duration-300",
          collapsed ? "w-16" : "w-64",
          "hidden md:block" // always show on desktop, hide on mobile
        )}
      >
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />
      </div>

      {/* 🔹 Main Content Scroll Area */}
      <main
        className="transition-all duration-300 overflow-y-auto"
        style={{
          marginLeft: window.innerWidth >= 768 && !statusMessage ? `${sidebarWidth}px` : "0px",
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
            children(activeTab)
          )}
        </div>
      </main>
    </div>
  );
}
