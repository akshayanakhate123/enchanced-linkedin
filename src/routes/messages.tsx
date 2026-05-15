import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { findUser } from "@/lib/data";
import { useAllMessages } from "@/lib/store";
import { useState } from "react";
import { ArrowLeft, MoreHorizontal, PenSquare, Search } from "lucide-react";

export const Route = createFileRoute("/messages")({ component: MsgPage });

function MsgPage() {
  const nav = useNavigate();
  const [folder, setFolder] = useState("Focus");
  const messages = useAllMessages();
  const list = messages.filter((m) => m.folder === folder);
  return (
    <div className="min-h-screen bg-background flex flex-col max-w-[480px] mx-auto">
      <header className="flex items-center gap-2 p-3 border-b border-border">
        <button onClick={() => nav({ to: "/" })}><ArrowLeft className="h-6 w-6" /></button>
        <div className="flex-1 flex items-center gap-2 bg-secondary rounded-full px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input placeholder="Search messages" className="bg-transparent outline-none text-sm flex-1" />
        </div>
        <MoreHorizontal className="h-5 w-5" />
        <PenSquare className="h-5 w-5" />
      </header>
      <div className="flex border-b border-border bg-card">
        {["Focus", "Other", "Alpine"].map((f) => (
          <button key={f} onClick={() => setFolder(f)} className={`flex-1 py-3 text-sm relative ${folder === f ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
            {f}
            {folder === f && <span className="absolute bottom-0 inset-x-6 h-0.5 bg-accent" />}
          </button>
        ))}
      </div>
      <div className="flex gap-2 px-3 py-3 overflow-x-auto no-scrollbar border-b border-border">
        {["Unread", "Drafts", "InMail", "All filters"].map((f) => (
          <button key={f} className="px-4 py-1.5 rounded-full text-xs border border-border whitespace-nowrap">{f}</button>
        ))}
      </div>
      <div className="divide-y divide-border flex-1 overflow-y-auto">
        {list.map((m) => {
          const u = findUser(m.participantId);
          return (
            <div key={m.id} className="flex items-start gap-3 p-4">
              <img src={u.avatar} className="h-12 w-12 rounded-full" alt="" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-sm">{u.name}</div>
                  <div className="text-xs text-muted-foreground">{m.timestamp}</div>
                </div>
                {m.badge && <span className="inline-block text-[10px] font-semibold uppercase tracking-wide bg-accent/20 text-accent rounded px-1.5 py-0.5 my-1">{m.badge}</span>}
                <div className={`text-sm line-clamp-2 ${m.unread ? "text-foreground font-medium" : "text-muted-foreground"}`}>{m.lastMessage}</div>
              </div>
              {m.unread && <span className="h-2.5 w-2.5 rounded-full bg-primary mt-2" />}
            </div>
          );
        })}
      </div>
      <button className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center">
        <PenSquare className="h-6 w-6" />
      </button>
    </div>
  );
}