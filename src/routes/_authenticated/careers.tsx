import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { careers, type Career } from "@/content/careers";

export const Route = createFileRoute("/_authenticated/careers")({
  head: () => ({ meta: [{ title: "Career explorer — ICT Career Compass" }, { name: "description", content: "Explore and compare ICT career paths." }] }),
  component: CareersPage,
});

function CareersPage() {
  const [saved, setSaved] = useState<Record<string, string>>({});
  const [open, setOpen] = useState<Career | null>(null);
  const [compare, setCompare] = useState<string[]>([]);

  useEffect(() => {
    supabase.from("saved_careers").select("id, career_id").then(({ data }) =>
      setSaved(Object.fromEntries((data ?? []).map((r) => [r.career_id, r.id]))));
  }, []);

  async function toggleSave(id: string) {
    if (saved[id]) {
      await supabase.from("saved_careers").delete().eq("id", saved[id]);
      setSaved(({ [id]: _, ...rest }) => rest);
    } else {
      const { data, error } = await supabase.from("saved_careers").insert({ career_id: id }).select("id").single();
      if (error) return toast.error(error.message);
      setSaved((s) => ({ ...s, [id]: data.id }));
    }
  }
  const toggleCompare = (id: string) =>
    setCompare((c) => (c.includes(id) ? c.filter((x) => x !== id) : c.length >= 3 ? c : [...c, id]));

  const compared = careers.filter((c) => compare.includes(c.id));

  return (
    <AppShell>
      <h1 className="font-display text-3xl font-bold text-primary">Career explorer</h1>
      <p className="mt-1 text-sm text-muted-foreground">General guidance only — not verified vacancy or salary data. Tick up to 3 careers to compare.</p>

      {compared.length >= 2 && (
        <Card className="mt-6 overflow-x-auto">
          <CardHeader><CardTitle className="text-base">Comparison</CardTitle></CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead><tr><th className="text-left" />{compared.map((c) => <th key={c.id} className="p-2 text-left">{c.title}</th>)}</tr></thead>
              <tbody>
                {([["Level", (c: Career) => c.level], ["Key skills", (c: Career) => c.technical.slice(0, 4).join(", ")], ["Tools", (c: Career) => c.tools.slice(0, 4).join(", ")], ["Entry roles", (c: Career) => c.roles.join(", ")]] as const).map(([l, f]) => (
                  <tr key={l} className="border-t border-border align-top"><td className="p-2 font-medium text-muted-foreground">{l}</td>{compared.map((c) => <td key={c.id} className="p-2">{f(c)}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {careers.map((c) => (
          <Card key={c.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base">{c.title}</CardTitle>
                <button aria-label={saved[c.id] ? "Unsave" : "Save"} onClick={() => toggleSave(c.id)}>
                  {saved[c.id] ? <BookmarkCheck className="h-5 w-5 text-teal" /> : <Bookmark className="h-5 w-5 text-muted-foreground" />}
                </button>
              </div>
              <div className="flex gap-1"><Badge variant="secondary">{c.category}</Badge><Badge variant="outline">{c.level}</Badge></div>
              <CardDescription>{c.description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => setOpen(open?.id === c.id ? null : c)}>{open?.id === c.id ? "Hide" : "Details"}</Button>
              <label className="flex items-center gap-1.5 text-xs"><input type="checkbox" checked={compare.includes(c.id)} onChange={() => toggleCompare(c.id)} />Compare</label>
            </CardContent>
            {open?.id === c.id && (
              <CardContent className="space-y-3 border-t border-border pt-4 text-sm">
                <List t="Responsibilities" items={c.responsibilities} />
                <List t="Technical skills" items={c.technical} />
                <List t="Tools" items={c.tools} />
                <List t="Project ideas" items={c.projects} />
                <List t="Entry-level roles" items={c.roles} />
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </AppShell>
  );
}

function List({ t, items }: { t: string; items: string[] }) {
  return <div><p className="font-medium">{t}</p><ul className="ml-4 list-disc text-muted-foreground">{items.map((i) => <li key={i}>{i}</li>)}</ul></div>;
}
