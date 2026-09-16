import type {
  AnalyticsPayload,
  ChatMessage,
  Conversation,
  Customer,
  DashboardPayload,
  Lead,
  Quotation,
  Task,
  TeamMember,
  Visit,
} from "../src/lib/types";

export const leads: Lead[] = [
  {
    id: 1,
    name: "Vikram Sharma",
    company: "Sharma Industries Pvt Ltd",
    phone: "+91 98765 43210",
    source: "IndiaMART",
    score: 87,
    temp: "hot",
    status: "Qualified",
    assigned: "Rahul K.",
    value: "₹4,20,000",
    city: "Pune",
    lastContact: "2h ago",
    product: "Industrial Pumps",
    gstin: "27AADCS1681G1ZK",
  },
  {
    id: 2,
    name: "Priya Mehta",
    company: "Mehta Electrical Works",
    phone: "+91 87654 32109",
    source: "WhatsApp",
    score: 72,
    temp: "hot",
    status: "Contacted",
    assigned: "Sunita R.",
    value: "₹1,85,000",
    city: "Ahmedabad",
    lastContact: "4h ago",
    product: "Safety Equipment",
  },
  {
    id: 3,
    name: "Ajay Patel",
    company: "Patel Auto Components",
    phone: "+91 76543 21098",
    source: "Meta Ads",
    score: 54,
    temp: "warm",
    status: "New",
    assigned: "Rahul K.",
    value: "₹95,000",
    city: "Surat",
    lastContact: "1d ago",
    product: "Auto Parts",
  },
  {
    id: 4,
    name: "Neha Singh",
    company: "Singh Packaging Solutions",
    phone: "+91 65432 10987",
    source: "Website",
    score: 61,
    temp: "warm",
    status: "Follow-up",
    assigned: "Amit D.",
    value: "₹2,30,000",
    city: "Delhi",
    lastContact: "2d ago",
    product: "Packaging Machinery",
  },
  {
    id: 5,
    name: "Ravi Kumar",
    company: "Kumar Steel & Pipes",
    phone: "+91 54321 09876",
    source: "JustDial",
    score: 38,
    temp: "cold",
    status: "New",
    assigned: "Sunita R.",
    value: "₹60,000",
    city: "Mumbai",
    lastContact: "3d ago",
    product: "Pipes & Fittings",
  },
  {
    id: 6,
    name: "Deepa Nair",
    company: "Nair Textile Machinery",
    phone: "+91 43210 98765",
    source: "IndiaMART",
    score: 79,
    temp: "hot",
    status: "Negotiation",
    assigned: "Amit D.",
    value: "₹8,50,000",
    city: "Coimbatore",
    lastContact: "5h ago",
    product: "Textile Machines",
  },
  {
    id: 7,
    name: "Suresh Reddy",
    company: "Reddy Chemicals Ltd",
    phone: "+91 32109 87654",
    source: "WhatsApp",
    score: 45,
    temp: "warm",
    status: "Contacted",
    assigned: "Rahul K.",
    value: "₹1,10,000",
    city: "Hyderabad",
    lastContact: "1d ago",
    product: "Industrial Chemicals",
  },
  {
    id: 8,
    name: "Kavya Iyer",
    company: "Iyer Hardware Solutions",
    phone: "+91 21098 76543",
    source: "Referral",
    score: 91,
    temp: "hot",
    status: "Proposal Sent",
    assigned: "Amit D.",
    value: "₹3,75,000",
    city: "Chennai",
    lastContact: "3h ago",
    product: "Hardware & Tools",
  },
];

export const pipelineOrder = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal Sent",
  "Negotiation",
  "Won",
] as const;

export function pipelineByStage() {
  const map: Record<string, Lead[]> = {
    New: [],
    Contacted: [],
    Qualified: [],
    "Proposal Sent": [],
    Negotiation: [],
    Won: [],
  };
  for (const lead of leads) {
    if (map[lead.status]) map[lead.status].push(lead);
    else if (lead.status === "Follow-up") map.Contacted.push(lead);
  }
  // Match Figma mapping (status Follow-up stays out of kanban columns as in source)
  map.New = leads.filter((l) => l.status === "New");
  map.Contacted = leads.filter((l) => l.status === "Contacted");
  map.Qualified = leads.filter((l) => l.status === "Qualified");
  map["Proposal Sent"] = leads.filter((l) => l.status === "Proposal Sent");
  map.Negotiation = leads.filter((l) => l.status === "Negotiation");
  map.Won = [];
  return map;
}

