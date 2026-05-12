import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Briefcase, Target, Lightbulb, Handshake, Check } from "lucide-react";
import { toast } from "sonner";
import type { User } from "@/lib/data";

const INTENTS = [
  { id: "office", icon: Calendar, emoji: "📅", title: "Office Hours", sub: "Book a 15-min slot" },
  { id: "referral", icon: Briefcase, emoji: "💼", title: "Referral Ask", sub: "Ask for a referral at their company" },
  { id: "mentor", icon: Target, emoji: "🎯", title: "Mentorship", sub: "Recurring guidance over 3 months" },
  { id: "question", icon: Lightbulb, emoji: "💡", title: "Industry Question", sub: "One-off async question" },
  { id: "general", icon: Handshake, emoji: "🤝", title: "General Networking", sub: "Just connect, no specific ask" },
] as const;

export function IntentSheet({ open, onOpenChange, target }: { open: boolean; onOpenChange: (o: boolean) => void; target: User | null }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [success, setSuccess] = useState(false);

  const reset = () => { setSelected(null); setText(""); setSuccess(false); };

  const send = () => {
    setSuccess(true);
    toast.success("Request sent", { description: "You have 4 referral asks remaining this week" });
    setTimeout(() => { onOpenChange(false); reset(); }, 1400);
  };

  return (
    <Sheet open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) reset(); }}>
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[88vh] overflow-y-auto bg-card border-border">
        {success ? (
          <div className="py-12 flex flex-col items-center text-center gap-3">
            <div className="h-14 w-14 rounded-full bg-accent/20 flex items-center justify-center">
              <Check className="h-7 w-7 text-accent" />
            </div>
            <h3 className="text-lg font-semibold">Request sent</h3>
            <p className="text-sm text-muted-foreground">You have 4 referral asks remaining this week</p>
          </div>
        ) : !selected ? (
          <>
            <SheetHeader>
              <SheetTitle className="text-left">What's the intent of this connection?</SheetTitle>
              <p className="text-sm text-muted-foreground text-left">
                Connecting with <span className="text-foreground font-medium">{target?.name}</span>
              </p>
            </SheetHeader>
            <div className="space-y-2 mt-4">
              {INTENTS.map((i) => (
                <button
                  key={i.id}
                  onClick={() => setSelected(i.id)}
                  className="w-full text-left p-4 rounded-xl border border-border bg-secondary/40 hover:bg-secondary transition flex items-start gap-3"
                >
                  <span className="text-2xl">{i.emoji}</span>
                  <div>
                    <div className="font-semibold">{i.title}</div>
                    <div className="text-sm text-muted-foreground">{i.sub}</div>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <SheetHeader>
              <SheetTitle className="text-left flex items-center gap-2">
                {INTENTS.find((x) => x.id === selected)?.emoji} {INTENTS.find((x) => x.id === selected)?.title}
              </SheetTitle>
            </SheetHeader>
            <div className="mt-4 space-y-3">
              {selected === "office" && (
                <div className="space-y-2">
                  {(target?.officeHoursSlots ?? [{ id: "x", date: "Thu, Nov 21", time: "4:00 PM", duration: "15 min", price: "Free" }]).map((s) => (
                    <button key={s.id} className="w-full p-3 rounded-lg border border-border bg-secondary/40 text-left hover:border-primary">
                      <div className="font-medium">{s.date} · {s.time}</div>
                      <div className="text-xs text-muted-foreground">{s.duration} · {s.price}</div>
                    </button>
                  ))}
                </div>
              )}
              {selected === "referral" && (
                <>
                  <select className="w-full bg-secondary rounded-lg p-3 text-sm border border-border">
                    <option>{target?.company ?? "Select company"}</option>
                  </select>
                  <select className="w-full bg-secondary rounded-lg p-3 text-sm border border-border">
                    <option>Senior Analyst</option>
                    <option>Associate</option>
                  </select>
                  <Textarea
                    placeholder="Why you? (200 char min)"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="min-h-32 bg-secondary border-border"
                  />
                </>
              )}
              {selected === "mentor" && (
                <>
                  <select className="w-full bg-secondary rounded-lg p-3 text-sm border border-border">
                    <option>Weekly</option><option>Biweekly</option><option>Monthly</option>
                  </select>
                  <select className="w-full bg-secondary rounded-lg p-3 text-sm border border-border">
                    <option>Consulting career path</option>
                    <option>Product management</option>
                    <option>Finance & Banking</option>
                  </select>
                </>
              )}
              {selected === "question" && (
                <Textarea maxLength={500} placeholder="Your question (500 char max)" value={text} onChange={(e) => setText(e.target.value)} className="min-h-32 bg-secondary border-border" />
              )}
              {selected === "general" && (
                <Textarea maxLength={300} placeholder="Add a personal note (300 char)" value={text} onChange={(e) => setText(e.target.value)} className="min-h-28 bg-secondary border-border" />
              )}
            </div>
            <div className="flex gap-2 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setSelected(null)}>Back</Button>
              <Button className="flex-1 rounded-full" onClick={send}>Send Request</Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

export function ConnectButton({ user, label = "Connect" }: { user: User; label?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button size="sm" variant="outline" className="rounded-full border-primary text-primary h-8 px-4" onClick={() => setOpen(true)}>
        + {label}
      </Button>
      <IntentSheet open={open} onOpenChange={setOpen} target={user} />
    </>
  );
}