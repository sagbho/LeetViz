import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = (query: string) => `
  I want you to now create a slideshow for this query:

  ${query}

  It should be 5-15 simple slides that do not overwhelm me with content. Simply return the JSX array using div, h1, p, ol, and li tags, nothing else.
`;

export async function POST(req: NextRequest) {
  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENAI_API_KEY,
  });

  const data = await req.text();
  const completion = await openai.chat.completions.create({
    model: "nousresearch/hermes-3-llama-3.1-405b",

    messages: [
      { role: "system", content: systemPrompt(data) },
      { role: "user", content: data },
    ],
  });

  console.log(completion.choices[0].message.content);

  const jsxArray = completion.choices[0].message.content;

  return new NextResponse(jsxArray, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
