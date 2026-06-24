import Groq from "groq-sdk";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return Response.json({ error: "GROQ_API_KEY is not configured" }, { status: 500 });
  }

  const body = await request.json();
  const messages = body.messages as ChatMessage[] | undefined;
  const prompt = body.prompt as string | undefined;
  const groq = new Groq({ apiKey });

  const completion = await groq.chat.completions.create({
    model: body.model ?? "llama-3.1-8b-instant",
    messages:
      messages ??
      [
        {
          role: "user",
          content: prompt ?? "",
        },
      ],
  });

  return new Response(completion.choices[0]?.message?.content ?? "", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
