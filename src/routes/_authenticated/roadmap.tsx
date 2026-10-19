import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { stages, defaultTasks } from "@/content/roadmap";

export const Route = createFileRoute("/_authenticated/roadmap")({
  head: () => ({ meta: [{ title: "My roadmap — ICT Career Compass" }, { name: "description", content: "Your editable four-stage plan from study to employment." }] }),
  component: RoadmapPage,
});

type Task = { id: string; stage: number; title: string; done: boolean; position: number; target_date: string | null };

function RoadmapPage() {
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [drafts, setDrafts] = useState<Record<number, string>>({});

  async function load() {
    const { data } = await supabase.from("roadmap_tasks").select("id, stage, title, done, position, target_date").order("position");
    if (data && data.length === 0) {
      await supabase.from("roadmap_tasks").insert(defaultTasks.map((t, i) => ({ ...t, position: i })));
      return load();
    }
    setTasks(data ?? []);
  }
  useEffect(() => { load(); }, []);

  async function update(id: string, patch: Partial<Task>) {
    setTasks((t) => t!.map((x) => (x.id === id ? { ...x, ...patch } : x)));
    const { error } = await supabase.from("roadmap_tasks").update(patch).eq("id", id);
    if (error) toast.error(error.message);
  }
  async function remove(id: string) {
    setTasks((t) => t!.filter((x) => x.id !== id));
    await supabase.from("roadmap_tasks").delete().eq("id", id);
  }
  async function add(stage: number) {
    const title = drafts[stage]?.trim();
    if (!title) return;
    const { error } = await supabase.from("roadmap_tasks").insert({ stage, title, is_custom: true, position: (tasks?.length ?? 0) + 1 });
    if (error) return toast.error(error.message);
    setDrafts((d) => ({ ...d, [stage]: "" }));
    load();
  }

  const doneCount = tasks?.filter((t) => t.done).length ?? 0;
  return (
    <AppShell>
      <h1 className="font-display text-3xl font-bold text-primary">My roadmap</h1>
      <p className="mt-1 text-sm text-muted-foreground">{tasks ? `${doneCount} of ${tasks.length} tasks done` : "Loading…"}</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {stages.map((s) => (
          <Card key={s.n}>
            <CardHeader>
              <CardTitle className="text-base">Stage {s.n}: {s.title}</CardTitle>
              <CardDescription>{s.hint}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {tasks?.filter((t) => t.stage === s.n).map((t) => (
                <div key={t.id} className="flex items-center gap-2 text-sm">
                  <Checkbox checked={t.done} onCheckedChange={(v) => update(t.id, { done: !!v })} />
                  <span className={t.done ? "flex-1 text-muted-foreground line-through" : "flex-1"}>{t.title}</span>
                  <input type="date" aria-label="Target date" value={t.target_date ?? ""} onChange={(e) => update(t.id, { target_date: e.target.value || null })} className="rounded border border-border bg-transparent px-1 text-xs" />
                  <button aria-label="Delete task" onClick={() => remove(t.id)}><Trash2 className="h-4 w-4 text-muted-foreground" /></button>
                </div>
              ))}
              <form className="flex gap-2 pt-2" onSubmit={(e) => { e.preventDefault(); add(s.n); }}>
                <Input placeholder="Add a task…" value={drafts[s.n] ?? ""} onChange={(e) => setDrafts((d) => ({ ...d, [s.n]: e.target.value }))} />
                <Button type="submit" size="sm" variant="outline">Add</Button>
              </form>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
