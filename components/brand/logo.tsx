"use client";
import { useTheme } from "next-themes";
import Image from "next/image";

const Logo = ({ className }: { className?: string }) => {
  const { theme } = useTheme();
  if (theme === "dark") {
    return (
      <Image
        className={className}
        width={296}
        height={77}
        src="/makr-logo-light.svg"
        alt="makr-logo"
      />
    );
  } else {
    return (
      <Image
        className={className}
        width={296}
        height={77}
        src="/makr-logo-dark.svg"
        alt="makr-logo"
      />
    );
  }
};

export default Logo;
