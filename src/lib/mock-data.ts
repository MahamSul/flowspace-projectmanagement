export type Status = "Backlog" | "To Do" | "In Progress" | "In Review" | "Blocked" | "Completed";
export type Priority = "Low" | "Medium" | "High" | "Urgent";
export type ProjectStatus = "On Track" | "At Risk" | "Delayed" | "Completed";

export interface Member {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  status: "Active" | "Away" | "Offline";
  workload: number;
  activeProjects: number;
  tasks: number;
  location: string;
  joined: string;
}

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  date: string;
  done: boolean;
}

export interface Comment {
  id: string;
  authorId: string;
  body: string;
  at: string;
}

export interface Subtask {
  id: string;
  title: string;
  done: boolean;
}

export interface Task {
  id: string;
  key: string;
  title: string;
  description: string;
  projectId: string;
  assigneeId: string;
  reporterId: string;
  status: Status;
  priority: Priority;
  due: string;
  tags: string[];
  estimate: number;
  logged: number;
  subtasks: Subtask[];
  comments: Comment[];
  attachments: { id: string; name: string; size: string }[];
}

export interface Project {
  id: string;
  code: string;
  name: string;
  description: string;
  client: string;
  managerId: string;
  memberIds: string[];
  start: string;
  deadline: string;
  status: ProjectStatus;
  priority: Priority;
  budget: number;
  spent: number;
  lastActivity: string;
  color: string;
}

export interface ActivityItem {
  id: string;
  actorId: string;
  action: string;
  target: string;
  projectId: string;
  at: string;
  type: "task" | "comment" | "project" | "file" | "member";
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: "Deadline" | "Milestone" | "Meeting" | "Release";
  projectId: string;
  time?: string;
  notes?: string;
}

export const members: Member[] = [
  { id: "u1", name: "Alex Morgan", role: "Product Manager", department: "Product", email: "alex.morgan@acmecorp.com", status: "Active", workload: 88, activeProjects: 5, tasks: 7, location: "Karachi, PK", joined: "Mar 2022" },
  { id: "u2", name: "Sophia Lee", role: "UI/UX Designer", department: "Design", email: "sophia.lee@acmecorp.com", status: "Active", workload: 72, activeProjects: 3, tasks: 6, location: "Singapore", joined: "Jan 2023" },
  { id: "u3", name: "Ethan Carter", role: "Frontend Developer", department: "Engineering", email: "ethan.carter@acmecorp.com", status: "Active", workload: 94, activeProjects: 4, tasks: 8, location: "Berlin, DE", joined: "Aug 2021" },
  { id: "u4", name: "Mia Johnson", role: "Backend Developer", department: "Engineering", email: "mia.johnson@acmecorp.com", status: "Away", workload: 112, activeProjects: 4, tasks: 10, location: "Toronto, CA", joined: "Feb 2022" },
  { id: "u5", name: "Noah Williams", role: "Project Manager", department: "Delivery", email: "noah.williams@acmecorp.com", status: "Active", workload: 88, activeProjects: 6, tasks: 7, location: "London, UK", joined: "Jun 2020" },
  { id: "u6", name: "Olivia Brown", role: "QA Engineer", department: "Quality", email: "olivia.brown@acmecorp.com", status: "Active", workload: 65, activeProjects: 3, tasks: 5, location: "Dublin, IE", joined: "Nov 2022" },
  { id: "u7", name: "James Wilson", role: "Data Analyst", department: "Analytics", email: "james.wilson@acmecorp.com", status: "Offline", workload: 102, activeProjects: 2, tasks: 6, location: "Austin, US", joined: "Apr 2023" },
  { id: "u8", name: "Liam Davis", role: "DevOps Engineer", department: "Engineering", email: "liam.davis@acmecorp.com", status: "Active", workload: 45, activeProjects: 2, tasks: 4, location: "Lisbon, PT", joined: "Sep 2021" },
  { id: "u9", name: "Ava Martinez", role: "Content Writer", department: "Marketing", email: "ava.martinez@acmecorp.com", status: "Active", workload: 30, activeProjects: 2, tasks: 3, location: "Madrid, ES", joined: "Jul 2023" },
  { id: "u10", name: "Daniel Okafor", role: "Marketing Manager", department: "Marketing", email: "daniel.okafor@acmecorp.com", status: "Active", workload: 78, activeProjects: 3, tasks: 5, location: "Lagos, NG", joined: "May 2022" },
  { id: "u11", name: "Emily Zhang", role: "Solutions Architect", department: "Engineering", email: "emily.zhang@acmecorp.com", status: "Away", workload: 84, activeProjects: 3, tasks: 6, location: "Vancouver, CA", joined: "Oct 2020" },
  { id: "u12", name: "Jessica Kim", role: "Business Analyst", department: "Delivery", email: "jessica.kim@acmecorp.com", status: "Active", workload: 58, activeProjects: 2, tasks: 4, location: "Seoul, KR", joined: "Feb 2024" },
];

