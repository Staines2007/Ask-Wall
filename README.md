# Ask Wall

## What It Does

Ask Wall is a web application that allows users to anonymously post questions on a shared public wall. Users can view questions, participate in discussions, and share answers in a simple and interactive environment.

## Core Screens

### Home Screen

Displays the application title and navigation options.

### Ask Question Screen

Allows users to submit a question anonymously.

### Question Wall Screen

Displays all submitted questions.

### Question Details Screen

Shows a selected question and its answers.
## Features

### Authentication

The application supports user authentication.

- User Registration
- User Login
- User Logout
- Current User Profile

Authentication APIs:

- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/me

### CRUD Operations

The application supports full CRUD operations for Questions.

Create:
- POST /api/questions

Read:
- GET /api/questions
- GET /api/questions/:id

Update:
- PUT /api/questions/:id

Delete:
- DELETE /api/questions/:id

### Deployment

The project includes a Dockerfile for deployment.

Build:

```bash
docker build -t ask-wall .
```

Run:

```bash
docker run -p 3000:3000 ask-wall
```