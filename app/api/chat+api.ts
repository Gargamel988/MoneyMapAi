import { google } from "@ai-sdk/google";
import { streamText } from "ai";

// Expo Router API route handler
export async function POST(request: Request) {
  try {
    const body = await request.text();
    const { messages } = JSON.parse(body);

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

    const result = streamText({
      model: google("gemini-2.0-flash"),
      system: `Bir fiş tespit edicisiniz.
Görsel varsa bunun fiş,makbuz veya fatura olup olmadığını belirtin.
Fişse Türkçe, kullanıcıya uygun ve okunaklı bir yanıt verin.
JSON veya kod bloğu KULLANMAYIN. YILDIZ (*) KULLANMAYIN.
kalemlerde birden fazla ürün varsa her ürün için bir satır açın.
kalemlerde adet yoksa 1 adet olarak yazın.
kalemlerde adete DİKKAT EDENİZ bazı fişlerde adet ürün adının üstünde yazılır.
kalemlerde ürün adı uzun ise kısa yazın.

ÖNEMLİ: Toplam tutarı şu formatta yazın:
💰 Toplam: [tutar] TL
Örnek: 💰 Toplam: 567.57 TL

Başlıkları EMOJİ ile belirtin (kalın yapmayın):
- 🏪 Mağaza/Restoran 
- 📅 Tarih / ⏰ Saat 
- 💰 Toplam: [tutar] TL
- 🏷️ Kategori: [kategori adını buraya yaz]
- 🧾 Kalemler (her satırda madde madde)
- 🧠 Özet (tek cümle)

Kalemleri madde madde yazın ve her satırı eksiksiz yazın ve bir emojili işaretle başlatın (örn. ✅):
- Ürün Adı x Adet — Fiyat TL

Kategori önerisi için şu kategorilerden birini seç: Market, Ulaşım, Faturalar, Kira, Eğlence, Sağlık, Giyim, Yemek, Eğitim, Diğer

Fiş , makbuz veya fatura değilse, kısa bir gerekçe yazın ve doğru görsel için yönlendirin. Görsel yoksa kullanıcıdan görsel göndermesini isteyin.`,
      messages: normalizedMessages,
    });

    return result.toDataStreamResponse();
  } catch (error: any) {
<<<<<<< HEAD
    return Response.json({ error: error.message }, { status: 500 });
=======
    return Response.json({ error: error.message || "Internal server error" }, { status: 500 });
>>>>>>> 2742bcc (ilk yükleme)
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
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
