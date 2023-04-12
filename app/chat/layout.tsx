import Sidebar from "@/components/navigation/sidebar";
import SiderbarOverlay from "@/components/navigation/sidebar-overlay";
import OpenAIKeyProvider from "@/components/providers/openai-key-provider";
import React from "react";

const ChatLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <OpenAIKeyProvider>
      <div className="relative flex w-full h-full overflow-hidden">
        <SiderbarOverlay />
        <Sidebar />
        {children}
      </div>
    </OpenAIKeyProvider>
  );
};

export default ChatLayout;
