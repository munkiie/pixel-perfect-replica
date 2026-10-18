import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass, ClipboardList, Map, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ICT Career Compass — Career readiness for ICT students" },
      { name: "description", content: "Discover ICT career paths, assess your skills, plan a roadmap and prepare for employment." },
      { property: "og:title", content: "ICT Career Compass" },
      { property: "og:description", content: "A career-readiness platform for ICT students and recent graduates." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const FEATURES = [
  { icon: ClipboardList, title: "Assess your skills", text: "Quizzes and self-assessments with clear explanations." },
  { icon: Compass, title: "Explore careers", text: "Compare ICT career paths and find your fit." },
  { icon: Map, title: "Plan your roadmap", text: "A four-stage plan from study to employment." },
  { icon: FileText, title: "Build your CV", text: "Draft a professional CV and download it as a PDF." },
];

function Index() {
  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto flex max-w-3xl flex-col items-center px-5 pt-24 pb-16 text-center">
        <Compass className="h-12 w-12 text-teal" aria-hidden />
        <h1 className="mt-4 font-display text-4xl font-bold text-primary sm:text-5xl">
          ICT Career Compass
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          A career-readiness platform for ICT students and recent graduates — assess your skills,
          explore career paths, plan your roadmap and prepare for employment.
        </p>
        <div className="mt-8 flex gap-3">
          <Button asChild size="lg">
            <Link to="/auth">Get started</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/auth">Sign in</Link>
          </Button>
        </div>
      </section>
      <section className="mx-auto grid max-w-4xl gap-4 px-5 pb-20 sm:grid-cols-2">
        {FEATURES.map((f) => (
          <div key={f.title} className="rounded-lg border border-border bg-card p-5">
            <f.icon className="h-6 w-6 text-teal" aria-hidden />
            <h2 className="mt-3 font-semibold text-foreground">{f.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
