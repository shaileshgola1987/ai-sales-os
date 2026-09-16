import cors from "cors";
import express from "express";
import {
  aiFollowup,
  aiWelcome,
  analytics,
  chatByLead,
  conversations,
  customers,
  dashboard,
  leads,
  pipelineByStage,
  quotations,
  suggestedReplies,
  tasks,
  visits,
} from "./data";

const PORT = Number(process.env.API_PORT ?? 43124);

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "ai-sale-os" });
});

app.get("/api/dashboard", (_req, res) => {
  res.json(dashboard());
});

app.get("/api/leads", (_req, res) => {
  res.json(leads);
});

app.post("/api/leads", (req, res) => {
  const body = req.body as Partial<(typeof leads)[number]>;
  if (!body.name || !body.company) {
    res.status(400).json({ error: "Name and company are required." });
    return;
  }
  const next = {
    id: Math.max(...leads.map((l) => l.id)) + 1,
    name: body.name,
    company: body.company,
    phone: body.phone ?? "",
    source: body.source ?? "WhatsApp Direct",
    score: body.score ?? 50,
    temp: body.temp ?? "warm",
    status: body.status ?? "New",
    assigned: body.assigned ?? "Amit D.",
    value: body.value ?? "₹0",
    city: body.city ?? "",
    lastContact: "just now",
    product: body.product ?? "",
  } as (typeof leads)[number];
  leads.unshift(next);
  res.status(201).json(next);
});

app.get("/api/pipeline", (_req, res) => {
  res.json({
    stages: pipelineByStage(),
    summary: "Visual Kanban · 23 active deals · ₹48.6L total value",
  });
});

app.get("/api/whatsapp", (_req, res) => {
  res.json({
    conversations,
    unread: conversations.reduce((n, c) => n + c.unread, 0),
    suggestedReplies,
  });
});

app.get("/api/whatsapp/:id/messages", (req, res) => {
  const id = Number(req.params.id);
  const thread = chatByLead[id] ?? [
    {
      id: 1,
      from: "customer" as const,
      text: conversations.find((c) => c.id === id)?.lastMsg ?? "Hello",
      time: "Just now",
    },
  ];
  res.json(thread);
});

app.post("/api/whatsapp/:id/messages", (req, res) => {
  const id = Number(req.params.id);
  const text = String(req.body?.text ?? "").trim();
  if (!text) {
    res.status(400).json({ error: "Message text is required." });
    return;
  }
  const list = chatByLead[id] ?? [];
  const msg = {
    id: list.length + 1,
    from: "agent" as const,
    text,
    time: new Date().toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
    }),
  };
  if (!chatByLead[id]) chatByLead[id] = list;
  chatByLead[id].push(msg);
  res.status(201).json(msg);
});

app.get("/api/customers", (_req, res) => {
  res.json(customers);
});

app.get("/api/quotations", (_req, res) => {
  res.json(quotations);
});

app.get("/api/tasks", (_req, res) => {
  res.json(tasks);
});

app.patch("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    res.status(404).json({ error: "Task not found." });
    return;
  }
  if (typeof req.body?.done === "boolean") task.done = req.body.done;
  res.json(task);
});

app.get("/api/sfa", (_req, res) => {
  res.json(visits);
});

app.get("/api/assistant/welcome", (_req, res) => {
  res.json({ text: aiWelcome });
});

app.post("/api/assistant/ask", (req, res) => {
  const q = String(req.body?.text ?? "").trim();
  if (!q) {
    res.status(400).json({ error: "Ask a question about your pipeline." });
    return;
  }
  res.json({ text: aiFollowup });
});

app.get("/api/analytics", (_req, res) => {
  res.json(analytics());
});

app.use("/api", (_req, res) => {
  res.status(404).json({ error: "Not found." });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`AI Sale OS API on http://127.0.0.1:${PORT}`);
});
