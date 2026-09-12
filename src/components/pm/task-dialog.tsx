import { CalendarDays, Check, Link2, Paperclip, Send, Tag, Trash2, X } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { useStore, formatDate, taskProgress } from "@/lib/store";
import type { Status, Task } from "@/lib/mock-data";
import { Avatar, Bar, Chip, PriorityBadge, StatusBadge } from "./primitives";
import { Button, inputClass } from "./app-shell";

const STATUSES: Status[] = ["Backlog", "To Do", "In Progress", "In Review", "Blocked", "Completed"];

export function TaskDialog({ task, onClose }: { task: Task | null; onClose: () => void }) {
  const { member, project, setTaskStatus, toggleSubtask, addComment } = useStore();
  const [draft, setDraft] = useState("");

  if (!task) return null;
  const assignee = member(task.assigneeId);
  const reporter = member(task.reporterId);
  const proj = project(task.projectId);
  const progress = taskProgress(task);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-3 sm:p-6">
      <div className="fixed inset-0 bg-foreground/45 backdrop-blur-sm" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={task.title}
        className="surface relative z-10 my-2 w-full max-w-4xl overflow-hidden p-0 shadow-[var(--shadow-pop)]"
      >
        <header className="flex items-start justify-between gap-4 border-b border-border px-6 py-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-semibold text-primary">{task.key}</span>
              <span>·</span>
              <span className="truncate">{proj?.name}</span>
            </div>
            <h2 className="mt-1 truncate text-lg font-bold tracking-tight">{task.title}</h2>
          </div>
          <div className="flex items-center gap-1">
            <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted" aria-label="Copy link">
              <Link2 className="size-4" />
            </button>
            <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted" aria-label="Delete task">
              <Trash2 className="size-4" />
            </button>
            <button onClick={onClose} className="rounded-lg p-2 text-muted-foreground hover:bg-muted" aria-label="Close">
              <X className="size-4" />
            </button>
          </div>
        </header>

        <div className="grid max-h-[76vh] gap-0 overflow-y-auto lg:grid-cols-[1fr_300px]">
          <div className="space-y-6 px-6 py-5">
            <section>
              <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Description</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/85">{task.description}</p>
            </section>

            <section>
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Subtasks
                </h3>
                <span className="text-xs text-muted-foreground">
                  {task.subtasks.filter((s) => s.done).length}/{task.subtasks.length} done
                </span>
              </div>
              <Bar value={progress} className="mt-2" />
              <ul className="mt-3 space-y-1">
                {task.subtasks.map((s) => (
                  <li key={s.id}>
                    <button
                      onClick={() => toggleSubtask(task.id, s.id)}
                      className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm transition hover:bg-muted"
                    >
                      <span
                        className={cn(
                          "grid size-4.5 shrink-0 place-items-center rounded-[5px] border transition",
                          s.done ? "border-primary bg-primary text-primary-foreground" : "border-input",
                        )}
                      >
                        {s.done && <Check className="size-3" strokeWidth={3} />}
                      </span>
                      <span className={cn(s.done && "text-muted-foreground line-through")}>{s.title}</span>
                    </button>
                  </li>
                ))}
                {!task.subtasks.length && (
                  <li className="px-2 py-3 text-sm text-muted-foreground">No subtasks yet.</li>
                )}
              </ul>
            </section>

            {task.attachments.length > 0 && (
              <section>
                <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Attachments
                </h3>
                <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                  {task.attachments.map((a) => (
                    <li
                      key={a.id}
                      className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5"
                    >
                      <span className="grid size-9 place-items-center rounded-lg bg-primary-soft text-primary">
                        <Paperclip className="size-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">{a.name}</span>
                        <span className="block text-[11px] text-muted-foreground">{a.size}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section>
              <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Comments ({task.comments.length})
              </h3>
              <ul className="mt-3 space-y-4">
                {task.comments.map((cm) => {
                  const author = member(cm.authorId);
                  return (
                    <li key={cm.id} className="flex gap-3">
                      <Avatar name={author.name} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="flex flex-wrap items-center gap-2 text-sm">
                          <span className="font-semibold">{author.name}</span>
                          <span className="text-[11px] text-muted-foreground">{cm.at}</span>
                        </p>
                        <p className="mt-1 rounded-lg bg-muted px-3 py-2 text-sm leading-relaxed">
                          {cm.body}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <form
                className="mt-4 flex items-center gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!draft.trim()) return;
                  addComment(task.id, draft.trim());
                  setDraft("");
                }}
              >
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  className={inputClass}
                  placeholder="Write a comment…"
                  aria-label="Write a comment"
                />
                <Button type="submit" size="icon" aria-label="Send comment">
                  <Send className="size-4" />
                </Button>
              </form>
            </section>
          </div>

          <aside className="space-y-5 border-t border-border bg-muted/40 px-6 py-5 lg:border-t-0 lg:border-l">
            <div>
              <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">Status</p>
              <select
                value={task.status}
                onChange={(e) => setTaskStatus(task.id, e.target.value as Status)}
                className={cn(inputClass, "mt-1.5")}
                aria-label="Task status"
              >
                {STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                Assignee
              </p>
              <div className="mt-2 flex items-center gap-2">
                <Avatar name={assignee.name} size="sm" />
                <span className="text-sm font-medium">{assignee.name}</span>
              </div>
            </div>
            <div>
              <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                Reporter
              </p>
              <div className="mt-2 flex items-center gap-2">
                <Avatar name={reporter.name} size="sm" />
                <span className="text-sm font-medium">{reporter.name}</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <PriorityBadge priority={task.priority} />
              <StatusBadge status={task.status} />
            </div>
            <div>
              <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                Due date
              </p>
              <p className="mt-1.5 flex items-center gap-2 text-sm font-medium">
                <CalendarDays className="size-4 text-muted-foreground" />
                {formatDate(task.due)}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                Time tracking
              </p>
              <p className="mt-1.5 text-sm font-medium">
                {task.logged}h logged{" "}
                <span className="font-normal text-muted-foreground">of {task.estimate}h</span>
              </p>
              <Bar value={(task.logged / task.estimate) * 100} tone="success" className="mt-2" />
            </div>
            {task.tags.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                  Tags
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {task.tags.map((t) => (
                    <Chip key={t}>
                      <Tag className="size-3" />
                      {t}
                    </Chip>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
