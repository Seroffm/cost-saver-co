import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const SYSTEM_PROMPT = `Du bist der freundliche KI-Assistent von EnergieClever, einem Beratungsservice für günstigere Strom- und Gastarife in Deutschland.

Aufgaben:
- Beantworte Fragen zu Strom, Gas, Solar, Gewerbetarifen, Anbieterwechsel, Ablauf und Datenschutz.
- Hilf Kund:innen, das passende Angebot zu finden, und verweise bei konkretem Interesse auf das kostenlose Anfrageformular unter /angebot.
- Bei Wunsch nach persönlicher Beratung: Telefon 0800 123 4567 oder hallo@energieclever.de.
- Antworte kurz, klar, in Du-Form auf Deutsch. Nutze gerne Aufzählungen.
- Keine verbindlichen Preiszusagen. Immer auf individuelle Berechnung verweisen.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as { messages?: UIMessage[] };
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const result = streamText({
          model: gateway("google/gemini-3-flash-preview"),
          system: SYSTEM_PROMPT,
          messages: await convertToModelMessages(messages),
        });

        return result.toUIMessageStreamResponse({ originalMessages: messages });
      },
    },
  },
});
