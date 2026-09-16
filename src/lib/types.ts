export type Temp = "hot" | "warm" | "cold";

export type Lead = {
  id: number;
  name: string;
  company: string;
  phone: string;
  source: string;
  score: number;
  temp: Temp;
  status: string;
  assigned: string;
  value: string;
  city: string;
  lastContact: string;
  product: string;
  gstin?: string;
};

export type Conversation = {
  id: number;
  name: string;
  company: string;
  phone: string;
  lastMsg: string;
  time: string;
  unread: number;
  score: number;
  status: Temp;
};

export type ChatMessage = {
  id: number;
  from: "customer" | "agent";
  text: string;
  time: string;
};

export type Task = {
  id: number;
  title: string;
  lead: string;
  due: string;
  priority: "high" | "medium" | "low";
  done: boolean;
  type: "call" | "whatsapp" | "visit" | "email";
};

export type Quotation = {
  id: string;
  customer: string;
  company: string;
  amount: string;
  status: string;
  date: string;
  items: number;
  validity: string;
};

export type TeamMember = {
  name: string;
  leads: number;
  closed: number;
  target: string;
  achieved: string;
  pct: number;
  visits: number;
  calls: number;
};

export type Customer = {
  name: string;
  company: string;
  health: number;
  lastOrder: string;
  orderValue: string;
  orders: number;
  status: "Active" | "At Risk";
};

export type Visit = {
  salesperson: string;
  company: string;
  checkIn: string;
  checkOut: string | null;
  duration: string;
  notes: string;
  status: string;
  gps: string;
};

export type Kpi = {
  label: string;
  value: string;
  sub: string;
  icon: string;
  color: string;
  border: string;
};

export type FunnelStage = {
  stage: string;
  count: number;
  pct: number;
  color: string;
};

export type Activity = {
  text: string;
  time: string;
  icon: string;
  color: string;
};

export type DashboardPayload = {
  greeting: string;
  kpis: Kpi[];
  funnel: FunnelStage[];
  conversion: string;
  team: TeamMember[];
  activity: Activity[];
  hotLeads: Lead[];
};

export type AnalyticsPayload = {
  kpis: { label: string; value: string; change: string; up: boolean }[];
  sources: { source: string; leads: number; pct: number }[];
  scores: { range: string; count: number; color: string; pct: number }[];
  team: TeamMember[];
  updated: string;
};
