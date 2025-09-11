# Join – Kanban Task Management (Learning Project)

**Join** is a Kanban-based task management tool. It offers registration/login, contact management, and a board where tasks can be created, prioritized, moved between columns, and assigned to people. The data is stored in a **Firebase Realtime Database**. The project is built purely with **HTML, CSS, and JavaScript**.

---

## About the project

**About**  
Join is a Kanban-based task management tool built as part of a training course. It provides registration/login, contacts, and a board where tasks can be created, prioritized, moved, assigned to people, and more. Data persistence is handled by a Firebase Realtime Database.

**Project structure & code quality**  
Implemented exclusively with HTML, CSS, and JavaScript. Clear module structure (Summary / Add Task / Board / Contacts), reusable render templates and utilities (e.g., Overlay, Toast). Data access is encapsulated behind a generic REST wrapper. JSDoc and consistent naming improve readability and maintainability.

---

## Features

- **Task management**: Create, edit, delete tasks; **subtasks** with progress tracking.
- **Drag & drop**: Move tasks across columns (To Do, In Progress, Awaiting Feedback, Done).
- **Priorities & categories**: e.g., Urgent / Medium / Low; User Story, Technical Task.
- **Assignments**: Assign tasks to contacts.
- **Contacts**: Contact management.
- **Search & filter**: Find tasks by keyword.
- **Due dates**: Set and display deadlines on board/details.
- **Overlays & toasts**: Interactive overlays (Add/Edit/Details/Move) and feedback toasts.
- **Summary/analytics**: Overview page with key metrics.
- **Responsive UI**: Desktop-first with sensible breakpoints.
- **Persistence**: Firebase Realtime Database (read/write).

---

## Architecture & key files

- **Pages (module-oriented)**  
  `/html/summary.html`, `/html/add-task.html`, `/html/board.html`, `/html/contacts.html`  
  Legal/public: `/html/privacy-policy.html`, `/html/legal-notice.html`  
  Landing/Login: `/index.html`

- **Templates** (included via `includeHTML()`)  
  `/assets/templates/header.html`, `/assets/templates/sidebar.html`

- **Scripts (selected)**  
  - `/script/authentication.js` – Access control
  - `/script/log-in.js` – login flow (sets `sessionStorage.isLoggedIn`)  
  - Module/UI scripts for Board, Add Task, Contacts, Summary  
  - Utilities/renderers (e.g., Overlay, Toast)  
  - Generic **REST wrapper** for DB access

> **Templating note:** `includeHTML()` fetches header/sidebar; afterwards the auth runs so public pages can hide app-only UI.

---

## Authentication

Authentication is handled via **Session Storage**.

- On successful login, set **`sessionStorage.setItem('isLoggedIn', 'true')`** and redirect to `/html/summary.html`.
- The **access control** (`checkAccess()` in `authentication.js`) enforces access:
  - **Protected pages** → redirect to `/index.html` when not logged in.
  - **Public pages** → content remains visible; app UI (sidebar/account menu) is hidden.
- **Public routes**: `/html/privacy-policy.html`, `/html/legal-notice.html`
- **UI conventions** used by the guard when not logged in:
  - `#sidebar-main.links-container` → class replaced with `dni`
  - `#account-menue` → class `dni` added

> ⚠️ **Learning project disclaimer:** A session-storage-only approach is not secure and is used here solely for client-side routing/visibility.