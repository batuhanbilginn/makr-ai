import { ChatGPTMessage } from "./openai";
import { Database } from "./supabase";

export interface MessageI extends ChatGPTMessage {
  id: string;
  createdAt: Date;
}

export type ProfileT = Database["public"]["Tables"]["profiles"]["Row"];
export type ChatT = Database["public"]["Tables"]["chats"]["Row"];
export type MessageT = Database["public"]["Tables"]["messages"]["Row"];
