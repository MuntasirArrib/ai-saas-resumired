import { auth } from "@clerk/nextjs/server"; // this is just "@clerk/nextjs" in tute
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
  });

export async function POST (
    req: Request
) {
    try {
        const {userId } = auth();
        const body = await req.json();
        const { messages } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 }); //is this actually checking for authentication? Cause the import statement is different
        }

        if (!openai.apiKey) { //this is configuration.apikey in tute
            return new NextResponse("OpenAI API Key not configured", { status: 500 });
        }
        if (!messages) {
            return new NextResponse("Messages are required", { status: 400 });
        }

        const freeTrial = await checkApiLimit();
        const isPro = await checkSubscription();

        if (!freeTrial && !isPro) {
            return new NextResponse("Free trial limit exceeded", { status: 403 });
        } 

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages
        });

        if (!isPro) {
        await increaseApiLimit();
        }
        return NextResponse.json(response.choices[0].message); // this is response.data.choices[0].message in tute

    } catch (error) {
        console.log("[CONVERSATION_ERROR]", error);
        return
    }
}