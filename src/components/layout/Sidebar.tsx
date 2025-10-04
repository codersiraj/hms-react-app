import {
  Home,
  CalendarCheck,
  Users,
  BarChart2,
  FileBadge,
  MessageSquare,
  FilePlus2,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "../../utils/cn";

type SidebarProps = {
  collapsed: boolean;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
};

export default function Sidebar({
  collapsed,
  mobileOpen,
  setMobileOpen,
}: SidebarProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const menus = [
    {
      label: "Dashboard",
      icon: <Home size={20} />,
      children: [
        {
          label: "Patient Dashboard",
          key: "patient-dashboard",
          onClick: () => navigate("/patient-dashboard"),
        },
        {
          label: "Doctor Dashboard",
          key: "doctor-dashboard",
          onClick: () => navigate("/doctor-dashboard"),
        },
      ],
    },
    {
      label: "Appointments",
      icon: <CalendarCheck size={20} />,
      onClick: () => navigate("/appointments"),
    },
    {
      label: "Queue",
      icon: <Users size={20} />,
      onClick: () => navigate("/queue"),
    },
    {
      label: "Reports",
      icon: <BarChart2 size={20} />,
      onClick: () => navigate("/reports"),
    },
    {
      label: "Certificates",
      icon: <FileBadge size={20} />,
      onClick: () => navigate("/certificates"),
    },
    {
      label: "Chat",
      icon: <MessageSquare size={20} />,
      onClick: () => navigate("/chat"),
    },
    {
      label: "Post",
      icon: <FilePlus2 size={20} />,
      onClick: () => navigate("/post"),
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
          "fixed top-[130px] bottom-0 z-40 bg-[#003366] text-white transition-all duration-300 overflow-y-auto",
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
                    location.pathname.includes(menu.label.toLowerCase()) ? "bg-[#00575d]" : ""
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
                        className={cn(
                          "block w-full text-left px-2 py-1.5 hover:bg-[#00575d] rounded",
                          location.pathname.includes(child.key) ? "bg-[#00575d]" : ""
                        )}
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
                        className={cn(
                          "block w-full text-left px-4 py-2 hover:bg-[#00575d]",
                          location.pathname.includes(child.key) ? "bg-[#00575d]" : ""
                        )}
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