export const conversations: Conversation[] = [
  {
    id: 1,
    name: "Vikram Sharma",
    company: "Sharma Industries",
    phone: "+91 98765 43210",
    lastMsg: "Sir, pump ki price list bhej do please",
    time: "2:34 PM",
    unread: 2,
    score: 87,
    status: "hot",
  },
  {
    id: 2,
    name: "Deepa Nair",
    company: "Nair Textile Machinery",
    phone: "+91 43210 98765",
    lastMsg: "Delivery schedule confirm karo",
    time: "1:12 PM",
    unread: 0,
    score: 79,
    status: "hot",
  },
  {
    id: 3,
    name: "Priya Mehta",
    company: "Mehta Electrical",
    phone: "+91 87654 32109",
    lastMsg: "Quotation received, will discuss with team",
    time: "11:45 AM",
    unread: 1,
    score: 72,
    status: "hot",
  },
  {
    id: 4,
    name: "Neha Singh",
    company: "Singh Packaging",
    phone: "+91 65432 10987",
    lastMsg: "Can you visit our factory next week?",
    time: "Yesterday",
    unread: 0,
    score: 61,
    status: "warm",
  },
  {
    id: 5,
    name: "Suresh Reddy",
    company: "Reddy Chemicals",
    phone: "+91 32109 87654",
    lastMsg: "Send product catalogue",
    time: "Yesterday",
    unread: 0,
    score: 45,
    status: "warm",
  },
];

export const chatByLead: Record<number, ChatMessage[]> = {
  1: [
    {
      id: 1,
      from: "customer",
      text: "Hello, mujhe industrial pump chahiye. 3 inch diameter, 5 HP motor.",
      time: "9:12 AM",
    },
    {
      id: 2,
      from: "agent",
      text: "Namaste Vikram ji! Hum Sharma Industries ke liye best pumps provide karte hain. Aap ka usage kya hai - water, chemicals, or slurry?",
      time: "9:15 AM",
    },
    {
      id: 3,
      from: "customer",
      text: "Water transfer ke liye. Factory mein lagana hai. Approx 500 meters distance.",
      time: "9:18 AM",
    },
    {
      id: 4,
      from: "agent",
      text: "Perfect! 3 inch, 5 HP centrifugal pump aapke liye ideal hai. Hamara model SP-350 INR 42,000 mein available hai. Kya main quotation bhej sakta hoon?",
      time: "9:21 AM",
    },
    {
      id: 5,
      from: "customer",
      text: "Haan bhejo. Aur installation bhi karte ho?",
      time: "9:25 AM",
    },
    {
      id: 6,
      from: "agent",
      text: "Bilkul! Installation + 1 year warranty included hai. Quotation abhi bhej raha hoon.",
      time: "9:27 AM",
    },
    {
      id: 7,
      from: "customer",
      text: "Sir, pump ki price list bhej do please",
      time: "2:34 PM",
    },
  ],
};

export const suggestedReplies = [
  "Vikram ji, aapke liye SP-350 pump ki detailed price list attach kar raha hoon. Isme installation aur warranty bhi include hai.",
  "Sir, kya main kal Pune visit schedule kar sakta hoon? Live demo dena chahta hoon.",
];

export const tasks: Task[] = [
  {
    id: 1,
    title: "Follow up with Vikram Sharma on pump quotation",
    lead: "Vikram Sharma",
    due: "Today, 5:00 PM",
    priority: "high",
    done: false,
    type: "call",
  },
  {
    id: 2,
    title: "Send product catalogue to Suresh Reddy",
    lead: "Suresh Reddy",
    due: "Today, 6:00 PM",
    priority: "medium",
    done: false,
    type: "whatsapp",
  },
  {
    id: 3,
    title: "Factory visit at Singh Packaging, Noida",
    lead: "Neha Singh",
    due: "Tomorrow, 11:00 AM",
    priority: "high",
    done: false,
    type: "visit",
  },
  {
    id: 4,
    title: "Quotation approval from Kavya Iyer",
    lead: "Kavya Iyer",
    due: "Tomorrow, 2:00 PM",
    priority: "high",
    done: false,
    type: "email",
  },
  {
    id: 5,
    title: "Demo call with Ajay Patel",
    lead: "Ajay Patel",
    due: "Sep 18, 10:00 AM",
    priority: "medium",
    done: true,
    type: "call",
  },
  {
    id: 6,
    title: "Send GST invoice to Ravi Kumar",
    lead: "Ravi Kumar",
    due: "Sep 18, 3:00 PM",
    priority: "low",
    done: false,
    type: "email",
  },
];

