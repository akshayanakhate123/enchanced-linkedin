import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/Layout";
import { findUser } from "@/lib/data";
import { useAllNotifications } from "@/lib/store";
import { useState } from "react";
import { MoreHorizontal } from "lucide-react";

export const Route = createFileRoute("/notifications")({ component: NotifPage });

function NotifPage() {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Jobs", "My posts", "Mentions"];
  const notifications = useAllNotifications();
  const list = filter === "All" ? notifications
    : filter === "Jobs" ? notifications.filter((n) => n.type === "job")
    : filter === "Mentions" ? notifications.filter((n) => n.type === "mention")
    : notifications.filter((n) => n.type === "like" || n.type === "view");

  return (
    <AppShell>
      <div className="flex gap-2 px-3 py-3 overflow-x-auto no-scrollbar bg-card border-b border-border">
        {filters.map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-full text-xs border whitespace-nowrap ${filter === f ? "bg-accent/20 text-accent border-accent" : "border-border"}`}>{f}</button>
        ))}
      </div>
      <div className="divide-y divide-border bg-card">
        {list.map((n) => {
          const u = findUser(n.avatarId);
          return (
            <div key={n.id} className="flex items-start gap-3 p-4">
              <img src={u.avatar} className="h-12 w-12 rounded-full" alt="" />
              <div className="flex-1 min-w-0">
                {n.badge && (
                  <span className="inline-block text-[10px] font-semibold uppercase tracking-wide bg-accent/20 text-accent rounded px-1.5 py-0.5 mb-1">{n.badge}</span>
                )}
                <div className="text-sm"><span className="font-semibold">{n.content.split(" ").slice(0, 2).join(" ")}</span> {n.content.split(" ").slice(2).join(" ")}</div>
                <div className="text-xs text-muted-foreground line-clamp-1">{n.preview}</div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs text-muted-foreground">{n.timestamp}</span>
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}