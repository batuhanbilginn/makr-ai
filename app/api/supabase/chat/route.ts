import { createClient } from "@/lib/supabase/supabase-server";

export async function POST(req: Request): Promise<Response> {
  const { message } = await req.json();

  if (!message) {
    return new Response("No message!", { status: 400 });
  }

  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const { error } = await supabase
    .from("messages")
    .insert({ ...message, owner: session?.user?.id });

  if (error) {
    return new Response(error.message, { status: 400 });
  } else {
    return new Response("Message added!", { status: 200 });
  }
}
