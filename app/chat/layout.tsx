import Sidebar from "@/components/navigation/sidebar";
import SiderbarOverlay from "@/components/navigation/sidebar-overlay";
import React from "react";

const ChatLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex w-full h-full overflow-hidden">
      <SiderbarOverlay />
      <Sidebar />
      {children}
    </div>
  );
};

export default ChatLayout;
