import ChatInput from "@/components/chat/chat-input";
import NewChat from "@/components/chat/new-chat";
import MobileMenuButton from "@/components/navigation/mobile-menu-button";

export default function Home() {
  return (
    <main className="relative flex flex-col items-stretch flex-1 w-full h-full ml-0 overflow-hidden transition-all transition-width md:ml-64 dark:bg-neutral-900 bg-neutral-50">
      <div className="flex-1 overflow-hidden">
        <MobileMenuButton />
        <NewChat />
        <ChatInput />
      </div>
    </main>
  );
}
