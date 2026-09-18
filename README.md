# Flowspace Project Hub

I want you to build a high quality, production style FRONTEND DEMO of a PROJECT MANAGEMENT web application based on the project management system design and visual direction I am providing.named flowspace 

IMPORTANT:

The provided design/reference is the primary source of truth for the visual design.

Do NOT redesign the interface.
Do NOT create a generic project management dashboard.
Do NOT simplify the screens.
Do NOT add unnecessary visual elements.
Do NOT make it look like a generic AI generated SaaS template.

Your job is to carefully analyze the provided reference design and recreate its visual language, layout quality, colors, spacing, typography, components, navigation patterns, and overall product feel while adapting the application specifically to the PROJECT MANAGEMENT niche.

The final result must feel like a real production ready project management SaaS product that I can show to potential clients as a live product demo.

==================================================
1. PROJECT GOAL
==================================================

Build a realistic PROJECT MANAGEMENT SaaS frontend that demonstrates how teams can plan, manage, track, collaborate on, and complete projects from one platform.

This is a FRONTEND ONLY portfolio/demo application.

There is NO real backend required.

Use realistic fictional mock data throughout the application.

The final result should feel like a real project management product rather than a collection of static screens.

The client should be able to:

- log in
- navigate between sections
- open projects
- create projects
- view project details
- create tasks
- assign tasks
- update task status
- search
- filter
- sort
- switch between project views
- open task details
- open dropdowns
- open modals
- interact with forms
- manage team members
- view project progress
- view deadlines
- view activity
- interact with dashboards
- see realistic success and error states

All functionality can use local mock data and frontend state.

==================================================
2. DESIGN DIRECTION
==================================================

First analyze the provided project management reference carefully.

Identify the visual design system including:

- primary colors
- secondary colors
- accent colors
- background colors
- typography
- font sizes
- font weights
- sidebar styling
- header styling
- card styling
- table styling
- button styling
- badges
- status colors
- borders
- border radius
- shadows
- spacing
- padding
- margins
- icon style
- tabs
- filters
- dropdowns
- modals
- forms
- progress indicators
- charts
- empty states
- hover states
- responsive behavior

The PROJECT MANAGEMENT niche should be immediately understandable from the interface.

Use a professional SaaS visual language suitable for:

- project managers
- agencies
- software development teams
- marketing teams
- operations teams
- remote teams
- business teams

Do not make it playful or overly consumer focused.

Do not use:

- unnecessary gradients
- glassmorphism
- floating blobs
- excessive shadows
- random illustrations
- excessive animations
- decorative AI generated elements

unless they clearly match the provided reference design.

The application should look polished, structured, professional, and trustworthy.

==================================================
3. BRAND COLORS
==================================================

Use the colors and visual character of the provided project management reference as the foundation.

Maintain the same overall color family throughout the application.

Create a consistent color system for:

- primary actions
- secondary actions
- navigation
- backgrounds
- cards
- borders
- text
- muted text
- project status
- task status
- priority indicators
- progress indicators
- notifications

Do not randomly introduce unrelated colors.

If the reference uses a specific primary color, preserve that color as the main brand color.

If additional colors are required for statuses, use them carefully and consistently.

==================================================
4. APPLICATION STRUCTURE
==================================================

Create a realistic project management application structure.

Use React Router or an equivalent routing solution.

Suggested routes:

/login

/dashboard

/projects

/projects/:id

/projects/:id/overview

/projects/:id/tasks

/projects/:id/board

/projects/:id/calendar

/projects/:id/files

/tasks

/my-tasks

/team

/calendar

/reports

/activity

/settings

Adapt the routes according to the actual screens and structure represented in the provided reference.

The sidebar navigation must work.

Clicking a navigation item must navigate to the correct page.

Do not create dead navigation items.

==================================================
5. LOGIN
==================================================

If the provided reference contains a login screen, recreate it closely.

The login should be functional on the frontend.

Use demo credentials:

Email:
demo@projectmanager.com

Password:
Demo123!

When valid credentials are submitted:

- show a short loading state
- navigate to the dashboard

When incorrect credentials are entered:

- show a professional error message

There is no real authentication backend.

Use frontend state only.

If the reference does not contain a login screen, create only a simple login experience that follows the established visual language.

Do not invent an unnecessarily complicated authentication system.

==================================================
6. DASHBOARD
==================================================

Create a realistic project management dashboard.

The dashboard should provide an immediate overview of the organization's work.

Possible statistics:

Active Projects
24

Completed Projects
86

Open Tasks
148

Overdue Tasks
12

Team Members
38

Overall Progress
74%

Use realistic mock data.

Do not blindly use these numbers if the reference design suggests a different information hierarchy.

The dashboard may include:

