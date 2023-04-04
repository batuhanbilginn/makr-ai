import { OpenAIStream } from "@/lib/openai-stream";
import { OpenAIStreamPayload } from "@/types/openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config = {
  runtime: "edge",
};

export async function POST(req: Request): Promise<Response> {
  const { messages, model } = await req.json();

  console.log("messages", messages);

  if (!messages) {
    return new Response("No messages!", { status: 400 });
  }

  const payload: OpenAIStreamPayload = {
    model: model ?? "gpt-3.5-turbo",
    messages,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 1000,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
}
