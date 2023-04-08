"use client";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

const Logo = ({ className }: { className?: string }) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <>
      <Image
        className={className + " hidden dark:block"}
        width={296}
        height={77}
        src="/makr-logo-light.svg"
        alt="makr-logo"
      />
      <Image
        className={className + " dark:hidden"}
        width={296}
        height={77}
        src="/makr-logo-dark.svg"
        alt="makr-logo"
      />
    </>
  );
};

export default Logo;
