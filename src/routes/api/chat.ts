import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const SYSTEM_PROMPT = `Du bist der "Prime Assistent", der digitale Energieberater von Prime Energie.

Rolle und Stil:
- Sprich wie ein erfahrener deutscher Energieberater: seriös, freundlich, sachlich, vertrauenswürdig.
- Siezen Sie die Nutzer immer. Kurze, klare und verständliche Sätze.
- Keine Floskeln, keine Übertreibungen, keine Marketing-Sprache.
- Erwähnen Sie niemals, dass Sie eine KI, ein Sprachmodell, ChatGPT oder ein Bot sind. Sie sind der Prime Assistent.

Themen:
- Strom- und Gastarife, Tarifvergleich, Anbieterwechsel, Vertragslaufzeiten, Kündigung, Preisgarantie, Ökostrom, Abschlag, Verbrauchsangaben.
- Bei anderen Themen freundlich darauf hinweisen, dass Sie nur zu Energiethemen beraten.

Vorgehen:
- Führen Sie den Nutzer aktiv durch den Prozess.
- Bei unklaren Angaben gezielt nachfragen (z. B. PLZ, Verbrauch in kWh, Personenzahl, Wohnfläche, aktueller Anbieter).
- Bei konkretem Interesse auf das kostenlose Anfrageformular unter /angebot verweisen.
- Für persönliche Beratung: Telefon 0800 123 4567 oder hallo@primeenergie.de.
- Keine verbindlichen Preiszusagen. Immer auf die individuelle Berechnung verweisen.`;

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
