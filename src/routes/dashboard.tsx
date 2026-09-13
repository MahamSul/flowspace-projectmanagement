import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  FolderKanban,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

import { AppShell, Button, PageHeader } from "@/components/pm/app-shell";
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
import { cn } from "@/lib/utils";
import { daysUntil, dueLabel, projectProgress, useStore } from "@/lib/store";
import type { Task } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Flowspace" },
      {
        name: "description",
        content:
          "Your Flowspace dashboard: tasks due today, project progress, overdue work and team workload at a glance.",
      },
      { property: "og:title", content: "Dashboard — Flowspace" },
      {
        property: "og:description",
        content: "Tasks due today, project progress and team workload in one view.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DashboardPage,
});

function StatCard({
  label,
  value,
  delta,
  hint,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  delta?: string;
  hint: string;
  icon: typeof FolderKanban;
  tone: "primary" | "success" | "warning" | "danger";
}) {
  const tones = {
    primary: "bg-primary-soft text-primary",
    success: "bg-success-soft text-success",
    warning: "bg-warning-soft text-warning",
    danger: "bg-danger-soft text-danger",
  };
  return (
    <div className="surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
        </div>
        <span className={cn("grid size-10 place-items-center rounded-xl", tones[tone])}>
          <Icon className="size-5" />
        </span>
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
        {delta && (
          <span className="inline-flex items-center gap-0.5 font-semibold text-success">
            <TrendingUp className="size-3.5" />
            {delta}
          </span>
        )}
        {hint}
      </p>
    </div>
  );
}

