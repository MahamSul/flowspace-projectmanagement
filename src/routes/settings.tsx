import { createFileRoute } from "@tanstack/react-router";
import { Check, Plug, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { AppShell, Button, Field, inputClass, PageHeader } from "@/components/pm/app-shell";
import { Avatar, Chip, Panel } from "@/components/pm/primitives";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Flowspace" },
      {
        name: "description",
        content:
          "Manage your Flowspace workspace: general details, members and roles, notifications, task statuses and integrations.",
      },
      { property: "og:title", content: "Settings — Flowspace" },
      {
        property: "og:description",
        content: "Workspace details, member roles, notifications, statuses and integrations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

const TABS = ["General", "Members", "Notifications", "Task statuses", "Integrations"] as const;
type Tab = (typeof TABS)[number];

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full transition-colors",
        checked ? "bg-primary" : "bg-muted",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 size-5 rounded-full bg-card shadow transition-transform",
          checked && "translate-x-5",
        )}
      />
    </button>
  );
}

const DEFAULT_STATUSES = [
  { name: "Backlog", tone: "muted" as const },
  { name: "To Do", tone: "info" as const },
  { name: "In Progress", tone: "primary" as const },
  { name: "In Review", tone: "warning" as const },
  { name: "Blocked", tone: "danger" as const },
  { name: "Completed", tone: "success" as const },
];

const INTEGRATIONS = [
  { name: "Slack", desc: "Send task and mention alerts to channels.", connected: true },
  { name: "GitHub", desc: "Link commits and pull requests to tasks.", connected: true },
  { name: "Google Drive", desc: "Attach files straight from Drive.", connected: false },
  { name: "Figma", desc: "Embed live design previews in tasks.", connected: true },
  { name: "Jira", desc: "Two-way sync with existing Jira projects.", connected: false },
  { name: "Zoom", desc: "Start meetings from calendar events.", connected: false },
];

