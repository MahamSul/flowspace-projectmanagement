import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, CheckCircle2, Filter, Plus, Search, X } from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell, Button, Field, PageHeader, inputClass } from "@/components/pm/app-shell";
import { TaskDialog } from "@/components/pm/task-dialog";
import {
  Avatar,
  Bar,
  Chip,
  EmptyState,
  Panel,
  PriorityBadge,
  StatusBadge,
} from "@/components/pm/primitives";
import { cn } from "@/lib/utils";
import { daysUntil, dueLabel, taskProgress, useStore } from "@/lib/store";
import type { Priority, Status, Task } from "@/lib/mock-data";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "My Tasks — Flowspace" },
      {
        name: "description",
        content:
          "Every task assigned to you, grouped by today, this week and later, with priority, status and due dates.",
      },
      { property: "og:title", content: "My Tasks — Flowspace" },
      {
        property: "og:description",
        content: "Track your assigned work grouped by today, this week and later.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TasksPage,
});

const STATUSES: Status[] = ["Backlog", "To Do", "In Progress", "In Review", "Blocked", "Completed"];
const PRIORITIES: Priority[] = ["Low", "Medium", "High", "Urgent"];

function NewTaskForm({ onClose }: { onClose: () => void }) {
  const { projects, members, addTask } = useStore();
  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState(projects[0]?.id ?? "");
  const [assigneeId, setAssigneeId] = useState(members[0]?.id ?? "");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [status, setStatus] = useState<Status>("To Do");
  const [due, setDue] = useState("2026-09-18");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim()) return;
          addTask({ title: title.trim(), projectId, assigneeId, priority, status, due });
          onClose();
        }}
        className="surface relative z-10 w-full max-w-lg p-0"
      >
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold">Create new task</h2>
          <button type="button" onClick={onClose} aria-label="Close">
            <X className="size-4 text-muted-foreground" />
          </button>
        </header>
        <div className="space-y-4 p-5">
          <Field label="Task title">
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
              placeholder="e.g. Prepare launch checklist"
              required
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Project">
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className={inputClass}
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Assignee">
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
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
            <Field label="Status">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                className={inputClass}
              >
                {STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
            <Field label="Due date" className="sm:col-span-2">
              <input
                type="date"
                value={due}
                onChange={(e) => setDue(e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
        </div>
        <footer className="flex justify-end gap-2 border-t border-border px-5 py-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Create task</Button>
        </footer>
      </form>
    </div>
  );
}

function TaskRow({ task, onOpen }: { task: Task; onOpen: () => void }) {
  const { projects, member, setTaskStatus } = useStore();
  const project = projects.find((p) => p.id === task.projectId);
  const done = task.status === "Completed";
  const overdue = daysUntil(task.due) < 0 && !done;

  return (
    <li>
      <div className="flex flex-wrap items-center gap-3 px-5 py-3.5 transition-colors hover:bg-muted/50">
        <input
          type="checkbox"
          checked={done}
          aria-label={`Mark ${task.title} complete`}
          onChange={() => setTaskStatus(task.id, done ? "In Progress" : "Completed")}
          className="size-4 shrink-0 rounded border-input accent-primary"
        />
        <button onClick={onOpen} className="min-w-0 flex-1 text-left">
          <p
            className={cn(
              "truncate text-sm font-medium",
              done && "text-muted-foreground line-through",
            )}
          >
            {task.title}
          </p>
          <p className="mt-0.5 flex items-center gap-2 truncate text-xs text-muted-foreground">
            <span className="font-medium text-primary">{task.key}</span> {project?.name}
            {task.subtasks.length > 0 && (
              <span className="hidden items-center gap-1.5 sm:inline-flex">
                · {task.subtasks.filter((s) => s.done).length}/{task.subtasks.length} subtasks
              </span>
            )}
          </p>
        </button>
        {task.subtasks.length > 0 && (
          <div className="hidden w-24 lg:block">
            <Bar value={taskProgress(task)} />
          </div>
        )}
        <PriorityBadge priority={task.priority} />
        <StatusBadge status={task.status} />
        <Chip tone={overdue ? "danger" : "muted"} className="w-24 justify-center">
          <CalendarDays className="size-3" /> {dueLabel(task.due)}
        </Chip>
        <Avatar name={member(task.assigneeId).name} size="sm" />
      </div>
    </li>
  );
}

function TasksPage() {
  const { tasks, me, projects } = useStore();
  const [openTask, setOpenTask] = useState<Task | null>(null);
  const [creating, setCreating] = useState(false);
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<"mine" | "all">("mine");
  const [status, setStatus] = useState<Status | "All">("All");
  const [priority, setPriority] = useState<Priority | "All">("All");
  const [projectId, setProjectId] = useState<string>("All");

  const filtered = useMemo(
    () =>
      tasks.filter((t) => {
        if (scope === "mine" && t.assigneeId !== me.id) return false;
        if (status !== "All" && t.status !== status) return false;
        if (priority !== "All" && t.priority !== priority) return false;
        if (projectId !== "All" && t.projectId !== projectId) return false;
        if (query && !`${t.title} ${t.key}`.toLowerCase().includes(query.toLowerCase()))
          return false;
        return true;
      }),
    [tasks, scope, me.id, status, priority, projectId, query],
  );

  const groups = useMemo(() => {
    const today: Task[] = [];
    const week: Task[] = [];
    const later: Task[] = [];
    const overdue: Task[] = [];
    for (const t of filtered) {
      const d = daysUntil(t.due);
      if (d < 0 && t.status !== "Completed") overdue.push(t);
      else if (d <= 0) today.push(t);
      else if (d <= 7) week.push(t);
      else later.push(t);
    }
    return { overdue, today, week, later };
  }, [filtered]);

  const completed = filtered.filter((t) => t.status === "Completed").length;
  const pct = filtered.length ? Math.round((completed / filtered.length) * 100) : 0;

  const sections: { key: string; title: string; hint: string; items: Task[] }[] = [
    { key: "overdue", title: "Overdue", hint: "Past their due date", items: groups.overdue },
    { key: "today", title: "Today", hint: "Due Friday 11 September", items: groups.today },
    { key: "week", title: "This week", hint: "Next 7 days", items: groups.week },
    { key: "later", title: "Later", hint: "Scheduled beyond this week", items: groups.later },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title="My Tasks"
          subtitle={`${filtered.length} tasks in view · ${completed} completed`}
          actions={
            <>
              <Button variant="outline">
                <Filter className="size-4" /> Save view
              </Button>
              <Button onClick={() => setCreating(true)}>
                <Plus className="size-4" /> New task
              </Button>
            </>
          }
        />

        <div className="surface flex flex-wrap items-center gap-3 p-4">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={cn(inputClass, "pl-9")}
              placeholder="Search tasks…"
              aria-label="Search tasks"
            />
          </div>
          <div className="flex rounded-lg border border-input p-0.5">
            {(["mine", "all"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setScope(s)}
                className={cn(
                  "h-8 rounded-md px-3 text-xs font-semibold transition-colors",
                  scope === s
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {s === "mine" ? "Assigned to me" : "All tasks"}
              </button>
            ))}
          </div>
          <select
            aria-label="Filter by project"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className={cn(inputClass, "w-auto min-w-[150px]")}
          >
            <option value="All">All projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <select
            aria-label="Filter by status"
            value={status}
            onChange={(e) => setStatus(e.target.value as Status | "All")}
            className={cn(inputClass, "w-auto")}
          >
            <option value="All">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <select
            aria-label="Filter by priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority | "All")}
            className={cn(inputClass, "w-auto")}
          >
            <option value="All">Any priority</option>
            {PRIORITIES.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className="surface flex flex-wrap items-center gap-4 p-5">
          <span className="grid size-10 place-items-center rounded-xl bg-success-soft text-success">
            <CheckCircle2 className="size-5" />
          </span>
          <div className="min-w-[180px] flex-1">
            <p className="text-sm font-semibold">
              {completed} of {filtered.length} tasks completed
            </p>
            <Bar className="mt-2" value={pct} tone="success" />
          </div>
          <p className="text-2xl font-bold">{pct}%</p>
        </div>

        <div className="space-y-6">
          {sections
            .filter((s) => s.items.length > 0)
            .map((s) => (
              <Panel
                key={s.key}
                title={
                  <span className="flex items-center gap-2">
                    {s.title}
                    <Chip tone={s.key === "overdue" ? "danger" : "muted"}>{s.items.length}</Chip>
                  </span>
                }
                subtitle={s.hint}
                bodyClassName="p-0"
              >
                <ul className="divide-y divide-border">
                  {s.items.map((t) => (
                    <TaskRow key={t.id} task={t} onOpen={() => setOpenTask(t)} />
                  ))}
                </ul>
              </Panel>
            ))}
          {filtered.length === 0 && (
            <EmptyState
              title="No tasks match these filters"
              hint="Try clearing the search or switching to all tasks."
            />
          )}
        </div>
      </div>

      <TaskDialog task={openTask} onClose={() => setOpenTask(null)} />
      {creating && <NewTaskForm onClose={() => setCreating(false)} />}
    </AppShell>
  );
}