export const currentUserId = "u1";

export const projects: Project[] = [
  { id: "p1", code: "WR", name: "Website Redesign", description: "Redesign the corporate website for better UX, accessibility and Core Web Vitals performance.", client: "Acme Corp", managerId: "u5", memberIds: ["u2", "u3", "u6", "u9", "u1"], start: "2026-07-14", deadline: "2026-09-28", status: "On Track", priority: "High", budget: 82000, spent: 54300, lastActivity: "2h ago", color: "info" },
  { id: "p2", code: "EC", name: "E-Commerce Platform", description: "Build and launch a headless commerce platform with multi-currency payment integration.", client: "Northwind Retail", managerId: "u5", memberIds: ["u3", "u4", "u8", "u6"], start: "2026-06-02", deadline: "2026-10-15", status: "At Risk", priority: "Urgent", budget: 165000, spent: 121400, lastActivity: "40m ago", color: "warning" },
  { id: "p3", code: "MB", name: "Mobile Banking App", description: "Cross-platform banking app for iOS and Android with biometric authentication.", client: "Meridian Bank", managerId: "u11", memberIds: ["u4", "u3", "u6", "u12"], start: "2026-05-19", deadline: "2026-11-30", status: "On Track", priority: "High", budget: 240000, spent: 138900, lastActivity: "1h ago", color: "success" },
  { id: "p4", code: "MC", name: "Marketing Campaign Q4", description: "Plan and execute the Q4 multi-channel campaign across paid, social and lifecycle email.", client: "Acme Corp", managerId: "u10", memberIds: ["u9", "u2", "u10"], start: "2026-08-01", deadline: "2026-09-20", status: "On Track", priority: "Medium", budget: 48000, spent: 29600, lastActivity: "3h ago", color: "accent" },
  { id: "p5", code: "DM", name: "Data Migration", description: "Migrate legacy on-prem warehouse data into the new cloud infrastructure with zero downtime.", client: "Helix Logistics", managerId: "u11", memberIds: ["u4", "u7", "u8"], start: "2026-04-08", deadline: "2026-10-10", status: "At Risk", priority: "High", budget: 96000, spent: 78200, lastActivity: "Yesterday", color: "primary" },
  { id: "p6", code: "SA", name: "Security Audit", description: "Conduct a full security audit, penetration testing and remediation of critical findings.", client: "Meridian Bank", managerId: "u5", memberIds: ["u8", "u6", "u11"], start: "2026-08-11", deadline: "2026-09-18", status: "Delayed", priority: "Urgent", budget: 54000, spent: 21100, lastActivity: "Yesterday", color: "danger" },
  { id: "p7", code: "CR", name: "CRM Development", description: "Internal CRM with pipeline management, quoting and reporting for the sales organisation.", client: "Internal", managerId: "u1", memberIds: ["u3", "u12", "u7", "u2"], start: "2026-03-16", deadline: "2026-12-05", status: "On Track", priority: "Medium", budget: 132000, spent: 61500, lastActivity: "5h ago", color: "info" },
  { id: "p8", code: "AI", name: "AI Automation Platform", description: "Workflow automation platform with document parsing and assisted task routing.", client: "Vertex Group", managerId: "u11", memberIds: ["u4", "u7", "u11", "u8"], start: "2026-01-12", deadline: "2026-08-29", status: "Completed", priority: "High", budget: 188000, spent: 179400, lastActivity: "2 days ago", color: "success" },
];

