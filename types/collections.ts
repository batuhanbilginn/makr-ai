import { ChatGPTMessage, OpenAISettings } from "./openai";
import { Database } from "./supabase";

export interface MessageI extends ChatGPTMessage {
  id: string;
  createdAt: Date;
}

export type ProfileT = Database["public"]["Tables"]["profiles"]["Row"];
export type ChatT = Database["public"]["Tables"]["chats"]["Row"];
export type MessageT = Database["public"]["Tables"]["messages"]["Row"];
export interface ChatWithMessageCountAndSettings
  extends Omit<ChatT, "advanced_settings">,
    Omit<OpenAISettings, "model" | "system_prompt"> {
  messages: [{ count: number }];
  advanced_settings: OpenAISettings["advanced_settings"];
}