- project overview
- project progress
- task statistics
- overdue tasks
- upcoming deadlines
- team workload
- recent activity
- productivity metrics
- upcoming milestones
- project status distribution
- task completion trends

Charts should use realistic mock data and visually match the established design language.

Charts must be functional enough for a client demonstration.

==================================================
7. PROJECTS
==================================================

Create a complete project management project listing.

Each project can contain:

- Project name
- Project ID
- Client
- Project manager
- Team members
- Start date
- Deadline
- Status
- Priority
- Progress
- Number of tasks
- Completed tasks
- Budget
- Last activity

Use fictional projects such as:

Website Redesign
Mobile Banking App
CRM Development
Marketing Campaign
E Commerce Platform
Healthcare Portal
AI Automation Platform
Internal Operations System

All information must be fictional.

Implement:

- search
- filtering
- sorting
- status filtering
- priority filtering
- project row/card click
- pagination if appropriate
- create project
- edit project
- project details

==================================================
8. PROJECT DETAIL PAGE
==================================================

The project detail page is one of the most important parts of the application.

Create a realistic project workspace.

It should include relevant information such as:

- project name
- project description
- project manager
- team members
- project status
- project progress
- deadline
- milestones
- task completion
- recent activity

Provide tabs or navigation such as:

Overview
Tasks
Board
Calendar
Files
Activity

Only include sections that fit the established product structure.

Each section must be interactive.

==================================================
9. TASK MANAGEMENT
==================================================

Create realistic fictional tasks.

Each task should support:

- task title
- description
- assignee
- reporter
- priority
- status
- due date
- project
- tags
- estimated time
- actual time
- comments
- attachments
- subtasks

Example task statuses:

To Do
In Progress
In Review
Blocked
Completed

Example priorities:

Low
Medium
High
Urgent

Allow users to:

- create a task
- edit a task
- assign a task
- change status
- change priority
- set due date
- open task details
- add comments
- create subtasks
- mark subtasks complete
- delete a task
- filter tasks
- search tasks

All interactions should work through local frontend state.

==================================================
10. KANBAN BOARD
==================================================

If the project management reference supports a board view, recreate it accurately.

Create columns such as:

To Do
In Progress
In Review
Completed

Each task card should display appropriate information such as:

- task title
- assignee
- priority
- due date
- comments
- subtasks
- tags

Allow basic frontend interactions such as:

- moving a task between statuses
- opening task details
- updating priority
- assigning users

Use drag and drop if appropriate.

If drag and drop is implemented, ensure it works correctly and does not create visual bugs.

==================================================
11. CALENDAR
==================================================

Create a realistic project calendar.

Display:

- project deadlines
- task deadlines
- milestones
- meetings
- important dates

Allow users to:

- switch between available calendar views
- select dates
- open event details
- create a mock event if supported by the reference
- edit event information
- delete mock events

Use frontend state only.

==================================================
12. TEAM MANAGEMENT
==================================================

Create a realistic team management page.

Each team member can include:

- name
- role
- department
- avatar
- active projects
- assigned tasks
- workload
- status

Example roles:

Project Manager
Product Manager
UI/UX Designer
Frontend Developer
Backend Developer
QA Engineer
Marketing Manager

All people must be fictional.

Do not use real people's personal information.

Allow users to:

- search team members
- filter by role
- open member details
- view assigned projects
- view assigned tasks

==================================================
13. MY TASKS
==================================================

Create a dedicated My Tasks section.

Show tasks assigned to the current demo user.

Include:

- task title
- project
- priority
- status
- due date
- progress
- comments

Allow:

- search
- filtering
- sorting
- status changes
- task detail opening

Include useful sections such as:

Today
Upcoming
Overdue
Completed

if they fit the reference design.

==================================================
14. REPORTS AND ANALYTICS
==================================================

Create realistic project management reporting.

Possible reports:

- project progress
- task completion
- overdue tasks
- team workload
- productivity
- project status
- time tracking
- milestone completion

Use charts and tables where appropriate.

Charts should use realistic mock data.

Do not overload the page with unnecessary charts.

Follow the established visual hierarchy.

==================================================
15. ACTIVITY
==================================================

Create a realistic activity feed.

Example activity:

Sarah completed "Homepage UI Design"

Daniel moved "API Integration" to In Review

Emily created a new task

Michael updated the project deadline

Team member was assigned to Website Redesign

Activity should appear realistic and chronological.

Use fictional users and projects.

==================================================
16. FORMS
==================================================

Any forms visible in the reference should be fully interactive.

Users should be able to:

- type
- select options
- choose dates
- select team members
- upload simulated files if appropriate
- toggle switches
- submit

On successful submission:

show a professional success toast.

Examples:

"Project created successfully"

"Task updated successfully"

"Team member assigned successfully"

"Changes saved successfully"

