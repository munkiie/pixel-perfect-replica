import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const studentDataOptions = queryOptions({
  queryKey: ["student-data"],
  queryFn: async () => {
    const { data: auth, error: authError } = await supabase.auth.getUser();
    if (authError || !auth.user) throw new Error("Please sign in to load your progress.");
    const userId = auth.user.id;
    const [profile, assessments, quizzes, projects, cvs, notes, tasks, saved, opportunities] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
      supabase.from("assessment_attempts").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      supabase.from("quiz_attempts").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      supabase.from("project_progress").select("*").eq("user_id", userId),
      supabase.from("cv_drafts").select("*").eq("user_id", userId).order("updated_at", { ascending: false }),
      supabase.from("interview_notes").select("*").eq("user_id", userId),
      supabase.from("roadmap_tasks").select("*").eq("user_id", userId).order("position"),
      supabase.from("saved_careers").select("*").eq("user_id", userId),
      supabase.from("opportunities").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    ]);
    for (const result of [profile, assessments, quizzes, projects, cvs, notes, tasks, saved, opportunities]) {
      if (result.error) throw new Error(result.error.message);
    }
    return { userId, email: auth.user.email ?? "", profile: profile.data, assessments: assessments.data ?? [], quizzes: quizzes.data ?? [], projects: projects.data ?? [], cvs: cvs.data ?? [], notes: notes.data ?? [], tasks: tasks.data ?? [], saved: saved.data ?? [], opportunities: opportunities.data ?? [] };
  },
});