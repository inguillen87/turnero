// app/api/demo/whatsapp/route.ts
import { NextResponse } from "next/server";
import { handleMessage, Session } from "@/lib/bot/stateMachine";

// Mock Session Store for Demo (In-Memory)
// In a real app, this would use Redis or DB, but for the demo we can just keep it simple
// or simulate persistence by passing the session back and forth (client-side state).
// However, the `WhatsAppSimulator` expects to send metadata and get metadata back.
// We can use the `metadata` field to store the Session object.

export async function POST(req: Request) {
  try {
    const { text, metadata, customServices } = await req.json();

    // Recover session from metadata or create fresh
    let session: Session = metadata?.session || { state: "HOME", updatedAt: Date.now() };

    // Process Message
    // Now passing customServices to handleMessage
    const { reply, session: nextSession, action } = await handleMessage(text.toLowerCase(), session, customServices);

    // Format for WhatsAppSimulator
    // The simulator expects `messages: [{ body: string, options?: [] }]`
    // Our `reply` string might contain newlines. We can split them or send as one block.
    // We also need to extract options if possible.
    // The `stateMachine` returns a single string with options embedded in text (e.g. "1) ...").
    // To make it look nice in the UI with buttons, we can parse the reply or update `stateMachine` to return structured options.
    // For now, let's just send the text and maybe parse simple options if we want chips.

    // Quick heuristic to extract options for UI chips
    const options: { label: string, value: string }[] = [];
    if (reply.includes("1)")) {
        const lines = reply.split("\n");
        lines.forEach(line => {
            const match = line.match(/^(\d+)\)\s+(.*)$/);
            if (match) {
                // e.g. "1) 📅 Reservar turno" -> label="📅 Reservar turno", value="1"
                // Clean price if present " ($50.000)"
                let label = match[2].trim();
                const priceMatch = label.match(/(.*)\s\(\$.*\)/);
                if (priceMatch) {
                    label = priceMatch[1];
                }
                options.push({ label: label, value: match[1] });
            }
        });
    }

    // Default chips for main menu if we are in HOME (heuristic)
    if (nextSession.state === 'HOME' && options.length === 0 && reply.includes("1) 📅 Reservar")) {
         // This block handles the case where regex above might fail or we want explicit buttons for main menu
         // But the regex above should catch "1) 📅 Reservar turno"
    }

    // Confirmation chips
    if (reply.includes("Confirmá:")) {
        options.push({ label: "✅ Confirmar", value: "1" });
        options.push({ label: "❌ Cancelar", value: "2" });
    }

    return NextResponse.json({
      messages: [
        {
          body: reply,
          options: options
        }
      ],
      metadata: { session: nextSession },
      action: action
    });

  } catch (error) {
    console.error("Demo API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