const c = (id: string, authorId: string, body: string, at: string): Comment => ({ id, authorId, body, at });

export const tasks: Task[] = [
  { id: "t1", key: "WR-23", title: "Design new homepage wireframe", description: "Create a clean and modern wireframe for the new homepage based on the approved layout direction. Focus on user flow, content hierarchy and key CTA placement.", projectId: "p1", assigneeId: "u2", reporterId: "u1", status: "To Do", priority: "High", due: "2026-09-14", tags: ["Homepage", "Design"], estimate: 16, logged: 6, subtasks: [
    { id: "s1", title: "Review requirements and brief", done: true },
    { id: "s2", title: "Analyze competitor layouts", done: true },
    { id: "s3", title: "Create low-fidelity wireframe", done: false },
    { id: "s4", title: "Share with team for feedback", done: false },
    { id: "s5", title: "Incorporate feedback and finalize", done: false },
  ], comments: [
    c("c1", "u2", "I've added some inspiration examples in the attachments. Let me know your thoughts.", "Sep 9, 10:15 AM"),
    c("c2", "u5", "Looks great! I think we should highlight the primary CTA more prominently.", "Sep 9, 11:02 AM"),
    c("c3", "u1", "Good point. Let's try a bolder treatment for the CTA section.", "Sep 9, 11:15 AM"),
  ], attachments: [ { id: "a1", name: "Homepage_Notes.sketch", size: "2.4 MB" }, { id: "a2", name: "Homepage_References.pdf", size: "1.6 MB" } ] },
  { id: "t2", key: "WR-24", title: "Create style guide & design system", description: "Define colors, typography scale, spacing and core components for the redesign.", projectId: "p1", assigneeId: "u2", reporterId: "u5", status: "In Progress", priority: "Medium", due: "2026-09-16", tags: ["Design System"], estimate: 24, logged: 14, subtasks: [ { id: "s6", title: "Color tokens", done: true }, { id: "s7", title: "Typography scale", done: true }, { id: "s8", title: "Component inventory", done: false } ], comments: [c("c4", "u2", "Typography scale is locked, moving on to components.", "Sep 10, 9:20 AM")], attachments: [] },
  { id: "t3", key: "WR-25", title: "Design inner pages (UI)", description: "Create high fidelity designs for the inner page templates.", projectId: "p1", assigneeId: "u2", reporterId: "u1", status: "In Progress", priority: "High", due: "2026-09-11", tags: ["UI"], estimate: 20, logged: 12, subtasks: [ { id: "s9", title: "About page", done: true }, { id: "s10", title: "Services page", done: true }, { id: "s11", title: "Case study page", done: true }, { id: "s12", title: "Careers page", done: false }, { id: "s13", title: "Contact page", done: false }, { id: "s14", title: "Legal pages", done: false } ], comments: [], attachments: [] },
  { id: "t4", key: "WR-26", title: "Build navigation prototype", description: "Interactive prototype for the new mega-menu navigation.", projectId: "p1", assigneeId: "u3", reporterId: "u5", status: "To Do", priority: "Medium", due: "2026-09-18", tags: ["Prototype"], estimate: 12, logged: 0, subtasks: [{ id: "s15", title: "Desktop menu", done: false }, { id: "s16", title: "Mobile drawer", done: false }], comments: [], attachments: [] },
  { id: "t5", key: "WR-27", title: "Homepage UI review", description: "Review the delivered homepage UI against the brand guidelines.", projectId: "p1", assigneeId: "u1", reporterId: "u2", status: "In Review", priority: "Medium", due: "2026-09-12", tags: ["Review"], estimate: 4, logged: 3, subtasks: [{ id: "s17", title: "Desktop pass", done: true }, { id: "s18", title: "Mobile pass", done: true }], comments: [c("c5", "u1", "Two small spacing issues in the hero, otherwise approved.", "Sep 11, 8:40 AM")], attachments: [] },
  { id: "t6", key: "WR-28", title: "Prepare content outline", description: "Outline the structure for homepage and inner page content.", projectId: "p1", assigneeId: "u9", reporterId: "u5", status: "To Do", priority: "Medium", due: "2026-09-11", tags: ["Content"], estimate: 8, logged: 2, subtasks: [], comments: [], attachments: [] },
  { id: "t7", key: "WR-29", title: "Kickoff meeting with team", description: "Project kickoff, scope walkthrough and role assignment.", projectId: "p1", assigneeId: "u5", reporterId: "u5", status: "Completed", priority: "Low", due: "2026-07-16", tags: ["Kickoff"], estimate: 2, logged: 2, subtasks: [{ id: "s19", title: "Agenda", done: true }], comments: [], attachments: [] },
  { id: "t8", key: "WR-30", title: "Audit current website", description: "Full accessibility, SEO and performance audit of the existing site.", projectId: "p1", assigneeId: "u6", reporterId: "u5", status: "Completed", priority: "Medium", due: "2026-07-24", tags: ["Audit"], estimate: 10, logged: 11, subtasks: [{ id: "s20", title: "Lighthouse run", done: true }, { id: "s21", title: "Report", done: true }], comments: [], attachments: [] },
  { id: "t9", key: "WR-31", title: "Prepare project documentation", description: "Create technical documentation for the handover package.", projectId: "p1", assigneeId: "u12", reporterId: "u1", status: "To Do", priority: "Low", due: "2026-09-24", tags: ["Docs"], estimate: 6, logged: 0, subtasks: [], comments: [], attachments: [] },

  { id: "t10", key: "EC-14", title: "Implement API integration", description: "Integrate the payment gateway API with retries and idempotency keys.", projectId: "p2", assigneeId: "u4", reporterId: "u11", status: "In Progress", priority: "High", due: "2026-09-13", tags: ["API", "Payments"], estimate: 30, logged: 19, subtasks: [{ id: "s22", title: "Sandbox credentials", done: true }, { id: "s23", title: "Checkout flow", done: false }, { id: "s24", title: "Webhook handling", done: false }], comments: [c("c6", "u4", "Sandbox is live, checkout flow in progress.", "Sep 10, 4:05 PM")], attachments: [] },
  { id: "t11", key: "EC-15", title: "Client feedback review", description: "Review consolidated feedback from the design review meeting.", projectId: "p2", assigneeId: "u1", reporterId: "u5", status: "In Review", priority: "Medium", due: "2026-09-11", tags: ["Feedback"], estimate: 3, logged: 1, subtasks: [], comments: [], attachments: [] },
  { id: "t12", key: "EC-16", title: "Integrate CMS with storefront", description: "Wire the headless CMS content models into the storefront templates.", projectId: "p2", assigneeId: "u3", reporterId: "u11", status: "In Progress", priority: "Medium", due: "2026-09-19", tags: ["CMS"], estimate: 18, logged: 7, subtasks: [{ id: "s25", title: "Content models", done: true }, { id: "s26", title: "Preview mode", done: false }, { id: "s27", title: "Caching", done: false }], comments: [], attachments: [] },
  { id: "t13", key: "EC-17", title: "Checkout load testing", description: "Run load tests on the checkout path for Black Friday traffic estimates.", projectId: "p2", assigneeId: "u8", reporterId: "u11", status: "Blocked", priority: "Urgent", due: "2026-09-15", tags: ["Performance"], estimate: 12, logged: 2, subtasks: [], comments: [c("c7", "u8", "Blocked until the staging environment is scaled up.", "Sep 10, 1:30 PM")], attachments: [] },
  { id: "t14", key: "EC-18", title: "Mobile responsiveness testing", description: "Cross-device QA sweep for the storefront and checkout.", projectId: "p2", assigneeId: "u6", reporterId: "u5", status: "In Review", priority: "High", due: "2026-09-12", tags: ["QA"], estimate: 10, logged: 8, subtasks: [{ id: "s28", title: "iOS Safari", done: true }, { id: "s29", title: "Android Chrome", done: true }, { id: "s30", title: "Tablet", done: true }], comments: [], attachments: [] },

  { id: "t15", key: "MB-08", title: "Biometric login flow", description: "Implement Face ID / fingerprint authentication with secure fallback.", projectId: "p3", assigneeId: "u4", reporterId: "u11", status: "In Progress", priority: "Urgent", due: "2026-09-17", tags: ["Security", "Auth"], estimate: 28, logged: 15, subtasks: [{ id: "s31", title: "iOS implementation", done: true }, { id: "s32", title: "Android implementation", done: false }], comments: [], attachments: [] },
  { id: "t16", key: "MB-09", title: "Write unit tests for auth module", description: "Add coverage for the authentication and session refresh modules.", projectId: "p3", assigneeId: "u6", reporterId: "u4", status: "To Do", priority: "Low", due: "2026-09-13", tags: ["Testing"], estimate: 8, logged: 0, subtasks: [], comments: [], attachments: [] },
  { id: "t17", key: "MB-10", title: "Transaction history screen", description: "Build the transaction list with filters, search and statement export.", projectId: "p3", assigneeId: "u3", reporterId: "u11", status: "To Do", priority: "Medium", due: "2026-09-22", tags: ["Mobile"], estimate: 20, logged: 0, subtasks: [{ id: "s33", title: "List view", done: false }, { id: "s34", title: "Filters", done: false }], comments: [], attachments: [] },
  { id: "t18", key: "MB-11", title: "Fix responsive layout issues", description: "Resolve layout bugs on tablet and small mobile breakpoints.", projectId: "p3", assigneeId: "u3", reporterId: "u6", status: "To Do", priority: "High", due: "2026-09-11", tags: ["Bug"], estimate: 6, logged: 1, subtasks: [], comments: [], attachments: [] },

  { id: "t19", key: "MC-05", title: "Marketing banner designs", description: "Design paid social and display banners for the Q4 campaign.", projectId: "p4", assigneeId: "u2", reporterId: "u10", status: "In Review", priority: "Medium", due: "2026-09-13", tags: ["Creative"], estimate: 12, logged: 10, subtasks: [{ id: "s35", title: "Static set", done: true }, { id: "s36", title: "Animated set", done: false }], comments: [], attachments: [] },
  { id: "t20", key: "MC-06", title: "Finalize campaign budget", description: "Lock channel-level budget allocation and approvals.", projectId: "p4", assigneeId: "u10", reporterId: "u1", status: "Blocked", priority: "High", due: "2026-09-08", tags: ["Budget"], estimate: 4, logged: 3, subtasks: [], comments: [c("c8", "u10", "Waiting on finance sign-off for the paid social increase.", "Sep 9, 2:10 PM")], attachments: [] },
  { id: "t21", key: "MC-07", title: "Content strategy for blog", description: "Editorial calendar for Q4 blog and lifecycle email content.", projectId: "p4", assigneeId: "u9", reporterId: "u10", status: "In Progress", priority: "Low", due: "2026-09-19", tags: ["Content"], estimate: 10, logged: 4, subtasks: [], comments: [], attachments: [] },

  { id: "t22", key: "DM-12", title: "Database schema optimization", description: "Improve query performance and indexing on the migrated warehouse tables.", projectId: "p5", assigneeId: "u4", reporterId: "u11", status: "To Do", priority: "High", due: "2026-09-18", tags: ["Database"], estimate: 16, logged: 0, subtasks: [{ id: "s37", title: "Index audit", done: false }], comments: [], attachments: [] },
  { id: "t23", key: "DM-13", title: "Database backup automation", description: "Automate nightly snapshots and restore verification.", projectId: "p5", assigneeId: "u8", reporterId: "u11", status: "In Progress", priority: "Urgent", due: "2026-09-09", tags: ["Infra"], estimate: 12, logged: 9, subtasks: [], comments: [], attachments: [] },
  { id: "t24", key: "DM-14", title: "Migration dry run report", description: "Document the results of the second dry run and open risks.", projectId: "p5", assigneeId: "u7", reporterId: "u11", status: "In Review", priority: "Medium", due: "2026-09-14", tags: ["Report"], estimate: 6, logged: 5, subtasks: [], comments: [], attachments: [] },

  { id: "t25", key: "SA-03", title: "Security audit & vulnerability scan", description: "Run the full scan suite and triage findings by severity.", projectId: "p6", assigneeId: "u8", reporterId: "u5", status: "To Do", priority: "Urgent", due: "2026-09-15", tags: ["Security"], estimate: 20, logged: 2, subtasks: [{ id: "s38", title: "Static analysis", done: false }, { id: "s39", title: "Dependency scan", done: false }], comments: [], attachments: [] },
  { id: "t26", key: "SA-04", title: "Update privacy policy", description: "Revise the privacy policy to reflect the new data processing flows.", projectId: "p6", assigneeId: "u12", reporterId: "u5", status: "In Progress", priority: "Medium", due: "2026-09-10", tags: ["Compliance"], estimate: 5, logged: 3, subtasks: [], comments: [], attachments: [] },

  { id: "t27", key: "CR-21", title: "Pipeline board component", description: "Build the drag-friendly sales pipeline board with stage totals.", projectId: "p7", assigneeId: "u3", reporterId: "u1", status: "In Progress", priority: "Medium", due: "2026-09-20", tags: ["Frontend"], estimate: 22, logged: 9, subtasks: [{ id: "s40", title: "Stage columns", done: true }, { id: "s41", title: "Deal card", done: false }], comments: [], attachments: [] },
  { id: "t28", key: "CR-22", title: "Quoting module requirements", description: "Gather and document requirements for the quoting module.", projectId: "p7", assigneeId: "u12", reporterId: "u1", status: "In Review", priority: "Medium", due: "2026-09-12", tags: ["Discovery"], estimate: 8, logged: 7, subtasks: [], comments: [], attachments: [] },
  { id: "t29", key: "CR-23", title: "Reporting data model", description: "Define the analytics data model for pipeline and revenue reporting.", projectId: "p7", assigneeId: "u7", reporterId: "u11", status: "Backlog", priority: "Low", due: "2026-10-02", tags: ["Analytics"], estimate: 14, logged: 0, subtasks: [], comments: [], attachments: [] },
  { id: "t30", key: "AI-40", title: "Post-launch retrospective", description: "Run the delivery retrospective and capture lessons learned.", projectId: "p8", assigneeId: "u11", reporterId: "u1", status: "Completed", priority: "Low", due: "2026-08-28", tags: ["Retro"], estimate: 3, logged: 3, subtasks: [], comments: [], attachments: [] },
  { id: "t31", key: "AI-41", title: "Document parsing accuracy report", description: "Final accuracy benchmark report for the parsing pipeline.", projectId: "p8", assigneeId: "u7", reporterId: "u11", status: "Completed", priority: "Medium", due: "2026-08-22", tags: ["Report"], estimate: 8, logged: 9, subtasks: [], comments: [], attachments: [] },
];

