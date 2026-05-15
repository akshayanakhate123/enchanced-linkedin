import { createFileRoute } from "@tanstack/react-router";
import { AppShell, VerifiedBadge } from "@/components/Layout";
import { posts, findUser } from "@/lib/data";
import { Heart, MessageCircle, Repeat2, Send, MoreHorizontal, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const Route = createFileRoute("/")({ component: Index });

function Index() {
  return (
    <AppShell>
      <div className="space-y-2 pt-2">
        {posts.map((p) => <PostCard key={p.id} post={p} />)}
      </div>
    </AppShell>
  );
}

function PostCard({ post }: { post: typeof posts[number] }) {
  const u = findUser(post.authorId);
  const [liked, setLiked] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const preview = post.content.length > 200 && !expanded ? post.content.slice(0, 200) : post.content;

  return (
    <article className="bg-card">
      {post.socialProof && (
        <div className="flex items-center justify-between px-4 py-2 text-xs text-muted-foreground border-b border-border">
          <span><span className="text-foreground font-medium">{post.socialProof.split(" ").slice(0, 2).join(" ")}</span> likes this</span>
          <MoreHorizontal className="h-4 w-4" />
        </div>
      )}
      <div className="px-4 pt-3 flex items-start gap-3">
        <img src={u.avatar} className="h-12 w-12 rounded-full bg-muted" alt="" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 text-sm font-semibold">
            <span className="truncate">{u.name}</span>
            {(u.isVerifiedAlum || u.isVerifiedStudent) && <VerifiedBadge />}
            <span className="text-muted-foreground font-normal text-xs">· 3rd+</span>
          </div>
          <div className="text-xs text-muted-foreground line-clamp-1">{u.headline}</div>
          <div className="text-xs text-muted-foreground flex items-center gap-1">{post.timestamp} · <Globe className="h-3 w-3" /></div>
        </div>
        <Button variant="ghost" size="sm" className="text-primary text-sm h-8">+ Follow</Button>
      </div>
      <div className="px-4 py-2 text-sm whitespace-pre-line">
        {preview}
        {post.content.length > 200 && !expanded && (
          <button className="text-muted-foreground" onClick={() => setExpanded(true)}>...more</button>
        )}
      </div>
      {post.image && (
        <div className="aspect-square w-full flex items-center justify-center text-white text-5xl font-extrabold tracking-tight" style={{ background: post.image }}>
          zepto
          <span className="sr-only">post image</span>
        </div>
      )}
      <div className="flex items-center justify-between px-4 py-2 text-xs text-muted-foreground">
        <span>{liked ? post.likes + 1 : post.likes}</span>
        <span>{post.comments} comments · {post.reposts} reposts</span>
      </div>
      <div className="grid grid-cols-4 border-t border-border text-xs text-muted-foreground">
        {[
          { icon: Heart, label: "Like", onClick: () => setLiked(!liked), active: liked },
          { icon: MessageCircle, label: "Comment" },
          { icon: Repeat2, label: "Repost" },
          { icon: Send, label: "Send" },
        ].map((b, i) => {
          const I = b.icon;
          return (
            <button key={i} onClick={b.onClick} className="flex items-center justify-center gap-1.5 py-3 hover:bg-secondary">
              <I className={`h-5 w-5 ${b.active ? "text-primary fill-primary" : ""}`} />
              <span className={b.active ? "text-primary" : ""}>{b.label}</span>
            </button>
          );
        })}
      </div>
    </article>
  );
}
