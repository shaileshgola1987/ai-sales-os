"use client";

import { ErrorState, LoadingState, PrimaryButton } from "@/components/ui";
import { api } from "@/lib/api";
import { useApi } from "@/lib/use-api";
import type { Task } from "@/lib/types";

const TYPE: Record<Task["type"], string> = {
  call: "📞",
  whatsapp: "💬",
  visit: "📍",
  email: "✉️",
};

const PRIORITY: Record<Task["priority"], string> = {
  high: "text-red-400 bg-red-950/40 border-red-500/20",
  medium: "text-orange-400 bg-orange-950/40 border-orange-500/20",
  low: "text-slate-400 bg-slate-800/40 border-slate-600/20",
};

export default function TasksPage() {
  const { data, error, loading, reload } = useApi<Task[]>("/api/tasks");
  if (loading) return <LoadingState label="Loading tasks…" />;
  if (error || !data) return <ErrorState message={error ?? "No data"} onRetry={reload} />;

  const pending = data.filter((t) => !t.done).length;
  const done = data.filter((t) => t.done).length;

  async function toggle(task: Task) {
    await api(`/api/tasks/${task.id}`, {
      method: "PATCH",
      body: JSON.stringify({ done: !task.done }),
    });
    reload();
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-5 border-b border-[--border] flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-white">Tasks & Follow-ups</h1>
          <p className="text-xs text-[--muted-foreground]">
            {pending} pending · {done} completed today
          </p>
        </div>
        <PrimaryButton>+ New Task</PrimaryButton>
      </div>
      <div className="flex-1 overflow-y-auto p-5 space-y-2">
        {data.map((task) => (
          <button
            key={task.id}
            type="button"
            onClick={() => toggle(task)}
            className="w-full text-left bg-[--card] border border-[--border] rounded-xl p-4 hover:border-[--primary]/20 flex items-start gap-3"
          >
            <span
              className={`w-5 h-5 rounded border flex items-center justify-center text-xs flex-shrink-0 mt-0.5 ${
                task.done
                  ? "bg-[--primary] border-[--primary] text-black"
                  : "border-[--border] hover:border-[--primary]"
              }`}
            >
              {task.done ? "✓" : ""}
            </span>
            <span className="text-base">{TYPE[task.type]}</span>
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-medium ${
                  task.done ? "line-through text-[--muted-foreground]" : "text-white"
                }`}
              >
                {task.title}
              </p>
              <p className="text-xs text-[--muted-foreground] mt-0.5">{task.lead}</p>
            </div>
            <span className="text-xs text-[--muted-foreground]">{task.due}</span>
            <span
              className={`text-xs px-2 py-0.5 rounded border capitalize ${PRIORITY[task.priority]}`}
            >
              {task.priority}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
