import { OpenAIStream } from "@/lib/openai-stream";
import { createClient } from "@/lib/supabase/supabase-server";

export const runtime = "experimental-edge";

export async function POST(req: Request): Promise<Response> {
  const { payload } = await req.json();

  // Create Supabase Server Client
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If no session, return 401
  if (!session) {
    return new Response("Not authorized!", { status: 401 });
  }

  if (!payload) {
    return new Response("No payload!", { status: 400 });
  }

  const stream = await OpenAIStream(payload);

  return new Response(stream);
}
