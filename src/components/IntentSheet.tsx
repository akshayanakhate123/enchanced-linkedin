import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, Lock } from "lucide-react";
import { toast } from "sonner";
import type { User } from "@/lib/data";
import { useApp, INTENT_LABELS, type IntentId } from "@/lib/store";

const INTENTS: { id: IntentId; emoji: string; title: string; sub: string }[] = [
  { id: "office", emoji: "📅", title: "Office Hours", sub: "Book a 15-min slot" },
  { id: "referral", emoji: "💼", title: "Referral Ask", sub: "Ask for a referral at their company" },
  { id: "mentor", emoji: "🎯", title: "Mentorship", sub: "Recurring guidance over 3 months" },
  { id: "question", emoji: "💡", title: "Industry Question", sub: "One-off async question" },
  { id: "general", emoji: "🤝", title: "General Networking", sub: "Just connect, no specific ask" },
];

type Props = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  target: User | null;
  prefilledIntent?: IntentId;
  prefilledCompany?: string;
  prefilledRole?: string;
};

export function IntentSheet({ open, onOpenChange, target, prefilledIntent, prefilledCompany, prefilledRole }: Props) {
  const { sendIntent, remainingFor } = useApp();
  const [selected, setSelected] = useState<IntentId | null>(null);
  const [text, setText] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [why, setWhy] = useState("");
  const [freq, setFreq] = useState("Weekly");
  const [focus, setFocus] = useState("Career Strategy");
  const [chosenSlot, setChosenSlot] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (open) {
      setSelected(prefilledIntent ?? null);
      setCompany(prefilledCompany ?? target?.company ?? "");
      setRole(prefilledRole ?? "");
      setWhy(""); setText(""); setChosenSlot(null); setSuccess(false);
    }
  }, [open, prefilledIntent, prefilledCompany, prefilledRole, target]);

  const reset = () => {
    setSelected(null); setText(""); setWhy(""); setCompany(""); setRole("");
    setChosenSlot(null); setSuccess(false);
  };

  const send = (summary: string) => {
    if (!target || !selected) return;
    sendIntent(target.id, selected, summary);
    setSuccess(true);
    const remaining = remainingFor(selected);
    toast.success(`Request sent to ${target.name}`, {
      description: remaining != null ? `${remaining - 1} ${INTENT_LABELS[selected]} requests left this week` : undefined,
    });
    setTimeout(() => { onOpenChange(false); reset(); }, 1200);
  };

  const handleSend = () => {
    if (!selected) return;
    if (selected === "referral") {
      if (!company || !role || why.length < 200) return;
      send(`${company} · ${role} — ${why.slice(0, 60)}`);
    } else if (selected === "mentor") {
      send(`${freq} mentorship · ${focus}`);
    } else if (selected === "question") {
      if (!text.trim()) return;
      send(text.slice(0, 80));
    } else if (selected === "general") {
      send(text.slice(0, 80) || "Networking");
    } else if (selected === "office") {
      const slot = target?.officeHoursSlots?.find((s) => s.id === chosenSlot);
      if (!slot) return;
      send(`Office Hours requested · ${slot.date} ${slot.time}`);
    }
  };

  const referralValid = company.length > 0 && role.length > 0 && why.length >= 200;

  return (
    <Sheet open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) reset(); }}>
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[88vh] overflow-y-auto bg-card border-border">
        {success ? (
          <div className="py-12 flex flex-col items-center text-center gap-3">
            <div className="h-14 w-14 rounded-full bg-accent/20 flex items-center justify-center">
              <Check className="h-7 w-7 text-accent" />
            </div>
            <h3 className="text-lg font-semibold">Request sent</h3>
            <p className="text-sm text-muted-foreground">Sent to {target?.name}</p>
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
              {INTENTS.map((i) => {
                const left = remainingFor(i.id);
                const disabled = left === 0;
                return (
                  <button
                    key={i.id}
                    onClick={() => !disabled && setSelected(i.id)}
                    disabled={disabled}
                    className={`w-full text-left p-4 rounded-xl border border-border bg-secondary/40 hover:bg-secondary transition flex items-start gap-3 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <span className="text-2xl">{i.emoji}</span>
                    <div className="flex-1">
                      <div className="font-semibold flex items-center gap-2">{i.title}{disabled && <Lock className="h-3.5 w-3.5" />}</div>
                      <div className="text-sm text-muted-foreground">{disabled ? "Limit reached. Resets in 7 days" : i.sub}</div>
                      {left != null && !disabled && <div className="text-[10px] text-accent mt-0.5">{left} left this week</div>}
                    </div>
                  </button>
                );
              })}
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
                  {(target?.officeHoursSlots ?? []).slice(0, 3).map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setChosenSlot(s.id)}
                      className={`w-full p-3 rounded-lg border text-left transition ${chosenSlot === s.id ? "border-primary bg-primary/10" : "border-border bg-secondary/40 hover:border-primary"}`}
                    >
                      <div className="font-medium">{s.date} · {s.time}</div>
                      <div className="text-xs text-muted-foreground">{s.duration} · {s.price}</div>
                    </button>
                  ))}
                </div>
              )}
              {selected === "referral" && (
                <>
                  <input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Target company"
                    className="w-full bg-secondary rounded-lg p-3 text-sm border border-border outline-none"
                  />
                  <input
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Target role"
                    className="w-full bg-secondary rounded-lg p-3 text-sm border border-border outline-none"
                  />
                  <Textarea
                    placeholder="Why you? (200 char min)"
                    value={why}
                    onChange={(e) => setWhy(e.target.value)}
                    className="min-h-32 bg-secondary border-border"
                  />
                  <div className={`text-xs text-right ${why.length >= 200 ? "text-accent" : "text-muted-foreground"}`}>
                    {why.length} / 200
                  </div>
                </>
              )}
              {selected === "mentor" && (
                <>
                  <select value={freq} onChange={(e) => setFreq(e.target.value)} className="w-full bg-secondary rounded-lg p-3 text-sm border border-border">
                    <option>Weekly</option><option>Biweekly</option><option>Monthly</option>
                  </select>
                  <select value={focus} onChange={(e) => setFocus(e.target.value)} className="w-full bg-secondary rounded-lg p-3 text-sm border border-border">
                    <option>Career Strategy</option>
                    <option>Consulting</option>
                    <option>Product</option>
                    <option>Finance</option>
                    <option>Marketing</option>
                    <option>Industry Insights</option>
                  </select>
                </>
              )}
              {selected === "question" && (
                <>
                  <Textarea maxLength={500} placeholder="Your question (500 char max)" value={text} onChange={(e) => setText(e.target.value)} className="min-h-32 bg-secondary border-border" />
                  <div className="text-xs text-right text-muted-foreground">{text.length} / 500</div>
                </>
              )}
              {selected === "general" && (
                <Textarea maxLength={300} placeholder="Add a personal note (300 char)" value={text} onChange={(e) => setText(e.target.value)} className="min-h-28 bg-secondary border-border" />
              )}
            </div>
            <div className="flex gap-2 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setSelected(null)}>Back</Button>
              <Button
                className="flex-1 rounded-full"
                onClick={handleSend}
                disabled={
                  (selected === "referral" && !referralValid) ||
                  (selected === "office" && !chosenSlot) ||
                  (selected === "question" && !text.trim())
                }
              >
                {selected === "office" ? "Confirm Booking" : "Send Request"}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

export function ConnectButton({ user, label = "Connect" }: { user: User; label?: string }) {
  const [open, setOpen] = useState(false);
  const { pendingConnections } = useApp();
  const pending = pendingConnections.has(user.id);
  return (
    <>
      <Button
        size="sm"
        variant="outline"
        disabled={pending}
        className={`rounded-full h-8 px-4 ${pending ? "border-muted text-muted-foreground" : "border-primary text-primary"}`}
        onClick={() => setOpen(true)}
      >
        {pending ? "Pending" : `+ ${label}`}
      </Button>
      <IntentSheet open={open} onOpenChange={setOpen} target={user} />
    </>
  );
}
