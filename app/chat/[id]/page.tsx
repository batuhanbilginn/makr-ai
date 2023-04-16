import Chatbox from "@/components/chat/chatbox";
import { createClient } from "@/lib/supabase/supabase-server";
import { ChatWithMessageCountAndSettings, MessageT } from "@/types/collections";
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
    .order("created_at", { ascending: true })
    .order("role", { ascending: false })
    .returns<MessageT[]>();

  // Check if the chat exists, if not, return 404
  const { data: currentChat } = await supabase
    .from("chats")
    .select("*, messages(count)")
    .eq("id", id)
    .single();
  if (!currentChat) {
    notFound();
  }
  const parsedCurrentChat = {
    ...currentChat,
    advanced_settings: JSON.parse(currentChat.advanced_settings as string),
  } as ChatWithMessageCountAndSettings;

  return (
    <Chatbox currentChat={parsedCurrentChat} initialMessages={messages ?? []} />
  );
};

export default ChatPage;