function DashboardPage() {
  const { me, tasks, projects, activity, member, setTaskStatus, members } = useStore();
  const [openTask, setOpenTask] = useState<Task | null>(null);

  const myTasks = tasks.filter((t) => t.assigneeId === me.id);
  const dueToday = tasks.filter((t) => daysUntil(t.due) === 0 && t.status !== "Completed");
  const overdue = tasks.filter((t) => daysUntil(t.due) < 0 && t.status !== "Completed");
  const active = projects.filter((p) => p.status !== "Completed");
  const completedThisMonth = tasks.filter((t) => t.status === "Completed").length;
  const topWorkload = [...members].sort((a, b) => b.workload - a.workload).slice(0, 6);

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title={`Good morning, ${me.name.split(" ")[0]} 👋`}
          subtitle="Here's what's happening across your workspace today, Friday 11 September."
          actions={
            <>
              <Link to="/reports">
                <Button variant="outline" size="md">
                  <TrendingUp className="size-4" /> View reports
                </Button>
              </Link>
              <Link to="/projects">
                <Button size="md">
                  <FolderKanban className="size-4" /> New project
                </Button>
              </Link>
            </>
          }
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Active projects"
            value={String(active.length)}
            delta="+2"
            hint="vs last month"
            icon={FolderKanban}
            tone="primary"
          />
          <StatCard
            label="Tasks completed"
            value={String(completedThisMonth)}
            delta="+18%"
            hint="this month"
            icon={CheckCircle2}
            tone="success"
          />
          <StatCard
            label="Due today"
            value={String(dueToday.length)}
            hint="across 4 projects"
            icon={Clock}
            tone="warning"
          />
          <StatCard
            label="Overdue"
            value={String(overdue.length)}
            hint="needs attention"
            icon={AlertTriangle}
            tone="danger"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <Panel
            className="xl:col-span-2"
            title="Tasks due today"
            subtitle={`${dueToday.length} tasks need to be closed before end of day`}
            action={
              <Link to="/tasks" className="text-xs font-semibold text-primary hover:underline">
                View all
              </Link>
            }
            bodyClassName="p-0"
          >
            {dueToday.length === 0 ? (
              <div className="p-5">
                <EmptyState title="Nothing due today" hint="Enjoy the clear runway." />
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {dueToday.map((t) => {
                  const p = projects.find((x) => x.id === t.projectId);
                  return (
                    <li key={t.id}>
                      <div className="flex flex-wrap items-center gap-3 px-5 py-3.5 transition-colors hover:bg-muted/50">
                        <input
                          type="checkbox"
                          aria-label={`Complete ${t.title}`}
                          className="size-4 shrink-0 rounded border-input accent-primary"
                          onChange={() => setTaskStatus(t.id, "Completed")}
                        />
                        <button
                          onClick={() => setOpenTask(t)}
                          className="min-w-0 flex-1 text-left"
                        >
                          <p className="truncate text-sm font-medium">{t.title}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {p?.name} · {t.key}
                          </p>
                        </button>
                        <PriorityBadge priority={t.priority} />
                        <StatusBadge status={t.status} />
                        <Avatar name={member(t.assigneeId).name} size="sm" />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>

          <Panel
            title="Team workload"
            subtitle="Capacity used this week"
            action={
              <Link to="/workload" className="text-xs font-semibold text-primary hover:underline">
                Details
              </Link>
            }
          >
            <ul className="space-y-4">
              {topWorkload.map((m) => (
                <li key={m.id}>
                  <div className="flex items-center gap-3">
                    <Avatar name={m.name} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{m.name}</p>
                      <p className="truncate text-[11px] text-muted-foreground">{m.role}</p>
                    </div>
                    <span
                      className={cn(
                        "text-xs font-semibold",
                        m.workload > 100
                          ? "text-danger"
                          : m.workload > 85
                            ? "text-warning"
                            : "text-success",
                      )}
                    >
                      {m.workload}%
                    </span>
                  </div>
                  <Bar
                    className="mt-2"
                    value={Math.min(100, m.workload)}
                    tone={m.workload > 100 ? "danger" : m.workload > 85 ? "warning" : "success"}
                  />
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <Panel
            className="xl:col-span-2"
            title="Project progress"
            subtitle="Active projects ranked by deadline"
            action={
              <Link to="/projects" className="text-xs font-semibold text-primary hover:underline">
                All projects
              </Link>
            }
            bodyClassName="p-0"
          >
            <ul className="divide-y divide-border">
              {active.slice(0, 5).map((p) => {
                const pct = projectProgress(tasks, p.id);
                const left = daysUntil(p.deadline);
                return (
                  <li key={p.id}>
                    <Link
                      to="/projects/$projectId"
                      params={{ projectId: p.id }}
                      className="block px-5 py-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="flex items-center gap-2 truncate text-sm font-semibold">
                            {p.name}
                            <ArrowUpRight className="size-3.5 text-muted-foreground" />
                          </p>
                          <p className="truncate text-xs text-muted-foreground">{p.client}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <AvatarStack names={p.memberIds.map((id) => member(id).name)} max={3} />
                          <ProjectStatusBadge status={p.status} />
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-3">
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
                        <span className="w-9 shrink-0 text-right text-xs font-semibold">{pct}%</span>
                        <span className="w-24 shrink-0 text-right text-[11px] text-muted-foreground">
                          {left < 0 ? `${Math.abs(left)}d overdue` : `${left}d left`}
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Panel>

          <Panel
            title="Overdue tasks"
            subtitle="Escalate or reschedule"
            bodyClassName="p-0"
          >
            <ul className="divide-y divide-border">
              {overdue.map((t) => (
                <li key={t.id}>
                  <button
                    onClick={() => setOpenTask(t)}
                    className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-muted/50"
                  >
                    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-danger-soft text-danger">
                      <AlertTriangle className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{t.title}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {member(t.assigneeId).name}
                      </p>
                    </div>
                    <Chip tone="danger">{dueLabel(t.due)}</Chip>
                  </button>
                </li>
              ))}
              {overdue.length === 0 && (
                <li className="p-5">
                  <EmptyState title="No overdue tasks" />
                </li>
              )}
            </ul>
          </Panel>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <Panel
            className="xl:col-span-2"
            title="Team activity"
            subtitle="Latest updates across the workspace"
            action={
              <Link to="/activity" className="text-xs font-semibold text-primary hover:underline">
                View feed
              </Link>
            }
          >
            <ol className="space-y-4">
              {activity.slice(0, 6).map((a) => (
                <li key={a.id} className="flex gap-3">
                  <Avatar name={member(a.actorId).name} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm">
                      <span className="font-semibold">{member(a.actorId).name}</span>{" "}
                      <span className="text-muted-foreground">{a.action}</span>{" "}
                      <span className="font-medium">{a.target}</span>
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      {projects.find((p) => p.id === a.projectId)?.name ?? "Workspace"} · {a.at}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Panel>

          <Panel title="My focus" subtitle={`${myTasks.length} tasks assigned to you`}>
            <div className="space-y-3">
              {myTasks.slice(0, 4).map((t) => (
                <button
                  key={t.id}
                  onClick={() => setOpenTask(t)}
                  className="w-full rounded-xl border border-border p-3.5 text-left transition-colors hover:border-primary/40 hover:bg-muted/40"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium">{t.title}</p>
                    <PriorityBadge priority={t.priority} />
                  </div>
                  <p className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <CalendarDays className="size-3.5" /> {dueLabel(t.due)} ·{" "}
                    {projects.find((p) => p.id === t.projectId)?.name}
                  </p>
                </button>
              ))}
              <Link to="/tasks" className="block">
                <Button variant="outline" className="w-full">
                  Open my tasks
                </Button>
              </Link>
            </div>
          </Panel>
        </div>
      </div>

      <TaskDialog task={openTask} onClose={() => setOpenTask(null)} />
    </AppShell>
  );
}
