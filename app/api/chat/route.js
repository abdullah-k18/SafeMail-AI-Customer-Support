import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
    });

    const data = await req.json();

    if (!Array.isArray(data)) {
      throw new Error("Request body must be an array of messages.");
    }
    const systemPrompt = `You are a Customer Support Assistant designed to help users understand what SafeMail is and how it works. SafeMail is an AI-powered tool that scans workplace emails for toxic language, including harassment, discrimination, or abusive behavior. Your role is to provide clear, concise, and friendly information about SafeMail, answering any questions users may have about its features, benefits, and usage. Maintain a professional and supportive tone, ensuring that users feel informed and at ease. Engage in friendly conversation and assist with any inquiries about SafeMail without requiring users to submit emails for scanning.`; // Use your own system prompt here

    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: systemPrompt }, ...data],
      model: "openai/gpt-3.5-turbo",
      stream: true,
    });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              const text = encoder.encode(content);
              controller.enqueue(text);
            }
          }
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(stream);
  } catch (error) {
    console.error("Error in POST /api/chat:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}