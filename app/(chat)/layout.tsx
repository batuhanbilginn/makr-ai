"use client";
import { mobileMenuAtom } from "@/atoms/navigation";
import Sidebar from "@/components/navigation/sidebar";
import { useAtom } from "jotai";
import React from "react";

const ChatLayout = ({ children }: { children: React.ReactNode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useAtom(mobileMenuAtom);
  return (
    <div className="relative flex w-full h-screen max-h-screen overflow-hidden">
      {/* Overlay When Mobile Menu Open */}
      <div
        onClick={() => setIsMobileMenuOpen(false)}
        className={`fixed inset-0 z-30 md:hidden transition-transform dark:bg-neutral-950/60 bg-white/60 duration-75 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      />
      <Sidebar />
      {children}
    </div>
  );
};

export default ChatLayout;