export const milestones: Milestone[] = [
  { id: "m1", projectId: "p1", title: "Scope approved", date: "2026-07-22", done: true },
  { id: "m2", projectId: "p1", title: "Design sign-off", date: "2026-08-26", done: true },
  { id: "m3", projectId: "p1", title: "Feature complete", date: "2026-09-16", done: false },
  { id: "m4", projectId: "p1", title: "Project launch", date: "2026-09-28", done: false },
  { id: "m5", projectId: "p2", title: "Payment integration live", date: "2026-09-24", done: false },
  { id: "m6", projectId: "p2", title: "Store launch", date: "2026-10-15", done: false },
  { id: "m7", projectId: "p3", title: "Beta release", date: "2026-10-06", done: false },
  { id: "m8", projectId: "p5", title: "Final cutover", date: "2026-10-08", done: false },
  { id: "m9", projectId: "p4", title: "Campaign go-live", date: "2026-09-20", done: false },
];

export const activity: ActivityItem[] = [
  { id: "ac1", actorId: "u3", action: "completed", target: "Implement search functionality", projectId: "p2", at: "1h ago", type: "task" },
  { id: "ac2", actorId: "u2", action: "updated task", target: "Design system components", projectId: "p1", at: "2h ago", type: "task" },
  { id: "ac3", actorId: "u4", action: "commented on", target: "API integration with payment gateway", projectId: "p2", at: "3h ago", type: "comment" },
  { id: "ac4", actorId: "u9", action: "uploaded a file to", target: "Brand guidelines", projectId: "p4", at: "4h ago", type: "file" },
  { id: "ac5", actorId: "u5", action: "moved", target: "Homepage UI review to In Review", projectId: "p1", at: "5h ago", type: "task" },
  { id: "ac6", actorId: "u11", action: "updated the deadline for", target: "Data Migration", projectId: "p5", at: "Yesterday, 6:20 PM", type: "project" },
  { id: "ac7", actorId: "u6", action: "reported a blocker on", target: "Checkout load testing", projectId: "p2", at: "Yesterday, 4:05 PM", type: "task" },
  { id: "ac8", actorId: "u1", action: "assigned", target: "Olivia Brown to Security Audit", projectId: "p6", at: "Yesterday, 11:40 AM", type: "member" },
  { id: "ac9", actorId: "u10", action: "created a new task", target: "Content strategy for blog", projectId: "p4", at: "2 days ago", type: "task" },
  { id: "ac10", actorId: "u8", action: "closed", target: "Nightly snapshot failure", projectId: "p5", at: "2 days ago", type: "task" },
  { id: "ac11", actorId: "u12", action: "shared", target: "Quoting module requirements", projectId: "p7", at: "3 days ago", type: "file" },
  { id: "ac12", actorId: "u7", action: "published", target: "Migration dry run report", projectId: "p5", at: "3 days ago", type: "file" },
];

