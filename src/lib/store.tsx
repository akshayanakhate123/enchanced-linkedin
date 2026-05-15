import { createContext, useContext, useState, useCallback, ReactNode, useMemo } from "react";
import { users, findUser, notifications as seedNotifications, messages as seedMessages } from "@/lib/data";

export type IntentId = "office" | "referral" | "mentor" | "question" | "general";

export const INTENT_LABELS: Record<IntentId, string> = {
  office: "Office Hours",
  referral: "Referral Ask",
  mentor: "Mentorship",
  question: "Industry Question",
  general: "General Networking",
};

export const RATE_LIMITS: Partial<Record<IntentId, number>> = {
  referral: 5,
  mentor: 3,
};

export type StoredNotification = {
  id: string;
  type: string;
  avatarId: string;
  content: string;
  preview: string;
  timestamp: string;
  badge?: string;
};

export type StoredMessage = {
  id: string;
  participantId: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  folder: string;
  badge?: string;
};

type Booking = { slotId: string; alumId: string; date: string; time: string };

type State = {
  pendingConnections: Set<string>;
  rateUsed: Record<IntentId, number>;
  extraNotifications: StoredNotification[];
  extraMessages: StoredMessage[];
  congratulated: Set<string>;
  comments: Record<string, string[]>;
  bookedSlotIds: Set<string>;
  bookings: Booking[];
};

type Ctx = State & {
  sendIntent: (targetId: string, intent: IntentId, summary: string) => void;
  remainingFor: (intent: IntentId) => number | null;
  congratulate: (postId: string, authorId: string) => void;
  addComment: (postId: string, text: string) => void;
  bookSlot: (alumId: string, slotId: string, date: string, time: string) => void;
};

const C = createContext<Ctx | null>(null);

let nid = 1000;
const newId = (p: string) => `${p}${++nid}`;

export function AppProvider({ children }: { children: ReactNode }) {
  const [pendingConnections, setPending] = useState<Set<string>>(new Set());
  const [rateUsed, setRateUsed] = useState<Record<IntentId, number>>({
    office: 0, referral: 0, mentor: 0, question: 0, general: 0,
  });
  const [extraNotifications, setNotifs] = useState<StoredNotification[]>([]);
  const [extraMessages, setMsgs] = useState<StoredMessage[]>([]);
  const [congratulated, setCongrats] = useState<Set<string>>(new Set());
  const [comments, setComments] = useState<Record<string, string[]>>({});
  const [bookedSlotIds, setBooked] = useState<Set<string>>(new Set());
  const [bookings, setBookings] = useState<Booking[]>([]);

  const remainingFor = useCallback((intent: IntentId) => {
    const limit = RATE_LIMITS[intent];
    if (limit == null) return null;
    return Math.max(0, limit - (rateUsed[intent] ?? 0));
  }, [rateUsed]);

  const sendIntent = useCallback((targetId: string, intent: IntentId, summary: string) => {
    const target = findUser(targetId);
    setPending((s) => new Set(s).add(targetId));
    setRateUsed((r) => ({ ...r, [intent]: (r[intent] ?? 0) + 1 }));
    const label = INTENT_LABELS[intent];
    setNotifs((n) => [
      {
        id: newId("n"),
        type: intent,
        avatarId: targetId,
        content: `You sent a ${label} to ${target.name}`,
        preview: summary,
        timestamp: "now",
        badge: label,
      },
      ...n,
    ]);
    setMsgs((m) => [
      {
        id: newId("m"),
        participantId: targetId,
        lastMessage: summary,
        timestamp: "now",
        unread: true,
        folder: "Focus",
        badge: label,
      },
      ...m,
    ]);
  }, []);

  const congratulate = useCallback((postId: string, authorId: string) => {
    const target = findUser(authorId);
    setCongrats((s) => new Set(s).add(postId));
    setMsgs((m) => [
      {
        id: newId("m"),
        participantId: authorId,
        lastMessage: `🎉 Congrats on the news, ${target.name.split(" ")[0]}!`,
        timestamp: "now",
        unread: false,
        folder: "Focus",
      },
      ...m,
    ]);
  }, []);

  const addComment = useCallback((postId: string, text: string) => {
    setComments((c) => ({ ...c, [postId]: [...(c[postId] ?? []), text] }));
  }, []);

  const bookSlot = useCallback((alumId: string, slotId: string, date: string, time: string) => {
    const alum = findUser(alumId);
    setBooked((s) => new Set(s).add(slotId));
    setBookings((b) => [...b, { slotId, alumId, date, time }]);
    setNotifs((n) => [
      {
        id: newId("n"),
        type: "office",
        avatarId: alumId,
        content: `Office Hours confirmed with ${alum.name}`,
        preview: `${date} · ${time}`,
        timestamp: "now",
        badge: "Office Hours",
      },
      ...n,
    ]);
    setMsgs((m) => [
      {
        id: newId("m"),
        participantId: alumId,
        lastMessage: `Office Hours booked for ${date} ${time}. Calendar invite sent.`,
        timestamp: "now",
        unread: true,
        folder: "Focus",
        badge: "Office Hours",
      },
      ...m,
    ]);
  }, []);

  const value = useMemo<Ctx>(() => ({
    pendingConnections, rateUsed, extraNotifications, extraMessages,
    congratulated, comments, bookedSlotIds, bookings,
    sendIntent, remainingFor, congratulate, addComment, bookSlot,
  }), [pendingConnections, rateUsed, extraNotifications, extraMessages, congratulated, comments, bookedSlotIds, bookings, sendIntent, remainingFor, congratulate, addComment, bookSlot]);

  return <C.Provider value={value}>{children}</C.Provider>;
}

export function useApp() {
  const v = useContext(C);
  if (!v) throw new Error("AppProvider missing");
  return v;
}

export function useAllNotifications() {
  const { extraNotifications } = useApp();
  return [...extraNotifications, ...seedNotifications];
}

export function useAllMessages() {
  const { extraMessages } = useApp();
  return [...extraMessages, ...seedMessages];
}

// re-export users for convenience
export { users };
