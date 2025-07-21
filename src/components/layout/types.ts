// types.ts

export interface HeaderProps {
  onMenuClick: () => void;
  onSettingsClick?: () => void; // Optional if needed
}

// types.ts (or wherever SidebarProps is defined)

export type TabKey = "patient" | "doctor"; // Remove "menu3a" if not needed

type SidebarProps = {
  activeTab: "patient" | "doctor";
  setActiveTab: (tab: "patient" | "doctor") => void;
  collapsed: boolean;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
};
