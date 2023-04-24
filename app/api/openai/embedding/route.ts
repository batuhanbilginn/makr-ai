import openai from "@/lib/openai";
import { createClient } from "@/lib/supabase/supabase-server";
import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<Response> {
  const { messages, apiKey } = await req.json();

  if (!messages) {
    return new Response("No messages!", { status: 400 });
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

  try {
    // Create Embeddings
    const { data } = await openaiClient.createEmbedding({
      model: "text-embedding-ada-002",
      input: messages
        .map((message: any) => message.content)
        .filter((filteredMessage: string) => filteredMessage !== ""),
    });

    const embeddings = data.data;

    if (!embeddings) {
      return NextResponse.json(
        { message: "Something went wrong!" },
        { status: 500 }
      );
    }

    // Finally return title
    return NextResponse.json(embeddings);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}
