import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useNavigate } from "@tanstack/react-router";
import { MessageCircle, X, Send, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const ACTION_RE = /\[\[ACTION:([^|\]]+)\|([^\]]+)\]\]/g;

function parseMessage(text: string): { body: string; actions: { label: string; href: string }[] } {
  const actions: { label: string; href: string }[] = [];
  const body = text.replace(ACTION_RE, (_m, label: string, href: string) => {
    actions.push({ label: label.trim(), href: href.trim() });
    return "";
  }).trim();
  return { body, actions };
}

const WELCOME_TEXT =
  "Hallo, ich bin der Prime Energieberater.\n\nIch unterstütze Sie bei Fragen zu Strom-, Gas- und Energietarifen. Gerne helfe ich Ihnen dabei, passende Tarife zu finden, Ihre Angaben zu verstehen oder Fragen zum Anbieterwechsel zu beantworten.\n\nWie kann ich Ihnen helfen?";

const QUICK_ACTIONS = [
  "Welcher Tarif passt zu mir?",
  "Ich suche einen Öko-Stromtarif",
  "Lohnt sich ein Wechsel?",
];

const INITIAL: UIMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    parts: [{ type: "text", text: WELCOME_TEXT }],
  } as UIMessage,
];

export function AiChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const transport = useRef(new DefaultChatTransport({ api: "/api/chat" })).current;

  const { messages, sendMessage, status, error } = useChat({
    id: "site-assistant",
    messages: INITIAL,
    transport,
  });

  const busy = status === "submitted" || status === "streaming";
  const showQuickActions = messages.length <= 1 && !busy;

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);

  const send = (text: string) => {
    if (!text.trim() || busy) return;
    void sendMessage({ text: text.trim() });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input;
    setInput("");
    send(text);
  };

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Chat schließen" : "Prime Assistent öffnen"}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "fixed bottom-5 right-5 z-[60] grid h-14 w-14 place-items-center rounded-full text-primary-foreground shadow-hero transition-all hover:scale-105",
          "bg-gradient-to-br from-primary to-success",
        )}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        {!open && (
          <span className="absolute -top-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-success text-[10px] font-bold text-white ring-2 ring-background">
            !
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Prime Assistent"
          className="fixed bottom-24 right-5 z-[60] flex h-[min(620px,calc(100vh-7rem))] w-[min(380px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-hero animate-in slide-in-from-bottom-4 fade-in"
        >
          <header className="flex items-center gap-3 border-b border-border bg-primary px-4 py-3 text-primary-foreground">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-success/20">
              <Sparkles className="h-5 w-5 text-success" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold">Prime Assistent</div>
              <div className="text-xs text-primary-foreground/70">Antwortet meist sofort</div>
            </div>
          </header>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-surface px-4 py-4">
            {messages.map((m) => {
              const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
              const isUser = m.role === "user";
              return (
                <div key={m.id} className={cn("flex", isUser ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm shadow-soft",
                      isUser
                        ? "rounded-br-sm bg-primary text-primary-foreground"
                        : "rounded-bl-sm bg-background text-foreground",
                    )}
                  >
                    {text || (busy && !isUser ? "…" : "")}
                  </div>
                </div>
              );
            })}
            {status === "submitted" && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm bg-background px-3 py-2 text-sm text-muted-foreground shadow-soft">
                  <span className="inline-flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60" />
                  </span>
                </div>
              </div>
            )}
            {showQuickActions && (
              <div className="space-y-2 pt-2">
                {QUICK_ACTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => send(q)}
                    className="block w-full rounded-full border border-primary/30 bg-background px-4 py-2 text-left text-sm text-primary transition hover:border-primary hover:bg-primary/5"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
            {error && (
              <div className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
                Es gab ein Problem. Bitte später erneut versuchen.
              </div>
            )}
          </div>

          <form
            onSubmit={onSubmit}
            className="flex items-center gap-2 border-t border-border bg-background px-3 py-3"
          >
            <input
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ihre Frage zu Strom oder Gas…"
              className="flex-1 rounded-full border border-border bg-surface px-4 py-2 text-sm outline-none transition focus:border-success"
              disabled={busy}
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Senden"
              className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
          <div className="px-3 pb-2 text-[10px] text-muted-foreground">
            Automatisierte Antworten. Keine verbindliche Beratung.
          </div>
        </div>
      )}
    </>
  );
}
