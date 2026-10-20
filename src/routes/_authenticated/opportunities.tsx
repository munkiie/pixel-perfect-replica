import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Pencil, Trash2, ExternalLink, Plus } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Field } from "@/components/Field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { opportunityStatuses, opportunityKinds, safeOpportunityUrl } from "@/content/opportunities";
import { studentDataOptions } from "@/lib/student-data";
import { pageHead } from "@/lib/page-head";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
type Draft = Pick<Tables<"opportunities">, "title" | "organisation" | "kind" | "status" | "link" | "notes" | "deadline" | "follow_up">;
const blank: Draft = { title: "", organisation: "", kind: "Internship", status: "Interested", link: "", notes: "", deadline: null, follow_up: null };
export const Route = createFileRoute("/_authenticated/opportunities")({ head: () => pageHead("Opportunity tracker", "Organise your own internships, graduate programmes and job applications."), loader: ({ context }) => context.queryClient.ensureQueryData(studentDataOptions), component: OpportunitiesPage });
function OpportunitiesPage() {
  const { data } = useSuspenseQuery(studentDataOptions); const qc = useQueryClient();
  const [draft, setDraft] = useState<Draft>(blank); const [id, setId] = useState<string | null>(null); const [open, setOpen] = useState(false); const [busy, setBusy] = useState(false); const [filter, setFilter] = useState("All");
  async function save(e: React.FormEvent) {
    e.preventDefault(); if (!draft.title.trim()) return;
    if (draft.link && !safeOpportunityUrl(draft.link)) { toast.error("Use a full http or https opportunity link."); return; }
    setBusy(true); const payload = { ...draft, title: draft.title.trim(), user_id: data.userId };
    const { error } = id ? await supabase.from("opportunities").update(payload).eq("id", id) : await supabase.from("opportunities").insert(payload);
    if (error) toast.error(error.message); else { await qc.invalidateQueries({ queryKey: studentDataOptions.queryKey }); setOpen(false); setId(null); setDraft(blank); toast.success("Opportunity saved."); } setBusy(false);
  }
  async function remove(rowId: string) { if (!window.confirm("Delete this opportunity?")) return; const { error } = await supabase.from("opportunities").delete().eq("id", rowId); if (error) toast.error(error.message); else await qc.invalidateQueries({ queryKey: studentDataOptions.queryKey }); }
  return <AppShell><div className="flex flex-wrap justify-between gap-4"><div><h1 className="page-title">Opportunity tracker</h1><p className="page-subtitle">Your applications, deadlines and follow-ups.</p></div><Button onClick={() => { setDraft(blank); setId(null); setOpen(true); }}><Plus className="h-4 w-4" />Add opportunity</Button></div>
    {open && <form onSubmit={save} className="mt-8 max-w-3xl space-y-4 border-y border-border py-6"><h2 className="text-lg font-semibold">{id ? "Edit opportunity" : "New opportunity"}</h2><div className="grid gap-4 sm:grid-cols-2">{(["title", "organisation", "link"] as const).map(k => <Field key={k} label={{ title: "Role / programme", organisation: "Organisation", link: "Original link" }[k]} id={`opp-${k}`}><Input id={`opp-${k}`} type={k === "link" ? "url" : "text"} required={k === "title"} value={draft[k]} onChange={e => setDraft(d => ({ ...d, [k]: e.target.value }))} /></Field>)}
      <Field label="Type" id="opp-kind"><select id="opp-kind" className="native-select w-full" value={draft.kind} onChange={e => setDraft(d => ({ ...d, kind: e.target.value }))}>{opportunityKinds.map(k => <option key={k}>{k}</option>)}</select></Field><Field label="Status" id="opp-status"><select id="opp-status" className="native-select w-full" value={draft.status} onChange={e => setDraft(d => ({ ...d, status: e.target.value }))}>{opportunityStatuses.map(s => <option key={s}>{s}</option>)}</select></Field>{(["deadline", "follow_up"] as const).map(k => <Field key={k} label={k === "deadline" ? "Application deadline" : "Follow-up date"} id={`opp-${k}`}><Input type="date" id={`opp-${k}`} value={draft[k] ?? ""} onChange={e => setDraft(d => ({ ...d, [k]: e.target.value || null }))} /></Field>)}</div><Field label="Notes" id="opp-notes"><Textarea id="opp-notes" value={draft.notes} onChange={e => setDraft(d => ({ ...d, notes: e.target.value }))} /></Field><div className="flex gap-3"><Button type="submit" disabled={busy}>{busy ? "Saving…" : "Save opportunity"}</Button><Button variant="ghost" type="button" onClick={() => setOpen(false)}>Cancel</Button></div></form>}
    <div className="mt-6"><Field label="Filter by status" id="opp-filter"><select id="opp-filter" className="native-select" value={filter} onChange={e => setFilter(e.target.value)}><option>All</option>{opportunityStatuses.map(s => <option key={s}>{s}</option>)}</select></Field></div>
    {!data.opportunities.length && <p className="mt-8 text-muted-foreground">No opportunities saved yet. Add a role or programme you found; there is no live vacancy feed.</p>}
    <div className="mt-8 grid gap-5 lg:grid-cols-2">{data.opportunities.filter(o => filter === "All" || o.status === filter).map(o => { const url = safeOpportunityUrl(o.link); return <article key={o.id} className="tool-item"><div className="flex items-center justify-between gap-3"><span className="text-xs font-medium text-primary">{o.status} · {o.kind}</span><div className="flex gap-1"><Button size="icon" variant="ghost" title="Edit opportunity" aria-label={`Edit ${o.title}`} onClick={() => { setId(o.id); setDraft(o); setOpen(true); }}><Pencil className="h-4 w-4" /></Button><Button size="icon" variant="ghost" title="Delete opportunity" aria-label={`Delete ${o.title}`} onClick={() => remove(o.id)}><Trash2 className="h-4 w-4" /></Button></div></div><h2 className="mt-2 text-lg font-semibold">{o.title}</h2><p className="text-sm text-muted-foreground">{o.organisation}</p><dl className="mt-4 grid grid-cols-2 gap-3 text-xs"><div><dt className="text-muted-foreground">Deadline</dt><dd className="mt-1">{o.deadline ?? "Not set"}</dd></div><div><dt className="text-muted-foreground">Follow-up</dt><dd className="mt-1">{o.follow_up ?? "Not set"}</dd></div></dl>{o.notes && <p className="mt-4 whitespace-pre-wrap break-words text-sm">{o.notes}</p>}{url && <Button asChild variant="link" className="mt-3 px-0"><a href={url} target="_blank" rel="noopener noreferrer">Original opportunity<ExternalLink className="h-3 w-3" /></a></Button>}</article>; })}</div>
  </AppShell>;
}