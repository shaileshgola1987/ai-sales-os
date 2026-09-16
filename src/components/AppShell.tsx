"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV = [
  { id: "dashboard", href: "/", label: "Dashboard", icon: "⬛" },
  { id: "leads", href: "/leads", label: "Leads", icon: "👤", badge: 12 },
  { id: "pipeline", href: "/pipeline", label: "Pipeline", icon: "📊" },
  { id: "whatsapp", href: "/whatsapp", label: "WhatsApp CRM", icon: "💬", badge: 3 },
  { id: "customers", href: "/customers", label: "Customers", icon: "🏢" },
  { id: "quotations", href: "/quotations", label: "Quotations", icon: "📋" },
  { id: "tasks", href: "/tasks", label: "Tasks", icon: "✅", badge: 4 },
  { id: "sfa", href: "/sfa", label: "Field SFA", icon: "📍" },
  { id: "ai-assistant", href: "/ai-assistant", label: "AI Assistant", icon: "🤖" },
  { id: "reports", href: "/reports", label: "Reports", icon: "📈" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="h-screen flex bg-[--background] overflow-hidden">
      <aside
        className={`${collapsed ? "w-16" : "w-56"} flex-shrink-0 flex flex-col border-r border-[--border] bg-[--card] transition-all duration-200`}
      >
        <div className="px-4 py-4 border-b border-[--border] flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[--primary] flex items-center justify-center text-black font-bold text-sm">
                AI
              </div>
              <div>
                <p className="font-display font-bold text-white text-sm leading-none">
                  SalesOS
                </p>
                <p className="text-xs text-[--muted-foreground]">by AI powered</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-lg bg-[--primary] flex items-center justify-center text-black font-bold text-sm mx-auto">
              AI
            </div>
          )}
          {!collapsed && (
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              className="text-[--muted-foreground] hover:text-white text-xs"
            >
              ◀
            </button>
          )}
        </div>
        {collapsed && (
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            className="text-[--muted-foreground] hover:text-white text-xs py-2 text-center"
          >
            ▶
          </button>
        )}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-left transition-all ${
                  active
                    ? "bg-[--primary]/10 text-[--primary] border border-[--primary]/20"
                    : "text-[--muted-foreground] hover:text-white hover:bg-[--secondary]"
                }`}
              >
                <span className="text-base flex-shrink-0">{item.icon}</span>
                {!collapsed && (
                  <>
                    <span className="text-sm font-medium flex-1 truncate">
                      {item.label}
                    </span>
                    {item.badge ? (
                      <span className="bg-[--primary] text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                        {item.badge}
                      </span>
                    ) : null}
                  </>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-[--border]">
          <div className={`flex items-center gap-2.5 ${collapsed ? "justify-center" : ""}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-[--primary] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              AD
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">Amit Desai</p>
                <p className="text-xs text-[--muted-foreground]">Sales Manager</p>
              </div>
            )}
          </div>
        </div>
      </aside>
      <main className="flex-1 min-w-0 overflow-hidden">{children}</main>
    </div>
  );
}
