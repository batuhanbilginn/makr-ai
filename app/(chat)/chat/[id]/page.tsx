import Chatbox from "@/components/chat/chatbox";
import { createClient } from "@/lib/supabase/supabase-server";
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
    .eq("chat", id);
  return (
    <Chatbox chatID={id} initialMessages={messages ?? []} type="EXISTING" />
  );
};

export default ChatPage;