export const events: CalendarEvent[] = [
  { id: "e1", title: "Design sign-off review", date: "2026-09-12", type: "Meeting", projectId: "p1", time: "10:00 AM", notes: "Walkthrough of the final homepage and inner page designs." },
  { id: "e2", title: "Homepage UI review due", date: "2026-09-12", type: "Deadline", projectId: "p1", time: "4:30 PM" },
  { id: "e3", title: "Payment gateway integration", date: "2026-09-13", type: "Deadline", projectId: "p2", time: "6:00 PM" },
  { id: "e4", title: "Sprint planning", date: "2026-09-15", type: "Meeting", projectId: "p3", time: "9:30 AM" },
  { id: "e5", title: "Feature complete", date: "2026-09-16", type: "Milestone", projectId: "p1" },
  { id: "e6", title: "Biometric login flow due", date: "2026-09-17", type: "Deadline", projectId: "p3" },
  { id: "e7", title: "Security remediation review", date: "2026-09-18", type: "Meeting", projectId: "p6", time: "2:00 PM" },
  { id: "e8", title: "Campaign go-live", date: "2026-09-20", type: "Milestone", projectId: "p4" },
  { id: "e9", title: "Storefront release 2.4", date: "2026-09-24", type: "Release", projectId: "p2", time: "8:00 PM" },
  { id: "e10", title: "Website launch", date: "2026-09-28", type: "Milestone", projectId: "p1" },
  { id: "e11", title: "Client status call", date: "2026-09-08", type: "Meeting", projectId: "p5", time: "3:00 PM" },
  { id: "e12", title: "Quarterly roadmap workshop", date: "2026-09-30", type: "Meeting", projectId: "p7", time: "11:00 AM" },
];

