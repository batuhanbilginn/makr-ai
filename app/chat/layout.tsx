import Sidebar from "@/components/navigation/sidebar";
import SiderbarOverlay from "@/components/navigation/sidebar-overlay";
import OpenAIServerKeyProvider from "@/components/providers/openai-serverkey-provider";
import React from "react";

const ChatLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <OpenAIServerKeyProvider>
      <div className="relative flex w-full h-full overflow-hidden">
        <SiderbarOverlay />
        <Sidebar />
        {children}
      </div>
    </OpenAIServerKeyProvider>
  );
};

export default ChatLayout;
