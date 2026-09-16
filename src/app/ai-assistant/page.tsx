"use client";

import { useEffect, useState } from "react";
import { ErrorState, LoadingState, PrimaryButton } from "@/components/ui";
import { api } from "@/lib/api";

const CHIPS = [
  "Top 5 leads to call today",
  "Draft WhatsApp for Deepa Nair",
  "Why are cold leads not converting?",
  "Amit Desai ki performance summary",
];

type Msg = { from: "ai" | "user"; text: string };

export default function AssistantPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [asking, setAsking] = useState(false);

  useEffect(() => {
    fetch("/api/assistant/welcome")
      .then(async (res) => {
        if (!res.ok) throw new Error("Could not load assistant");
        return (await res.json()) as { text: string };
      })
      .then((body) => setMessages([{ from: "ai", text: body.text }]))
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Error"))
      .finally(() => setLoading(false));
  }, []);

  async function ask(text: string) {
    const q = text.trim();
    if (!q) return;
    setDraft("");
    setMessages((m) => [...m, { from: "user", text: q }]);
    setAsking(true);
    try {
      const res = await api<{ text: string }>("/api/assistant/ask", {
        method: "POST",
        body: JSON.stringify({ text: q }),
      });
      setMessages((m) => [...m, { from: "ai", text: res.text }]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          from: "ai",
          text: err instanceof Error ? err.message : "The assistant could not answer that.",
        },
      ]);
    } finally {
      setAsking(false);
    }
  }

  if (loading) return <LoadingState label="Waking the assistant…" />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="h-full flex flex-col">
      <div className="p-5 border-b border-[--border]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-xl">
            🤖
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-white">AI Sales Assistant</h1>
            <p className="text-xs text-emerald-400">GPT-4 powered · trained on your sales data</p>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((m, i) => (
          <div key={`${m.from}-${i}`} className={`flex gap-3 ${m.from === "user" ? "flex-row-reverse" : ""}`}>
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${
                m.from === "ai" ? "bg-gradient-to-br from-emerald-500 to-cyan-500" : "bg-[--primary]"
              }`}
            >
              {m.from === "ai" ? "🤖" : "U"}
            </div>
            <div
              className={`max-w-lg rounded-xl px-4 py-3 text-sm leading-relaxed ${
                m.from === "ai"
                  ? "bg-[--card] border border-[--border] text-[--foreground]"
                  : "bg-[--primary] text-black"
              }`}
            >
              {m.text.split("\n").map((line, idx) => (
                <p key={idx} className={line === "" ? "mt-2" : ""}>
                  {line}
                </p>
              ))}
            </div>
          </div>
        ))}
        {asking && (
          <p className="text-xs text-[--muted-foreground] animate-pulse ml-11">Analyzing your query…</p>
        )}
      </div>
      <div className="px-5 py-3 border-t border-[--border]">
        <div className="flex flex-wrap gap-2 mb-3">
          {CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => setDraft(chip)}
              className="text-xs bg-[--secondary] text-[--muted-foreground] border border-[--border] px-3 py-1.5 rounded-full hover:text-white hover:border-[--primary]/30 transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && ask(draft)}
            placeholder="Ask anything about your sales pipeline..."
            className="flex-1 bg-[--secondary] border border-[--border] rounded-xl px-4 py-3 text-sm text-white placeholder-[--muted-foreground] outline-none focus:border-[--primary] transition-colors"
          />
          <PrimaryButton className="px-5 py-3 rounded-xl" onClick={() => ask(draft)}>
            Ask AI
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
