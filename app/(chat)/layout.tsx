import Sidebar from "@/components/navigation/sidebar";
import React from "react";

const ChatLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex w-full h-screen max-h-screen overflow-hidden">
      <Sidebar />
      {children}
    </div>
  );
};

export default ChatLayout;
