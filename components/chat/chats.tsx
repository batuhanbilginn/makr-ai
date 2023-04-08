"use client";
import { mobileMenuAtom } from "@/atoms/navigation";
import useChats from "@/hooks/useChats";
import { useSetAtom } from "jotai";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import Spinner from "../ui/spinner";
import Chat from "./chat";

const Chats = () => {
  const { chats, addChatHandler, isLoading } = useChats();
  const showMobileMenu = useSetAtom(mobileMenuAtom);
  return (
    <div className="h-full mt-8 sm:mt-20">
      {/* New Chat Button */}
      <Button
        onClick={() => {
          addChatHandler();
          showMobileMenu(false);
        }}
        variant="subtle"
        className="w-full"
      >
        New Chat <Plus size="16" />
      </Button>
      {/* Chats */}
      {chats && chats?.length > 0 && (
        <h3 className="mt-4 text-sm font-medium sm:mt-6 dark:text-neutral-400 text-neutral-600">
          Chats <span className="text-xs">({chats?.length})</span>
        </h3>
      )}
      {chats && !isLoading ? (
        <div className="flex flex-col gap-4 mt-2 overflow-y-auto">
          {chats?.map((chat) => (
            <Chat key={chat.id} chat={chat} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-full py-10">
          <Spinner size="lg" />
        </div>
      )}
    </div>
  );
};

export default Chats;
