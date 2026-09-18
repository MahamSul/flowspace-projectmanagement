import { createFileRoute, Link } from "@tanstack/react-router";
import { LayoutGrid, List, Mail, MapPin, Search, UserPlus } from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell, Button, inputClass, PageHeader } from "@/components/pm/app-shell";
import { Avatar, Bar, Chip, EmptyState, Panel } from "@/components/pm/primitives";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Team — Flowspace" },
      {
        name: "description",
        content:
          "Browse the Flowspace team directory: roles, departments, availability, active projects and current workload.",
      },
      { property: "og:title", content: "Team — Flowspace" },
      {
        property: "og:description",
        content: "Roles, departments, availability and workload for every teammate.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TeamPage,
});

function loadTone(w: number): "danger" | "warning" | "accent" | "success" {
  return w > 100 ? "danger" : w > 85 ? "warning" : w < 50 ? "accent" : "success";
}

function TeamPage() {
  const { members, projects, tasks } = useStore();
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("All");
  const [view, setView] = useState<"grid" | "list">("grid");

  const departments = useMemo(
    () => ["All", ...Array.from(new Set(members.map((m) => m.department)))],
    [members],
  );

  const filtered = members.filter(
    (m) =>
      (dept === "All" || m.department === dept) &&
      (m.name.toLowerCase().includes(q.toLowerCase()) ||
        m.role.toLowerCase().includes(q.toLowerCase())),
  );

  const avgLoad = Math.round(members.reduce((s, m) => s + m.workload, 0) / members.length);

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title="Team"
          subtitle={`${members.length} people across ${departments.length - 1} departments.`}
          actions={
            <Button size="sm">
              <UserPlus className="size-4" /> Invite member
            </Button>
          }
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["Team members", `${members.length}`, "Across all departments"],
            ["Active now", `${members.filter((m) => m.status === "Active").length}`, "Available today"],
            ["Average load", `${avgLoad}%`, "Of weekly capacity"],
            [
              "Overloaded",
              `${members.filter((m) => m.workload > 100).length}`,
              "Above 100% capacity",
            ],
          ].map(([label, value, hint]) => (
            <div key={label} className="surface p-5">
              <p className="text-xs font-medium text-muted-foreground">{label}</p>
              <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
            </div>
          ))}
        </div>

        <div className="surface flex flex-wrap items-center gap-3 p-4">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name or role…"
              aria-label="Search team"
              className={cn(inputClass, "pl-9")}
            />
          </div>
          <select
            value={dept}
            onChange={(e) => setDept(e.target.value)}
            aria-label="Filter by department"
            className={cn(inputClass, "w-auto")}
          >
            {departments.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
          <div className="flex items-center gap-1 rounded-lg border border-border p-1">
            <button
              aria-label="Grid view"
              onClick={() => setView("grid")}
              className={cn(
                "rounded-md p-1.5",
                view === "grid" ? "bg-primary-soft text-primary" : "text-muted-foreground",
              )}
            >
              <LayoutGrid className="size-4" />
            </button>
            <button
              aria-label="List view"
              onClick={() => setView("list")}
              className={cn(
                "rounded-md p-1.5",
                view === "list" ? "bg-primary-soft text-primary" : "text-muted-foreground",
              )}
            >
              <List className="size-4" />
            </button>
          </div>
        </div>

        {filtered.length === 0 && (
          <EmptyState title="No team members found" hint="Try another search or department." />
        )}

        {filtered.length > 0 && view === "grid" && (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((m) => {
              const memberProjects = projects.filter((p) => p.memberIds.includes(m.id));
              const open = tasks.filter(
                (t) => t.assigneeId === m.id && t.status !== "Completed",
              ).length;
              return (
                <article key={m.id} className="surface p-5">
                  <div className="flex items-start gap-3">
                    <Avatar name={m.name} size="lg" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{m.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{m.role}</p>
                    </div>
                    <Chip
                      tone={
                        m.status === "Active" ? "success" : m.status === "Away" ? "warning" : "muted"
                      }
                    >
                      {m.status}
                    </Chip>
                  </div>

                  <dl className="mt-4 grid grid-cols-3 gap-2 rounded-lg bg-muted/50 p-3 text-center">
                    <div>
                      <dt className="text-[11px] text-muted-foreground">Projects</dt>
                      <dd className="text-sm font-semibold">{memberProjects.length}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] text-muted-foreground">Open tasks</dt>
                      <dd className="text-sm font-semibold">{open}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] text-muted-foreground">Load</dt>
                      <dd className="text-sm font-semibold">{m.workload}%</dd>
                    </div>
                  </dl>

                  <Bar
                    value={Math.min(100, m.workload)}
                    tone={loadTone(m.workload)}
                    className="mt-3"
                  />

                  <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                    <p className="flex items-center gap-1.5 truncate">
                      <Mail className="size-3.5 shrink-0" /> {m.email}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MapPin className="size-3.5 shrink-0" /> {m.location} · joined {m.joined}
                    </p>
                  </div>

                  {memberProjects.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {memberProjects.slice(0, 3).map((p) => (
                        <Link key={p.id} to="/projects/$projectId" params={{ projectId: p.id }}>
                          <Chip tone="primary">{p.name}</Chip>
                        </Link>
                      ))}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}

        {filtered.length > 0 && view === "list" && (
          <Panel title="Team directory" bodyClassName="p-0">
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full min-w-[760px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="px-5 py-3 font-medium">Member</th>
                    <th className="px-5 py-3 font-medium">Department</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Projects</th>
                    <th className="px-5 py-3 font-medium">Workload</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((m) => (
                    <tr key={m.id} className="hover:bg-muted/40">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={m.name} size="sm" />
                          <div className="min-w-0">
                            <p className="truncate font-medium">{m.name}</p>
                            <p className="truncate text-xs text-muted-foreground">{m.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">{m.department}</td>
                      <td className="px-5 py-3">
                        <Chip
                          tone={
                            m.status === "Active"
                              ? "success"
                              : m.status === "Away"
                                ? "warning"
                                : "muted"
                          }
                        >
                          {m.status}
                        </Chip>
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">{m.activeProjects}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <Bar
                            value={Math.min(100, m.workload)}
                            tone={loadTone(m.workload)}
                            className="w-28"
                          />
                          <span className="text-xs font-medium">{m.workload}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        )}
      </div>
    </AppShell>
  );
}
