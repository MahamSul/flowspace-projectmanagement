import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Plus,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell, Button, Field, PageHeader, inputClass } from "@/components/pm/app-shell";
import {
  AvatarStack,
  Bar,
  Chip,
  EmptyState,
  Panel,
  PriorityBadge,
  ProjectStatusBadge,
} from "@/components/pm/primitives";
import { cn } from "@/lib/utils";
import { daysUntil, formatDate, projectProgress, useStore } from "@/lib/store";
import type { Priority, ProjectStatus } from "@/lib/mock-data";

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: [
      { title: "Projects — Flowspace" },
      {
        name: "description",
        content:
          "All Flowspace projects with progress, owners, deadlines and delivery status in one sortable list.",
      },
      { property: "og:title", content: "Projects — Flowspace" },
      {
        property: "og:description",
        content: "Browse every project with progress, team and deadline at a glance.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProjectsPage,
});

const STATUSES: ProjectStatus[] = ["On Track", "At Risk", "Delayed", "Completed"];
const PRIORITIES: Priority[] = ["Low", "Medium", "High", "Urgent"];
const PER_PAGE = 5;

function NewProjectForm({ onClose }: { onClose: () => void }) {
  const { members, addProject } = useStore();
  const [name, setName] = useState("");
  const [client, setClient] = useState("");
  const [description, setDescription] = useState("");
  const [managerId, setManagerId] = useState(members[0]?.id ?? "");
  const [deadline, setDeadline] = useState("2026-12-15");
  const [priority, setPriority] = useState<Priority>("Medium");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return;
          addProject({
            name: name.trim(),
            client: client.trim() || "Internal",
            description: description.trim(),
            managerId,
            deadline,
            priority,
          });
          onClose();
        }}
        className="surface relative z-10 w-full max-w-lg p-0"
      >
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold">Create new project</h2>
          <button type="button" onClick={onClose} aria-label="Close">
            <X className="size-4 text-muted-foreground" />
          </button>
        </header>
        <div className="space-y-4 p-5">
          <Field label="Project name">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              placeholder="e.g. Customer Portal Revamp"
              required
            />
          </Field>
          <Field label="Client">
            <input
              value={client}
              onChange={(e) => setClient(e.target.value)}
              className={inputClass}
              placeholder="e.g. Acme Corp"
            />
          </Field>
          <Field label="Description">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={cn(inputClass, "h-auto py-2")}
              placeholder="What is this project delivering?"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Project manager">
              <select
                value={managerId}
                onChange={(e) => setManagerId(e.target.value)}
                className={inputClass}
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Priority">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className={inputClass}
              >
                {PRIORITIES.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </Field>
            <Field label="Deadline" className="sm:col-span-2">
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
        </div>
        <footer className="flex justify-end gap-2 border-t border-border px-5 py-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Create project</Button>
        </footer>
      </form>
    </div>
  );
}

