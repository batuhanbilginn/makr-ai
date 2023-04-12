import openai from "@/lib/openai";
import { createClient } from "@/lib/supabase/supabase-server";
import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<Response> {
  const { key } = await req.json();

  if (!key) {
    return NextResponse.json({ message: "Key is required!" }, { status: 401 });
  }

  // Create Supabase Server Client
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If no session, return 401
  if (!session) {
    return NextResponse.json({ message: "Not authorized!" }, { status: 401 });
  }

  // Create OpenAI Client
  const openaiClient = openai(key);

  try {
    // Get Model (this will throw an error if the key is invalid)
    await openaiClient.retrieveModel("text-davinci-003");

    // Return 200 if there is no error
    return NextResponse.json("Key is valid!");
  } catch (error: any) {
    console.log(error);
    if (error?.response.status === 401) {
      return NextResponse.json(
        { message: "Key is not valid." },
        { status: 404 }
      );
    }
    // If it's not a 401, return 500
    else {
      return NextResponse.json(
        { message: "Something went wrong." },
        { status: 500 }
      );
    }
  }
}
