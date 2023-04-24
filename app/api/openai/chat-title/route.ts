import openai from "@/lib/openai";
import { createClient } from "@/lib/supabase/supabase-server";
import { ChatGPTMessage } from "@/types/openai";
import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<Response> {
  const { messages, chatID, apiKey, model } = await req.json();

  if (!messages) {
    return new Response("No messages!", { status: 400 });
  }

  if (!chatID) {
    return new Response("No chatID!", { status: 400 });
  }

  if (!apiKey) {
    return new Response("No key!", { status: 400 });
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

  // Create OpenAI Client
  const openaiClient = openai(apiKey);

  const typeCorrectedMessages = messages as ChatGPTMessage[];

  // Get Conversation Title
  const response = await openaiClient.createChatCompletion({
    model: model ?? "gpt-3.5-turbo",
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
  await supabase
    .from("chats")
    // @ts-ignore
    .update({ title })
    .eq("id", chatID);

  // Finally return title
  return NextResponse.json({
    title,
  });
}
