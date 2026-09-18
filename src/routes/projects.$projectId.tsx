import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  CalendarDays,
  Download,
  FileText,
  Flag,
  Plus,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell, Button } from "@/components/pm/app-shell";
import { TaskDialog } from "@/components/pm/task-dialog";
import {
  Avatar,
  AvatarStack,
  Bar,
  Chip,
  EmptyState,
  Panel,
  PriorityBadge,
  ProjectStatusBadge,
  StatusBadge,
} from "@/components/pm/primitives";
import { projectFiles, type Status, type Task } from "@/lib/mock-data";
import { dueLabel, formatDate, formatShort, projectProgress, taskProgress, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/projects/$projectId")({
  head: () => ({
    meta: [
      { title: "Project workspace — Flowspace" },
      {
        name: "description",
        content:
          "Project workspace in Flowspace: kanban board, timeline, milestones, files and team for a single project.",
      },
      { property: "og:title", content: "Project workspace — Flowspace" },
      {
        property: "og:description",
        content: "Board, timeline, milestones and files for your project.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProjectDetailPage,
});

const COLUMNS: { status: Status; label: string }[] = [
  { status: "Backlog", label: "Backlog" },
  { status: "To Do", label: "To Do" },
  { status: "In Progress", label: "In Progress" },
  { status: "In Review", label: "In Review" },
  { status: "Completed", label: "Done" },
];

const TABS = ["Overview", "Board", "Timeline", "Files", "Team"] as const;
type Tab = (typeof TABS)[number];

function money(n: number) {
  return `$${n.toLocaleString("en-US")}`;
}

function ProjectDetailPage() {
  const { projectId } = useParams({ from: "/projects/$projectId" });
  const { project, tasks, member, milestones, toggleMilestone, setTaskStatus } = useStore();
  const [tab, setTab] = useState<Tab>("Board");
  const [open, setOpen] = useState<Task | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<Status | null>(null);

  const proj = project(projectId);
  const list = useMemo(() => tasks.filter((t) => t.projectId === projectId), [tasks, projectId]);
  const projMilestones = milestones.filter((m) => m.projectId === projectId);

  if (!proj) {
    return (
      <AppShell>
        <div className="space-y-4">
          <EmptyState title="Project not found" hint="It may have been archived or removed." />
          <Link to="/projects" className="text-sm text-primary underline">
            Back to projects
          </Link>
        </div>
      </AppShell>
    );
  }

  const progress = projectProgress(tasks, proj.id);
  const done = list.filter((t) => t.status === "Completed").length;
  const manager = member(proj.managerId);
  const logged = list.reduce((s, t) => s + t.logged, 0);
  const estimate = list.reduce((s, t) => s + t.estimate, 0);

  const drop = (status: Status) => {
    if (dragId) setTaskStatus(dragId, status);
    setDragId(null);
    setOverCol(null);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" /> All projects
          </Link>

          <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-sm font-bold text-primary">
                  {proj.code}
                </span>
                <h1 className="text-2xl font-bold tracking-tight">{proj.name}</h1>
                <ProjectStatusBadge status={proj.status} />
                <PriorityBadge priority={proj.priority} />
              </div>
              <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{proj.description}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <AvatarStack names={proj.memberIds.map((id) => member(id).name)} />
              <Button variant="outline" size="sm">
                <Download className="size-4" /> Export
              </Button>
              <Button size="sm">
                <Plus className="size-4" /> Add task
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="surface p-5">
            <p className="text-xs font-medium text-muted-foreground">Progress</p>
            <p className="mt-2 text-2xl font-bold">{progress}%</p>
            <Bar value={progress} className="mt-3" />
            <p className="mt-2 text-xs text-muted-foreground">
              {done} of {list.length} tasks completed
            </p>
          </div>
          <div className="surface p-5">
            <p className="text-xs font-medium text-muted-foreground">Deadline</p>
            <p className="mt-2 text-2xl font-bold">{formatShort(proj.deadline)}</p>
            <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarDays className="size-3.5" /> Started {formatShort(proj.start)}
            </p>
          </div>
          <div className="surface p-5">
            <p className="text-xs font-medium text-muted-foreground">Budget used</p>
            <p className="mt-2 text-2xl font-bold">
              {Math.round((proj.spent / proj.budget) * 100)}%
            </p>
            <Bar
              value={(proj.spent / proj.budget) * 100}
              tone={proj.spent / proj.budget > 0.85 ? "danger" : "success"}
              className="mt-3"
            />
            <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Wallet className="size-3.5" /> {money(proj.spent)} of {money(proj.budget)}
            </p>
          </div>
          <div className="surface p-5">
            <p className="text-xs font-medium text-muted-foreground">Hours logged</p>
            <p className="mt-2 text-2xl font-bold">{logged}h</p>
            <Bar value={estimate ? (logged / estimate) * 100 : 0} tone="accent" className="mt-3" />
            <p className="mt-2 text-xs text-muted-foreground">{estimate}h estimated</p>
          </div>
        </div>

        <div className="flex gap-1 overflow-x-auto border-b border-border scrollbar-thin">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "relative shrink-0 px-4 py-2.5 text-sm font-medium transition-colors",
                tab === t
                  ? "text-primary after:absolute after:inset-x-2 after:-bottom-px after:h-0.5 after:rounded-full after:bg-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "Overview" && (
          <div className="grid gap-5 lg:grid-cols-3">
            <Panel title="Project details" className="lg:col-span-2">
              <dl className="grid gap-5 sm:grid-cols-2">
                {[
                  ["Client", proj.client],
                  ["Project code", proj.code],
                  ["Start date", formatDate(proj.start)],
                  ["Deadline", formatDate(proj.deadline)],
                  ["Budget", money(proj.budget)],
                  ["Spent", money(proj.spent)],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-xs text-muted-foreground">{k}</dt>
                    <dd className="mt-1 text-sm font-medium">{v}</dd>
                  </div>
                ))}
                <div>
                  <dt className="text-xs text-muted-foreground">Project manager</dt>
                  <dd className="mt-1.5 flex items-center gap-2">
                    <Avatar name={manager.name} size="sm" />
                    <span className="text-sm font-medium">{manager.name}</span>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Last activity</dt>
                  <dd className="mt-1 text-sm font-medium">{proj.lastActivity}</dd>
                </div>
              </dl>
            </Panel>

            <Panel title="Milestones" subtitle={`${projMilestones.filter((m) => m.done).length} of ${projMilestones.length} reached`}>
              {projMilestones.length === 0 ? (
                <EmptyState title="No milestones yet" />
              ) : (
                <ul className="space-y-3">
                  {projMilestones.map((m) => (
                    <li key={m.id} className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={m.done}
                        onChange={() => toggleMilestone(m.id)}
                        aria-label={m.title}
                        className="mt-0.5 size-4 shrink-0 accent-[var(--color-primary)]"
                      />
                      <div className="min-w-0">
                        <p
                          className={cn(
                            "truncate text-sm font-medium",
                            m.done && "text-muted-foreground line-through",
                          )}
                        >
                          {m.title}
                        </p>
                        <p className="text-xs text-muted-foreground">{formatDate(m.date)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </div>
        )}

        {tab === "Board" && (
          <div className="-mx-1 overflow-x-auto px-1 pb-2 scrollbar-thin">
            <div className="flex min-w-max gap-4">
              {COLUMNS.map((col) => {
                const items = list.filter((t) => t.status === col.status);
                return (
                  <div
                    key={col.status}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setOverCol(col.status);
                    }}
                    onDragLeave={() => setOverCol((c) => (c === col.status ? null : c))}
                    onDrop={() => drop(col.status)}
                    className={cn(
                      "flex w-[290px] shrink-0 flex-col rounded-xl border border-border bg-muted/40 transition-colors",
                      overCol === col.status && "border-primary bg-primary-soft/50",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={col.status} />
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground">
                        {items.length}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col gap-3 px-3 pb-3">
                      {items.map((t) => (
                        <article
                          key={t.id}
                          draggable
                          onDragStart={() => setDragId(t.id)}
                          onDragEnd={() => setDragId(null)}
                          onClick={() => setOpen(t)}
                          className={cn(
                            "cursor-pointer rounded-xl border border-border bg-card p-3.5 text-left shadow-[var(--shadow-card)] transition hover:border-primary/40 hover:shadow-[var(--shadow-pop)]",
                            dragId === t.id && "opacity-50",
                          )}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-semibold text-muted-foreground">
                              {t.key}
                            </span>
                            <PriorityBadge priority={t.priority} />
                          </div>
                          <p className="mt-2 text-sm font-medium">{t.title}</p>
                          {t.tags.length > 0 && (
                            <div className="mt-2.5 flex flex-wrap gap-1.5">
                              {t.tags.map((tag) => (
                                <Chip key={tag}>{tag}</Chip>
                              ))}
                            </div>
                          )}
                          {t.subtasks.length > 0 && (
                            <div className="mt-3">
                              <Bar value={taskProgress(t)} />
                              <p className="mt-1.5 text-[11px] text-muted-foreground">
                                {t.subtasks.filter((s) => s.done).length}/{t.subtasks.length} subtasks
                              </p>
                            </div>
                          )}
                          <div className="mt-3 flex items-center justify-between gap-2">
                            <Avatar name={member(t.assigneeId).name} size="xs" />
                            <span className="text-[11px] text-muted-foreground">
                              {dueLabel(t.due)}
                            </span>
                          </div>
                        </article>
                      ))}
                      <button className="flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-border py-2 text-xs font-medium text-muted-foreground transition hover:border-primary/50 hover:text-foreground">
                        <Plus className="size-3.5" /> Add task
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === "Timeline" && <Timeline projectId={projectId} />}

        {tab === "Files" && (
          <Panel
            title="Project files"
            subtitle={`${projectFiles.length} files shared with the team`}
            action={
              <Button variant="outline" size="sm">
                <Plus className="size-4" /> Upload
              </Button>
            }
            bodyClassName="p-0"
          >
            <ul className="divide-y divide-border">
              {projectFiles.map((f) => (
                <li key={f.id} className="flex items-center gap-3 px-5 py-3.5">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
                    <FileText className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{f.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {f.size} · {member(f.by).name} · {f.at}
                    </p>
                  </div>
                  <Chip>{f.type}</Chip>
                  <button
                    aria-label={`Download ${f.name}`}
                    className="rounded-md p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  >
                    <Download className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          </Panel>
        )}

        {tab === "Team" && (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {proj.memberIds.map((id) => {
              const m = member(id);
              const assigned = list.filter((t) => t.assigneeId === id);
              return (
                <div key={id} className="surface p-5">
                  <div className="flex items-center gap-3">
                    <Avatar name={m.name} size="lg" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{m.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{m.role}</p>
                    </div>
                    {id === proj.managerId && <Chip tone="primary" className="ml-auto">Lead</Chip>}
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{assigned.length} tasks on this project</span>
                    <span>{m.workload}% load</span>
                  </div>
                  <Bar
                    value={Math.min(100, m.workload)}
                    tone={m.workload > 100 ? "danger" : m.workload > 85 ? "warning" : "success"}
                    className="mt-2"
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      <TaskDialog task={open} onClose={() => setOpen(null)} />
    </AppShell>
  );
}

function Timeline({ projectId }: { projectId: string }) {
  const { project, tasks, milestones, member } = useStore();
  const proj = project(projectId)!;
  const list = tasks.filter((t) => t.projectId === projectId);

  const start = new Date(`${proj.start}T00:00:00Z`).getTime();
  const end = new Date(`${proj.deadline}T00:00:00Z`).getTime();
  const span = Math.max(1, end - start);

  const months: { label: string; pct: number }[] = [];
  const cursor = new Date(start);
  cursor.setUTCDate(1);
  while (cursor.getTime() <= end) {
    const next = new Date(cursor);
    next.setUTCMonth(next.getUTCMonth() + 1);
    const from = Math.max(cursor.getTime(), start);
    const to = Math.min(next.getTime(), end);
    months.push({
      label: cursor.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" }),
      pct: Math.max(0, ((to - from) / span) * 100),
    });
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }

  const pos = (dateStr: string) => {
    const t = new Date(`${dateStr}T00:00:00Z`).getTime();
    return Math.min(100, Math.max(0, ((t - start) / span) * 100));
  };

  const TONES: Record<string, string> = {
    Completed: "bg-success",
    "In Progress": "bg-primary",
    "In Review": "bg-warning",
    Blocked: "bg-danger",
    "To Do": "bg-info",
    Backlog: "bg-muted-foreground",
  };

  return (
    <div className="space-y-5">
      <Panel
        title="Timeline"
        subtitle={`${formatShort(proj.start)} – ${formatShort(proj.deadline)}`}
        bodyClassName="p-0"
      >
        <div className="overflow-x-auto scrollbar-thin">
          <div className="min-w-[760px]">
            <div className="flex border-b border-border pl-[240px]">
              {months.map((m, i) => (
                <div
                  key={`${m.label}-${i}`}
                  style={{ width: `${m.pct}%` }}
                  className="border-l border-border px-2 py-2 text-[11px] font-semibold text-muted-foreground"
                >
                  {m.label}
                </div>
              ))}
            </div>

            <ul className="divide-y divide-border">
              {list.map((t) => {
                const left = pos(t.due);
                const barStart = Math.max(0, left - 14);
                return (
                  <li key={t.id} className="flex items-center">
                    <div className="w-[240px] shrink-0 px-5 py-3">
                      <p className="truncate text-sm font-medium">{t.title}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {t.key} · {member(t.assigneeId).name}
                      </p>
                    </div>
                    <div className="relative h-14 flex-1 border-l border-border">
                      <div
                        title={`${t.title} — due ${formatShort(t.due)}`}
                        style={{ left: `${barStart}%`, width: `${Math.max(6, left - barStart)}%` }}
                        className={cn(
                          "absolute top-1/2 h-6 -translate-y-1/2 rounded-md px-2 text-[11px] leading-6 font-medium text-white",
                          TONES[t.status],
                        )}
                      >
                        <span className="truncate">{formatShort(t.due)}</span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="relative flex items-center border-t border-border">
              <div className="w-[240px] shrink-0 px-5 py-3 text-xs font-semibold text-muted-foreground">
                Milestones
              </div>
              <div className="relative h-14 flex-1 border-l border-border">
                {milestones
                  .filter((m) => m.projectId === projectId)
                  .map((m) => (
                    <span
                      key={m.id}
                      title={`${m.title} — ${formatShort(m.date)}`}
                      style={{ left: `${pos(m.date)}%` }}
                      className={cn(
                        "absolute top-1/2 grid size-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-lg",
                        m.done ? "bg-success-soft text-success" : "bg-accent-soft text-accent",
                      )}
                    >
                      <Flag className="size-3.5" />
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </Panel>

      <div className="surface flex flex-wrap items-center justify-between gap-4 border-primary/25 bg-primary-soft/40 p-5">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles className="size-5" />
          </span>
          <div>
            <p className="text-sm font-semibold">Unlock dependencies & critical path</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Flowspace Pro adds task dependencies, baselines and resource levelling to the timeline.
            </p>
          </div>
        </div>
        <Button size="sm">
          <Users className="size-4" /> Upgrade workspace
        </Button>
      </div>
    </div>
  );
}
