const taskForm = document.getElementById('todo-form');
const taskInput = document.getElementById('task-input');
const dateInput = document.getElementById('date-input');
const taskList = document.getElementById('task-list');
const filterSelect = document.getElementById('filter');
const submitBtn = document.getElementById('submit-btn');
const deleteAllBtn = document.getElementById('delete-all');

// Stats
const statTotal = document.getElementById('stat-total');
const statCompleted = document.getElementById('stat-completed');
const statPending = document.getElementById('stat-pending');
const statProgress = document.getElementById('stat-progress');

// Toast
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let editIndex = null;

// Show toast
function showToast(message) {
  toastMessage.textContent = message;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 2000);
}

// Render tasks
function renderTasks(filter = 'all') {
  taskList.innerHTML = '';

  const now = new Date();
  let filteredTasks = tasks;

  // Filter logic
  if (filter === 'upcoming') {
    filteredTasks = tasks.filter((task) => new Date(task.date) >= now && task.status !== 'Completed');
  } else if (filter === 'past') {
    filteredTasks = tasks.filter((task) => new Date(task.date) < now && task.status !== 'Completed');
  } else if (filter === 'completed') {
    filteredTasks = tasks.filter((task) => task.status === 'Completed');
  }

  // Jika kosong, tampilkan pesan
  if (filteredTasks.length === 0) {
    taskList.innerHTML = `
      <tr>
        <td colspan="4" class="text-center text-gray-500 py-4">
          Tidak ada tugas yang ditampilkan
        </td>
      </tr>
    `;
    updateStats();
    return;
  }

  // Render task list jika ada data
  filteredTasks.forEach((task, index) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td class="px-3 py-2">${task.text}</td>
      <td class="px-3 py-2">${task.date}</td>
      <td class="px-3 py-2">
        <span class="px-2 py-1 rounded text-xs ${task.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}">
          ${task.status}
        </span>
      </td>
      <td class="px-3 py-2 text-center">
        <div class="flex justify-center gap-2">
          <button onclick="toggleComplete(${index})" title="Complete"
            class="text-green-500 hover:text-green-700">✔</button>
          <button onclick="editTask(${index})" title="Edit"
            class="text-blue-500 hover:text-blue-700">✏</button>
          <button onclick="deleteTask(${index})" title="Delete"
            class="text-red-500 hover:text-red-700">🗑</button>
        </div>
      </td>
    `;
    taskList.appendChild(row);
  });

  updateStats();
}

// Update stats
function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.status === 'Completed').length;
  const pending = total - completed;
  const progress = total ? Math.round((completed / total) * 100) : 0;

  statTotal.textContent = total;
  statCompleted.textContent = completed;
  statPending.textContent = pending;
  statProgress.textContent = `${progress}%`;
}

// Add/Update task
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const text = taskInput.value.trim();
  const date = dateInput.value;

  if (!text || !date) {
    showToast('Please fill out all fields!');
    return;
  }

  if (editIndex !== null) {
    tasks[editIndex].text = text;
    tasks[editIndex].date = date;
    showToast('Task updated successfully!');
    editIndex = null;
    submitBtn.textContent = 'Add Task';
  } else {
    tasks.push({ text, date, status: 'Pending' });
    showToast('Task added successfully!');
  }

  localStorage.setItem('tasks', JSON.stringify(tasks));
  taskInput.value = '';
  dateInput.value = '';
  renderTasks(filterSelect.value);
});

// Delete task
function deleteTask(index) {
  tasks.splice(index, 1);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  showToast('Task deleted successfully!');
  renderTasks(filterSelect.value);
}

// Edit task
function editTask(index) {
  const task = tasks[index];
  taskInput.value = task.text;
  dateInput.value = task.date;
  editIndex = index;
  submitBtn.textContent = 'Update Task';
}

// Toggle Complete
function toggleComplete(index) {
  tasks[index].status = tasks[index].status === 'Completed' ? 'Pending' : 'Completed';
  localStorage.setItem('tasks', JSON.stringify(tasks));
  showToast(tasks[index].status === 'Completed' ? 'Task marked as completed!' : 'Task marked as pending!');
  renderTasks(filterSelect.value);
}

// Delete all tasks
deleteAllBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to delete all tasks?')) {
    tasks = [];
    localStorage.setItem('tasks', JSON.stringify(tasks));
    showToast('All tasks deleted!');
    renderTasks(filterSelect.value);
  }
});

// Filter change
filterSelect.addEventListener('change', (e) => {
  renderTasks(e.target.value);
});

// Initial render
renderTasks();

// Animasi sambutan & stats
window.addEventListener('load', () => {
  // Fade-in sambutan
  document.getElementById('welcome-text').classList.remove('opacity-0', 'translate-y-4');

  // Animasi card statistik stagger
  setTimeout(() => {
    document.getElementById('stat-1').classList.remove('opacity-0', 'scale-90');
  }, 200);
  setTimeout(() => {
    document.getElementById('stat-2').classList.remove('opacity-0', 'scale-90');
  }, 400);
  setTimeout(() => {
    document.getElementById('stat-3').classList.remove('opacity-0', 'scale-90');
  }, 600);
  setTimeout(() => {
    document.getElementById('stat-4').classList.remove('opacity-0', 'scale-90');
  }, 800);
});
