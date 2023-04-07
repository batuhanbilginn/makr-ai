import Chatbox from "@/components/chat/chatbox";
import { createClient } from "@/lib/supabase/supabase-server";
import { notFound } from "next/navigation";
export const revalidate = 0;

const ChatPage = async ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  // Get Initial Messages
  const supabase = createClient();
  const id = params.id;
  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .eq("chat", id)
    .order("created_at", { ascending: true });

  // Check if the chat exists, if not, return 404
  const { data: chat } = await supabase
    .from("chats")
    .select("*")
    .eq("id", id)
    .single();
  if (!chat) {
    notFound();
  }
  return <Chatbox chatID={id} initialMessages={messages ?? []} />;
};

export default ChatPage;
