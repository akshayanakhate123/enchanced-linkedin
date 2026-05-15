import { createFileRoute } from "@tanstack/react-router";
import { AppShell, VerifiedBadge } from "@/components/Layout";
import { jobs, findUser, currentUser } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { IntentSheet } from "@/components/IntentSheet";
import { useApp } from "@/lib/store";
import { X, Bookmark, ListChecks, Briefcase } from "lucide-react";

export const Route = createFileRoute("/jobs")({ component: JobsPage });

function JobsPage() {
  const [target, setTarget] = useState<{ user: any; company: string; role: string } | null>(null);
  const { pendingConnections } = useApp();
  return (
    <AppShell>
      <div className="flex gap-2 px-3 py-3 overflow-x-auto no-scrollbar bg-card border-b border-border">
        {["Preferences", "Job tracker", "Post a free job"].map((p) => (
          <button key={p} className="px-4 py-1.5 rounded-full text-xs border border-border whitespace-nowrap">{p}</button>
        ))}
      </div>
      <section className="bg-card mx-3 mt-3 rounded-xl border border-border p-4 grid grid-cols-3 gap-2 text-center">
        {[
          { icon: Bookmark, label: "Saved", count: 12 },
          { icon: ListChecks, label: "Applied", count: 5 },
          { icon: Briefcase, label: "Interviewing", count: 2 },
        ].map((s) => {
          const I = s.icon;
          return (
            <div key={s.label}>
              <I className="h-5 w-5 mx-auto text-primary" />
              <div className="text-lg font-semibold mt-1">{s.count}</div>
              <div className="text-[11px] text-muted-foreground">{s.label}</div>
            </div>
          );
        })}
      </section>
      <section className="bg-card mt-3 p-4">
        <h2 className="font-bold text-lg">Top job picks for you</h2>
        <p className="text-xs text-muted-foreground">Based on your profile, preferences, and activity like applies, searches, and saves</p>
      </section>
      <div className="divide-y divide-border bg-card">
        {jobs.map((j) => {
          const poster = findUser(j.postedById);
          const pending = pendingConnections.has(poster.id);
          return (
            <div key={j.id} className="p-4 flex gap-3">
              <div className="h-12 w-12 rounded-md flex items-center justify-center text-white font-bold shrink-0" style={{ background: j.logoColor }}>{j.logo}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold flex items-center gap-1">{j.role} <VerifiedBadge /></div>
                <div className="text-xs">{j.company}</div>
                <div className="text-xs text-muted-foreground">{j.location} · {j.salary}</div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                  <img src={poster.avatar} className="h-4 w-4 rounded-full object-cover" alt="" />
                  Posted by {poster.name.split(" ")[0]}
                </div>
                <Button
                  size="sm"
                  disabled={pending}
                  onClick={() => setTarget({ user: poster, company: j.company, role: j.role })}
                  className={`mt-2 rounded-full h-8 text-xs ${pending ? "bg-muted text-muted-foreground" : "bg-accent hover:bg-accent/90 text-accent-foreground"}`}
                >
                  {pending ? "Pending" : "Ask for Referral"}
                </Button>
              </div>
              <X className="h-5 w-5 text-muted-foreground" />
            </div>
          );
        })}
      </div>
      <section className="bg-card mt-3 p-4 flex items-center gap-3">
        <img src={currentUser.avatar} className="h-12 w-12 rounded-full object-cover" alt="" />
        <div className="text-sm font-semibold flex-1">Apply smarter with jobs personalized for you</div>
      </section>
      <IntentSheet
        open={!!target}
        onOpenChange={(o) => !o && setTarget(null)}
        target={target?.user ?? null}
        prefilledIntent="referral"
        prefilledCompany={target?.company}
        prefilledRole={target?.role}
      />
    </AppShell>
  );
}
