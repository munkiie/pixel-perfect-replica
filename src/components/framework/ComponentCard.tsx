import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Component } from "@/content/framework";

export function ComponentCard({ c }: { c: Component }) {
  const [open, setOpen] = useState(false);
  const Icon = c.icon;
  return (
    <div className="card-surface flex flex-col">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-start gap-4 p-5 text-left focus-visible:outline-2 focus-visible:outline-ring rounded-xl"
      >
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-xs font-semibold uppercase tracking-wider text-teal">
            Component {c.id}
          </span>
          <span className="mt-1 block font-display text-lg font-semibold leading-snug text-primary">
            {c.title}
          </span>
          <span className="mt-1 block text-sm text-muted-foreground">{c.summary}</span>
        </span>
        <ChevronDown
          className={`mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {open && (
        <div className="animate-in fade-in slide-in-from-top-1 border-t border-border px-5 pb-5 pt-4 text-sm">
          <h4 className="font-semibold text-primary">Key skills</h4>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-foreground">
            {c.skills.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <h4 className="mt-4 font-semibold text-primary">Suggested support</h4>
          <p className="mt-1 text-foreground">{c.support}</p>
        </div>
      )}
    </div>
  );
}
