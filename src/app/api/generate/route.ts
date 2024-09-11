import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = (query: string) =>
  `I want you to create a slideshow for this query:

${query}

The slideshow should consist of five to fifteen simple slides, designed to help someone understand the complete approach to the leetcode problem with some possible code. Each slide should be clear and not overwhelming. The output should be a JSX array formatted as plain text using div, h1, p, ol, and li tags. Please do not include any additional formatting or JSON structures. For example:

[
  {
    "slide": 1,
    "content": [
      <div className="slide">
        <h1>Slide Title</h1>
        <p>Explanation of the approach or concept.</p>
      </div>
    ]
  },
  ... additional slides follow...
]`;

export async function POST(req: NextRequest) {
  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENAI_API_KEY,
  });

  const data = await req.text();
  const completion = await openai.chat.completions.create({
    model: "google/gemini-flash-1.5-exp",
    messages: [
      { role: "system", content: systemPrompt(data) },
      { role: "user", content: data },
    ],
  });

  const jsxArray = completion.choices[0].message.content;

  // Log the response to check its format
  console.log("Received JSX Array:", jsxArray);

  return new NextResponse(jsxArray, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
