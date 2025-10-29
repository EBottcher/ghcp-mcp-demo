const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// In-memory storage for todos
let todos = [];
let nextId = 1;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Get all todos
app.get('/api/todos', (req, res) => {
    res.json(todos);
});

// Add a new todo
app.post('/api/todos', (req, res) => {
    const { text, priority } = req.body;
    
    if (!text || !priority) {
        return res.status(400).json({ error: 'Text and priority are required' });
    }
    
    const newTodo = {
        id: nextId++,
        text: text,
        priority: priority,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    todos.push(newTodo);
    res.status(201).json(newTodo);
});

// Delete a todo
app.delete('/api/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = todos.findIndex(todo => todo.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Todo not found' });
    }
    
    todos.splice(index, 1);
    res.status(204).send();
});

// Toggle todo completion
app.patch('/api/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const todo = todos.find(todo => todo.id === id);
    
    if (!todo) {
        return res.status(404).json({ error: 'Todo not found' });
    }
    
    todo.completed = !todo.completed;
    res.json(todo);
});

app.listen(PORT, () => {
    console.log(`Todo app running at http://localhost:${PORT}`);
});
