import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  activity as seedActivity,
  events as seedEvents,
  members as seedMembers,
  milestones as seedMilestones,
  projects as seedProjects,
  tasks as seedTasks,
  currentUserId,
  type ActivityItem,
  type CalendarEvent,
  type Member,
  type Priority,
  type Project,
  type Status,
  type Task,
} from "./mock-data";

const AUTH_KEY = "flowspace.auth";

interface NewTaskInput {
  title: string;
  description?: string;
  projectId: string;
  assigneeId: string;
  status: Status;
  priority: Priority;
  due: string;
}

interface NewProjectInput {
  name: string;
  description: string;
  client: string;
  managerId: string;
  deadline: string;
  priority: Priority;
}

interface StoreValue {
  authed: boolean;
  authReady: boolean;
  signIn: () => void;
  signOut: () => void;
  members: Member[];
  projects: Project[];
  tasks: Task[];
  activity: ActivityItem[];
  events: CalendarEvent[];
  milestones: typeof seedMilestones;
  me: Member;
  member: (id: string) => Member;
  project: (id: string) => Project | undefined;
  setTaskStatus: (id: string, status: Status) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  addComment: (taskId: string, body: string) => void;
  addTask: (input: NewTaskInput) => void;
  addProject: (input: NewProjectInput) => void;
  toggleMilestone: (id: string) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [projects, setProjects] = useState<Project[]>(seedProjects);
  const [tasks, setTasks] = useState<Task[]>(seedTasks);
  const [activity, setActivity] = useState<ActivityItem[]>(seedActivity);
  const [milestones, setMilestones] = useState(seedMilestones);

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage.getItem(AUTH_KEY) === "1") {
      setAuthed(true);
    }
  }, []);

  const signIn = useCallback(() => {
    window.localStorage.setItem(AUTH_KEY, "1");
    setAuthed(true);
  }, []);

  const signOut = useCallback(() => {
    window.localStorage.removeItem(AUTH_KEY);
    setAuthed(false);
  }, []);

  const member = useCallback(
    (id: string): Member => (seedMembers.find((m) => m.id === id) ?? seedMembers[0]) as Member,
    [],
  );

  const pushActivity = useCallback((item: Omit<ActivityItem, "id" | "at">) => {
    setActivity((prev) => [
      { ...item, id: `ac-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`, at: "Just now" },
      ...prev,
    ]);
  }, []);

  const value = useMemo<StoreValue>(
    () => ({
      authed,
      signIn,
      signOut,
      members: seedMembers,
      projects,
      tasks,
      activity,
      events: seedEvents,
      milestones,
      me: member(currentUserId),
      member,
      project: (id) => projects.find((p) => p.id === id),
      setTaskStatus: (id, status) => {
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
        const t = tasks.find((x) => x.id === id);
        if (t) {
          pushActivity({
            actorId: currentUserId,
            action: status === "Completed" ? "completed" : "moved",
            target: status === "Completed" ? t.title : `${t.title} to ${status}`,
            projectId: t.projectId,
            type: "task",
          });
        }
      },
      toggleSubtask: (taskId, subtaskId) =>
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  subtasks: t.subtasks.map((s) =>
                    s.id === subtaskId ? { ...s, done: !s.done } : s,
                  ),
                }
              : t,
          ),
        ),
      addComment: (taskId, body) => {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  comments: [
                    ...t.comments,
                    {
                      id: `c-${Date.now()}`,
                      authorId: currentUserId,
                      body,
                      at: "Just now",
                    },
                  ],
                }
              : t,
          ),
        );
        const t = tasks.find((x) => x.id === taskId);
        if (t) {
          pushActivity({
            actorId: currentUserId,
            action: "commented on",
            target: t.title,
            projectId: t.projectId,
            type: "comment",
          });
        }
      },
      addTask: (input) => {
        const proj = projects.find((p) => p.id === input.projectId);
        const id = `t-${Date.now()}`;
        setTasks((prev) => [
          {
            id,
            key: `${proj?.code ?? "TSK"}-${100 + prev.length}`,
            title: input.title,
            description: input.description ?? "",
            projectId: input.projectId,
            assigneeId: input.assigneeId,
            reporterId: currentUserId,
            status: input.status,
            priority: input.priority,
            due: input.due,
            tags: [],
            estimate: 8,
            logged: 0,
            subtasks: [],
            comments: [],
            attachments: [],
          },
          ...prev,
        ]);
        pushActivity({
          actorId: currentUserId,
          action: "created a new task",
          target: input.title,
          projectId: input.projectId,
          type: "task",
        });
      },
      addProject: (input) => {
        const id = `p-${Date.now()}`;
        setProjects((prev) => [
          {
            id,
            code: input.name.slice(0, 2).toUpperCase(),
            name: input.name,
            description: input.description,
            client: input.client,
            managerId: input.managerId,
            memberIds: [input.managerId, currentUserId],
            start: new Date().toISOString().slice(0, 10),
            deadline: input.deadline,
            status: "On Track",
            priority: input.priority,
            budget: 50000,
            spent: 0,
            lastActivity: "Just now",
            color: "primary",
          },
          ...prev,
        ]);
        pushActivity({
          actorId: currentUserId,
          action: "created the project",
          target: input.name,
          projectId: id,
          type: "project",
        });
      },
      toggleMilestone: (id) =>
        setMilestones((prev) => prev.map((m) => (m.id === id ? { ...m, done: !m.done } : m))),
    }),
    [authed, signIn, signOut, projects, tasks, activity, milestones, member, pushActivity],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

export function taskProgress(task: Task) {
  if (!task.subtasks.length) return task.status === "Completed" ? 100 : 0;
  return Math.round((task.subtasks.filter((s) => s.done).length / task.subtasks.length) * 100);
}

export function projectProgress(tasks: Task[], projectId: string) {
  const list = tasks.filter((t) => t.projectId === projectId);
  if (!list.length) return 0;
  return Math.round((list.filter((t) => t.status === "Completed").length / list.length) * 100);
}

export const TODAY = new Date("2026-09-11T09:00:00Z");

export function daysUntil(dateStr: string) {
  const d = new Date(`${dateStr}T00:00:00Z`);
  return Math.round((d.getTime() - TODAY.getTime()) / 86_400_000);
}

export function formatDate(dateStr: string) {
  return new Date(`${dateStr}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatShort(dateStr: string) {
  return new Date(`${dateStr}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function dueLabel(dateStr: string) {
  const d = daysUntil(dateStr);
  if (d === 0) return "Today";
  if (d === 1) return "Tomorrow";
  if (d === -1) return "Yesterday";
  if (d < 0) return `${Math.abs(d)}d overdue`;
  return formatShort(dateStr);
}
