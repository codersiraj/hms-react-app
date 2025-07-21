import {
  Home,
  User,
  LayoutGrid,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import React, { useState } from "react";
import { cn } from "../../utils/cn";

type SidebarProps = {
  activeTab: "patient" | "doctor";
  setActiveTab: (tab: "patient" | "doctor") => void;
  collapsed: boolean;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
};

export default function Sidebar({
  activeTab,
  setActiveTab,
  collapsed,
  mobileOpen,
  setMobileOpen,
}: SidebarProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const menus = [
    {
      label: "Dashboard",
      icon: <Home size={20} />,
      children: [
        {
          label: "Patient Dashboard",
          key: "patient",
          onClick: () => setActiveTab("patient"),
        },
        {
          label: "Doctor Dashboard",
          key: "doctor",
          onClick: () => setActiveTab("doctor"),
        },
      ],
    },
    {
      label: "Menu 2",
      icon: <LayoutGrid size={20} />,
      onClick: () => alert("Menu 2 clicked"),
    },
    {
      label: "Menu 3",
      icon: <User size={20} />,
      children: [
        { label: "Option 1", onClick: () => alert("Option 1 clicked") },
        { label: "Option 2", onClick: () => alert("Option 2 clicked") },
      ],
    },
  ];

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <>
      {/* Overlay for mobile view */}
      {mobileOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed top-[140px] bottom-0 z-40 bg-[#003366] text-white transition-all duration-300 overflow-y-auto",
          collapsed ? "w-16" : "w-64",
          mobileOpen ? "left-0" : "-left-full",
          "md:left-0"
        )}
      >


        <nav className="flex flex-col pt-4 space-y-2 relative">
          {menus.map((menu, idx) => {
            const hasChildren = !!menu.children;
            const isOpen = openDropdown === menu.label;

            return (
              <div
                key={idx}
                className="relative group"
                onMouseEnter={() => collapsed && setHovered(menu.label)}
                onMouseLeave={() => collapsed && setHovered(null)}
              >
                <button
                  onClick={() => {
                    if (!hasChildren) {
                      menu.onClick?.();
                    } else {
                      if (!collapsed) {
                        setOpenDropdown(isOpen ? null : menu.label);
                      }
                    }
                  }}
                  className={cn(
                    "flex items-center w-full px-4 py-2 hover:bg-[#00575d] transition-colors",
                    activeTab === menu.label ? "bg-[#00575d]" : ""
                  )}
                >
                  <span>{menu.icon}</span>
                  {!collapsed && (
                    <span className="ml-3 flex-1 text-left">{menu.label}</span>
                  )}
                  {!collapsed && hasChildren && (
                    <>
                      {isOpen ? (
                        <ChevronDown className="ml-auto w-4 h-4" />
                      ) : (
                        <ChevronRight className="ml-auto w-4 h-4" />
                      )}
                    </>
                  )}
                </button>

                {/* Expanded mode dropdown */}
                {!collapsed && hasChildren && isOpen && (
                  <div className="pl-8">
                    {menu.children.map((child, idx) => (
                      <button
                        key={idx}
                        onClick={child.onClick}
                        className="block w-full text-left px-2 py-1.5 hover:bg-[#00575d] rounded"
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Collapsed mode hover popup */}
                {collapsed && hovered === menu.label && hasChildren && (
                  <div className="absolute left-full top-0 bg-[#003366] text-white rounded shadow-lg z-50 min-w-[180px] ml-1">
                    {menu.children.map((child, idx) => (
                      <button
                        key={idx}
                        onClick={child.onClick}
                        className="block w-full text-left px-4 py-2 hover:bg-[#00575d]"
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
