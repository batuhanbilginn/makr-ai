"use client";

import { ThemeProvider } from "next-themes";

export function ThemeProviderClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="data-theme" enableSystem>
      {children}
    </ThemeProvider>
  );
}
