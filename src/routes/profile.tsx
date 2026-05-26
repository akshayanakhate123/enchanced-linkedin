import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { currentUser, users, profileBanner, findUser } from "@/lib/data";
import { VerifiedBadge } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search, Settings, Pencil, MoreHorizontal, Calendar, Plus, CalendarCheck, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useApp } from "@/lib/store";
import { useTheme } from "@/lib/theme";

export const Route = createFileRoute("/profile")({ component: ProfilePage });

function ProfilePage() {
  const nav = useNavigate();
  const alum = users.find((u) => u.offersOfficeHours)!;
  const { bookings } = useApp();
  const myBooking = bookings.find((b) => b.alumId === alum.id);

  return (
    <div className="min-h-screen bg-background max-w-[480px] mx-auto pb-10">
      <header className="flex items-center gap-2 p-3 sticky top-0 bg-background/95 backdrop-blur z-30 border-b border-border">
        <button onClick={() => nav({ to: "/" })}><ArrowLeft className="h-6 w-6" /></button>
        <div className="flex-1 flex items-center gap-2 bg-secondary rounded-full px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input placeholder="Search" className="bg-transparent outline-none text-sm flex-1" />
        </div>
        <Settings className="h-6 w-6" />
      </header>

      {myBooking && (
        <div className="bg-accent/15 border-b border-accent/40 px-4 py-2 flex items-center gap-2 text-sm">
          <CalendarCheck className="h-4 w-4 text-accent" />
          <span>You have an upcoming session with {findUser(myBooking.alumId).name.split(" ")[0]} on {myBooking.date} · {myBooking.time}</span>
        </div>
      )}

      <div className="relative">
        <img src={profileBanner} className="h-28 w-full object-cover" alt="banner" />
        <img src={currentUser.avatar} className="absolute left-4 -bottom-10 h-24 w-24 rounded-full border-4 border-background bg-card object-cover" alt="" />
        <button className="absolute right-3 -bottom-3 h-8 w-8 rounded-full bg-card border border-border flex items-center justify-center"><Pencil className="h-4 w-4" /></button>
      </div>

      <div className="px-4 pt-12">
        <div className="text-xl font-bold flex items-center gap-1.5">{currentUser.name} <VerifiedBadge /> <span className="text-sm font-normal text-muted-foreground">She/Her</span></div>
        <p className="text-sm mt-1">{currentUser.headline}</p>
        <p className="text-sm text-muted-foreground mt-1">Accenture · Scaler School Of Business</p>
        <p className="text-sm text-muted-foreground">{currentUser.location}</p>
        <p className="text-sm text-primary font-semibold mt-1">500+ connections</p>

        <div className="flex gap-2 mt-3">
          <Button className="rounded-full bg-primary text-primary-foreground flex-1">Open to</Button>
          <Button variant="outline" className="rounded-full border-primary text-primary flex-1">Add section</Button>
          <button className="h-9 w-9 rounded-full border border-border flex items-center justify-center"><MoreHorizontal className="h-5 w-5" /></button>
        </div>
        <Button variant="outline" className="rounded-full border-primary text-primary w-full mt-2">Enhance profile</Button>
      </div>

      <section className="bg-card mt-3 p-4 mx-3 rounded-xl border border-border">
        <h3 className="font-semibold">Analytics</h3>
        <p className="text-xs text-muted-foreground mb-3">👁 Private to you</p>
        <div className="space-y-2 text-sm">
          <div>👥 <span className="font-semibold">147</span> profile views <span className="text-muted-foreground">this week</span></div>
          <div>📊 <span className="font-semibold">1,247</span> post impressions</div>
          <div>🔍 <span className="font-semibold">38</span> search appearances</div>
        </div>
      </section>

      <OfficeHoursCard alum={alum} />

      <section className="bg-card mt-3 p-4 mx-3 rounded-xl border border-border">
        <h3 className="font-semibold mb-2">About</h3>
        <p className="text-sm text-muted-foreground">MBA candidate at Scaler School of Business, Class of 2027. Passionate about consumer tech and fintech. Previously Salesforce Application Developer at Accenture, 4x Salesforce certified.</p>
      </section>

      {[
        { title: "Experience", items: [
          { primary: "MBA Candidate", secondary: "Scaler School of Business · 2025 - 2027" },
          { primary: "Salesforce Application Developer", secondary: "Accenture · 2022 - 2025" },
        ]},
        { title: "Education", items: [
          { primary: "Scaler School of Business", secondary: "PGP, Mgt and Tech · 2025 - 2027", verified: true },
          { primary: "VIT Vellore", secondary: "B.Tech, Computer Science · 2018 - 2022" },
        ]},
        { title: "Skills", items: [
          { primary: "Salesforce Apex · Endorsed by 24" },
          { primary: "Product Management · Endorsed by 18" },
          { primary: "Data Management · Endorsed by 15" },
          { primary: "Strategy · Endorsed by 12" },
          { primary: "SQL · Endorsed by 9" },
        ]},
      ].map((section) => (
        <section key={section.title} className="bg-card mt-3 p-4 mx-3 rounded-xl border border-border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">{section.title}</h3>
            <Plus className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {section.items.map((it: any, i: number) => (
              <div key={i}>
                <div className="text-sm font-medium flex items-center gap-1">{it.primary} {it.verified && <VerifiedBadge />}</div>
                {it.secondary && <div className="text-xs text-muted-foreground">{it.secondary}</div>}
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className="bg-card mt-3 p-4 mx-3 rounded-xl border border-border">
        <h3 className="font-semibold mb-3">People you may know</h3>
        <div className="flex gap-3 overflow-x-auto -mx-1 px-1 no-scrollbar">
          {users.filter((u) => u.isVerifiedAlum).slice(0, 5).map((u) => (
            <div key={u.id} className="w-32 shrink-0 text-center border border-border rounded-lg p-3">
              <img src={u.avatar} className="h-14 w-14 rounded-full mx-auto object-cover" alt="" />
              <div className="text-xs font-semibold mt-2 line-clamp-1">{u.name}</div>
              <div className="text-[10px] text-muted-foreground line-clamp-2 h-7">{u.headline}</div>
            </div>
          ))}
        </div>
      </section>

      <AppearanceToggle />
    </div>
  );
}

function AppearanceToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <section className="bg-card mt-3 p-4 mx-3 rounded-xl border border-border">
      <h3 className="font-semibold mb-1">Appearance</h3>
      <p className="text-xs text-muted-foreground mb-3">Choose how AluLink looks on this device.</p>
      <div className="grid grid-cols-2 gap-2 p-1 rounded-full bg-secondary/60 border border-border">
        <button
          onClick={() => setTheme("light")}
          className={`flex items-center justify-center gap-2 py-2 rounded-full text-sm font-medium transition-all ${
            theme === "light" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Sun className="h-4 w-4" /> Light Mode
        </button>
        <button
          onClick={() => setTheme("dark")}
          className={`flex items-center justify-center gap-2 py-2 rounded-full text-sm font-medium transition-all ${
            theme === "dark" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Moon className="h-4 w-4" /> Dark Mode
        </button>
      </div>
    </section>
  );
}

function OfficeHoursCard({ alum }: { alum: typeof currentUser }) {
  const { bookedSlotIds, bookSlot } = useApp();
  const [open, setOpen] = useState(false);
  const [chosen, setChosen] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const allSlots = (alum.officeHoursSlots ?? []).filter((s) => !bookedSlotIds.has(s.id));
  const visible = allSlots.slice(0, 3);

  const confirm = () => {
    const s = allSlots.find((x) => x.id === chosen);
    if (!s) return;
    bookSlot(alum.id, s.id, s.date, s.time);
    toast.success(`Booked Office Hours with ${alum.name}`, { description: `${s.date} · ${s.time}` });
    setOpen(false); setChosen(null); setNote("");
  };

  return (
    <section className="bg-card mt-3 p-4 mx-3 rounded-xl border-2 border-accent/40 relative overflow-hidden">
      <div className="absolute top-0 right-0 bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-bl-lg">New</div>
      <div className="flex items-center gap-2">
        <div className="h-9 w-9 rounded-full bg-accent/20 flex items-center justify-center"><Calendar className="h-5 w-5 text-accent" /></div>
        <div>
          <h3 className="font-semibold">Office Hours available</h3>
          <p className="text-xs text-muted-foreground">with {alum.name} · {alum.role}</p>
        </div>
      </div>
      <div className="mt-3 space-y-2">
        {visible.length === 0 && <p className="text-sm text-muted-foreground">No upcoming slots.</p>}
        {visible.map((s) => (
          <div key={s.id} className="w-full p-3 rounded-lg bg-secondary/40 border border-border">
            <div className="text-sm font-medium">{s.date} · {s.time}</div>
            <div className="text-xs text-muted-foreground">{s.duration} · {s.price}</div>
          </div>
        ))}
      </div>
      <Button className="rounded-full w-full mt-3 bg-primary" disabled={visible.length === 0} onClick={() => { setChosen(visible[0]?.id ?? null); setOpen(true); }}>Book a slot</Button>

      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setChosen(null); }}>
        <DialogContent className="bg-card border-border max-w-sm">
          <DialogHeader><DialogTitle>Book Office Hours</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              {allSlots.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setChosen(s.id)}
                  className={`w-full p-3 rounded-lg border text-left ${chosen === s.id ? "border-primary bg-primary/10" : "border-border bg-secondary/40"}`}
                >
                  <div className="text-sm font-medium">{s.date} · {s.time}</div>
                  <div className="text-xs text-muted-foreground">{s.duration} · {s.price}</div>
                </button>
              ))}
            </div>
            <Textarea placeholder="Add a note (optional)" value={note} onChange={(e) => setNote(e.target.value)} className="bg-secondary border-border" />
            <Button className="w-full rounded-full" disabled={!chosen} onClick={confirm}>Confirm Booking</Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
