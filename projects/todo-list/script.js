let tasks = JSON.parse(localStorage.getItem('advancedTasks')) || [];
let filter = 'all';
let currentEditId = null;

// Initialize Date
document.getElementById('date-now').innerText = new Date().toDateString();

function addTask() {
    const textInput = document.getElementById('task-input');
    const priorityInput = document.getElementById('priority-input');
    const dateInput = document.getElementById('date-input');

    if (!textInput.value) return alert("Enter task description!");

    const newTask = {
        id: Date.now(),
        text: textInput.value,
        priority: priorityInput.value,
        dueDate: dateInput.value || 'No Date',
        completed: false
    };

    tasks.push(newTask);
    textInput.value = '';
    saveData();
}

function renderTasks() {
    const list = document.getElementById('task-list');
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    list.innerHTML = '';

    let filtered = tasks.filter(t => t.text.toLowerCase().includes(searchTerm));
    if (filter === 'pending') filtered = filtered.filter(t => !t.completed);
    if (filter === 'completed') filtered = filtered.filter(t => t.completed);

    filtered.forEach(t => {
        const li = document.createElement('li');
        li.className = `task-item ${t.priority} ${t.completed ? 'done' : ''}`;
        li.innerHTML = `
            <div class="task-info">
                <h4>${t.text}</h4>
                <span><i class="far fa-calendar-alt"></i> ${t.dueDate} | Priority: ${t.priority.toUpperCase()}</span>
            </div>
            <div class="task-actions">
                <i class="fas fa-check-circle" onclick="toggleTask(${t.id})"></i>
                <i class="fas fa-edit" onclick="openEdit(${t.id})"></i>
                <i class="fas fa-trash" onclick="deleteTask(${t.id})"></i>
            </div>
        `;
        list.appendChild(li);
    });
    updateProgress();
}

function toggleTask(id) {
    tasks = tasks.map(t => t.id === id ? {...t, completed: !t.completed} : t);
    saveData();
}

function deleteTask(id) {
    if(confirm("Remove this task?")) {
        tasks = tasks.filter(t => t.id !== id);
        saveData();
    }
}

// Update Logic
function openEdit(id) {
    currentEditId = id;
    const task = tasks.find(t => t.id === id);
    document.getElementById('edit-text').value = task.text;
    document.getElementById('edit-modal').classList.remove('hidden');
}

function saveUpdate() {
    const newText = document.getElementById('edit-text').value;
    tasks = tasks.map(t => t.id === currentEditId ? {...t, text: newText} : t);
    closeModal();
    saveData();
}

function closeModal() {
    document.getElementById('edit-modal').classList.add('hidden');
}

function updateProgress() {
    const completed = tasks.filter(t => t.completed).length;
    const total = tasks.length;
    const pc = total === 0 ? 0 : Math.round((completed / total) * 100);
    document.getElementById('stat-number').innerText = pc + "%";
}

function setFilter(f) {
    filter = f;
    document.querySelectorAll('.chip').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderTasks();
}

function saveData() {
    localStorage.setItem('advancedTasks', JSON.stringify(tasks));
    renderTasks();
}

renderTasks();