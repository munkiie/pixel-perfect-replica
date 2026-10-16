import { createFileRoute } from "@tanstack/react-router";
import { Compass } from "lucide-react";

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

function Index() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5">
      <div className="max-w-xl text-center">
        <Compass className="mx-auto h-10 w-10 text-teal" aria-hidden />
        <h1 className="mt-4 font-display text-4xl font-bold text-primary">ICT Career Compass</h1>
        <p className="mt-3 text-muted-foreground">
          A career-readiness platform for ICT students and recent graduates. Sign-in, assessments,
          roadmap and CV builder are being built.
        </p>
      </div>
    </main>
  );
}