function SettingsPage() {
  const { members, me, member } = useStore();
  const [tab, setTab] = useState<Tab>("General");
  const [saved, setSaved] = useState(false);
  const [workspace, setWorkspace] = useState({
    name: "Acme Corp Workspace",
    url: "acme-corp",
    industry: "Software & Technology",
    size: "50–200 employees",
    timezone: "Asia/Karachi (GMT+5)",
    week: "Monday",
  });
  const [notify, setNotify] = useState({
    assigned: true,
    mentions: true,
    dueSoon: true,
    comments: false,
    weekly: true,
    marketing: false,
  });
  const [statuses, setStatuses] = useState(DEFAULT_STATUSES);
  const [newStatus, setNewStatus] = useState("");

  const save = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title="Settings"
          subtitle="Configure your workspace, team access and notification preferences."
          actions={
            <Button size="sm" onClick={save}>
              {saved ? <Check className="size-4" /> : null} {saved ? "Saved" : "Save changes"}
            </Button>
          }
        />

        <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
          <nav className="surface h-fit p-2">
            <ul className="space-y-0.5">
              {TABS.map((t) => (
                <li key={t}>
                  <button
                    onClick={() => setTab(t)}
                    className={cn(
                      "w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition",
                      tab === t
                        ? "bg-primary-soft text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {t}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-5">
            {tab === "General" && (
              <>
                <Panel title="Workspace details" subtitle="Visible to everyone in the workspace">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Workspace name">
                      <input
                        className={inputClass}
                        value={workspace.name}
                        onChange={(e) => setWorkspace({ ...workspace, name: e.target.value })}
                      />
                    </Field>
                    <Field label="Workspace URL" hint="flowspace.app/{slug}">
                      <input
                        className={inputClass}
                        value={workspace.url}
                        onChange={(e) => setWorkspace({ ...workspace, url: e.target.value })}
                      />
                    </Field>
                    <Field label="Industry">
                      <select
                        className={inputClass}
                        value={workspace.industry}
                        onChange={(e) => setWorkspace({ ...workspace, industry: e.target.value })}
                      >
                        {["Software & Technology", "Finance", "Retail", "Agency", "Healthcare"].map(
                          (i) => (
                            <option key={i}>{i}</option>
                          ),
                        )}
                      </select>
                    </Field>
                    <Field label="Company size">
                      <select
                        className={inputClass}
                        value={workspace.size}
                        onChange={(e) => setWorkspace({ ...workspace, size: e.target.value })}
                      >
                        {["1–10 employees", "11–50 employees", "50–200 employees", "200+ employees"].map(
                          (s) => (
                            <option key={s}>{s}</option>
                          ),
                        )}
                      </select>
                    </Field>
                    <Field label="Time zone">
                      <select
                        className={inputClass}
                        value={workspace.timezone}
                        onChange={(e) => setWorkspace({ ...workspace, timezone: e.target.value })}
                      >
                        {[
                          "Asia/Karachi (GMT+5)",
                          "Europe/London (GMT+1)",
                          "America/New_York (GMT-4)",
                          "Asia/Singapore (GMT+8)",
                        ].map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Week starts on">
                      <select
                        className={inputClass}
                        value={workspace.week}
                        onChange={(e) => setWorkspace({ ...workspace, week: e.target.value })}
                      >
                        {["Monday", "Sunday", "Saturday"].map((w) => (
                          <option key={w}>{w}</option>
                        ))}
                      </select>
                    </Field>
                  </div>
                </Panel>

                <Panel title="Your profile">
                  <div className="flex flex-wrap items-center gap-4">
                    <Avatar name={me.name} size="xl" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">{me.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {me.role} · {me.email}
                      </p>
                      <div className="mt-3 flex gap-2">
                        <Button variant="outline" size="sm">
                          Change photo
                        </Button>
                        <Button variant="ghost" size="sm">
                          Edit profile
                        </Button>
                      </div>
                    </div>
                  </div>
                </Panel>
              </>
            )}

            {tab === "Members" && (
              <Panel
                title="Members & roles"
                subtitle={`${members.length} people have access to this workspace`}
                action={
                  <Button size="sm">
                    <Plus className="size-4" /> Invite
                  </Button>
                }
                bodyClassName="p-0"
              >
                <div className="overflow-x-auto scrollbar-thin">
                  <table className="w-full min-w-[640px] text-sm">
                    <thead>
                      <tr className="border-b border-border text-left text-xs text-muted-foreground">
                        <th className="px-5 py-3 font-medium">Member</th>
                        <th className="px-5 py-3 font-medium">Role</th>
                        <th className="px-5 py-3 font-medium">Access</th>
                        <th className="px-5 py-3 font-medium">Status</th>
                        <th className="px-5 py-3" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {members.map((m, i) => (
                        <tr key={m.id} className="hover:bg-muted/40">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              <Avatar name={m.name} size="sm" />
                              <div className="min-w-0">
                                <p className="truncate font-medium">{m.name}</p>
                                <p className="truncate text-xs text-muted-foreground">{m.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-muted-foreground">{m.role}</td>
                          <td className="px-5 py-3">
                            <select
                              defaultValue={i === 0 ? "Owner" : i < 3 ? "Admin" : "Member"}
                              aria-label={`Access level for ${m.name}`}
                              className={cn(inputClass, "h-8 w-auto py-0 text-xs")}
                            >
                              {["Owner", "Admin", "Member", "Guest"].map((r) => (
                                <option key={r}>{r}</option>
                              ))}
                            </select>
                          </td>
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
                          <td className="px-5 py-3 text-right">
                            <button
                              aria-label={`Remove ${m.name}`}
                              className="rounded-md p-2 text-muted-foreground transition hover:bg-danger-soft hover:text-danger"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Panel>
            )}

            {tab === "Notifications" && (
              <Panel title="Notification preferences" subtitle="Choose what lands in your inbox">
                <ul className="divide-y divide-border">
                  {(
                    [
                      ["assigned", "Task assigned to me", "When someone assigns you a task."],
                      ["mentions", "Mentions", "When a teammate @mentions you in a comment."],
                      ["dueSoon", "Due date reminders", "One day before a task is due."],
                      ["comments", "All comments", "Every comment on tasks you follow."],
                      ["weekly", "Weekly summary", "A Monday digest of progress and risks."],
                      ["marketing", "Product updates", "New Flowspace features and tips."],
                    ] as const
                  ).map(([key, title, desc]) => (
                    <li key={key} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{title}</p>
                        <p className="text-xs text-muted-foreground">{desc}</p>
                      </div>
                      <Toggle
                        label={title}
                        checked={notify[key]}
                        onChange={(v) => setNotify({ ...notify, [key]: v })}
                      />
                    </li>
                  ))}
                </ul>
              </Panel>
            )}

            {tab === "Task statuses" && (
              <Panel
                title="Custom task statuses"
                subtitle="Statuses used on every project board"
              >
                <ul className="space-y-2">
                  {statuses.map((s) => (
                    <li
                      key={s.name}
                      className="flex items-center gap-3 rounded-lg border border-border px-4 py-3"
                    >
                      <Chip tone={s.tone}>
                        <span className="size-1.5 rounded-full bg-current" />
                        {s.name}
                      </Chip>
                      <span className="flex-1 text-xs text-muted-foreground">
                        Visible on boards, lists and reports
                      </span>
                      <button
                        aria-label={`Remove ${s.name}`}
                        onClick={() => setStatuses((prev) => prev.filter((x) => x.name !== s.name))}
                        className="rounded-md p-1.5 text-muted-foreground transition hover:bg-danger-soft hover:text-danger"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </li>
                  ))}
                </ul>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const name = newStatus.trim();
                    if (!name) return;
                    setStatuses((prev) => [...prev, { name, tone: "accent" as const }]);
                    setNewStatus("");
                  }}
                  className="mt-4 flex flex-wrap gap-2"
                >
                  <input
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    placeholder="New status name…"
                    aria-label="New status name"
                    className={cn(inputClass, "max-w-xs flex-1")}
                  />
                  <Button size="sm" type="submit">
                    <Plus className="size-4" /> Add status
                  </Button>
                </form>
              </Panel>
            )}

            {tab === "Integrations" && (
              <Panel title="Integrations" subtitle="Connect Flowspace to the tools you already use">
                <div className="grid gap-4 sm:grid-cols-2">
                  {INTEGRATIONS.map((i) => (
                    <div key={i.name} className="rounded-xl border border-border p-4">
                      <div className="flex items-start gap-3">
                        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-muted text-muted-foreground">
                          <Plug className="size-5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold">{i.name}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">{i.desc}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        {i.connected ? (
                          <Chip tone="success">
                            <Check className="size-3" /> Connected
                          </Chip>
                        ) : (
                          <Chip>Not connected</Chip>
                        )}
                        <Button variant={i.connected ? "outline" : "primary"} size="sm">
                          {i.connected ? "Manage" : "Connect"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
