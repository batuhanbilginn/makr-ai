"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

const Sidelink = ({
  children,
  title,
  href,
  active,
}: {
  children: React.ReactNode;
  title: string;
  href: string;
  active: boolean;
}) => {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger>
          <Link className={`${!active && "text-tertiaryWhite"}`} href={href}>
            {children}
          </Link>
        </TooltipTrigger>
        <TooltipContent className="ml-2" side="right">
          <p>{title}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default Sidelink;