export const quotations: Quotation[] = [
  {
    id: "QT-2026-0089",
    customer: "Kavya Iyer",
    company: "Iyer Hardware Solutions",
    amount: "₹3,75,000",
    status: "Sent",
    date: "Sep 14, 2026",
    items: 5,
    validity: "Sep 21, 2026",
  },
  {
    id: "QT-2026-0088",
    customer: "Deepa Nair",
    company: "Nair Textile Machinery",
    amount: "₹8,50,000",
    status: "Negotiating",
    date: "Sep 12, 2026",
    items: 12,
    validity: "Sep 26, 2026",
  },
  {
    id: "QT-2026-0087",
    customer: "Vikram Sharma",
    company: "Sharma Industries",
    amount: "₹4,20,000",
    status: "Draft",
    date: "Sep 15, 2026",
    items: 3,
    validity: "Sep 29, 2026",
  },
  {
    id: "QT-2026-0086",
    customer: "Neha Singh",
    company: "Singh Packaging",
    amount: "₹2,30,000",
    status: "Approved",
    date: "Sep 10, 2026",
    items: 8,
    validity: "Sep 24, 2026",
  },
  {
    id: "QT-2026-0085",
    customer: "Priya Mehta",
    company: "Mehta Electrical",
    amount: "₹1,85,000",
    status: "Sent",
    date: "Sep 09, 2026",
    items: 4,
    validity: "Sep 23, 2026",
  },
];

export const team: TeamMember[] = [
  {
    name: "Rahul Kumar",
    leads: 34,
    closed: 8,
    target: "₹12L",
    achieved: "₹9.2L",
    pct: 77,
    visits: 18,
    calls: 52,
  },
  {
    name: "Amit Desai",
    leads: 28,
    closed: 11,
    target: "₹15L",
    achieved: "₹14.1L",
    pct: 94,
    visits: 22,
    calls: 67,
  },
  {
    name: "Sunita Rao",
    leads: 19,
    closed: 5,
    target: "₹8L",
    achieved: "₹5.2L",
    pct: 65,
    visits: 12,
    calls: 38,
  },
];

export const customers: Customer[] = [
  {
    name: "Kavya Iyer",
    company: "Iyer Hardware Solutions",
    health: 94,
    lastOrder: "Sep 14",
    orderValue: "₹3.75L",
    orders: 7,
    status: "Active",
  },
  {
    name: "Deepa Nair",
    company: "Nair Textile Machinery",
    health: 78,
    lastOrder: "Aug 28",
    orderValue: "₹8.5L",
    orders: 12,
    status: "Active",
  },
  {
    name: "Vikram Sharma",
    company: "Sharma Industries",
    health: 62,
    lastOrder: "Jul 15",
    orderValue: "₹4.2L",
    orders: 4,
    status: "At Risk",
  },
  {
    name: "Neha Singh",
    company: "Singh Packaging",
    health: 88,
    lastOrder: "Sep 10",
    orderValue: "₹2.3L",
    orders: 9,
    status: "Active",
  },
];

export const visits: Visit[] = [
  {
    salesperson: "Amit Desai",
    company: "Singh Packaging, Noida",
    checkIn: "9:30 AM",
    checkOut: "11:45 AM",
    duration: "2h 15m",
    notes:
      "Demo completed. Client interested in 5-machine order. Follow-up quotation needed.",
    status: "Completed",
    gps: "28.5355° N, 77.3910° E",
  },
  {
    salesperson: "Rahul Kumar",
    company: "Sharma Industries, Pune",
    checkIn: "2:00 PM",
    checkOut: null,
    duration: "Ongoing",
    notes: "",
    status: "Checked In",
    gps: "18.5204° N, 73.8567° E",
  },
  {
    salesperson: "Sunita Rao",
    company: "Reddy Chemicals, Hyderabad",
    checkIn: "10:00 AM",
    checkOut: "12:30 PM",
    duration: "2h 30m",
    notes: "Prospecting visit. Requested catalogue. Low interest currently.",
    status: "Completed",
    gps: "17.3850° N, 78.4867° E",
  },
];

export const aiWelcome = `Here's a briefing on Vikram Sharma (Sharma Industries):

🔥 AI Score: 87/100 (HOT)

📌 Key Facts:
- 3" / 5HP centrifugal pump inquiry, water transfer
- Budget discussed: ~₹42,000 per unit (multiple units likely)
- Last contact: 2 hours ago via WhatsApp
- Location: Pune, Maharashtra

✅ Recommended Next Actions:
1. Send detailed product catalogue + pricing today
2. Schedule Pune factory visit this week
3. Prepare quotation for 3-5 pump units

💡 AI Insight: High purchase intent — mentions specific specs and asked about installation. Closing probability: 74%`;