function ProjectsPage() {
  const { projects, tasks, member } = useStore();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ProjectStatus | "All">("All");
  const [sort, setSort] = useState<"deadline" | "name" | "progress">("deadline");
  const [view, setView] = useState<"list" | "grid">("list");
  const [page, setPage] = useState(1);
  const [creating, setCreating] = useState(false);

  const filtered = useMemo(() => {
    const list = projects.filter((p) => {
      if (status !== "All" && p.status !== status) return false;
      if (query && !`${p.name} ${p.client}`.toLowerCase().includes(query.toLowerCase()))
        return false;
      return true;
    });
    return [...list].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "progress")
        return projectProgress(tasks, b.id) - projectProgress(tasks, a.id);
      return a.deadline.localeCompare(b.deadline);
    });
  }, [projects, status, query, sort, tasks]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, pages);
  const shown = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const counts = {
    All: projects.length,
    ...Object.fromEntries(
      STATUSES.map((s) => [s, projects.filter((p) => p.status === s).length]),
    ),
  } as Record<string, number>;

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title="Projects"
          subtitle={`${projects.length} projects · ${projects.filter((p) => p.status !== "Completed").length} in delivery`}
          actions={
            <>
              <Button variant="outline">
                <SlidersHorizontal className="size-4" /> Customize
              </Button>
              <Button onClick={() => setCreating(true)}>
                <Plus className="size-4" /> New project
              </Button>
            </>
          }
        />

        <div className="surface flex flex-wrap items-center gap-3 p-4">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              className={cn(inputClass, "pl-9")}
              placeholder="Search projects or clients…"
              aria-label="Search projects"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(["All", ...STATUSES] as const).map((s) => (
              <button
                key={s}
                onClick={() => {
                  setStatus(s as ProjectStatus | "All");
                  setPage(1);
                }}
                className={cn(
                  "h-8 rounded-lg border px-3 text-xs font-semibold transition-colors",
                  status === s
                    ? "border-primary bg-primary-soft text-primary"
                    : "border-input text-muted-foreground hover:text-foreground",
                )}
              >
                {s} <span className="opacity-60">{counts[s] ?? 0}</span>
              </button>
            ))}
          </div>
          <select
            aria-label="Sort projects"
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className={cn(inputClass, "w-auto")}
          >
            <option value="deadline">Sort: Deadline</option>
            <option value="name">Sort: Name</option>
            <option value="progress">Sort: Progress</option>
          </select>
          <div className="flex rounded-lg border border-input p-0.5">
            <button
              aria-label="List view"
              onClick={() => setView("list")}
              className={cn(
                "grid size-8 place-items-center rounded-md",
                view === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground",
              )}
            >
              <List className="size-4" />
            </button>
            <button
              aria-label="Grid view"
              onClick={() => setView("grid")}
              className={cn(
                "grid size-8 place-items-center rounded-md",
                view === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground",
              )}
            >
              <LayoutGrid className="size-4" />
            </button>
          </div>
        </div>

        {shown.length === 0 ? (
          <EmptyState title="No projects found" hint="Adjust the filters or create a project." />
        ) : view === "list" ? (
          <Panel bodyClassName="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[880px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                    <th className="px-5 py-3">Project</th>
                    <th className="px-5 py-3">Progress</th>
                    <th className="px-5 py-3">Team</th>
                    <th className="px-5 py-3">Deadline</th>
                    <th className="px-5 py-3">Priority</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {shown.map((p) => {
                    const pct = projectProgress(tasks, p.id);
                    const left = daysUntil(p.deadline);
                    return (
                      <tr key={p.id} className="transition-colors hover:bg-muted/50">
                        <td className="px-5 py-4">
                          <Link
                            to="/projects/$projectId"
                            params={{ projectId: p.id }}
                            className="flex items-center gap-3"
                          >
                            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary-soft text-xs font-bold text-primary">
                              {p.code}
                            </span>
                            <span className="min-w-0">
                              <span className="block truncate font-semibold hover:text-primary">
                                {p.name}
                              </span>
                              <span className="block truncate text-xs text-muted-foreground">
                                {p.client} · {tasks.filter((t) => t.projectId === p.id).length} tasks
                              </span>
                            </span>
                          </Link>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex w-40 items-center gap-2">
                            <Bar
                              value={pct}
                              tone={
                                p.status === "Delayed"
                                  ? "danger"
                                  : p.status === "At Risk"
                                    ? "warning"
                                    : "primary"
                              }
                            />
                            <span className="w-8 text-right text-xs font-semibold">{pct}%</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <AvatarStack names={p.memberIds.map((id) => member(id).name)} max={3} />
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-xs font-medium">{formatDate(p.deadline)}</p>
                          <p
                            className={cn(
                              "text-[11px]",
                              left < 0 ? "text-danger" : "text-muted-foreground",
                            )}
                          >
                            {left < 0 ? `${Math.abs(left)}d overdue` : `${left} days left`}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <PriorityBadge priority={p.priority} />
                        </td>
                        <td className="px-5 py-4">
                          <ProjectStatusBadge status={p.status} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Panel>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {shown.map((p) => {
              const pct = projectProgress(tasks, p.id);
              return (
                <Link
                  key={p.id}
                  to="/projects/$projectId"
                  params={{ projectId: p.id }}
                  className="surface block p-5 transition hover:border-primary/40 hover:shadow-[var(--shadow-pop)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-sm font-bold text-primary">
                      {p.code}
                    </span>
                    <ProjectStatusBadge status={p.status} />
                  </div>
                  <h3 className="mt-4 font-semibold">{p.name}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{p.description}</p>
                  <div className="mt-4 flex items-center gap-2">
                    <Bar value={pct} />
                    <span className="text-xs font-semibold">{pct}%</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <AvatarStack names={p.memberIds.map((id) => member(id).name)} max={3} />
                    <Chip tone="muted">{formatDate(p.deadline)}</Chip>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {filtered.length > PER_PAGE && (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              Showing {(current - 1) * PER_PAGE + 1}–{Math.min(current * PER_PAGE, filtered.length)}{" "}
              of {filtered.length} projects
            </p>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                disabled={current === 1}
                onClick={() => setPage(current - 1)}
              >
                <ChevronLeft className="size-4" /> Previous
              </Button>
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  aria-current={n === current ? "page" : undefined}
                  className={cn(
                    "size-8 rounded-lg text-xs font-semibold transition-colors",
                    n === current
                      ? "bg-primary text-primary-foreground"
                      : "border border-input text-muted-foreground hover:text-foreground",
                  )}
                >
                  {n}
                </button>
              ))}
              <Button
                variant="outline"
                size="sm"
                disabled={current === pages}
                onClick={() => setPage(current + 1)}
              >
                Next <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {creating && <NewProjectForm onClose={() => setCreating(false)} />}
    </AppShell>
  );
}
