import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { KeyRound, Save } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { normalizeProfileName } from "@/content/profile";
import { studentDataOptions } from "@/lib/student-data";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => pageHead("Profile & settings", "Update your student profile and account preferences."),
  loader: ({ context }) => context.queryClient.ensureQueryData(studentDataOptions),
  component: SettingsPage,
});

const statusOptions = [
  { value: "student", label: "Current student" },
  { value: "graduate", label: "Recent graduate" },
  { value: "other", label: "Other" },
];
const studyYears = ["1st year", "2nd year", "3rd year", "4th year", "Postgraduate", "Not applicable"];

function SettingsPage() {
  const { data } = useSuspenseQuery(studentDataOptions);
  const queryClient = useQueryClient();
  const profile = data.profile;
  const [name, setName] = useState(profile?.full_name ?? "");
  const [programme, setProgramme] = useState(profile?.programme ?? "");
  const [status, setStatus] = useState(profile?.status || "student");
  const [studyYear, setStudyYear] = useState(profile?.study_year ?? "");
  const [busy, setBusy] = useState(false);

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanName = normalizeProfileName(name);
    if (!cleanName) {
      toast.error("Enter your name before saving.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("profiles").update({
      full_name: cleanName,
      programme: programme.trim(),
      status,
      study_year: studyYear,
      updated_at: new Date().toISOString(),
    }).eq("id", data.userId);
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    await queryClient.invalidateQueries({ queryKey: studentDataOptions.queryKey });
    setName(cleanName);
    toast.success("Profile saved.");
  }

  async function sendPasswordReset() {
    if (!data.email) {
      toast.error("No email address is available for this account.");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) toast.error(error.message);
    else toast.success("Password reset instructions sent to your email.");
  }

  return <AppShell>
    <div className="mb-8"><h1 className="page-title">Profile & settings</h1><p className="page-subtitle">Keep your study details current.</p></div>
    <section className="max-w-3xl border-y border-border py-6">
      <h2 className="text-lg font-semibold">Student profile</h2>
      <p className="mt-1 text-sm text-muted-foreground">These details help personalise your career workspace.</p>
      <form onSubmit={saveProfile} className="mt-6 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="settings-name">Full name</Label><Input id="settings-name" required value={name} onChange={event => setName(event.target.value)} /></div>
          <div className="space-y-2"><Label htmlFor="settings-email">Account email</Label><Input id="settings-email" type="email" readOnly value={data.email} /></div>
          <div className="space-y-2"><Label htmlFor="settings-programme">Programme / field of study</Label><Input id="settings-programme" value={programme} onChange={event => setProgramme(event.target.value)} /></div>
          <div className="space-y-2"><Label>Current status</Label><Select value={status} onValueChange={setStatus}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{statusOptions.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-2"><Label>Year of study</Label><Select value={studyYear} onValueChange={setStudyYear}><SelectTrigger><SelectValue placeholder="Select your year" /></SelectTrigger><SelectContent>{studyYears.map(year => <SelectItem key={year} value={year}>{year}</SelectItem>)}</SelectContent></Select></div>
        </div>
        <Button type="submit" disabled={busy}><Save className="h-4 w-4" />{busy ? "Saving…" : "Save profile"}</Button>
      </form>
    </section>
    <section className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-7">
      <div><h2 className="font-semibold">Password</h2><p className="mt-1 text-sm text-muted-foreground">Send a password reset link to your account email.</p></div>
      <Button variant="outline" onClick={sendPasswordReset}><KeyRound className="h-4 w-4" />Email reset link</Button>
    </section>
    <p className="mt-6 text-sm text-muted-foreground">Your saved assessments, CV drafts and activity remain private to your account. <Link to="/auth" className="text-primary underline">Account sign-in</Link></p>
  </AppShell>;
}