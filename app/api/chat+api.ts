import i18next from "@/services/i18next";
import { objectScheme } from "@/src/schemas/objectScheme";
import { google } from "@ai-sdk/google";
import { streamObject } from "ai";

// Expo Router API route handler
export async function POST(request: Request) {
  try {
    const bodyText = await request.text();

    const parsedBody = JSON.parse(bodyText || "{}");
    const messages =
      parsedBody.messages ??
      (parsedBody.input && Array.isArray(parsedBody.input.messages)
        ? parsedBody.input.messages
        : undefined);
    const language =
      parsedBody.language ??
      (parsedBody.input && parsedBody.input.language
        ? parsedBody.input.language
        : undefined);

    const userLanguage = (language || "tr").split("-")[0];

    const t = i18next.getFixedT(userLanguage); 
  

    if (!messages || !Array.isArray(messages)) {
      return Response.json(
        { error: "Messages must be an array" },
        { status: 400 }
      );
    }

    const normalizedMessages = messages.map((msg: any, index: number) => {
      if (typeof msg.content === "string") {
        return { role: msg.role, content: msg.content };
      }

      if (Array.isArray(msg.content)) {
        const parts = msg.content as any[];
        const textParts = parts
          .filter((p) => p.type === "text")
          .map((p) => p.text)
          .join("\n");
        const imageParts = parts.filter(
          (p) => p.type === "file" && p.url
        );

        const contentArray: any[] = [];
        if (textParts) {
          contentArray.push({ type: "text", text: textParts });
        }
        imageParts.forEach((img) => {
          contentArray.push({ type: "image", image: img.url });
        });

        return {
          role: msg.role,
          content: contentArray.length > 0 ? contentArray : "Empty message",
        };
      }

      return msg;
    });

    const languageName = t(`ai.languageNames.${userLanguage}`, {
      defaultValue: userLanguage,
    });
    const systemPrompt = `${t('ai.systemPrompt.intro')}
${t('ai.systemPrompt.imageCheck')}
${t('ai.systemPrompt.language')}
${t('ai.systemPrompt.format')}
${t('ai.systemPrompt.important', { language: languageName })}
${t('ai.systemPrompt.items.multiple')}
${t('ai.systemPrompt.items.quantity')}
${t('ai.systemPrompt.items.quantityNote')}
${t('ai.systemPrompt.items.shortName')}

${t('ai.systemPrompt.total.format')}

${t('ai.systemPrompt.headers')}

${t('ai.systemPrompt.items.format')}

${t('ai.systemPrompt.categories')}

${t('ai.systemPrompt.notReceipt')}`;

    const result = streamObject({
      model: google("gemini-2.5-flash"),
      system: systemPrompt,
      messages: normalizedMessages,
      schema: objectScheme,
    });

    try {
      return result.toTextStreamResponse();
    } catch (err: any) {
      const message = err?.message || "";
      if (message.includes("Controller is already closed") || message.includes("Premature close")) {
        return Response.json({ error: "client aborted" }, { status: 499 });
      }
      throw err;
    }
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ message: "Chat API endpoint is working" });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
