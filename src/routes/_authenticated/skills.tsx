import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Field } from "@/components/Field";
import { Button } from "@/components/ui/button";
import { careers } from "@/content/careers";
import { studentDataOptions } from "@/lib/student-data";
import { pageHead } from "@/lib/page-head";
import { supabase } from "@/integrations/supabase/client";
import { readObject } from "@/lib/progress";

export const Route = createFileRoute("/_authenticated/skills")({ head: () => pageHead("My skills", "Compare self-rated confidence and quiz performance with general career skill recommendations."), loader: ({ context }) => context.queryClient.ensureQueryData(studentDataOptions), component: SkillsPage });
function SkillsPage() {
  const { data } = useSuspenseQuery(studentDataOptions); const qc = useQueryClient();
  const [careerId, setCareerId] = useState(data.saved[0]?.career_id ?? "software");
  const [ratings, setRatings] = useState<Record<string, unknown>>(() => readObject(readObject(data.profile?.onboarding)['skillRatings']));
  const [busy, setBusy] = useState(false);
  const career = careers.find(c => c.id === careerId) ?? careers[0];
  async function save() {
    setBusy(true);
    const { error } = await supabase.from("profiles").update({ onboarding: { ...readObject(data.profile?.onboarding), skillRatings: ratings } as import("@/integrations/supabase/types").Json, updated_at: new Date().toISOString() }).eq("id", data.userId);
    if (error) toast.error(error.message); else { await qc.invalidateQueries({ queryKey: studentDataOptions.queryKey }); toast.success("Confidence ratings saved."); } setBusy(false);
  }
  if (!career) return null;
  return <AppShell><h1 className="page-title">My skills</h1><p className="page-subtitle">Confidence is self-reported. Quiz scores are separate practice evidence.</p><div className="mt-6 flex flex-wrap items-end gap-4"><Field label="Career path" id="skills-career"><select id="skills-career" className="native-select" value={career.id} onChange={e => setCareerId(e.target.value)}>{careers.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}</select></Field><Button onClick={save} disabled={busy}>{busy ? "Saving…" : "Save ratings"}</Button></div>
    <p className="mt-6 text-xs text-muted-foreground">Importance: 1 = useful, 2 = important, 3 = core. General guidance, not an official employer ranking.</p>
    <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><thead className="border-b border-border text-muted-foreground"><tr>{["Skill", "Importance", "My confidence", "Latest quiz", "Next activity"].map(h => <th className="px-3 py-4 font-medium" key={h}>{h}</th>)}</tr></thead><tbody>{career.skills.map(s => {
      const rating = typeof ratings[s.name] === "number" ? Number(ratings[s.name]) : 0;
      const quiz = data.quizzes.find(q => q.category === s.quiz);
      return <tr key={s.name} className="border-b border-border"><td className="px-3 py-5 font-medium">{s.name}{rating > 0 && rating < 3 && <span className="mt-1 block text-xs text-warning">Development priority</span>}</td><td className="px-3 py-5">{s.importance}/3</td><td className="px-3 py-5"><select aria-label={`Confidence in ${s.name}`} className="native-select" value={rating} onChange={e => setRatings(r => ({ ...r, [s.name]: Number(e.target.value) }))}><option value="0">Not rated</option>{[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v} / 5</option>)}</select></td><td className="px-3 py-5">{quiz ? `${Math.round(quiz.score / quiz.total * 100)}%` : s.quiz ? "Not attempted" : "No linked quiz"}</td><td className="px-3 py-5"><Button asChild variant="link" size="sm"><Link to={s.quiz ? "/quizzes" : "/projects"}>{s.quiz ? "Practise quiz" : "Build a project"}</Link></Button></td></tr>;
    })}</tbody></table></div>
  </AppShell>;
}