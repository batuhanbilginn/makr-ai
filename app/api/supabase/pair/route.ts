import { createClient } from "@/lib/supabase/supabase-server";
import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<Response> {
  const { messageID, pairID } = await req.json();

  // If no ID, return 400
  if (!messageID || !pairID) {
    return NextResponse.json("Wrong payload!", { status: 400 });
  }

  // Create Supabase Server Client
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If no session, return 401
  if (!session) {
    return NextResponse.json("Not authorized!", { status: 401 });
  }

  const { error } = await supabase
    .from("messages")
    .update({ pair: pairID })
    .match({ id: messageID, owner: session?.user?.id });

  if (error) {
    console.log(error);
    return NextResponse.json(error, { status: 400 });
  }

  return NextResponse.json("Success!");
}
