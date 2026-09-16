"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  PrimaryButton,
  ScoreBadge,
  StatusChip,
} from "@/components/ui";
import { api } from "@/lib/api";
import { useApi } from "@/lib/use-api";
import type { Lead } from "@/lib/types";

export default function LeadsPage() {
  const { data, error, loading, reload } = useApi<Lead[]>("/api/leads");
  const [temp, setTemp] = useState<"all" | "hot" | "warm" | "cold">("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const list = data ?? [];
    return list.filter((lead) => {
      const matchTemp = temp === "all" || lead.temp === temp;
      const hay = `${lead.name} ${lead.company} ${lead.city} ${lead.product}`.toLowerCase();
      return matchTemp && hay.includes(q.toLowerCase());
    });
  }, [data, temp, q]);

  async function onCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setSaving(true);
    setFormError(null);
    try {
      await api("/api/leads", {
        method: "POST",
        body: JSON.stringify({
          name: form.get("name"),
          company: form.get("company"),
          phone: form.get("phone"),
          city: form.get("city"),
          product: form.get("product"),
          value: form.get("value"),
          source: form.get("source"),
        }),
      });
      setOpen(false);
      reload();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Could not create lead");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <LoadingState label="Loading leads…" />;
  if (error || !data) return <ErrorState message={error ?? "No data"} onRetry={reload} />;

  const hotCount = data.filter((l) => l.temp === "hot").length;

  return (
    <div className="h-full flex flex-col">
      <div className="p-5 border-b border-[--border] flex flex-wrap items-center gap-3">
        <div>
          <h1 className="font-display text-xl font-bold text-white">Lead Management</h1>
          <p className="text-xs text-[--muted-foreground]">
            {data.length} total leads · {hotCount} hot
          </p>
        </div>
        <div className="flex-1 ml-4 min-w-40">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search leads, companies..."
            className="w-full max-w-sm bg-[--secondary] border border-[--border] rounded-lg px-3 py-2 text-sm text-white placeholder-[--muted-foreground] outline-none focus:border-[--primary] transition-colors"
          />
        </div>
        <div className="flex gap-1">
          {(["all", "hot", "warm", "cold"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTemp(key)}
              className={`text-xs font-medium px-3 py-1.5 rounded-lg capitalize transition-all ${
                temp === key
                  ? "bg-[--primary] text-black"
                  : "bg-[--secondary] text-[--muted-foreground] hover:text-white"
              }`}
            >
              {key === "hot" ? "🔥 Hot" : key === "warm" ? "🟡 Warm" : key === "cold" ? "❄️ Cold" : "All"}
            </button>
          ))}
        </div>
        <PrimaryButton className="ml-auto" onClick={() => setOpen(true)}>
          + New Lead
        </PrimaryButton>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No leads match this filter"
              body="Try another temperature, clear the search, or add a new lead."
            />
          </div>
        ) : (
          <table className="w-full">
            <thead className="sticky top-0 bg-[--card] z-10">
              <tr className="border-b border-[--border]">
                {[
                  "Lead",
                  "Company",
                  "AI Score",
                  "Status",
                  "Value",
                  "Assigned",
                  "Source",
                  "Last Contact",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left text-xs font-semibold text-[--muted-foreground] uppercase tracking-wider px-4 py-3"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead, i) => (
                <tr
                  key={lead.id}
                  className={`border-b border-[--border] hover:bg-[--secondary] transition-colors cursor-pointer ${
                    i % 2 === 0 ? "" : "bg-[#0b0f1a]"
                  }`}
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-white">{lead.name}</p>
                      <p className="text-xs text-[--muted-foreground]">{lead.phone}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[--foreground]">{lead.company}</td>
                  <td className="px-4 py-3">
                    <ScoreBadge score={lead.score} temp={lead.temp} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusChip status={lead.status} />
                  </td>
                  <td className="px-4 py-3 font-mono-data text-sm font-semibold text-[--primary]">
                    {lead.value}
                  </td>
                  <td className="px-4 py-3 text-sm text-[--foreground]">{lead.assigned}</td>
                  <td className="px-4 py-3 text-xs text-[--muted-foreground]">{lead.source}</td>
                  <td className="px-4 py-3 text-xs text-[--muted-foreground]">{lead.lastContact}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        className="text-xs bg-green-950/50 text-green-400 border border-green-500/20 px-2 py-1 rounded hover:bg-green-950 transition-colors"
                      >
                        WhatsApp
                      </button>
                      <button
                        type="button"
                        className="text-xs bg-[--secondary] text-[--muted-foreground] border border-[--border] px-2 py-1 rounded hover:text-white transition-colors"
                      >
                        Call
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/60 z-20 flex items-center justify-center p-4">
          <form
            onSubmit={onCreate}
            className="w-full max-w-md bg-[--card] border border-[--border] rounded-2xl p-5 space-y-3"
          >
            <h2 className="font-display text-lg font-bold text-white">+ New Lead</h2>
            {[
              ["name", "Contact name"],
              ["company", "Company"],
              ["phone", "Phone"],
              ["city", "City"],
              ["product", "Product interest"],
              ["value", "Deal value"],
              ["source", "Source"],
            ].map(([name, label]) => (
              <label key={name} className="block">
                <span className="text-xs text-[--muted-foreground]">{label}</span>
                <input
                  name={name}
                  required={name === "name" || name === "company"}
                  className="mt-1 w-full bg-[--secondary] border border-[--border] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[--primary]"
                />
              </label>
            ))}
            {formError && <p className="text-xs text-red-400">{formError}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-sm text-[--muted-foreground] px-3 py-2"
              >
                Cancel
              </button>
              <PrimaryButton disabled={saving}>{saving ? "Saving…" : "Create lead"}</PrimaryButton>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
