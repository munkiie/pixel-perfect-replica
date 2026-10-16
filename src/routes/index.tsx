import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowRight, Factory, Target, AlertTriangle, BookOpen, ChevronDown } from "lucide-react";
import { components, theories, feedbackSteps, references } from "@/content/framework";
import { ComponentCard } from "@/components/framework/ComponentCard";
import { Stakeholders } from "@/components/framework/Stakeholders";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Career-Readiness Support Framework for ICT Students | WSU" },
      {
        name: "description",
        content:
          "A proposed, literature-informed career-readiness support framework for ICT students at Walter Sisulu University, Buffalo City Campus.",
      },
      { property: "og:title", content: "Career-Readiness Support Framework for ICT Students" },
      {
        property: "og:description",
        content: "Skills, support and university–industry cooperation for ICT student career readiness at WSU.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Connector() {
  return (
    <div className="flex justify-center py-3 text-teal" aria-hidden>
      <ArrowDown className="h-6 w-6" />
    </div>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-secondary">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
          <span className="inline-block rounded-full border border-teal/40 bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
            Proposed Framework — Under Development
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-primary sm:text-5xl">
            Career-Readiness Support Framework
          </h1>
          <p className="mt-3 max-w-3xl text-lg text-foreground">
            Supporting ICT students to develop the skills, experience and confidence needed for the
            modern workplace.
          </p>
          <p className="mt-2 text-sm font-medium text-muted-foreground">
            Walter Sisulu University — Buffalo City Campus, South Africa
          </p>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            This framework connects ICT skills development, employability skills, practical
            experience, career support and collaboration with industry. It is based on a literature
            review for the research report “Developing a Career Readiness Support Framework for ICT
            Students at iYunivesithi Walter Sisulu Buffalo City Campus” and will be refined once
            questionnaire responses have been analysed.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-16 px-5 py-12">
        <section aria-labelledby="framework">
          <h2 id="framework" className="sr-only">Framework diagram</h2>
          <div className="flex items-center justify-center gap-3 rounded-2xl border-2 border-primary px-5 py-4 text-center">
            <Factory className="h-5 w-5 shrink-0 text-primary" aria-hidden />
            <p className="font-display text-lg font-semibold text-primary">
              Modern Workplace and Industry Requirements
            </p>
          </div>
          <Connector />
          <p className="mb-4 text-center text-sm text-muted-foreground">
            Select a component to view its key skills and suggested support.
          </p>
          <div className="grid items-start gap-4 md:grid-cols-2 lg:grid-cols-3">
            {components.map((c) => (
              <ComponentCard key={c.id} c={c} />
            ))}
          </div>
          <Connector />
          <Stakeholders />
          <Connector />
          <div className="rounded-2xl bg-accent p-6 text-center sm:p-8">
            <Target className="mx-auto h-7 w-7 text-primary" aria-hidden />
            <h2 className="mt-2 font-display text-2xl font-semibold text-primary">
              Improved Career Readiness for ICT Students
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-foreground">
              The framework aims to support students in developing relevant skills, gaining
              practical experience, preparing for job applications and adapting to changing
              workplace requirements.
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-xs italic text-muted-foreground">
              Improved career readiness does not guarantee employment. Employment outcomes are also
              influenced by labour-market conditions and other factors.
            </p>
          </div>
        </section>

        <section aria-labelledby="theory">
          <h2 id="theory" className="font-display text-2xl font-semibold text-primary">
            Theoretical Foundation
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {theories.map((t) => (
              <div key={t.title} className="card-surface border-l-4 border-l-teal p-5">
                <h3 className="font-semibold text-primary">{t.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="feedback">
          <h2 id="feedback" className="font-display text-2xl font-semibold text-primary">
            Feedback and Improvement
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Questionnaire results will be used to refine the proposed framework.
          </p>
          <ol className="mt-5 flex flex-col items-stretch gap-2 md:flex-row md:items-center">
            {feedbackSteps.map((s, i) => (
              <li key={s} className="flex flex-col items-center gap-2 md:flex-1 md:flex-row">
                <span className="card-surface w-full p-4 text-center text-sm font-medium text-primary">
                  <span className="block text-xs text-teal">Step {i + 1}</span>
                  {s}
                </span>
                {i < feedbackSteps.length - 1 && (
                  <>
                    <ArrowDown className="h-4 w-4 shrink-0 text-teal md:hidden" aria-hidden />
                    <ArrowRight className="hidden h-4 w-4 shrink-0 text-teal md:block" aria-hidden />
                  </>
                )}
              </li>
            ))}
          </ol>
          <div role="note" className="mt-6 flex gap-3 rounded-xl border border-warning/40 bg-warning/10 p-4 text-sm text-foreground">
            <AlertTriangle className="h-5 w-5 shrink-0 text-warning" aria-hidden />
            <p>
              This is a preliminary, literature-informed framework. It must be reviewed using the
              actual research findings before it is presented as the final framework.
            </p>
          </div>
        </section>

        <section>
          <details className="card-surface group p-5">
            <summary className="flex cursor-pointer list-none items-center gap-3 font-semibold text-primary">
              <BookOpen className="h-5 w-5 text-teal" aria-hidden />
              <span className="flex-1">Key Literature Informing the Framework</span>
              <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" aria-hidden />
            </summary>
            <ul className="mt-4 space-y-2 text-sm text-foreground">
              {references.map((r) => (
                <li key={r} className="pl-6 -indent-6">{r}</li>
              ))}
            </ul>
          </details>
        </section>
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        Academic research project · Walter Sisulu University, Buffalo City Campus
      </footer>
    </div>
  );
}
