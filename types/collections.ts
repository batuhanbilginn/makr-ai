import { ChatGPTMessage } from "./openai";
import { Database } from "./supabase";

export interface MessageI extends ChatGPTMessage {
  id: string;
  createdAt: Date;
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
