import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Field } from "@/components/Field";
import { Checkbox } from "@/components/ui/checkbox";
import { careers } from "@/content/careers";
import { projectIdeas } from "@/content/practice";
import { studentDataOptions } from "@/lib/student-data";
import { pageHead } from "@/lib/page-head";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/projects")({
  head: () => pageHead("Project lab", "Build and track practical ICT portfolio projects."),
  loader: ({ context }) => context.queryClient.ensureQueryData(studentDataOptions), component: ProjectsPage,
});
function ProjectsPage() {
  const { data } = useSuspenseQuery(studentDataOptions); const qc = useQueryClient();
  const [career, setCareer] = useState("all"); const [level, setLevel] = useState("all"); const [busy, setBusy] = useState<string | null>(null);
  async function toggle(projectId: string, milestone: number, checked: boolean) {
    setBusy(projectId);
    const row = data.projects.find(p => p.project_id === projectId);
    const current = row?.milestones && typeof row.milestones === "object" && !Array.isArray(row.milestones) ? row.milestones : {};
    const { error } = await supabase.from("project_progress").upsert({ user_id: data.userId, project_id: projectId, milestones: { ...current, [milestone]: checked }, updated_at: new Date().toISOString() }, { onConflict: "user_id,project_id" });
    if (error) toast.error(error.message); else await qc.invalidateQueries({ queryKey: studentDataOptions.queryKey }); setBusy(null);
  }
  return <AppShell><h1 className="page-title">Project lab</h1><p className="page-subtitle">Build evidence of what you can do.</p>
    <div className="mt-6 flex flex-wrap gap-4"><Field label="Career path" id="project-career"><select className="native-select" id="project-career" value={career} onChange={e => setCareer(e.target.value)}><option value="all">All careers</option>{careers.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}</select></Field><Field label="Difficulty" id="project-level"><select className="native-select" id="project-level" value={level} onChange={e => setLevel(e.target.value)}><option value="all">All levels</option><option>Beginner</option><option>Intermediate</option></select></Field></div>
    <div className="mt-8 grid gap-5 lg:grid-cols-2">{projectIdeas.filter(p => (career === "all" || p.careerId === career) && (level === "all" || p.difficulty === level)).map(p => {
      const raw = data.projects.find(x => x.project_id === p.id)?.milestones;
      const done = raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {};
      const count = p.milestones.filter((_, i) => done[String(i)] === true).length;
      return <article key={p.id} className="tool-item"><div className="flex justify-between gap-3 text-xs text-muted-foreground"><span>{p.difficulty}</span><span>{count}/{p.milestones.length} complete</span></div><h2 className="mt-3 text-lg font-semibold">{p.title}</h2><p className="mt-2 text-sm text-muted-foreground">{p.objective}</p>
        <details className="mt-4 text-sm"><summary className="cursor-pointer font-medium text-primary">Project brief</summary><div className="mt-3 space-y-3"><p><strong>Skills:</strong> {p.skills.join(", ")}</p><p><strong>Tools:</strong> {p.tools.join(", ")}</p><div><strong>Deliverables:</strong><ul className="mt-1 list-disc pl-5">{p.deliverables.map(d => <li key={d}>{d}</li>)}</ul></div><p>Document the problem, your contribution, technical decisions, screenshots and lessons learned. Use sample data; never publish private student information.</p>{p.careerId === "cyber" && <p className="text-warning">Defensive work only, in environments you are authorised to use.</p>}</div></details>
        <div className="mt-5 space-y-3">{p.milestones.map((m, i) => <label key={m} className="flex items-center gap-3 text-sm"><Checkbox disabled={busy === p.id} checked={done[String(i)] === true} onCheckedChange={v => toggle(p.id, i, v === true)} />{m}</label>)}</div>
      </article>;
    })}</div>
  </AppShell>;
}