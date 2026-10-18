import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/onboarding")({
  head: () => ({
    meta: [
      { title: "Welcome — ICT Career Compass" },
      { name: "description", content: "Tell us about yourself to personalise your career journey." },
    ],
  }),
  component: OnboardingPage,
});

const STATUSES = [
  { value: "student", label: "Current student" },
  { value: "graduate", label: "Recent graduate" },
  { value: "other", label: "Other" },
];

const YEARS = ["1st year", "2nd year", "3rd year", "4th year", "Postgraduate", "Not applicable"];

function OnboardingPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [status, setStatus] = useState("student");
  const [programme, setProgramme] = useState("");
  const [studyYear, setStudyYear] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) {
      setBusy(false);
      navigate({ to: "/auth" });
      return;
    }
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: fullName,
      status,
      programme,
      study_year: studyYear,
      onboarded: true,
      updated_at: new Date().toISOString(),
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("You're all set!");
    navigate({ to: "/dashboard" });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="font-display text-2xl">Welcome to ICT Career Compass</CardTitle>
          <CardDescription>
            A few quick details so we can tailor your assessments, roadmap and resources.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="full-name">Full name</Label>
              <Input
                id="full-name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
              />
            </div>
            <div className="space-y-2">
              <Label>I am a…</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="programme">Programme / field of study</Label>
              <Input
                id="programme"
                value={programme}
                onChange={(e) => setProgramme(e.target.value)}
                placeholder="e.g. BSc Computer Science"
              />
            </div>
            <div className="space-y-2">
              <Label>Year of study</Label>
              <Select value={studyYear} onValueChange={setStudyYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your year" />
                </SelectTrigger>
                <SelectContent>
                  {YEARS.map((y) => (
                    <SelectItem key={y} value={y}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full" disabled={busy}>
              {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Continue to my dashboard
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
