import { ChatGPTMessage, OpenAISettings } from "./openai";
import { Database } from "./supabase";

export interface MessageI extends ChatGPTMessage {
  id: string;
  createdAt: Date;
}

type MessageFromSchema = Database["public"]["Tables"]["messages"]["Row"];

export type ProfileT = Database["public"]["Tables"]["profiles"]["Row"];
export type ChatT = Database["public"]["Tables"]["chats"]["Row"];
export interface MessageT
  extends Omit<MessageFromSchema, "index" | "owner" | "embedding" | "pair"> {
  index?: number;
  owner?: string;
  embedding?: string;
  pair?: string;
}
export interface ChatWithMessageCountAndSettings
  extends Omit<ChatT, "advanced_settings" | "model" | "history_type">,
    Omit<OpenAISettings, "system_prompt"> {
  messages: [{ count: number }];
  advanced_settings: OpenAISettings["advanced_settings"];
  history_type: "chat" | "global";
}
