"use client";
import { openAPIKeyHandlerAtom } from "@/atoms/chat";
import { useAuth } from "@/lib/supabase/supabase-auth-provider";
import { useSetAtom } from "jotai";
import { LogOut, RefreshCcw } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const ProfileMenu = () => {
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const apiKeyHandler = useSetAtom(openAPIKeyHandlerAtom);
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center w-full gap-3">
        <Avatar>
          <AvatarImage src={user?.avatar_url ?? ""} />

          <AvatarFallback>
            {user?.full_name?.slice(0, 2).toLocaleUpperCase() ?? "UU"}
          </AvatarFallback>
        </Avatar>
        <div className="text-left whitespace-nowrap">
          <div>{user?.full_name}</div>
          <div className="text-xs dark:text-neutral-400">@makrdev</div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full mb-2" side="top" align="start">
        <DropdownMenuLabel>
          Created by{" "}
          <Link href="https://www.twitter.com/makrdev">@makrdev</Link>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <div className="flex items-center gap-1">
            Prompts Library{" "}
            <span className="px-2 py-1 text-xs rounded-md bg-neutral-100 dark:bg-neutral-600 dark:text-neutral-200">
              Soon
            </span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <div className="flex items-center gap-1">
            Collections{" "}
            <span className="px-2 py-1 text-xs rounded-md bg-neutral-100 dark:bg-neutral-600 dark:text-neutral-200">
              Soon
            </span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <div className="flex items-center gap-1">
            Plugins{" "}
            <span className="px-2 py-1 text-xs rounded-md bg-neutral-100 dark:bg-neutral-600 dark:text-neutral-200">
              Soon
            </span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setTheme(theme === "dark" ? "light" : "dark");
          }}
        >
          Change Theme
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            apiKeyHandler({
              action: "remove",
            });
            router.push("/chat");
          }}
        >
          <div className="flex items-center gap-2">
            <RefreshCcw size="14" /> Reset API Key
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut}>
          <div className="flex items-center gap-2">
            <LogOut size="14" /> Log Out
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileMenu;