export const notifications = [
  { id: "n1", title: "Mia Johnson mentioned you", body: "In \"Implement API integration\"", at: "12m ago" },
  { id: "n2", title: "Task due soon", body: "Homepage UI review is due today", at: "1h ago" },
  { id: "n3", title: "Checkout load testing blocked", body: "Liam Davis reported a blocker", at: "3h ago" },
];

export const burndown = [
  { day: "Aug 24", ideal: 100, actual: 100 }, { day: "Aug 27", ideal: 92, actual: 95 },
  { day: "Aug 30", ideal: 84, actual: 88 }, { day: "Sep 02", ideal: 76, actual: 79 },
  { day: "Sep 05", ideal: 68, actual: 72 }, { day: "Sep 08", ideal: 60, actual: 61 },
  { day: "Sep 11", ideal: 52, actual: 50 }, { day: "Sep 14", ideal: 44, actual: 41 },
  { day: "Sep 17", ideal: 36, actual: 34 }, { day: "Sep 20", ideal: 28, actual: 26 },
  { day: "Sep 23", ideal: 20, actual: 21 }, { day: "Sep 26", ideal: 12, actual: 14 },
  { day: "Sep 28", ideal: 0, actual: 8 },
];

export const velocity = [
  { sprint: "Aug 3–16", points: 32 }, { sprint: "Aug 17–30", points: 44 },
  { sprint: "Aug 31–13", points: 48 }, { sprint: "Sep 14–27", points: 40 },
  { sprint: "Sep 28–11", points: 58 },
];

