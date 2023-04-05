"use client";
import useChats from "@/hooks/useChats";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import Spinner from "../ui/spinner";
import Chat from "./chat";

const Chats = () => {
  const { chats, addChatHandler, isLoading } = useChats();
  return (
    <div className="h-full mt-20 ">
      {/* New Chat Button */}
      <Button onClick={addChatHandler} variant="subtle" className="w-full">
        New Chat <Plus size="16" />
      </Button>
      {/* Chats */}
      {chats && chats?.length > 0 && (
        <h3 className="mt-6 text-sm font-medium dark:text-neutral-400">
          Chats <span className="text-xs">({chats?.length})</span>
        </h3>
      )}
      {chats && !isLoading ? (
        <div className="flex flex-col gap-4 mt-2 h-full max-h-[60vh] overflow-y-auto">
          {chats?.map((chat) => (
            <Chat key={chat.id} chat={chat} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center w-full py-10">
          <Spinner variant="default" />
        </div>
      )}
    </div>
  );
};

export default Chats;
