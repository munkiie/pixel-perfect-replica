import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { assessmentItems, scaleLabels, confidenceLabels, scoreAssessment } from "@/content/assessment";
import { careers } from "@/content/careers";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/assessment")({
  head: () => ({ meta: [{ title: "Skills assessment — ICT Career Compass" }, { name: "description", content: "Rate your interests and confidence across ICT areas." }] }),
  component: AssessmentPage,
});

function AssessmentPage() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<Record<string, number> | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("assessment_attempts").select("answers").order("created_at", { ascending: false }).limit(1).then(({ data }) => {
      if (data?.[0]) setResult(data[0].answers as Record<string, number>);
    });
  }, []);

  const done = Object.keys(answers).length;
  async function submit() {
    if (done < assessmentItems.length) { toast.error("Please answer every statement."); return; }
    setSaving(true);
    const { error } = await supabase.from("assessment_attempts").insert({ answers });
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    setResult(answers);
    setAnswers({});
    window.scrollTo({ top: 0 });
  }

  if (result) {
    const scores = scoreAssessment(result, careers.map((c) => c.id))
      .sort((a, b) => (b.interest ?? 0) + (b.confidence ?? 0) - ((a.interest ?? 0) + (a.confidence ?? 0)));
    return (
      <AppShell>
        <h1 className="font-display text-3xl font-bold text-primary">Your results</h1>
        <p className="mt-1 text-sm text-muted-foreground">Self-reported interest and confidence (1–5). This is guidance, not a measure of proven ability.</p>
        <div className="mt-6 space-y-3">
          {scores.map((s, i) => {
            const c = careers.find((x) => x.id === s.careerId)!;
            return (
              <Card key={s.careerId} className={cn(i < 3 && "border-teal")}>
                <CardContent className="grid gap-2 py-4 sm:grid-cols-[1fr_2fr]">
                  <p className="font-medium">{i < 3 && "★ "}{c.title}</p>
                  <div className="space-y-1.5 text-xs">
                    <Bar label="Interest" v={s.interest} />
                    <Bar label="Confidence" v={s.confidence} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <Button className="mt-6" variant="outline" onClick={() => setResult(null)}>Retake assessment</Button>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <h1 className="font-display text-3xl font-bold text-primary">Skills assessment</h1>
      <p className="mt-1 text-sm text-muted-foreground">Answer honestly — there are no right answers. {done}/{assessmentItems.length} answered.</p>
      {(["interest", "confidence"] as const).map((type) => (
        <Card key={type} className="mt-6">
          <CardHeader><CardTitle className="text-lg">{type === "interest" ? "Part 1: Interests" : "Part 2: How confident are you at…"}</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            {assessmentItems.filter((q) => q.type === type).map((q) => (
              <div key={q.id}>
                <p className="mb-2 text-sm font-medium">{q.text}</p>
                <div className="grid grid-cols-5 gap-1">
                  {(type === "interest" ? scaleLabels : confidenceLabels).map((l, i) => (
                    <button key={l} type="button" onClick={() => setAnswers((a) => ({ ...a, [q.id]: i + 1 }))}
                      className={cn("rounded-md border px-1 py-2 text-[11px] leading-tight", answers[q.id] === i + 1 ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-accent")}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
      <Button className="mt-6" onClick={submit} disabled={saving}>{saving ? "Saving…" : "See my results"}</Button>
    </AppShell>
  );
}

function Bar({ label, v }: { label: string; v: number | null }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-20 text-muted-foreground">{label}</span>
      <div className="h-2 flex-1 rounded bg-muted"><div className="h-2 rounded bg-teal" style={{ width: `${((v ?? 0) / 5) * 100}%` }} /></div>
      <span className="w-8 text-right">{v ?? "–"}</span>
    </div>
  );
}
