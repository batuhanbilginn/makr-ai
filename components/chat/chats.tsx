"use client";
import useChats from "@/hooks/useChats";
import Spinner from "../ui/spinner";
import Chat from "./chat";

const Chats = () => {
  const { chats, isLoading } = useChats();
  return (
    <div className="flex flex-col h-full mt-4 overflow-hidden">
      {/* Chats */}
      {chats && chats?.length > 0 && (
        <h3 className="mt-4 text-sm font-medium sm:mt-6 dark:text-neutral-400 text-neutral-600">
          Chats <span className="text-xs">({chats?.length})</span>
        </h3>
      )}
      {chats && !isLoading ? (
        <div className="flex flex-col h-full gap-4 mt-2 overflow-y-auto">
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
