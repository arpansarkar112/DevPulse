# 🚼 DevPulse - API Backend

> **Live Deployment:** [https://assignment-dun-gamma.vercel.app/](https://assignment-dun-gamma.vercel.app/)

DevPulse is an internal tech issue and feature tracker built for software teams. It provides a secure, role-based API for developers and maintainers to report bugs, suggest features, and coordinate workflow resolutions.

## 🚀 Features

* **Role-Based Access Control (RBAC):** Strict permission layers for `contributor` and `maintainer` roles.
* **Secure Authentication:** JWT-based stateless authentication with securely hashed passwords using `bcrypt`.
* **Issue Management:** Full CRUD operations for bugs and feature requests, including dynamic status tracking.
* **Raw SQL Integration:** Direct database interactions using the native `pg` driver and connection pooling (Zero ORMs or Query Builders).
* **Serverless Ready:** Fully optimized for cloud deployment on Vercel using ES Modules.

## 🛠️ Technology Stack

* **Runtime:** Node.js (v24.x LTS)
* **Language:** Strict TypeScript
* **Framework:** Express.js
* **Database:** PostgreSQL (NeonDB/Supabase/ElephantSQL)
* **Security:** `jsonwebtoken`, `bcrypt`
* **Deployment:** Vercel

## 👥 User Roles & Permissions

The API enforces strict Role-Based Access Control (RBAC) across all protected routes.

| Role | Allowed Actions |
| :--- | :--- |
| **Contributor** | • Register and log in<br>• Create new issues (bug or feature request)<br>• View all issues<br>• Update own issue field |
| **Maintainer** | • All contributor permissions<br>• Update any issue field<br>• Delete any issue<br>• Change issue workflow status independently |

## 🗄️ Database Schema Summary

The database consists of two primary relational tables:

### `users`
* `id` (Primary Key, Auto-increment)
* `name` (String, required)
* `email` (String, unique, required)
* `password` (String, hashed, required)
* `role` (Enum: `contributor`, `maintainer`)
* `created_at` / `updated_at` (Timestamps)

### `issues`
* `id` (Primary Key, Auto-increment)
* `title` (String, max 150 chars, required)
* `description` (Text, min 20 chars, required)
* `type` (Enum: `bug`, `feature_request`)
* `status` (Enum: `open`, `in_progress`, `resolved`)
* `reporter_id` (References `users.id`)
* `created_at` / `updated_at` (Timestamps)

## 🌐 API Endpoints Specification

### Authentication Module
* `POST /api/auth/signup` - Register a new user (`contributor` or `maintainer`).
* `POST /api/auth/login` - Authenticate user and receive a JWT.

### Issues Module
* `POST /api/issues` - Create a new bug report or feature request (Requires Auth).
* `GET /api/issues` - Retrieve all issues with optional sorting and filtering (Public).
* `GET /api/issues/:id` - Retrieve full details of a specific issue (Public).
* `PATCH /api/issues/:id` - Update an issue (Requires `Maintainer`, or `Contributor` if they own the open issue).
* `DELETE /api/issues/:id` - Permanently remove an issue (Requires `Maintainer`).

## 💻 Local Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/arpansarkar112/DevPulse.git](https://github.com/arpansarkar112/DevPulse.git)
   cd DevPulse
