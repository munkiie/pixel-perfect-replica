import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowUp, ArrowDown, Download, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Field } from "@/components/Field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { studentDataOptions } from "@/lib/student-data";
import { pageHead } from "@/lib/page-head";
import { cvCompletion, emptyCv, parseCv, type CvData, type CvEntry, type CvSection } from "@/content/cv";

export const Route = createFileRoute("/_authenticated/cv")({
  head: () => pageHead("CV builder", "Create, save and download an honest entry-level ICT CV."),
  loader: ({ context }) => context.queryClient.ensureQueryData(studentDataOptions),
  component: CvPage,
});

function CvPage() {
  const { data } = useSuspenseQuery(studentDataOptions);
  const queryClient = useQueryClient();
  const [id, setId] = useState<string | null>(data.cvs[0]?.id ?? null);
  const [title, setTitle] = useState(data.cvs[0]?.title ?? "My ICT CV");
  const [cv, setCv] = useState<CvData>(() => parseCv(data.cvs[0]?.data, data.profile?.full_name, data.email));
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [section, setSection] = useState<CvSection>("Education");
  function change(patch: Partial<CvData>) { setCv(c => ({ ...c, ...patch })); setDirty(true); }
  function entries(list: CvEntry[]) { change({ sections: { ...cv.sections, [section]: list } }); }
  function move(s: CvSection, offset: number) {
    const order = [...cv.order]; const from = order.indexOf(s); const to = from + offset;
    if (to < 0 || to >= order.length) return;
    const first = order[from]; const second = order[to];
    if (!first || !second) return;
    order[from] = second; order[to] = first;
    change({ order });
  }
  async function save() {
    if (!title.trim()) { toast.error("Give your draft a name."); return; }
    setBusy(true);
    const payload = { title: title.trim(), data: cv as unknown as Json, updated_at: new Date().toISOString(), user_id: data.userId };
    const result = id ? await supabase.from("cv_drafts").update(payload).eq("id", id).select("id").single() : await supabase.from("cv_drafts").insert(payload).select("id").single();
    setBusy(false);
    if (result.error) { toast.error(result.error.message); return; }
    setId(result.data.id); setDirty(false); await queryClient.invalidateQueries({ queryKey: studentDataOptions.queryKey }); toast.success("CV draft saved.");
  }
  async function remove() {
    if (!id || !window.confirm("Delete this CV draft?")) return;
    const { error } = await supabase.from("cv_drafts").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    setId(null); setCv(emptyCv(data.profile?.full_name, data.email)); setTitle("My ICT CV"); setDirty(false);
    await queryClient.invalidateQueries({ queryKey: studentDataOptions.queryKey }); toast.success("Draft deleted.");
  }
  function loadDraft(value: string) {
    if (dirty && !window.confirm("Discard unsaved changes?")) return;
    const draft = data.cvs.find(c => c.id === value);
    setId(draft?.id ?? null); setTitle(draft?.title ?? "My ICT CV"); setCv(parseCv(draft?.data, data.profile?.full_name, data.email)); setDirty(false);
  }
  async function download() {
    if (!cv.name.trim()) { toast.error("Add your name before downloading."); return; }
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF(); let y = 20;
    function text(content: string, size = 10, bold = false) {
      if (!content.trim()) return;
      doc.setFont("helvetica", bold ? "bold" : "normal"); doc.setFontSize(size);
      const lines = doc.splitTextToSize(content, 170) as string[];
      for (const line of lines) { if (y > 278) { doc.addPage(); y = 20; } doc.text(line, 20, y); y += size * 0.46 + 1; }
    }
    text(cv.name, 22, true);
    text([cv.email, cv.phone, cv.location, cv.website].filter(Boolean).join(" | "));
    y += 5; text(cv.summary); y += 5;
    for (const s of cv.order) {
      if (!cv.sections[s].length) continue;
      if (y > 250) { doc.addPage(); y = 20; }
      text(s.toUpperCase(), 12, true); y += 2;
      for (const e of cv.sections[s]) { text(e.title, 11, true); text([e.subtitle, e.dates].filter(Boolean).join(" | ")); text(e.detail); y += cv.template === "compact" ? 3 : 6; }
      y += 3;
    }
    doc.save(`${title.trim().replace(/[^a-z0-9 -]/gi, "") || "CV"}.pdf`);
  }
  return <AppShell>
    <div className="flex flex-wrap items-start justify-between gap-4"><div><h1 className="page-title">CV builder</h1><p className="mt-1 text-sm text-muted-foreground">{cvCompletion(cv)}% complete · {dirty ? "Unsaved changes" : id ? "Saved draft" : "New draft"}</p></div>
      <div className="flex gap-2"><Button variant="outline" onClick={download}><Download className="h-4 w-4" />PDF</Button><Button onClick={save} disabled={busy}><Save className="h-4 w-4" />{busy ? "Saving…" : "Save draft"}</Button></div></div>
    <div className="mt-6 flex flex-wrap items-end gap-3">
      <Field label="Saved drafts" id="cv-draft"><select id="cv-draft" className="native-select" value={id ?? ""} onChange={e => loadDraft(e.target.value)}><option value="">New draft</option>{data.cvs.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}</select></Field>
      <Field label="Draft name" id="cv-title"><Input id="cv-title" value={title} onChange={e => { setTitle(e.target.value); setDirty(true); }} /></Field>
      <Field label="Template" id="cv-template"><select id="cv-template" className="native-select" value={cv.template} onChange={e => change({ template: e.target.value === "compact" ? "compact" : "classic" })}><option value="classic">Classic</option><option value="compact">Compact</option></select></Field>
      {id && <Button size="icon" variant="ghost" title="Delete draft" aria-label="Delete draft" onClick={remove}><Trash2 className="h-4 w-4" /></Button>}
    </div>
    <div className="mt-8 grid items-start gap-8 xl:grid-cols-2">
      <div className="min-w-0 space-y-6">
        <h2 className="text-lg font-semibold">Personal details</h2>
        <div className="grid gap-4 sm:grid-cols-2">{(["name", "email", "phone", "location", "website"] as const).map(k => <Field key={k} label={{ name: "Full name", email: "Email", phone: "Phone", location: "City / location", website: "Portfolio / LinkedIn" }[k]} id={`cv-${k}`}><Input id={`cv-${k}`} type={k === "email" ? "email" : "text"} value={cv[k]} onChange={e => change({ [k]: e.target.value })} /></Field>)}</div>
        <Field label="Professional summary" id="cv-summary"><Textarea id="cv-summary" rows={4} value={cv.summary} onChange={e => change({ summary: e.target.value })} /></Field>
        <Field label="Section" id="cv-section"><select id="cv-section" className="native-select w-full" value={section} onChange={e => setSection(e.target.value as CvSection)}>{cv.order.map(s => <option key={s}>{s}</option>)}</select></Field>
        <div className="flex items-center justify-between"><h2 className="font-semibold">{section}</h2><div className="flex gap-1"><Button size="icon" variant="ghost" title="Move section up" aria-label="Move section up" disabled={cv.order.indexOf(section) === 0} onClick={() => move(section, -1)}><ArrowUp className="h-4 w-4" /></Button><Button size="icon" variant="ghost" title="Move section down" aria-label="Move section down" disabled={cv.order.indexOf(section) === cv.order.length - 1} onClick={() => move(section, 1)}><ArrowDown className="h-4 w-4" /></Button></div></div>
        {!cv.sections[section].length && <p className="text-sm text-muted-foreground">No entries yet.</p>}
        {cv.sections[section].map((entry, index) => <div key={entry.id} className="space-y-3 border-b border-border pb-6">
          <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Entry {index + 1}</span><div className="flex"><Button size="icon" variant="ghost" aria-label="Move entry up" title="Move entry up" disabled={index === 0} onClick={() => { const list = [...cv.sections[section]]; const previous = list[index - 1]; if (!previous) return; list[index - 1] = entry; list[index] = previous; entries(list); }}><ArrowUp className="h-4 w-4" /></Button><Button size="icon" variant="ghost" aria-label="Remove entry" title="Remove entry" onClick={() => entries(cv.sections[section].filter(e => e.id !== entry.id))}><Trash2 className="h-4 w-4" /></Button></div></div>
          {(["title", "subtitle", "dates", "detail"] as const).map(k => <Field key={k} label={{ title: "Title / skill / qualification", subtitle: "Organisation / institution", dates: "Dates (optional)", detail: "Details / evidence" }[k]} id={`${entry.id}-${k}`}>{k === "detail" ? <Textarea id={`${entry.id}-${k}`} value={entry[k]} onChange={e => entries(cv.sections[section].map(x => x.id === entry.id ? { ...x, [k]: e.target.value } : x))} /> : <Input id={`${entry.id}-${k}`} value={entry[k]} onChange={e => entries(cv.sections[section].map(x => x.id === entry.id ? { ...x, [k]: e.target.value } : x))} />}</Field>)}
        </div>)}
        <Button variant="outline" onClick={() => entries([...cv.sections[section], { id: crypto.randomUUID(), title: "", subtitle: "", dates: "", detail: "" }])}><Plus className="h-4 w-4" />Add entry</Button>
      </div>
      <div className="xl:sticky xl:top-8"><h2 className="mb-3 text-sm font-medium text-muted-foreground">Live preview</h2><article aria-label="CV preview" className={`cv-paper ${cv.template === "compact" ? "cv-compact" : ""}`}>
        <h2 className="text-2xl font-bold break-words">{cv.name || "Your name"}</h2><p className="mt-2 break-words text-xs">{[cv.email, cv.phone, cv.location, cv.website].filter(Boolean).join(" · ")}</p>
        {cv.summary && <p className="mt-5 whitespace-pre-wrap text-sm">{cv.summary}</p>}
        {cv.order.filter(s => cv.sections[s].length).map(s => <section key={s} className="mt-6"><h3 className="border-b border-paper-border pb-1 text-xs font-bold uppercase">{s}</h3>{cv.sections[s].map(e => <div key={e.id} className="mt-3 break-words"><h4 className="text-sm font-semibold">{e.title}</h4><p className="text-xs">{[e.subtitle, e.dates].filter(Boolean).join(" · ")}</p><p className="mt-1 whitespace-pre-wrap text-xs">{e.detail}</p></div>)}</section>)}
      </article></div>
    </div>
  </AppShell>;
}