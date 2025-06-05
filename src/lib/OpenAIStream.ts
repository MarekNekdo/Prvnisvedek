import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  project: process.env.OPENAI_PROJECT_ID,
});

export async function OpenAIStream(messages: any[]): Promise<ReadableStream> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages,
    stream: true,
  });

  // @ts-ignore – kvůli typu ReadableStream
  return response as any as ReadableStream;
}
