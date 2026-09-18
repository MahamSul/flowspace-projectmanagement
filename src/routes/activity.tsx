import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity as ActivityIcon,
  FileText,
  FolderKanban,
  MessageSquare,
  SquareCheckBig,
  UserPlus,
} from "lucide-react";
import { useState } from "react";

import { AppShell, Button, inputClass, PageHeader } from "@/components/pm/app-shell";
import { Avatar, Chip, EmptyState, Panel } from "@/components/pm/primitives";
import type { ActivityItem } from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/activity")({
  head: () => ({
    meta: [
      { title: "Activity — Flowspace" },
      {
        name: "description",
        content:
          "Follow the Flowspace activity feed: task updates, comments, file uploads and project changes across the team.",
      },
      { property: "og:title", content: "Activity — Flowspace" },
      {
        property: "og:description",
        content: "Task updates, comments, uploads and project changes across your team.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ActivityPage,
});

const ICONS: Record<ActivityItem["type"], typeof SquareCheckBig> = {
  task: SquareCheckBig,
  comment: MessageSquare,
  project: FolderKanban,
  file: FileText,
  member: UserPlus,
};

const TONES: Record<ActivityItem["type"], string> = {
  task: "bg-primary-soft text-primary",
  comment: "bg-info-soft text-info",
  project: "bg-accent-soft text-accent",
  file: "bg-warning-soft text-warning",
  member: "bg-success-soft text-success",
};

const FILTERS = ["All", "task", "comment", "file", "project", "member"] as const;
const LABELS: Record<string, string> = {
  All: "All activity",
  task: "Tasks",
  comment: "Comments",
  file: "Files",
  project: "Projects",
  member: "People",
};

function ActivityPage() {
  const { activity, member, project, projects } = useStore();
  const [type, setType] = useState<string>("All");
  const [projectId, setProjectId] = useState("All");

  const filtered = activity.filter(
    (a) => (type === "All" || a.type === type) && (projectId === "All" || a.projectId === projectId),
  );

  const groups = new Map<string, ActivityItem[]>();
  for (const a of filtered) {
    const bucket = /m ago|h ago|Just now/.test(a.at)
      ? "Today"
      : a.at === "Yesterday"
        ? "Yesterday"
        : "Earlier";
    const arr = groups.get(bucket) ?? [];
    arr.push(a);
    groups.set(bucket, arr);
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title="Activity"
          subtitle="Everything happening across your projects, newest first."
          actions={
            <Button variant="outline" size="sm">
              <ActivityIcon className="size-4" /> Notification settings
            </Button>
          }
        />

        <div className="grid gap-5 xl:grid-cols-[1fr_300px]">
          <div className="space-y-5">
            <div className="surface flex flex-wrap items-center gap-2 p-4">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setType(f)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-medium transition",
                    type === f
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground",
                  )}
                >
                  {LABELS[f]}
                </button>
              ))}
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                aria-label="Filter by project"
                className={cn(inputClass, "ml-auto w-auto")}
              >
                <option value="All">All projects</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {filtered.length === 0 ? (
              <EmptyState title="No activity yet" hint="Try a different filter." />
            ) : (
              Array.from(groups.entries()).map(([bucket, items]) => (
                <Panel key={bucket} title={bucket} subtitle={`${items.length} updates`}>
                  <ol className="relative space-y-5 before:absolute before:top-2 before:bottom-2 before:left-[19px] before:w-px before:bg-border">
                    {items.map((a) => {
                      const Icon = ICONS[a.type];
                      const actor = member(a.actorId);
                      return (
                        <li key={a.id} className="relative flex gap-4">
                          <span
                            className={cn(
                              "z-10 grid size-10 shrink-0 place-items-center rounded-xl ring-4 ring-card",
                              TONES[a.type],
                            )}
                          >
                            <Icon className="size-4.5" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm">
                              <span className="font-semibold">{actor.name}</span>{" "}
                              <span className="text-muted-foreground">{a.action}</span>{" "}
                              <span className="font-medium">{a.target}</span>
                            </p>
                            <div className="mt-1.5 flex flex-wrap items-center gap-2">
                              <Link to="/projects/$projectId" params={{ projectId: a.projectId }}>
                                <Chip tone="primary">{project(a.projectId)?.name ?? "Project"}</Chip>
                              </Link>
                              <span className="text-xs text-muted-foreground">{a.at}</span>
                            </div>
                          </div>
                          <Avatar name={actor.name} size="sm" className="hidden sm:inline-flex" />
                        </li>
                      );
                    })}
                  </ol>
                </Panel>
              ))
            )}
          </div>

          <div className="space-y-5">
            <Panel title="Activity breakdown">
              <ul className="space-y-3">
                {(["task", "comment", "file", "project", "member"] as const).map((t) => {
                  const count = activity.filter((a) => a.type === t).length;
                  const Icon = ICONS[t];
                  return (
                    <li key={t} className="flex items-center gap-3">
                      <span className={cn("grid size-8 place-items-center rounded-lg", TONES[t])}>
                        <Icon className="size-4" />
                      </span>
                      <span className="flex-1 text-sm text-muted-foreground">{LABELS[t]}</span>
                      <span className="text-sm font-semibold">{count}</span>
                    </li>
                  );
                })}
              </ul>
            </Panel>

            <Panel title="Most active people">
              <ul className="space-y-3">
                {Array.from(
                  activity.reduce((map, a) => {
                    map.set(a.actorId, (map.get(a.actorId) ?? 0) + 1);
                    return map;
                  }, new Map<string, number>()),
                )
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 5)
                  .map(([id, count]) => (
                    <li key={id} className="flex items-center gap-3">
                      <Avatar name={member(id).name} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{member(id).name}</p>
                        <p className="truncate text-xs text-muted-foreground">{member(id).role}</p>
                      </div>
                      <span className="text-sm font-semibold">{count}</span>
                    </li>
                  ))}
              </ul>
            </Panel>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
