import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";

export function Field({ label, id, children }: { label: string; id: string; children: ReactNode }) {
  return <div className="space-y-2"><Label htmlFor={id}>{label}</Label>{children}</div>;
}