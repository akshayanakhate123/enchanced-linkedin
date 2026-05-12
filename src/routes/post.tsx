import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { currentUser } from "@/lib/data";
import { X, ChevronDown, Clock, Image as ImageIcon, Video, FileText, BarChart3, PartyPopper, Calendar, Sparkles, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/post")({ component: PostPage });

function PostPage() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const submit = () => { toast.success("Post published"); navigate({ to: "/" }); };
  return (
    <div className="min-h-screen bg-background flex flex-col max-w-[480px] mx-auto">
      <header className="flex items-center justify-between p-3 border-b border-border">
        <button onClick={() => navigate({ to: "/" })}><X className="h-6 w-6" /></button>
        <div className="flex items-center gap-2">
          <img src={currentUser.avatar} className="h-8 w-8 rounded-full" alt="" />
          <button className="flex items-center gap-1 text-sm font-medium">Anyone <ChevronDown className="h-4 w-4" /></button>
        </div>
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <Button disabled={!text} onClick={submit} className="rounded-full h-8 px-5">Post</Button>
        </div>
      </header>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Share your thoughts..."
        className="flex-1 bg-transparent text-lg p-4 outline-none resize-none placeholder:text-muted-foreground"
        autoFocus
      />
      <div className="border-t border-border p-3 flex items-center justify-between">
        <button className="flex items-center gap-2 px-3 py-2 rounded-full border border-border text-sm">
          <Sparkles className="h-4 w-4 text-amber-500" /> Rewrite with AI
        </button>
        <div className="flex items-center gap-3 text-muted-foreground">
          <ImageIcon className="h-5 w-5" />
          <Video className="h-5 w-5" />
          <FileText className="h-5 w-5" />
          <BarChart3 className="h-5 w-5" />
          <PartyPopper className="h-5 w-5" />
          <Calendar className="h-5 w-5" />
          <MoreHorizontal className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}