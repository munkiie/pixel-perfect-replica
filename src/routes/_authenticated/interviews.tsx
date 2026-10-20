import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Field } from "@/components/Field";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { careers } from "@/content/careers";
import { interviewQuestions } from "@/content/practice";
import { studentDataOptions } from "@/lib/student-data";
import { pageHead } from "@/lib/page-head";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/interviews")({ head: () => pageHead("Interview practice", "Practise graduate, technical and STAR interview answers with structured guidance."), loader: ({ context }) => context.queryClient.ensureQueryData(studentDataOptions), component: InterviewsPage });
function InterviewsPage() {
  const { data } = useSuspenseQuery(studentDataOptions); const qc = useQueryClient();
  const [mode, setMode] = useState("General"); const [career, setCareer] = useState(careers[0]?.id ?? "software"); const [index, setIndex] = useState(0); const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>(() => Object.fromEntries(data.notes.map(n => [n.question_id, n.note])));
  const [reveal, setReveal] = useState(false); const [busy, setBusy] = useState(false);
  const list = interviewQuestions.filter(q => q.mode === mode); const q = list[index];
  if (!q) return null;
  const key = `${career}-${q.id}`;
  async function save() {
    if (!q) return; setBusy(true);
    const { error } = await supabase.from("interview_notes").upsert({ user_id: data.userId, question_id: key, question: `${careers.find(c => c.id === career)?.title}: ${q.question}`, note: answers[key] ?? "", updated_at: new Date().toISOString() }, { onConflict: "user_id,question_id" });
    if (error) toast.error(error.message); else { await qc.invalidateQueries({ queryKey: studentDataOptions.queryKey }); toast.success("Answer saved."); } setBusy(false);
  }
  return <AppShell><h1 className="page-title">Interview practice</h1><p className="page-subtitle">Your experience. Your words.</p>
    <div className="mt-6 flex flex-wrap items-end gap-4"><Field label="Career path" id="interview-career"><select id="interview-career" className="native-select" value={career} onChange={e => { setCareer(e.target.value); setStarted(false); }}>{careers.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}</select></Field><Field label="Practice mode" id="interview-mode"><select id="interview-mode" className="native-select" value={mode} onChange={e => { setMode(e.target.value); setIndex(0); setStarted(false); setReveal(false); }}><option>General</option><option>Technical</option><option>Behavioural</option></select></Field><Button onClick={() => { setStarted(true); setReveal(false); }}>Start practice</Button></div>
    {started && <section className="mt-10 max-w-3xl"><p className="text-xs text-muted-foreground">Question {index + 1} of {list.length} · {careers.find(c => c.id === career)?.title}</p><h2 className="mt-3 text-2xl font-semibold">{q.question}</h2><div className="mt-6"><Field label="Your answer / notes" id="interview-answer"><Textarea id="interview-answer" rows={9} value={answers[key] ?? ""} onChange={e => setAnswers(a => ({ ...a, [key]: e.target.value }))} /></Field></div><div className="mt-4 flex flex-wrap gap-3"><Button onClick={save} disabled={busy}><Save className="h-4 w-4" />{busy ? "Saving…" : "Save answer"}</Button><Button variant="outline" onClick={() => setReveal(!reveal)}>{reveal ? "Hide guidance" : "Reveal guidance"}</Button></div>
      {reveal && <div className="mt-6 space-y-4 border-l-2 border-teal pl-5 text-sm"><p>{q.guidance}</p><p className="text-muted-foreground">{q.example}</p><p className="text-muted-foreground">Self-review: Is my answer specific, honest and clear? What evidence supports it?</p></div>}
      <div className="mt-8 flex justify-between"><Button variant="ghost" disabled={index === 0} onClick={() => { setIndex(index - 1); setReveal(false); }}><ChevronLeft className="h-4 w-4" />Previous</Button>{index < list.length - 1 ? <Button variant="ghost" onClick={() => { setIndex(index + 1); setReveal(false); }}>Next<ChevronRight className="h-4 w-4" /></Button> : <Button variant="ghost" onClick={() => { setIndex(0); setReveal(false); }}>Practise again</Button>}</div>
    </section>}
  </AppShell>;
}