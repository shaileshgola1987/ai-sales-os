"use client";

import type { Temp } from "@/lib/types";

export function ScoreBadge({ score, temp }: { score: number; temp: Temp }) {
  const cls =
    temp === "hot"
      ? "text-red-400 bg-red-950/50"
      : temp === "warm"
        ? "text-amber-400 bg-amber-950/50"
        : "text-sky-400 bg-sky-950/50";
  return (
    <span className={`font-mono-data text-xs font-semibold px-2 py-0.5 rounded ${cls}`}>
      {score}
    </span>
  );
}

export function TempDot({ temp }: { temp: Temp }) {
  const cls =
    temp === "hot" ? "bg-red-500" : temp === "warm" ? "bg-amber-400" : "bg-sky-500";
  return <span className={`inline-block w-2 h-2 rounded-full ${cls} flex-shrink-0`} />;
}

const STATUS: Record<string, string> = {
  New: "bg-slate-700 text-slate-300",
  Contacted: "bg-blue-950 text-blue-400",
  Qualified: "bg-violet-950 text-violet-400",
  "Follow-up": "bg-amber-950 text-amber-400",
  "Proposal Sent": "bg-cyan-950 text-cyan-400",
  Negotiation: "bg-orange-950 text-orange-400",
  Won: "bg-green-950 text-green-400",
  Sent: "bg-blue-950 text-blue-400",
  Negotiating: "bg-orange-950 text-orange-400",
  Draft: "bg-slate-700 text-slate-300",
  Approved: "bg-green-950 text-green-400",
};

export function StatusChip({ status }: { status: string }) {
  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS[status] ?? "bg-slate-700 text-slate-300"}`}
    >
      {status}
    </span>
  );
}

export function PrimaryButton({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`bg-[--primary] text-black text-sm font-semibold px-4 py-2 rounded-lg hover:brightness-110 transition-all ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`text-xs bg-[--secondary] text-[--muted-foreground] border border-[--border] px-3 py-2 rounded-lg hover:text-white ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="h-full flex items-center justify-center p-10">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-[--border] border-t-[--primary] animate-spin mx-auto" />
        <p className="text-sm text-[--muted-foreground]">{label}</p>
      </div>
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="h-full flex items-center justify-center p-10">
      <div className="max-w-sm text-center space-y-3 bg-[--card] border border-red-500/20 rounded-xl p-6">
        <p className="text-sm font-semibold text-red-400">Couldn’t load this view</p>
        <p className="text-xs text-[--muted-foreground]">{message}</p>
        {onRetry && (
          <PrimaryButton type="button" onClick={onRetry}>
            Try again
          </PrimaryButton>
        )}
      </div>
    </div>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="border-2 border-dashed border-[--border] rounded-xl p-8 text-center">
      <p className="text-sm font-medium text-white">{title}</p>
      <p className="text-xs text-[--muted-foreground] mt-1">{body}</p>
    </div>
  );
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2);
}
