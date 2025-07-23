require('dotenv').config();

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  res.header("Cache-Control", "no-cache, no-store, must-revalidate");
  res.header("Pragma", "no-cache");
  res.header("Expires", "0");
  next();
});

let users = [];
let tasks = [];
let taskIdCounter = 1;
let userIdCounter = 1;

app.get("/", (req, res) => {
  res.json({ message: "Task Manager API is running!" });
});

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    console.log("Signup request:", { email, name });

    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      id: userIdCounter++,
      email,
      name: name || "User",
      password: hashedPassword,
    };
    users.push(user);

    console.log("User created:", {
      id: user.id,
      email: user.email,
      name: user.name,
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);

    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login request:", { email });

    const user = users.find((u) => u.email === email);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("User logged in:", { id: user.id, email: user.email });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);

    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

const authenticate = (req, res, next) => {
  console.log("=== AUTHENTICATE MIDDLEWARE ===");
  console.log("Request headers:", req.headers);
  console.log("Authorization header:", req.header("Authorization"));

  const token = req.header("Authorization")?.replace("Bearer ", "");
  console.log("Extracted token:", token);

  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ message: "Access denied" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Token decoded successfully:", decoded);
    req.userId = decoded.userId;
    console.log("Set req.userId to:", req.userId);
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    res.status(401).json({ message: "Invalid token" });
  }
};

app.get("/api/tasks/:id", authenticate, (req, res) => {
  const taskId = parseInt(req.params.id);
  const userId = req.userId;
  console.log(`=== GET /api/tasks/${taskId} called ===`);
  const task = tasks.find((t) => t.id === taskId && t.userId === userId);
  if (!task) {
    console.log("Task not found or user mismatch");
    return res.status(404).json({ message: "Task not found" });
  }
  res.json(task);
});

app.get("/api/tasks", authenticate, (req, res) => {
  console.log("=== GET /api/tasks called ===");
  console.log("User ID from token:", req.userId);
  console.log("Tasks array length:", tasks.length);
  console.log("All tasks in memory:", tasks);

  if (!req.userId) {
    console.log("No user ID found");
    return res.status(400).json({ message: "Bad request, no user ID" });
  }

  try {
    console.log("About to filter tasks...");
    const userTasks = tasks.filter((task) => task.userId === req.userId);
    console.log(`Fetching tasks for user ${req.userId}:`, userTasks.length);
    console.log("User tasks:", userTasks);

    console.log("About to send response...");
    res.json(userTasks);
    console.log("Response sent successfully");
  } catch (error) {
    console.error("Error in GET /api/tasks:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/api/tasks", authenticate, (req, res) => {
  console.log("=== POST /api/tasks called ===");
  console.log("User ID from token:", req.userId);
  console.log("Request body:", req.body);

  const { title, description } = req.body;

  const task = {
    id: taskIdCounter++,
    title,
    description,
    completed: false,
    userId: req.userId,
    createdAt: new Date(),
  };

  tasks.push(task);
  console.log("Task created:", task);
  res.json(task);
});

app.put("/api/tasks/:id", authenticate, (req, res) => {
  console.log("=== PUT /api/tasks/:id called ===");
  console.log("Task ID:", req.params.id);
  console.log("User ID from token:", req.userId);
  console.log("Request body:", req.body);

  const taskId = parseInt(req.params.id);
  const { title, description, completed } = req.body;

  const taskIndex = tasks.findIndex(
    (t) => t.id === taskId && t.userId === req.userId
  );
  if (taskIndex === -1) {
    console.log("Task not found or user mismatch");
    return res.status(404).json({ message: "Task not found" });
  }

  tasks[taskIndex] = { ...tasks[taskIndex], title, description, completed };
  console.log("Task updated:", tasks[taskIndex]);
  res.json(tasks[taskIndex]);
});

app.patch("/api/tasks/:id/complete", authenticate, (req, res) => {
  const taskId = parseInt(req.params.id);

  console.log(`=== PATCH /api/tasks/${taskId}/complete ===`);
  console.log("User ID from token:", req.userId);
  console.log(
    "All tasks:",
    tasks.map((t) => ({ id: t.id, userId: t.userId, title: t.title }))
  );

  const taskIndex = tasks.findIndex(
    (t) => t.id === taskId && t.userId === req.userId
  );
  console.log("Found task index:", taskIndex);

  if (taskIndex === -1) {
    console.log("Task not found or user mismatch");
    return res.status(404).json({ message: "Task not found" });
  }

  tasks[taskIndex].completed = true;
  tasks[taskIndex].completedAt = new Date();

  console.log("Task completed:", tasks[taskIndex]);
  res.json(tasks[taskIndex]);
});

app.delete("/api/tasks/:id", authenticate, (req, res) => {
  console.log("=== DELETE /api/tasks/:id called ===");
  console.log("Task ID:", req.params.id);
  console.log("User ID from token:", req.userId);

  const taskId = parseInt(req.params.id);

  const taskIndex = tasks.findIndex(
    (t) => t.id === taskId && t.userId === req.userId
  );
  if (taskIndex === -1) {
    console.log("Task not found or user mismatch");
    return res.status(404).json({ message: "Task not found" });
  }

  tasks.splice(taskIndex, 1);
  console.log("Task deleted:", taskId);
  res.json({ message: "Task deleted" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log("API endpoints:");
  console.log("- POST /api/auth/signup");
  console.log("- POST /api/auth/login");
  console.log("- GET /api/tasks");
  console.log("- POST /api/tasks");
  console.log("- PUT /api/tasks/:id");
  console.log("- PATCH /api/tasks/:id/complete");
  console.log("- DELETE /api/tasks/:id");
});
