import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { quizzes, scoreQuiz, type Quiz } from "@/content/quizzes";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/quizzes")({
  head: () => ({ meta: [{ title: "Practice quizzes — ICT Career Compass" }, { name: "description", content: "Short technical quizzes with explanations." }] }),
  component: QuizzesPage,
});

function QuizzesPage() {
  const [best, setBest] = useState<Record<string, number>>({});
  const [active, setActive] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);

  async function loadBest() {
    const { data } = await supabase.from("quiz_attempts").select("category, score, total");
    const b: Record<string, number> = {};
    (data ?? []).forEach((r) => { const p = Math.round((r.score / r.total) * 100); b[r.category] = Math.max(b[r.category] ?? 0, p); });
    setBest(b);
  }
  useEffect(() => { loadBest(); }, []);

  async function submit() {
    if (!active) return;
    if (answers.filter((a) => a !== undefined).length < active.questions.length) { toast.error("Answer every question first."); return; }
    const score = scoreQuiz(active, answers);
    const { error } = await supabase.from("quiz_attempts").insert({ category: active.id, score, total: active.questions.length, answers });
    if (error) { toast.error(error.message); return; }
    setSubmitted(true);
    loadBest();
  }

  if (active) {
    const score = scoreQuiz(active, answers);
    return (
      <AppShell>
        <Button variant="ghost" size="sm" onClick={() => setActive(null)}>← All quizzes</Button>
        <h1 className="mt-2 font-display text-3xl font-bold text-primary">{active.title}</h1>
        {submitted && <p className="mt-2 text-lg font-medium">You scored {score}/{active.questions.length}</p>}
        <div className="mt-6 space-y-4">
          {active.questions.map((q, qi) => (
            <Card key={qi}>
              <CardContent className="space-y-2 py-4">
                <p className="font-medium">{qi + 1}. {q.q}</p>
                {q.options.map((o, oi) => {
                  const chosen = answers[qi] === oi;
                  const right = submitted && oi === q.answer;
                  const wrong = submitted && chosen && oi !== q.answer;
                  return (
                    <button key={oi} disabled={submitted} onClick={() => setAnswers((a) => { const n = [...a]; n[qi] = oi; return n; })}
                      className={cn("flex w-full items-center gap-2 rounded-md border px-3 py-2 text-left text-sm",
                        right ? "border-teal bg-teal/10" : wrong ? "border-destructive bg-destructive/10" : chosen ? "border-primary bg-accent" : "border-border hover:bg-accent")}>
                      {right && <CheckCircle2 className="h-4 w-4 text-teal" />}{wrong && <XCircle className="h-4 w-4 text-destructive" />}{o}
                    </button>
                  );
                })}
                {submitted && <p className="text-sm text-muted-foreground">{q.explain}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
        {submitted
          ? <Button className="mt-6" onClick={() => { setAnswers([]); setSubmitted(false); }}>Try again</Button>
          : <Button className="mt-6" onClick={submit}>Submit answers</Button>}
      </AppShell>
    );
  }

  return (
    <AppShell>
      <h1 className="font-display text-3xl font-bold text-primary">Practice quizzes</h1>
      <p className="mt-1 text-sm text-muted-foreground">Scores show practice progress, not certified competence.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {quizzes.map((q) => (
          <Card key={q.id}>
            <CardHeader>
              <CardTitle className="text-base">{q.title}</CardTitle>
              <CardDescription>{q.questions.length} questions · {best[q.id] !== undefined ? `Best: ${best[q.id]}%` : "Not attempted"}</CardDescription>
            </CardHeader>
            <CardContent><Button size="sm" onClick={() => { setActive(q); setAnswers([]); setSubmitted(false); }}>Start</Button></CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