Do not send any data to an external server.

Use local frontend state.

==================================================
17. MODALS AND INTERACTIONS
==================================================

Any visible:

- modal
- drawer
- dropdown
- confirmation dialog
- tooltip
- popup
- menu
- filter panel

must be implemented properly.

They must open and close correctly.

Do not create visual buttons that do nothing.

When users perform actions such as:

- Save
- Update
- Create
- Delete
- Assign
- Complete
- Move
- Send

show an appropriate frontend response.

==================================================
18. MOCK DATA
==================================================

Create a centralized mock data layer.

Do NOT hardcode large amounts of repeated data directly inside components.

Create reusable mock data for:

- projects
- tasks
- team members
- milestones
- calendar events
- activity
- reports
- dashboard statistics
- notifications
- comments

All data must be fictional.

Create enough data to make the application feel populated and realistic.

Avoid repetitive names and obviously fake placeholder content such as:

John Doe
Test Project
Lorem Ipsum
Task 1
Task 2

Use realistic business data.

==================================================
19. RESPONSIVE DESIGN
==================================================

Desktop should be the primary priority because this is a project management SaaS dashboard.

Also support:

- tablet
- mobile

On smaller screens:

- sidebar should collapse appropriately
- navigation should remain accessible
- cards should stack
- tables should remain usable
- Kanban should remain horizontally scrollable
- forms should resize properly
- filters should remain usable
- modals should fit the viewport

Do not destroy the desktop layout just to make the application responsive.

==================================================
20. TECHNOLOGY
==================================================

Build the application using:

- React
- TypeScript
- Tailwind CSS
- React Router
- modern reusable React components
- Lucide icons or another consistent professional icon library

Use a clean component based architecture.

Create reusable components for:

- Sidebar
- Header
- Cards
- Buttons
- Tables
- Filters
- Search
- Status badges
- Priority badges
- Modals
- Forms
- Toast notifications
- Project cards
- Task cards
- User avatars
- Progress indicators
- Charts

Do not use random emoji icons.

Do not use random external images.

Use professional placeholder avatars where necessary.

==================================================
21. UX QUALITY
==================================================

The application should feel like a real SaaS product.

Avoid:

- dead buttons
- empty pages
- broken navigation
- unrealistic placeholder content
- duplicated components
- inconsistent spacing
- inconsistent typography
- broken responsive layouts
- missing hover states
- missing loading states
- missing feedback
- visual inconsistencies

Every important interaction should have a meaningful response.

==================================================
22. ACCESSIBILITY
==================================================

Use:

- semantic HTML
- accessible buttons
- keyboard friendly interactions
- proper labels
- sufficient text contrast
- focus states
- accessible form fields
- meaningful status labels

Do not rely only on color to communicate task or project status.

==================================================
23. PERFORMANCE
==================================================

Keep the application lightweight.

Avoid unnecessary libraries.

Use reusable components.

Do not load huge assets unnecessarily.

Optimize images.

Do not create a backend.

Do not create:

- real authentication
- real database
- real payment processing
- real project management integrations
- real email functionality
- real notifications backend
- real file storage

Everything should remain frontend-only.

==================================================
24. FINAL VISUAL QA
==================================================

After building the complete application, perform a full visual and functional QA pass.

Check every route and every major interaction.

Look for:

- broken navigation
- dead buttons
- empty pages
- incorrect links
- inconsistent spacing
- inconsistent typography
- missing hover states
- broken responsive layouts
- overlapping elements
- incorrect sizing
- poor alignment
- unreadable text
- broken modals
- broken dropdowns
- broken filters
- broken forms
- missing loading states
- unrealistic placeholder content
- duplicated components
- inconsistent colors
- inconsistent status badges
- console errors

Fix these issues without changing the established visual design.

==================================================
25. MOST IMPORTANT REQUIREMENT
==================================================

FIRST analyze the provided project management reference as a complete design system.

Do not treat individual screens as unrelated pages.

Identify the common:

- color system
- typography
- spacing
- component styles
- navigation
- buttons
- cards
- tables
- forms
- badges
- icons
- interaction patterns

Then implement the entire project management application using that shared design system.

The final application should look like ONE cohesive product.

It should NOT look like:

- an AI generated template
- a generic admin dashboard
- a basic Tailwind starter
- a collection of unrelated pages
- an unfinished prototype

It should look like a polished, production quality PROJECT MANAGEMENT SaaS application.

Most importantly:

FOLLOW THE PROVIDED DESIGN REFERENCE.

Preserve its visual character, color direction, spacing, hierarchy, and professional feel.

Adapt the content and functionality specifically to PROJECT MANAGEMENT.

Start by analyzing the complete reference and then build the full interactive frontend application.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/797bda59-b63e-4af2-8eee-dba1bcd9b31a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
