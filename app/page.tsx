import Chatbox from "@/components/chat/chatbox";
import Sidebar from "@/components/navigation/sidebar";

export default function Home() {
  return (
    <div className="flex w-full h-screen max-h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />
      {/* Chatbox */}
      <Chatbox />
    </div>
  );
}
