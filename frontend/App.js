import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
    const [tasks, setTasks] = useState([]);
    const [taskText, setTaskText] = useState('');

    useEffect(() => {
        axios.get('http://localhost:5000/tasks')
            .then(res => setTasks(res.data))
            .catch(err => console.error(err));
    }, []);

    const addTask = () => {
        if (!taskText) return;
        axios.post('http://localhost:5000/tasks', { text: taskText, completed: false })
            .then(res => setTasks([...tasks, res.data]))
            .catch(err => console.error(err));
        setTaskText('');
    };

    const deleteTask = (id) => {
        axios.delete(`http://localhost:5000/tasks/${id}`)
            .then(() => setTasks(tasks.filter(task => task._id !== id)))
            .catch(err => console.error(err));
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h2>To-Do List</h2>
            <input 
                type="text" 
                value={taskText} 
                onChange={(e) => setTaskText(e.target.value)} 
                placeholder="Add a task..." 
            />
            <button onClick={addTask}>Add</button>
            <ul>
                {tasks.map(task => (
                    <li key={task._id}>
                        {task.text} 
                        <button onClick={() => deleteTask(task._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;
