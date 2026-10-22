import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ClipboardList, Compass, Map, FileText, Briefcase, Bookmark } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — ICT Career Compass" },
      { name: "description", content: "Your career-readiness overview." },
    ],
  }),
  component: DashboardPage,
});

interface Counts {
  roadmapDone: number;
  roadmapTotal: number;
  savedCareers: number;
  quizAttempts: number;
  opportunities: number;
}

function DashboardPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [counts, setCounts] = useState<Counts | null>(null);

  useEffect(() => {
    async function load() {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, onboarded")
        .eq("id", user.id)
        .maybeSingle();

      if (!profile?.onboarded) {
        navigate({ to: "/onboarding", replace: true });
        return;
      }
      setName(profile.full_name);

      const [tasks, careers, quizzes, opps] = await Promise.all([
        supabase.from("roadmap_tasks").select("done"),
        supabase.from("saved_careers").select("id"),
        supabase.from("quiz_attempts").select("id"),
        supabase.from("opportunities").select("id"),
      ]);

      const taskRows = tasks.data ?? [];
      setCounts({
        roadmapDone: taskRows.filter((t) => t.done).length,
        roadmapTotal: taskRows.length,
        savedCareers: careers.data?.length ?? 0,
        quizAttempts: quizzes.data?.length ?? 0,
        opportunities: opps.data?.length ?? 0,
      });
    }
    load();
  }, [navigate]);

  const cards = [
    {
      to: "/assessment",
      icon: ClipboardList,
      title: "Skills assessment",
      description: "Discover your strengths and gaps across key career-readiness areas.",
      stat: counts ? `${counts.quizAttempts} quiz attempt${counts.quizAttempts === 1 ? "" : "s"}` : null,
    },
    {
      to: "/careers",
      icon: Compass,
      title: "Career explorer",
      description: "Browse ICT career paths and save the ones that interest you.",
      stat: counts ? `${counts.savedCareers} saved career${counts.savedCareers === 1 ? "" : "s"}` : null,
    },
    {
      to: "/roadmap",
      icon: Map,
      title: "My roadmap",
      description: "Your four-stage plan from study to employment.",
      stat: counts ? `${counts.roadmapDone} of ${counts.roadmapTotal} tasks done` : null,
    },
    {
      to: "/cv",
      icon: FileText,
      title: "CV builder",
      description: "Draft a professional CV and download it as a PDF.",
      stat: null,
    },
    {
      to: "/opportunities",
      icon: Briefcase,
      title: "Opportunity tracker",
      description: "Keep track of internships, bursaries and graduate roles.",
      stat: counts ? `${counts.opportunities} tracked` : null,
    },
    {
      to: "/interviews",
      icon: Bookmark,
      title: "Interview practice",
      description: "Prepare answers to common interview questions.",
      stat: null,
    },
  ];

  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-primary">
          {name ? `Welcome, ${name.split(" ")[0]}` : "Welcome"}
        </h1>
        <p className="mt-1 text-muted-foreground">Here's your career-readiness overview.</p>
      </div>

      {counts === null ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Link key={card.title} to={card.to} className="group rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <Card className="h-full transition-colors group-hover:border-ring">
                <CardHeader>
                  <card.icon className="h-6 w-6 text-teal" aria-hidden />
                  <CardTitle className="text-base">{card.title}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
                {card.stat && (
                  <CardContent>
                    <p className="text-sm font-medium text-primary">{card.stat}</p>
                  </CardContent>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  );
}
