import { createFileRoute } from "@tanstack/react-router";
import { AppShell, VerifiedBadge } from "@/components/Layout";
import { users, invitations, currentUser, posts, findUser, cohortPulse, salaryBenchmark } from "@/lib/data";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConnectButton } from "@/components/IntentSheet";
import { X, Check, ChevronRight, ChevronDown, Sparkles } from "lucide-react";

export const Route = createFileRoute("/network")({ component: NetworkPage });

function NetworkPage() {
  const [tab, setTab] = useState<"grow" | "catch" | "cohort">("grow");
  return (
    <AppShell>
      <div className="flex border-b border-border bg-card">
        {[
          { id: "grow", label: "Grow" },
          { id: "catch", label: "Catch up" },
          { id: "cohort", label: "My Cohort" },
        ].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id as any)} className={`flex-1 py-3 text-sm relative ${tab === t.id ? "text-accent font-semibold" : "text-muted-foreground"}`}>
            {t.label}
            {tab === t.id && <span className="absolute bottom-0 inset-x-4 h-0.5 bg-accent rounded-full" />}
          </button>
        ))}
      </div>
      {tab === "grow" && <GrowTab />}
      {tab === "catch" && <CatchTab />}
      {tab === "cohort" && <CohortTab />}
    </AppShell>
  );
}