export const timeByProject = [
  { name: "Website Redesign", hours: 42.25, pct: 33, color: "var(--color-primary)" },
  { name: "E-Commerce Platform", hours: 31.5, pct: 24, color: "var(--color-warning)" },
  { name: "Mobile Banking App", hours: 28.75, pct: 22, color: "var(--color-danger)" },
  { name: "Marketing Campaign Q4", hours: 16.33, pct: 13, color: "var(--color-success)" },
  { name: "Data Migration", hours: 9.9, pct: 8, color: "var(--color-muted-foreground)" },
];

export const completionTrend = [
  { week: "Wk 28", created: 34, completed: 26 }, { week: "Wk 29", created: 41, completed: 33 },
  { week: "Wk 30", created: 38, completed: 40 }, { week: "Wk 31", created: 45, completed: 37 },
  { week: "Wk 32", created: 36, completed: 44 }, { week: "Wk 33", created: 42, completed: 39 },
  { week: "Wk 34", created: 39, completed: 47 },
];

export const projectFiles = [
  { id: "f1", name: "Homepage_Notes.sketch", size: "2.4 MB", by: "u2", at: "Sep 8, 2026", type: "Design" },
  { id: "f2", name: "Homepage_References.pdf", size: "1.6 MB", by: "u2", at: "Sep 8, 2026", type: "PDF" },
  { id: "f3", name: "Brand_Guidelines_v3.pdf", size: "8.1 MB", by: "u9", at: "Sep 4, 2026", type: "PDF" },
  { id: "f4", name: "Content_Outline.docx", size: "312 KB", by: "u9", at: "Sep 2, 2026", type: "Document" },
  { id: "f5", name: "Accessibility_Audit.xlsx", size: "740 KB", by: "u6", at: "Aug 27, 2026", type: "Spreadsheet" },
  { id: "f6", name: "Launch_Checklist.md", size: "12 KB", by: "u5", at: "Aug 21, 2026", type: "Document" },
];

export const DEMO_EMAIL = "demo@projectmanager.com";
export const DEMO_PASSWORD = "Demo123!";