export const aiFollowup =
  "Analyzing your query... Based on the current pipeline data, here's my recommendation for this lead. Their engagement score has increased 12 points this week, suggesting active consideration. I recommend a follow-up call within 4 hours.";

export function dashboard(): DashboardPayload {
  const hour = new Date().getHours();
  const greet =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const date = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(new Date());

  return {
    greeting: `${date} · ${greet}, Amit`,
    kpis: [
      {
        label: "Total Leads",
        value: "1,284",
        sub: "+87 this week",
        icon: "👤",
        color: "text-violet-400",
        border: "border-violet-500/20",
      },
      {
        label: "Hot Leads",
        value: "142",
        sub: "Score 70+",
        icon: "🔥",
        color: "text-red-400",
        border: "border-red-500/20",
      },
      {
        label: "Pipeline Value",
        value: "₹48.6L",
        sub: "23 active deals",
        icon: "💰",
        color: "text-green-400",
        border: "border-green-500/20",
      },
      {
        label: "WhatsApp Msgs",
        value: "3,847",
        sub: "Today's volume",
        icon: "💬",
        color: "text-emerald-400",
        border: "border-emerald-500/20",
      },
      {
        label: "Quotations",
        value: "₹22.4L",
        sub: "Pending approval",
        icon: "📋",
        color: "text-cyan-400",
        border: "border-cyan-500/20",
      },
      {
        label: "Conversion Rate",
        value: "18.4%",
        sub: "+2.1% vs last month",
        icon: "📈",
        color: "text-amber-400",
        border: "border-amber-500/20",
      },
    ],
    funnel: [
      { stage: "New Leads", count: 1284, pct: 100, color: "bg-violet-500" },
      { stage: "Contacted", count: 847, pct: 66, color: "bg-blue-500" },
      { stage: "Qualified", count: 412, pct: 32, color: "bg-cyan-500" },
      { stage: "Proposal", count: 156, pct: 12, color: "bg-amber-500" },
      { stage: "Won", count: 48, pct: 4, color: "bg-green-500" },
    ],
    conversion: "3.7%",
    team,
    activity: [
      {
        text: "Rahul K. closed deal with Ravi Kumar",
        time: "5m ago",
        icon: "✅",
        color: "text-green-400",
      },
      {
        text: "New lead from IndiaMART: Sharma Industries",
        time: "12m ago",
        icon: "📥",
        color: "text-violet-400",
      },
      {
        text: "AI scored Kavya Iyer at 91 — Hot lead",
        time: "18m ago",
        icon: "🤖",
        color: "text-emerald-400",
      },
      {
        text: "Quotation QT-0089 sent to Iyer Hardware",
        time: "34m ago",
        icon: "📤",
        color: "text-cyan-400",
      },
      {
        text: "Amit D. checked in at Singh Packaging factory",
        time: "1h ago",
        icon: "📍",
        color: "text-amber-400",
      },
      {
        text: "WhatsApp template sent to 50 leads",
        time: "2h ago",
        icon: "💬",
        color: "text-blue-400",
      },
    ],
    hotLeads: leads.filter((l) => l.temp === "hot"),
  };
}

export function analytics(): AnalyticsPayload {
  return {
    updated: "September 2026 · Updated 5 min ago",
    kpis: [
      { label: "MRR", value: "₹25,000", change: "+12%", up: true },
      { label: "Avg Deal Size", value: "₹2.8L", change: "+8%", up: true },
      { label: "Win Rate", value: "18.4%", change: "+2.1%", up: true },
      { label: "Avg Response", value: "47 min", change: "-18%", up: true },
    ],
    sources: [
      { source: "IndiaMART", leads: 412, pct: 32 },
      { source: "WhatsApp Direct", leads: 298, pct: 23 },
      { source: "Meta Ads", leads: 219, pct: 17 },
      { source: "JustDial", leads: 181, pct: 14 },
      { source: "Website", leads: 116, pct: 9 },
      { source: "Referral", leads: 58, pct: 5 },
    ],
    scores: [
      { range: "81–100 (Hot 🔥)", count: 142, color: "bg-red-500", pct: 11 },
      { range: "61–80 (Warm 🟡)", count: 389, color: "bg-amber-500", pct: 30 },
      { range: "41–60 (Cool)", count: 512, color: "bg-blue-500", pct: 40 },
      { range: "0–40 (Cold ❄️)", count: 241, color: "bg-slate-500", pct: 19 },
    ],
    team,
  };
}
