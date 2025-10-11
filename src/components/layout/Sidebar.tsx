import {
  Home,
  Users,
  CalendarCheck,
  ChevronRight,
  ChevronDown,
  User,
} from "lucide-react";
import React, { JSX, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "../../utils/cn";

type SidebarProps = {
  collapsed: boolean;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
};

// ✅ Union type for menu items
type MenuItem =
  | {
      label: string;
      icon: JSX.Element;
      children: { label: string; key: string; onClick: () => void }[];
      onClick?: never;
    }
  | {
      label: string;
      icon: JSX.Element;
      onClick: () => void;
      children?: never;
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

  // ✅ Define sidebar menu items
  const menus: MenuItem[] = [
    {
      label: "Dashboard",
      icon: <Home size={22} />,
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
      label: "Member",
      icon: <Users size={22} />,
      children: [
        {
          label: "Member List",
          key: "member-list",
          onClick: () => navigate("/member-list"),
        },
      ],
    },
    {
      label: "Patient",
      icon: <User size={22} />,
      children: [
        {
          label: "Patient Register",
          key: "patient-register",
          onClick: () => navigate("/patient-register"),
        },
      ],
    },
    // {
    //   label: "Appointments",
    //   icon: <CalendarCheck size={22} />,
    //   onClick: () => navigate("/appointments"),
    // },
  ];

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  // ✅ Automatically open dropdown if route matches a child item
  useEffect(() => {
    menus.forEach((menu) => {
      if (
        menu.children &&
        menu.children.some((child) =>
          location.pathname.includes(`/${child.key}`)
        )
      ) {
        setOpenDropdown(menu.label);
      }
    });
  }, [location.pathname]);

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
          "fixed top-[130px] bottom-0 z-40 bg-cyan-600 text-white transition-all duration-300 overflow-y-auto shadow-md",
          collapsed ? "w-16" : "w-64",
          mobileOpen ? "left-0" : "-left-full",
          "md:left-0"
        )}
      >
        <nav className="flex flex-col pt-4 space-y-2 relative text-[15px] font-medium">
          {menus.map((menu, idx) => {
            const hasChildren = !!menu.children;
            const isOpen = openDropdown === menu.label;

            // ✅ Determine if menu or its child is active
            const isActive =
              (location.pathname === "/" && menu.label === "Dashboard") ||
              (menu.children &&
                menu.children.some((child) =>
                  location.pathname.includes(`/${child.key}`)
                )) ||
              (!menu.children &&
                location.pathname ===
                  `/${menu.label.toLowerCase().replace(" ", "-")}`);

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
                      (menu as any).onClick?.();
                    } else if (!collapsed) {
                      setOpenDropdown(isOpen ? null : menu.label);
                    }
                  }}
                  className={cn(
                    "flex items-center w-full px-4 py-2 rounded-md transition-colors duration-200",
                    isActive
                      ? "bg-cyan-800 shadow-inner"
                      : "hover:bg-cyan-700 hover:shadow-sm"
                  )}
                >
                  <span>{menu.icon}</span>
                  {!collapsed && (
                    <span className="ml-3 flex-1 text-left text-[16px] tracking-wide">
                      {menu.label}
                    </span>
                  )}
                  {!collapsed && hasChildren && (
                    <>
                      {isOpen ? (
                        <ChevronDown className="ml-auto w-5 h-5" />
                      ) : (
                        <ChevronRight className="ml-auto w-5 h-5" />
                      )}
                    </>
                  )}
                </button>

                {/* Expanded dropdown */}
                {!collapsed && hasChildren && isOpen && (
                  <div className="pl-8 mt-1 space-y-1">
                    {menu.children.map((child, idx) => {
                      const isChildActive = location.pathname.includes(
                        `/${child.key}`
                      );
                      return (
                        <button
                          key={idx}
                          onClick={child.onClick}
                          className={cn(
                            "block w-full text-left px-3 py-1.5 rounded-md text-[15px] transition-all",
                            isChildActive
                              ? "bg-cyan-800 text-white font-semibold"
                              : "hover:bg-cyan-700 hover:text-white"
                          )}
                        >
                          {child.label}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Collapsed hover popup */}
                {collapsed && hovered === menu.label && hasChildren && (
                  <div className="absolute left-full top-0 bg-cyan-700 text-white rounded-lg shadow-lg z-50 min-w-[180px] ml-1">
                    {menu.children.map((child, idx) => {
                      const isChildActive = location.pathname.includes(
                        `/${child.key}`
                      );
                      return (
                        <button
                          key={idx}
                          onClick={child.onClick}
                          className={cn(
                            "block w-full text-left px-4 py-2 text-[15px] rounded-md",
                            isChildActive
                              ? "bg-cyan-800 text-white"
                              : "hover:bg-cyan-600"
                          )}
                        >
                          {child.label}
                        </button>
                      );
                    })}
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
