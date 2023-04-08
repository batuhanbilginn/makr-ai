"use client";

import { mobileMenuAtom } from "@/atoms/navigation";
import { useAtom } from "jotai";

const SiderbarOverlay = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useAtom(mobileMenuAtom);
  return (
    <div
      onClick={() => setIsMobileMenuOpen(false)}
      className={`fixed inset-0 z-30 md:hidden transition-transform dark:bg-neutral-950/60 bg-white/60 duration-75 ${
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    />
  );
};

export default SiderbarOverlay;
