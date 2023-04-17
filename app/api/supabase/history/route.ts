import { createClient } from "@/lib/supabase/supabase-server";
import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<Response> {
  const {
    query_embedding,
    similarity_threshold,
    match_count,
    chat_id,
    owner_id,
  } = await req.json();

  // If no ID, return 400
  if (!query_embedding || !similarity_threshold || !match_count || !owner_id) {
    console.log({
      query_embedding,
      similarity_threshold,
      match_count,
      chat_id,
    });
    return NextResponse.json("Wrong payload!", { status: 400 });
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

  try {
    const { data, error } = await supabase.rpc("search_messages", {
      query_embedding,
      similarity_threshold,
      match_count,
      chat_id,
      owner_id,
    });

    if (error) {
      console.log(error);
      return NextResponse.json(error, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 400 });
  }
}
