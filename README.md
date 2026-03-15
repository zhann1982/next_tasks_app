# Next Tasks App

A simple tasks app built with **Next.js**, **TypeScript**, **MongoDB**, and custom cookie-based authentication.

Users can:

- register
- log in
- create tasks
- mark tasks as completed
- delete tasks
- log out

Each user can only see and manage their own tasks.

---

## Tech Stack

- Next.js
- TypeScript
- MongoDB Node.js Driver
- bcryptjs
- Cookie-based session auth

---

## Requirements

Before running this project, make sure you have installed:

- **Node.js**
- **npm**
- **MongoDB Community Server** or another running MongoDB instance
- **MongoDB Compass** (optional, but recommended for viewing your database)

---

## Installation and Setup

Install project dependencies:

```bash
npm install


```
```

### Setting up MongoDB

1. **Start MongoDB**  
    Make sure your MongoDB server is running locally or use a cloud MongoDB provider (like MongoDB Atlas).

2. **Create a Database**  
    You can use MongoDB Compass or the CLI to create a database (e.g., `next_tasks_app`).

### Environment Variables

Create a `.env.local` file in the root of your project with the following content:

```
MONGODB_URI=mongodb://localhost:27017/next_tasks_app
JWT_SECRET=your_jwt_secret_here
```

- Replace `MONGODB_URI` with your actual MongoDB connection string if using a remote database.
- Set `JWT_SECRET` to a strong, random string for signing authentication tokens.