import { OpenAIStream } from "@/lib/openai-stream";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const runtime = "experimental-edge";

export async function POST(req: Request): Promise<Response> {
  const { payload } = await req.json();

  if (!payload) {
    return new Response("No payload!", { status: 400 });
  }

  const stream = await OpenAIStream(payload);
  return new Response(stream);
}
