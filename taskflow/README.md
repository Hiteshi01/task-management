# TaskFlow — Java Full Stack Project Management

A modern task & project management app built with **Spring Boot 3** + **React 18**.

## Tech Stack

| Layer     | Technology                                     |
|-----------|------------------------------------------------|
| Backend   | Spring Boot 3, Spring Security, Spring Data JPA |
| Auth      | JWT (jjwt), BCrypt                             |
| Database  | H2 (dev) — swap to PostgreSQL/MySQL for prod   |
| Frontend  | React 18, Vite, TailwindCSS, React Router v6   |
| HTTP      | Axios, REST API                                |

## Features

- **Auth** — JWT login / register with BCrypt passwords
- **Projects** — Create, update, delete projects with emoji + color
- **Kanban Board** — Drag-and-drop tasks across `TODO → IN PROGRESS → IN REVIEW → DONE`
- **Task Management** — Priority levels, due dates, assignees
- **Dashboard** — Stats overview, project progress, upcoming tasks
- **My Tasks** — Filtered view of assigned tasks

## Quick Start

### Backend
```bash
cd backend
./mvnw spring-boot:run
# API runs on http://localhost:8080
# H2 console: http://localhost:8080/h2-console
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# UI runs on http://localhost:3000
```

### Demo Login
```
Username: demo
Password: demo123
```

## Project Structure

```
taskflow/
├── backend/                     # Spring Boot app
│   └── src/main/java/com/taskflow/
│       ├── config/              # Security, CORS, DataSeeder
│       ├── controller/          # REST endpoints
│       ├── dto/                 # Request/Response DTOs
│       ├── entity/              # JPA entities
│       ├── enums/               # TaskStatus, Priority
│       ├── exception/           # GlobalExceptionHandler
│       ├── repository/          # Spring Data repos
│       ├── security/            # JWT utils & filter
│       └── service/             # Business logic
│
└── frontend/                    # React SPA
    └── src/
        ├── api/                 # Axios client
        ├── components/          # Reusable UI components
        │   ├── layout/          # Sidebar/Layout
        │   ├── projects/        # NewProjectModal
        │   └── tasks/           # TaskCard, NewTaskModal
        ├── context/             # AuthContext
        └── pages/               # Dashboard, Project, MyTasks
```

## API Endpoints

| Method | Path                         | Description        |
|--------|------------------------------|--------------------|
| POST   | `/api/auth/register`         | Register           |
| POST   | `/api/auth/login`            | Login → JWT        |
| GET    | `/api/projects`              | My projects        |
| POST   | `/api/projects`              | Create project     |
| PUT    | `/api/projects/:id`          | Update project     |
| DELETE | `/api/projects/:id`          | Delete project     |
| GET    | `/api/tasks/project/:id`     | Tasks by project   |
| GET    | `/api/tasks/my`              | My assigned tasks  |
| POST   | `/api/tasks`                 | Create task        |
| PATCH  | `/api/tasks/:id`             | Update task        |
| DELETE | `/api/tasks/:id`             | Delete task        |

## Production Swap (PostgreSQL)

Replace in `application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/taskflow
spring.datasource.username=your_user
spring.datasource.password=your_pass
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
```
Add PostgreSQL driver to `pom.xml`:
```xml
<dependency>
  <groupId>org.postgresql</groupId>
  <artifactId>postgresql</artifactId>
  <scope>runtime</scope>
</dependency>
```
