
import i18next from "@/services/i18next";
import { google } from "@ai-sdk/google";
import { streamText } from "ai";

// Expo Router API route handler
export async function POST(request: Request) {
  try {
    const body = await request.text();
    const { messages, language } = JSON.parse(body);
    console.log(language);
    // Kullanıcının dilini request'ten al, yoksa varsayılan olarak 'tr' kullan
    const userLanguage = (language || 'tr').split('-')[0]; // 'tr-TR' -> 'tr'
    
    // Kullanıcının diline göre translation fonksiyonu oluştur
    const t = i18next.getFixedT(userLanguage);

    if (!messages || !Array.isArray(messages)) {
      return Response.json(
        { error: "Messages must be an array" },
        { status: 400 }
      );
    }

    const normalizedMessages = messages.map((msg: any) => {
      if (typeof msg.content === "string") {
        return { role: msg.role, content: msg.content };
      }

      if (Array.isArray(msg.content)) {
        const parts = msg.content as any[];
        const textParts = parts
          .filter((p) => p.type === "text")
          .map((p) => p.text)
          .join("\n");
        const imageParts = parts.filter((p) => p.type === "file" && p.url);

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
    
    // Kullanıcının diline göre system prompt oluştur
    const languageName = t(`ai.languageNames.${userLanguage}`, { defaultValue: userLanguage });
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

    const result = streamText({
      model: google("gemini-2.0-flash"),
      system: systemPrompt,
      messages: normalizedMessages,
    });

    return result.toDataStreamResponse();
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// GET endpoint for testing
export async function GET() {
  return Response.json({ message: "Chat API endpoint is working" });
}

// OPTIONS method for CORS
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
