"use client";
import { mobileMenuAtom } from "@/atoms/navigation";
import { useAtomValue } from "jotai";
import Logo from "../brand/logo";
import Chats from "../chat/chats";
import ProfileMenu from "./profile-menu";

const Sidebar = () => {
  const isMobileMenuOpen = useAtomValue(mobileMenuAtom);
  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 w-64 px-4 py-8 transition-transform -translate-x-full shadow-md md:translate-x-0 dark:border-neutral-800 border-neutral-200 bg-white dark:bg-neutral-950 dark:text-neutral-50 ${
        isMobileMenuOpen ? " !translate-x-0" : " "
      }`}
    >
      <div className="flex flex-col justify-between h-full">
        <div>
          <Logo className="max-w-[70px]" />
          <Chats />
        </div>
        <ProfileMenu />
      </div>
    </aside>
  );
};

export default Sidebar;
