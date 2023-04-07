"use client";
import { mobileMenuAtom } from "@/atoms/navigation";
import { useSetAtom } from "jotai";
import { Menu } from "lucide-react";
import { Button } from "../ui/button";

const MobileMenuButton = () => {
  const showMobileMenu = useSetAtom(mobileMenuAtom);
  return (
    <div className="sticky top-0 w-full px-4 py-4 sm:px-8 md:hidden">
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
