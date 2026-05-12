import { Link, useLocation, Outlet } from "@tanstack/react-router";
import { Bell, Briefcase, Home, MessageSquareText, PlusSquare, Search, Users } from "lucide-react";
import { currentUser } from "@/lib/data";

function TopBar() {
  return (
    <header className="sticky top-0 z-40 flex items-center gap-2 bg-background/95 backdrop-blur px-3 py-2 border-b border-border">
      <Link to="/profile">
        <img src={currentUser.avatar} alt="me" className="h-9 w-9 rounded-full bg-muted" />
      </Link>
      <div className="flex-1 flex items-center gap-2 bg-secondary rounded-full px-3 py-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          placeholder="Search"
          className="bg-transparent flex-1 text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
      <Link to="/messages" className="p-2 rounded-full hover:bg-secondary">
        <MessageSquareText className="h-6 w-6" />
      </Link>
    </header>
  );
}

const tabs: { to: string; label: string; icon: typeof Home; exact?: boolean }[] = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/network", label: "My Network", icon: Users },
  { to: "/post", label: "Post", icon: PlusSquare },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/jobs", label: "Jobs", icon: Briefcase },
];

function BottomNav() {
  const loc = useLocation();
  return (
    <nav className="sticky bottom-0 z-40 bg-background border-t border-border flex">
      {tabs.map((t) => {
        const Icon = t.icon;
        const active = t.exact ? loc.pathname === t.to : loc.pathname.startsWith(t.to);
        return (
          <Link
            key={t.to}
            to={t.to as any}
            className="flex-1 flex flex-col items-center gap-0.5 py-2 text-[11px]"
          >
            <Icon className={`h-6 w-6 ${active ? "text-foreground" : "text-muted-foreground"}`} strokeWidth={active ? 2.5 : 1.8} />
            <span className={active ? "text-foreground font-medium" : "text-muted-foreground"}>{t.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ showTop = true, showBottom = true, children }: { showTop?: boolean; showBottom?: boolean; children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground max-w-[480px] mx-auto">
      {showTop && <TopBar />}
      <main className="flex-1 overflow-y-auto pb-2">{children}</main>
      {showBottom && <BottomNav />}
    </div>
  );
}

export function VerifiedBadge({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`inline-block h-4 w-4 text-accent ${className}`} fill="currentColor" aria-label="verified">
      <path d="M12 1l2.5 2.5L18 3l1 3.5L21 8l-1 3 1 3-2 1.5L18 19l-3.5-.5L12 21l-2.5-2.5L6 19l-1-3.5L3 14l1-3-1-3 2-1.5L6 3l3.5.5L12 1z" />
      <path d="M10.5 13.5L8 11l-1.4 1.4 3.9 3.9 7-7L16.1 8z" fill="hsl(var(--background))" />
    </svg>
  );
}