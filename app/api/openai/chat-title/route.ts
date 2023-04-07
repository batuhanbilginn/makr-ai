import openai from "@/lib/openai";
import { createClient } from "@/lib/supabase/supabase-server";
import { ChatGPTMessage } from "@/types/openai";
import { NextResponse } from "next/server";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export async function POST(req: Request): Promise<Response> {
  const { messages, chatID } = await req.json();

  if (!messages) {
    return new Response("No messages!", { status: 400 });
  }

  // Create Supabase Server Client
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If no session, return 401
  if (!session) {
    return new Response("Not authorized!", { status: 401 });
  }

  const typeCorrectedMessages = messages as ChatGPTMessage[];

  // Get Conversation Title
  const response = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [
      {
        content:
          "Based on the previous conversation, please write a short title for this conversation. RETURN ONLY THE TITLE.",
        role: "system",
      },
      ...typeCorrectedMessages,
    ],
  });

  const title = response.data.choices[0].message?.content;

  // If no title found, return 400
  if (!title) {
    return new Response("No response from OpenAI", { status: 401 });
  }

  // Update Chat Title
  await supabase.from("chats").update({ title }).eq("id", chatID);

  // Finally return title
  return NextResponse.json({
    title,
  });
}
