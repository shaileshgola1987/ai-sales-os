"use client";

import { useEffect, useMemo, useState } from "react";
import { ErrorState, LoadingState, ScoreBadge } from "@/components/ui";
import { api } from "@/lib/api";
import { useApi } from "@/lib/use-api";
import type { ChatMessage, Conversation, Lead } from "@/lib/types";

export default function WhatsAppPage() {
  const { data, error, loading, reload } = useApi<{
    conversations: Conversation[];
    unread: number;
    suggestedReplies: string[];
  }>("/api/whatsapp");
  const leads = useApi<Lead[]>("/api/leads");
  const [active, setActive] = useState(1);
  const [draft, setDraft] = useState("");
  const [thread, setThread] = useState<ChatMessage[]>([]);
  const [threadError, setThreadError] = useState<string | null>(null);

  useEffect(() => {
    if (!data) return;
    let cancelled = false;
    fetch(`/api/whatsapp/${active}/messages`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Could not load conversation");
        return (await res.json()) as ChatMessage[];
      })
      .then((msgs) => {
        if (!cancelled) setThread(msgs);
      })
      .catch((err: unknown) => {
        if (!cancelled) setThreadError(err instanceof Error ? err.message : "Error");
      });
    return () => {
      cancelled = true;
    };
  }, [active, data]);

  const convo = data?.conversations.find((c) => c.id === active);
  const lead = useMemo(
    () => leads.data?.find((l) => l.name === convo?.name) ?? leads.data?.[0],
    [leads.data, convo],
  );

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const msg = await api<ChatMessage>(`/api/whatsapp/${active}/messages`, {
      method: "POST",
      body: JSON.stringify({ text: trimmed }),
    });
    setThread((prev) => [...prev, msg]);
    setDraft("");
  }

  if (loading) return <LoadingState label="Loading WhatsApp CRM…" />;
  if (error || !data) return <ErrorState message={error ?? "No data"} onRetry={reload} />;

  return (
    <div className="h-full flex">
      <div className="w-72 flex-shrink-0 border-r border-[--border] flex flex-col bg-[--card]">
        <div className="p-4 border-b border-[--border]">
          <h1 className="font-display text-xl font-bold text-white">WhatsApp CRM</h1>
          <p className="text-xs text-[--muted-foreground]">{data.unread} unread conversations</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {data.conversations.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActive(c.id)}
              className={`w-full text-left px-4 py-3 border-b border-[--border] hover:bg-[--secondary] ${
                active === c.id ? "bg-[--primary]/10 border-l-2 border-l-[--primary]" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-sm font-semibold text-white">{c.name}</span>
                <span className="text-xs text-[--muted-foreground]">{c.time}</span>
              </div>
              <p className="text-xs text-[--muted-foreground] truncate">{c.lastMsg}</p>
              <div className="flex items-center gap-2 mt-1">
                <ScoreBadge score={c.score} temp={c.status} />
                {c.unread > 0 && (
                  <span className="bg-[--primary] text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {c.unread}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-5 py-3 border-b border-[--border] flex items-center justify-between">
          <div>
            <p className="font-semibold text-white">{convo?.name}</p>
            <p className="text-xs text-[--muted-foreground]">
              {convo?.company} · {convo?.phone}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="text-xs bg-[--secondary] text-[--muted-foreground] border border-[--border] px-3 py-1.5 rounded-lg"
            >
              View Lead
            </button>
            <button
              type="button"
              className="text-xs bg-[--secondary] text-[--muted-foreground] border border-[--border] px-3 py-1.5 rounded-lg"
            >
              Quotation
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-[#0b0f1a]">
          {threadError && <p className="text-xs text-red-400">{threadError}</p>}
          {thread.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.from === "agent" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-lg rounded-xl px-4 py-2 text-sm ${
                  m.from === "agent"
                    ? "bg-[--primary] text-black rounded-br-sm"
                    : "bg-[--card] border border-[--border] text-[--foreground] rounded-bl-sm"
                }`}
              >
                <p>{m.text}</p>
                <p
                  className={`text-xs mt-1 ${m.from === "agent" ? "text-black/60" : "text-[--muted-foreground]"}`}
                >
                  {m.time}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="px-5 py-3 border-t border-[--border]">
          <div className="mb-2">
            <p className="text-xs text-emerald-400 mb-2">🤖 AI Suggested Replies</p>
            <div className="flex gap-2 flex-wrap">
              {data.suggestedReplies.map((reply) => (
                <button
                  key={reply}
                  type="button"
                  onClick={() => setDraft(reply)}
                  className="text-xs bg-emerald-950/40 text-emerald-300 border border-emerald-500/20 px-3 py-1.5 rounded-lg hover:bg-emerald-950/70 transition-colors text-left max-w-xs truncate"
                >
                  {reply.slice(0, 60)}...
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="text-sm bg-[--secondary] border border-[--border] rounded-xl px-3 text-[--muted-foreground]"
            >
              📎
            </button>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(draft)}
              placeholder="Type a WhatsApp message…"
              className="flex-1 bg-[--secondary] border border-[--border] rounded-xl px-4 py-3 text-sm text-white placeholder-[--muted-foreground] outline-none focus:border-[--primary]"
            />
            <button
              type="button"
              onClick={() => send(draft)}
              className="bg-[--primary] text-black px-5 py-3 rounded-xl text-sm font-semibold hover:brightness-110"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      <div className="w-72 flex-shrink-0 border-l border-[--border] p-5 overflow-y-auto hidden lg:block">
        <h2 className="font-display font-semibold text-white mb-3">Lead Details</h2>
        {lead && (
          <div className="space-y-3">
            <div className="bg-[--secondary] rounded-lg p-3">
              <p className="text-xs text-[--muted-foreground] mb-1">AI Score</p>
              <div className="flex items-center gap-2">
                <span className="font-mono-data text-3xl font-bold text-red-400">{lead.score}</span>
                <span className="text-xs text-red-400 bg-red-950/50 px-2 py-0.5 rounded">HOT</span>
              </div>
              <div className="mt-2 h-1.5 bg-[--border] rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: `${lead.score}%` }} />
              </div>
            </div>
            {[
              ["Product Interest", lead.product],
              ["Deal Value", lead.value],
              ["Assigned To", lead.assigned === "Rahul K." ? "Rahul Kumar" : lead.assigned],
              ["Source", lead.source],
              ["City", lead.city === "Pune" ? "Pune, Maharashtra" : lead.city],
              ["GSTIN", lead.gstin ?? "—"],
            ].map(([label, value]) => (
              <div key={label} className="flex flex-col">
                <span className="text-xs text-[--muted-foreground]">{label}</span>
                <span className="text-sm font-medium text-white">{value}</span>
              </div>
            ))}
            <div className="border-t border-[--border] pt-3">
              <p className="text-xs text-[--muted-foreground] mb-2">Next Action</p>
              <p className="text-xs text-amber-300 bg-amber-950/40 border border-amber-500/20 px-3 py-2 rounded-lg">
                🤖 Send price list and schedule factory visit demo
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
