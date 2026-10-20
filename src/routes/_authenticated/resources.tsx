import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/Field";
import { careers } from "@/content/careers";
import { resources } from "@/content/practice";
import { pageHead } from "@/lib/page-head";
export const Route = createFileRoute("/_authenticated/resources")({ head: () => pageHead("Learning resources", "Find reliable ICT documentation and practical learning activities."), component: ResourcesPage });
function ResourcesPage() {
  const [career, setCareer] = useState("all"); const [search, setSearch] = useState("");
  const list = resources.filter(r => (career === "all" || r.careers.includes(career)) && `${r.title} ${r.topic}`.toLowerCase().includes(search.toLowerCase()));
  return <AppShell><h1 className="page-title">Learning resources</h1><p className="page-subtitle">Learn a topic. Apply it. Keep the evidence.</p><div className="mt-6 flex flex-wrap gap-4"><Field label="Search topics" id="resource-search"><Input id="resource-search" value={search} onChange={e => setSearch(e.target.value)} placeholder="e.g. programming" /></Field><Field label="Career path" id="resource-career"><select id="resource-career" className="native-select" value={career} onChange={e => setCareer(e.target.value)}><option value="all">All careers</option>{careers.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}</select></Field></div><div className="mt-8 grid gap-5 md:grid-cols-2">{list.map(r => <article className="tool-item" key={r.title}><h2 className="text-lg font-semibold">{r.title}</h2><p className="mt-2 text-sm text-primary">{r.topic}</p><p className="mt-3 text-sm text-muted-foreground">{r.activity}</p><Button asChild variant="outline" size="sm" className="mt-5"><a href={r.url} target="_blank" rel="noopener noreferrer">Visit resource<ExternalLink className="h-3 w-3" /></a></Button></article>)}</div>{!list.length && <p className="mt-8 text-muted-foreground">No resources match your filters.</p>}<p className="mt-8 max-w-3xl text-sm text-muted-foreground">Before choosing a course or certification, check its prerequisites, cost, assessment method and relevance to your target role. A course certificate does not guarantee employment.</p></AppShell>;
}