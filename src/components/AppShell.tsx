import { Link, useNavigate } from "@tanstack/react-router";
import {
  Activity, BookOpenCheck, Bookmark, BriefcaseBusiness, Compass, FileText,
  FolderKanban, GraduationCap, LayoutDashboard, LogOut, Map, Menu, Network,
  Settings2, Target, X,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/assessment", label: "Assessment", icon: Target },
  { to: "/quizzes", label: "Practice quizzes", icon: BookOpenCheck },
  { to: "/careers", label: "Career paths", icon: Compass },
  { to: "/roadmap", label: "My roadmap", icon: Map },
  { to: "/skills", label: "Skill matrix", icon: Activity },
  { to: "/projects", label: "Project lab", icon: FolderKanban },
  { to: "/interviews", label: "Interview practice", icon: Network },
  { to: "/resources", label: "Learning resources", icon: GraduationCap },
  { to: "/opportunities", label: "Opportunity tracker", icon: BriefcaseBusiness },
  { to: "/cv", label: "CV builder", icon: FileText },
  { to: "/settings", label: "Profile & settings", icon: Settings2 },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  function Navigation({ close = false }: { close?: boolean }) {
    return (
      <nav aria-label="Main navigation" className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
          const item = (
            <Link key={to} to={to} onClick={() => close && setMobileOpen(false)}
              className="flex min-h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
              activeProps={{ className: "bg-sidebar-accent text-sidebar-primary" }}>
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              <span>{label}</span>
            </Link>
          );
          return close ? <SheetClose asChild key={to}>{item}</SheetClose> : item;
        })}
      </nav>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground [--sidebar-width:17rem]">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[var(--sidebar-width)] flex-col border-r border-sidebar-border bg-sidebar px-4 py-5 lg:flex">
        <Link to="/dashboard" className="mb-8 flex items-center gap-3 px-2">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground"><Compass className="h-5 w-5" aria-hidden /></span>
          <span className="font-semibold text-sidebar-foreground">ICT Career Compass</span>
        </Link>
        <p className="mb-3 px-3 text-[11px] font-semibold uppercase text-muted-foreground">Career workspace</p>
        <div className="min-h-0 flex-1 overflow-y-auto"><Navigation /></div>
        <div className="mt-4 border-t border-sidebar-border pt-3">
          <Button variant="ghost" onClick={handleSignOut} className="w-full justify-start gap-3 px-3 text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-foreground"><LogOut className="h-4 w-4" />Sign out</Button>
        </div>
      </aside>

      <div className="lg:ml-[var(--sidebar-width)]">
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur lg:justify-end lg:px-8">
          <Link to="/dashboard" className="flex items-center gap-2 font-semibold lg:hidden"><Compass className="h-5 w-5 text-primary" />ICT Career Compass</Link>
          <div className="lg:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild><Button size="icon" variant="ghost" aria-label="Open navigation"><Menu className="h-5 w-5" /></Button></SheetTrigger>
              <SheetContent side="left" className="w-[var(--sidebar-width)] max-w-[85vw] border-sidebar-border bg-sidebar p-4 text-sidebar-foreground">
                <SheetHeader className="mb-6 text-left"><SheetTitle className="flex items-center gap-2 text-sidebar-foreground"><Compass className="h-5 w-5 text-sidebar-primary" />ICT Career Compass</SheetTitle></SheetHeader>
                <div className="max-h-[calc(100vh-9rem)] overflow-y-auto"><Navigation close /></div>
                <div className="mt-4 border-t border-sidebar-border pt-3"><Button variant="ghost" onClick={handleSignOut} className="w-full justify-start gap-3 px-3"><LogOut className="h-4 w-4" />Sign out</Button></div>
              </SheetContent>
            </Sheet>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="hidden gap-2 lg:inline-flex"><LogOut className="h-4 w-4" />Sign out</Button>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}