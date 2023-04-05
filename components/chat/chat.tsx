import { ChatT } from "@/types/collections";
import { MessageSquare } from "lucide-react";
import { DateTime } from "luxon";
import Link from "next/link";

const Chat = ({ chat }: { chat: ChatT }) => {
  return (
    <Link title={chat.title as string} href={`/chat/${chat.id}`}>
      <div className="flex items-center w-full gap-2 px-3 py-2 transition-colors duration-100 ease-in-out rounded-md bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800">
        <MessageSquare className="shrink-0" size="16" />
        <div className="text-sm leading-loose line-clamp-1">{chat.title}</div>
      </div>
      {/* Meta */}
      <div className="flex items-center mt-1 dark:text-neutral-600">
        <div className="text-xs">
          {DateTime.fromISO(chat.created_at as string).toRelativeCalendar()}
        </div>
        <div className="w-1 h-1 mx-2 rounded-full dark:bg-neutral-700" />
        <div className="text-xs">3 Messages</div>
      </div>
    </Link>
  );
};

export default Chat;
