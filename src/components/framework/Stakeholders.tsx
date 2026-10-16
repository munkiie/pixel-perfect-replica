import { Network } from "lucide-react";
import { stakeholders } from "@/content/framework";

export function Stakeholders() {
  return (
    <section aria-labelledby="stakeholders" className="rounded-2xl bg-primary p-6 text-primary-foreground sm:p-8">
      <div className="flex flex-col items-center text-center">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-teal text-primary">
          <Network className="h-6 w-6" aria-hidden />
        </span>
        <h2 id="stakeholders" className="mt-3 font-display text-2xl font-semibold">
          Stakeholder Cooperation
        </h2>
        <p className="mt-2 max-w-2xl text-sm opacity-85">
          Cooperation among stakeholders connects all six framework components, so that skills,
          experience and support develop together rather than in isolation.
        </p>
      </div>
      <div className="mx-auto mt-6 h-px max-w-3xl bg-teal/50" aria-hidden />
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stakeholders.map((s) => {
          const Icon = s.icon;
          return (
            <li key={s.name} className="relative rounded-xl bg-primary-foreground/10 p-4">
              <span className="absolute -top-6 left-1/2 hidden h-6 w-px -translate-x-1/2 bg-teal/50 lg:block" aria-hidden />
              <Icon className="h-5 w-5 text-teal" aria-hidden />
              <h3 className="mt-2 text-sm font-semibold leading-snug">{s.name}</h3>
              <p className="mt-1 text-xs opacity-80">{s.role}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
