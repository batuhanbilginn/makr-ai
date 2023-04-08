"use client";
import { mobileMenuAtom } from "@/atoms/navigation";
import useChats from "@/hooks/useChats";
import { useAtom } from "jotai";
import { Plus } from "lucide-react";
import Logo from "../brand/logo";
import Chats from "../chat/chats";
import { Button } from "../ui/button";
import ProfileMenu from "./profile-menu";

const Sidebar = () => {
  const [isMobileMenuOpen, showMobileMenu] = useAtom(mobileMenuAtom);
  const { addChatHandler } = useChats();

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 w-64 px-4 py-8 transition-transform -translate-x-full shadow-md md:translate-x-0 dark:border-neutral-800 border-neutral-200 bg-white dark:bg-neutral-950 dark:text-neutral-50 ${
        isMobileMenuOpen ? " !translate-x-0" : " "
      }`}
    >
      <div className="flex flex-col flex-1 h-full max-w-full">
        {/* Header */}
        <div>
          <Logo className="max-w-[70px]" />
          {/* New Chat Button */}
          <Button
            onClick={() => {
              addChatHandler();
              showMobileMenu(false);
            }}
            variant="subtle"
            className="flex-shrink-0 w-full mt-8 sm:mt-16"
          >
            New Chat <Plus size="16" />
          </Button>
        </div>
        <Chats />
        {/* Footer */}
        <div className="flex-1 mt-10">
          <ProfileMenu />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
