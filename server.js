const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'your-secret-key';

app.use(cors());
app.use(express.json());

let users = [];
let tasks = [];
let taskIdCounter = 1;
let userIdCounter = 1;

app.get('/', (req, res) => {
  res.json({ message: 'Task Manager API is running!' });
});

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    console.log('Signup request:', { email, name });
        
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
        
    const hashedPassword = await bcrypt.hash(password, 10);
        
    const user = {
      id: userIdCounter++,
      email,
      name: name || 'User',
      password: hashedPassword
    };
    users.push(user);
    
    console.log('User created:', { id: user.id, email: user.email, name: user.name });
        
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    
    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login request:', { email });
    
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
        
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    console.log('User logged in:', { id: user.id, email: user.email });
        
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    
    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

app.get('/api/tasks', authenticate, (req, res) => {
	if (!req.userId){
		console.log (`Received bad request for null user ID ${JSON.stringify(req)}`);
		res.status(400).json({ message: 'Bad request, no user ID'})
  }
  try {
		console.log(`Received GET request for task: ${JSON.stringify(req)}`);
		const userTasks = tasks.filter(task => task.userId === req.userId); 
		console.log(`Fetching tasks for user ${req.userId}:`, userTasks.length);
		if (userTasks.length === 0 ) {
			res.status(404).json({ message: "User has no Tasks"});
		}
		res.json(userTasks);
	} catch (error){
		res.status(500).json({ message: 'Server Error'});
	}
});

app.post('/api/tasks', authenticate, (req, res) => {
  const { title, description } = req.body;
  
  const task = {
    id: taskIdCounter++,
    title,
    description,
    completed: false,
    userId: req.userId,
    createdAt: new Date()
  };
  
  tasks.push(task);
  console.log('Task created:', task);
  res.json(task);
});

app.put('/api/tasks/:id', authenticate, (req, res) => {
  const taskId = parseInt(req.params.id);
  const { title, description, completed } = req.body;
  
  const taskIndex = tasks.findIndex(t => t.id === taskId && t.userId === req.userId);
  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }
  
  tasks[taskIndex] = { ...tasks[taskIndex], title, description, completed };
  console.log('Task updated:', tasks[taskIndex]);
  res.json(tasks[taskIndex]);
});

app.patch('/api/tasks/:id/complete', authenticate, (req, res) => {
  const taskId = parseInt(req.params.id);
  
  console.log(`=== PATCH /api/tasks/${taskId}/complete ===`);
  console.log('User ID from token:', req.userId);
  console.log('All tasks:', tasks.map(t => ({ id: t.id, userId: t.userId, title: t.title })));
  
  const taskIndex = tasks.findIndex(t => t.id === taskId && t.userId === req.userId);
  console.log('Found task index:', taskIndex);
  
  if (taskIndex === -1) {
    console.log('❌ Task not found or user mismatch');
    return res.status(404).json({ message: 'Task not found' });
  }
  
  tasks[taskIndex].completed = true;
  tasks[taskIndex].completedAt = new Date();
  
  console.log('✅ Task completed:', tasks[taskIndex]);
  res.json(tasks[taskIndex]);
});

app.delete('/api/tasks/:id', authenticate, (req, res) => {
  const taskId = parseInt(req.params.id);
  
  const taskIndex = tasks.findIndex(t => t.id === taskId && t.userId === req.userId);
  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }
  
  tasks.splice(taskIndex, 1);
  console.log('Task deleted:', taskId);
  res.json({ message: 'Task deleted' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('API endpoints:');
  console.log('- POST /api/auth/signup');
  console.log('- POST /api/auth/login');
  console.log('- GET /api/tasks');
  console.log('- POST /api/tasks');
  console.log('- PUT /api/tasks/:id');
  console.log('- PATCH /api/tasks/:id/complete'); 
  console.log('- DELETE /api/tasks/:id');
});
