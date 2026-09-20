const htmlElement = document.documentElement;
const themeToggleBtn = document.getElementById('theme-toggle');
const taskForm = document.getElementById('task-form');
const taskTitleInput = document.getElementById('task-title');
const taskCategorySelect = document.getElementById('task-category');
const taskList = document.getElementById('task-list');

const searchTaskInput = document.getElementById('search-task');
const filterCategorySelect = document.getElementById('filter-category');
const totalCountSpan = document.getElementById('total-count');
const completedCountSpan = document.getElementById('completed-count');
const pendingCountSpan = document.getElementById('pending-count');
const clearAllBtn = document.getElementById('clear-all');

themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    htmlElement.setAttribute('data-theme', newTheme);
    document.body.classList.add('theme-changing');
    setTimeout(() => {
        document.body.classList.remove('theme-changing');
    }, 300);
});

function updateView() {
    const items = taskList.children;
    let total = 0;
    let completed = 0;
    const filterText = filterCategorySelect.value;
    const searchText = searchTaskInput.value.toLowerCase();

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const title = item.querySelector('.task-title').textContent.toLowerCase();
        const category = item.dataset.category;
        const status = item.dataset.status;

        const matchesCategory = filterText === 'All' || category === filterText;
        const matchesSearch = title.includes(searchText);

        if (matchesCategory && matchesSearch) {
            item.style.display = '';
            total++;
            if (status === 'completed') {
                completed++;
            }
        } else {
            item.style.display = 'none';
        }
    }

    totalCountSpan.textContent = total;
    completedCountSpan.textContent = completed;
    pendingCountSpan.textContent = total - completed;
}

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = taskTitleInput.value.trim();
    const category = taskCategorySelect.value;

    if (!title || !category) {
        alert("Please provide both a title and a category.");
        return;
    }

    const taskItem = document.createElement('div');
    taskItem.className = 'task-item';
    taskItem.setAttribute('data-id', Date.now().toString());
    taskItem.dataset.status = 'pending';
    taskItem.dataset.category = category;

    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'task-details';

    const titleSpan = document.createElement('span');
    titleSpan.className = 'task-title';
    titleSpan.appendChild(document.createTextNode(title));

    const catBadge = document.createElement('span');
    catBadge.className = 'task-category-badge';
    catBadge.appendChild(document.createTextNode(category));

    detailsDiv.append(titleSpan, catBadge);

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'task-actions';

    const completeBtn = document.createElement('button');
    completeBtn.className = 'btn btn-success complete-btn';
    completeBtn.textContent = 'Complete';

    const editBtn = document.createElement('button');
    editBtn.className = 'btn edit-btn';
    editBtn.textContent = 'Edit';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-danger delete-btn';
    deleteBtn.textContent = 'Delete';

    actionsDiv.appendChild(completeBtn);
    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);

    taskItem.append(detailsDiv, actionsDiv);

    taskList.prepend(taskItem);

    taskTitleInput.value = '';
    taskCategorySelect.value = '';

    updateView();
});

taskList.addEventListener('click', (e) => {
    const taskItem = e.target.closest('.task-item');
    if (!taskItem) return;

    if (e.target.classList.contains('delete-btn')) {
        taskItem.remove();
        updateView();
    }
    else if (e.target.classList.contains('complete-btn')) {
        const isCompleted = taskItem.dataset.status === 'completed';

        if (isCompleted) {
            taskItem.dataset.status = 'pending';
            taskItem.removeAttribute('data-completed');
            e.target.textContent = 'Complete';
        } else {
            taskItem.dataset.status = 'completed';
            taskItem.setAttribute('data-completed', 'true');
            e.target.textContent = 'Undo';
        }
        updateView();
    }
    else if (e.target.classList.contains('edit-btn')) {
        const titleSpan = taskItem.querySelector('.task-title');
        const newTitle = prompt("Edit Task Title:", titleSpan.textContent);

        if (newTitle !== null && newTitle.trim() !== '') {
            titleSpan.textContent = newTitle.trim();

            const notification = document.createElement('div');
            notification.textContent = 'Task updated!';
            notification.className = 'notification-message';

            taskItem.before(notification);

            setTimeout(() => {
                const updatedNotification = document.createElement('div');
                updatedNotification.textContent = 'Refreshing list...';
                updatedNotification.className = 'notification-updated';
                notification.replaceWith(updatedNotification);

                const doneSpan = document.createElement('span');
                doneSpan.textContent = ' ✔';
                updatedNotification.after(doneSpan);

                setTimeout(() => {
                    updatedNotification.remove();
                    doneSpan.remove();
                    updateView();
                }, 500);
            }, 800);
        }
    }
});

searchTaskInput.addEventListener('input', updateView);
filterCategorySelect.addEventListener('change', updateView);

clearAllBtn.addEventListener('click', () => {
    if (confirm("Are you sure you want to clear all tasks?")) {
        taskList.innerHTML = '';
        updateView();
    }
});

updateView();