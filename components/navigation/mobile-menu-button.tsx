"use client";
import { mobileMenuAtom } from "@/atoms/navigation";
import { useSetAtom } from "jotai";
import { Menu } from "lucide-react";
import { Button } from "../ui/button";

const MobileMenuButton = () => {
  const showMobileMenu = useSetAtom(mobileMenuAtom);
  return (
    <div className="w-full px-8 py-4 md:hidden">
      <Button
        title="Mobile Menu"
        className="-ml-4"
        onClick={() => {
          showMobileMenu((prev) => !prev);
        }}
        variant="ghost"
      >
        <Menu />
      </Button>
    </div>
  );
};

export default MobileMenuButton;