function GrowTab() {
  const alumni = users.filter((u) => u.isVerifiedAlum);
  return (
    <div className="space-y-2">
      <section className="bg-card p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Invitations ({invitations.length})</h2>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="mt-3 space-y-3">
          {invitations.map((inv) => (
            <div key={inv.id} className="flex items-center gap-3">
              {inv.avatarId ? (
                <img src={findUser(inv.avatarId).avatar} className="h-12 w-12 rounded-lg" alt="" />
              ) : (
                <div className="h-12 w-12 rounded-lg flex items-center justify-center text-white font-bold" style={{ background: inv.logoColor }}>{inv.logo}</div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-xs text-muted-foreground">{inv.subtitle}</div>
                <div className="text-sm font-semibold line-clamp-2">{inv.title}</div>
                <div className="text-xs text-muted-foreground">{inv.time}</div>
              </div>
              <button className="h-9 w-9 rounded-full border border-border flex items-center justify-center"><X className="h-4 w-4" /></button>
              <button className="h-9 w-9 rounded-full border border-primary text-primary flex items-center justify-center"><Check className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
        <button className="text-sm text-muted-foreground mt-3">Manage</button>
      </section>

      <section className="bg-card p-4">
        <h3 className="font-semibold text-sm mb-3">People you may know based on your recent activity</h3>
        <div className="flex gap-3 overflow-x-auto -mx-4 px-4 no-scrollbar">
          {alumni.map((u) => (
            <PersonTile key={u.id} user={u} />
          ))}
        </div>
      </section>

      <section className="bg-card p-4">
        <h3 className="font-semibold text-sm mb-3">From your school</h3>
        <div className="flex gap-3 overflow-x-auto -mx-4 px-4 no-scrollbar">
          {users.filter((u) => u.gradYear === 2027 && u.id !== currentUser.id).slice(0, 6).map((u) => (
            <PersonTile key={u.id} user={u} />
          ))}
        </div>
      </section>
    </div>
  );
}

function PersonTile({ user }: { user: any }) {
  return (
    <div className="w-40 shrink-0 bg-card border border-border rounded-lg p-3 flex flex-col items-center text-center">
      <img src={user.avatar} className="h-16 w-16 rounded-full bg-muted" alt="" />
      <div className="text-sm font-semibold mt-2 line-clamp-1 flex items-center gap-1">{user.name} {user.isVerifiedAlum && <VerifiedBadge />}</div>
      <div className="text-xs text-muted-foreground line-clamp-2 h-8 mt-0.5">{user.headline}</div>
      <div className="text-[10px] text-muted-foreground mt-1">12 mutual</div>
      <div className="mt-2 w-full">
        <ConnectButton user={user} />
      </div>
    </div>
  );
}

function CatchTab() {
  const pills = ["All", "Job changes", "Birthdays", "Work anniversaries", "Education"];
  const [active, setActive] = useState("All");
  const cohort = users.filter((u) => u.id.startsWith("c")).slice(0, 6);
  return (
    <div>
      <div className="flex gap-2 px-3 py-3 overflow-x-auto no-scrollbar bg-card border-b border-border">
        {pills.map((p) => (
          <button key={p} onClick={() => setActive(p)} className={`px-4 py-1.5 rounded-full text-xs whitespace-nowrap border ${active === p ? "bg-accent/20 text-accent border-accent" : "border-border text-foreground"}`}>{p}</button>
        ))}
      </div>
      <div className="bg-card mt-2">
        {cohort.map((u, i) => (
          <div key={u.id} className={`flex items-start gap-3 p-4 ${i === 0 ? "bg-primary/10" : ""} border-b border-border`}>
            <img src={u.avatar} className="h-14 w-14 rounded-full" alt="" />
            <div className="flex-1">
              <div className="font-semibold text-sm">{u.name}</div>
              <div className="text-sm text-muted-foreground">{i === 0 ? "Started a new position as Senior Analyst at Genpact" : `Celebrate ${u.name.split(" ")[0]}'s recent birthday on May ${12 - i}`}</div>
              <Button variant="outline" size="sm" className="mt-2 rounded-full border-primary text-primary text-xs h-8">
                {i === 0 ? "✈ Congrats..." : "✈ Happy belated birthday!"}
              </Button>
            </div>
            {i === 0 && <div className="text-xs text-muted-foreground">👍 4 💬 1</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function CohortTab() {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Placements", "Internships", "Projects", "Wins"];
  const cohortPosts = posts.filter((p) => p.id.startsWith("c"));
  const [showSalary, setShowSalary] = useState(false);
  return (
    <div className="space-y-2">
      <section className="bg-gradient-to-br from-primary/30 to-accent/20 m-3 rounded-xl p-4 border border-primary/30">
        <div className="text-xs text-accent font-semibold uppercase tracking-wide">Your cohort</div>
        <div className="text-lg font-bold mt-1">Class of 2027 · SSB</div>
        <div className="text-sm text-muted-foreground">247 classmates</div>
      </section>
      <section className="bg-card mx-3 rounded-xl p-4 border border-accent/40 flex gap-3 items-center">
        <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center"><Sparkles className="h-5 w-5 text-accent" /></div>
        <p className="text-sm">{cohortPulse}</p>
      </section>
      <div className="flex gap-2 px-3 py-2 overflow-x-auto no-scrollbar">
        {filters.map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-full text-xs whitespace-nowrap border ${filter === f ? "bg-accent text-accent-foreground border-accent" : "border-border"}`}>{f}</button>
        ))}
      </div>
      <div className="space-y-2">
        {cohortPosts.map((p) => {
          const u = findUser(p.authorId);
          return (
            <article key={p.id} className="bg-card p-4">
              <div className="flex items-start gap-3">
                <img src={u.avatar} className="h-11 w-11 rounded-full" alt="" />
                <div className="flex-1">
                  <div className="text-sm font-semibold flex items-center gap-1">{u.name} <VerifiedBadge /></div>
                  <div className="text-xs text-muted-foreground line-clamp-1">{u.headline}</div>
                  <div className="text-xs text-muted-foreground">{p.timestamp}</div>
                </div>
              </div>
              <p className="text-sm mt-3">{p.content}</p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" className="rounded-full h-8 bg-accent hover:bg-accent/90 text-accent-foreground">🎉 Congratulate</Button>
                <Button size="sm" variant="outline" className="rounded-full h-8">Comment</Button>
              </div>
            </article>
          );
        })}
      </div>
      <section className="bg-card mx-3 mt-3 rounded-xl border border-border overflow-hidden">
        <button onClick={() => setShowSalary(!showSalary)} className="w-full p-4 flex items-center justify-between">
          <div className="text-left">
            <div className="font-semibold text-sm">Salary benchmark by function</div>
            <div className="text-xs text-muted-foreground">Anonymized · Class of 2027</div>
          </div>
          <ChevronDown className={`h-5 w-5 transition ${showSalary ? "rotate-180" : ""}`} />
        </button>
        {showSalary && (
          <div className="border-t border-border divide-y divide-border">
            {salaryBenchmark.map((b) => (
              <div key={b.function} className="flex items-center justify-between p-3 text-sm">
                <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: b.color }} /> {b.function}</span>
                <span className="font-semibold">{b.median} median</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}