/**
 * TaskFlow Pro - Interactive Vanilla JS Engine
 * Features: Inline Edit, Mark Complete Toggle, Delete, LocalStorage, Timestamps & Count Badges
 */

class TaskApp {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('taskflow_tasks')) || [];
        this.editingTaskId = null;

        this.initDOM();
        this.bindEvents();
        this.render();
        this.startLiveClock();
    }

    initDOM() {
        this.taskForm = document.getElementById('addTaskForm');
        this.taskInput = document.getElementById('taskInput');
        this.pendingList = document.getElementById('pendingList');
        this.completedList = document.getElementById('completedList');
        this.pendingCount = document.getElementById('pendingCount');
        this.completedCount = document.getElementById('completedCount');
        this.pendingEmptyState = document.getElementById('pendingEmptyState');
        this.completedEmptyState = document.getElementById('completedEmptyState');
        this.liveClock = document.getElementById('liveClock');
    }

    bindEvents() {
        this.taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTask(this.taskInput.value.trim());
        });
    }

    saveToStorage() {
        localStorage.setItem('taskflow_tasks', JSON.stringify(this.tasks));
    }

    formatTimestamp(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }

    addTask(text) {
        if (!text) return;

        const newTask = {
            id: Date.now().toString(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString(),
            completedAt: null
        };

        this.tasks.unshift(newTask);
        this.saveToStorage();
        this.taskInput.value = '';
        this.render();
    }

    toggleTaskStatus(id) {
        this.tasks = this.tasks.map(task => {
            if (task.id === id) {
                const isNowCompleted = !task.completed;
                return {
                    ...task,
                    completed: isNowCompleted,
                    completedAt: isNowCompleted ? new Date().toISOString() : null
                };
            }
            return task;
        });
        this.saveToStorage();
        this.render();
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveToStorage();
        this.render();
    }

    enableEditMode(id) {
        this.editingTaskId = id;
        this.render();
    }

    cancelEditMode() {
        this.editingTaskId = null;
        this.render();
    }

    saveTaskEdit(id, newText) {
        const trimmed = newText.trim();
        if (!trimmed) return;

        this.tasks = this.tasks.map(task => {
            if (task.id === id) {
                return { ...task, text: trimmed };
            }
            return task;
        });
        this.editingTaskId = null;
        this.saveToStorage();
        this.render();
    }

    render() {
        const pendingTasks = this.tasks.filter(t => !t.completed);
        const completedTasks = this.tasks.filter(t => t.completed);

        // Update counters
        this.pendingCount.textContent = `${pendingTasks.length} pending`;
        this.completedCount.textContent = `${completedTasks.length} completed`;

        // Toggle Empty States
        this.pendingEmptyState.style.display = pendingTasks.length === 0 ? 'flex' : 'none';
        this.completedEmptyState.style.display = completedTasks.length === 0 ? 'flex' : 'none';

        // Render Pending List
        this.pendingList.innerHTML = '';
        pendingTasks.forEach(task => {
            this.pendingList.appendChild(this.createTaskCard(task));
        });

        // Render Completed List
        this.completedList.innerHTML = '';
        completedTasks.forEach(task => {
            this.completedList.appendChild(this.createTaskCard(task));
        });
    }

    createTaskCard(task) {
        const card = document.createElement('div');
        card.className = `task-card ${task.completed ? 'completed' : ''}`;
        card.dataset.id = task.id;

        const isEditing = this.editingTaskId === task.id;

        if (isEditing) {
            // Edit Mode Card UI
            card.innerHTML = `
                <div class="task-header">
                    <input type="text" class="edit-input" id="editInput_${task.id}" value="${this.escapeHtml(task.text)}">
                </div>
                <div class="task-meta">
                    <span>Editing task...</span>
                    <div class="task-actions">
                        <button class="btn-action-sm btn-save" id="saveBtn_${task.id}">Save</button>
                        <button class="btn-action-sm btn-cancel" id="cancelBtn_${task.id}">Cancel</button>
                    </div>
                </div>
            `;

            // Attach edit save & cancel events dynamically
            setTimeout(() => {
                const editInput = document.getElementById(`editInput_${task.id}`);
                const saveBtn = document.getElementById(`saveBtn_${task.id}`);
                const cancelBtn = document.getElementById(`cancelBtn_${task.id}`);

                editInput.focus();

                saveBtn.addEventListener('click', () => {
                    this.saveTaskEdit(task.id, editInput.value);
                });

                cancelBtn.addEventListener('click', () => {
                    this.cancelEditMode();
                });

                editInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        this.saveTaskEdit(task.id, editInput.value);
                    } else if (e.key === 'Escape') {
                        this.cancelEditMode();
                    }
                });
            }, 0);

        } else {
            // Standard Task Card UI
            const timeLabel = task.completed
                ? `Done: ${this.formatTimestamp(task.completedAt)}`
                : `Added: ${this.formatTimestamp(task.createdAt)}`;

            card.innerHTML = `
                <div class="task-header">
                    <input type="checkbox" class="toggle-checkbox" ${task.completed ? 'checked' : ''} aria-label="Mark task completed">
                    <span class="task-text">${this.escapeHtml(task.text)}</span>
                </div>
                <div class="task-meta">
                    <span class="task-timestamp">🕒 ${timeLabel}</span>
                    <div class="task-actions">
                        ${!task.completed ? `<button class="btn-action-sm btn-edit">Edit</button>` : ''}
                        <button class="btn-action-sm btn-delete">Delete</button>
                    </div>
                </div>
            `;

            // Event Listeners for actions
            const checkbox = card.querySelector('.toggle-checkbox');
            checkbox.addEventListener('change', () => this.toggleTaskStatus(task.id));

            const editBtn = card.querySelector('.btn-edit');
            if (editBtn) {
                editBtn.addEventListener('click', () => this.enableEditMode(task.id));
            }

            const deleteBtn = card.querySelector('.btn-delete');
            deleteBtn.addEventListener('click', () => this.deleteTask(task.id));
        }

        return card;
    }

    escapeHtml(str) {
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    startLiveClock() {
        const updateClock = () => {
            const now = new Date();
            this.liveClock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        };
        updateClock();
        setInterval(updateClock, 1000);
    }
}

// Initialize Application on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    new TaskApp();
});
