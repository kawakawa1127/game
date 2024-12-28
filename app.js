if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
            console.log('Service Worker registration failed:', error);
        });
}

document.addEventListener('DOMContentLoaded', loadTasks);

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const priority = document.getElementById('priority').value;
    const taskText = taskInput.value;
    if (taskText === '') return;

    const taskList = document.getElementById('taskList');
    const taskItem = document.createElement('li');
    taskItem.className = `task ${priority}`;
    taskItem.innerHTML = `
        <span onclick="editTask(this)">${taskText}</span>
        <button onclick="toggleComplete(this)">完了</button>
        <button onclick="removeTask(this)">削除</button>
    `;
    taskList.appendChild(taskItem);
    saveTasks();
    taskInput.value = '';
}

function toggleComplete(button) {
    const taskItem = button.parentElement;
    taskItem.classList.toggle('completed');
    saveTasks();
}

function removeTask(button) {
    const taskItem = button.parentElement;
    taskItem.remove();
    saveTasks();
}

function editTask(span) {
    const newText = prompt('タスクを編集:', span.textContent);
    if (newText !== null) {
        span.textContent = newText;
        saveTasks();
    }
}

function saveTasks() {
    const tasks = [];
    document.querySelectorAll('.task').forEach(task => {
        tasks.push({
            text: task.querySelector('span').textContent,
            priority: task.classList.contains('high') ? 'high' : task.classList.contains('medium') ? 'medium' : 'low',
            completed: task.classList.contains('completed')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const taskList = document.getElementById('taskList');
        const taskItem = document.createElement('li');
        taskItem.className = `task ${task.priority}`;
        if (task.completed) taskItem.classList.add('completed');
        taskItem.innerHTML = `
            <span onclick="editTask(this)">${task.text}</span>
            <button onclick="toggleComplete(this)">完了</button>
            <button onclick="removeTask(this)">削除</button>
        `;
        taskList.appendChild(taskItem);
    });
}
