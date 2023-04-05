import { createClient } from "@/lib/supabase/supabase-server";

// POST
export async function POST(req: Request): Promise<Response> {
  const { message } = await req.json();
  // If no message, return 400
  if (!message) {
    return new Response("No message!", { status: 400 });
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

  // Insert Message
  const { error } = await supabase
    .from("messages")
    .insert({ ...message, owner: session?.user?.id });

  if (error) {
    return new Response(error.message, { status: 400 });
  } else {
    return new Response("Message added!", { status: 200 });
  }
}

// DELETE
export async function DELETE(req: Request): Promise<Response> {
  const { id } = await req.json();

  // If no ID, return 400
  if (!id) {
    return new Response("No ID!", { status: 400 });
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

  const { error } = await supabase
    .from("messages")
    .delete()
    .match({ id, owner: session?.user?.id });
  console.log(error);

  return new Response("Message deleted!", { status: 200 });
}
