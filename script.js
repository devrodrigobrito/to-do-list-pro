// =========================================================================
// SELECTION OF DOM ELEMENTS
// =========================================================================

// Initial Status
let tasks = [];
let nextTaskId = 1;
let currentTaskToEditId = null;

//Action and Modal Elements
const addtaskbtn = document.getElementById('add-task-btn'); 
const taskmodal = document.getElementById('task-modal');
const cancelmodalbtn = document.getElementById('cancel-modal-btn');
const taskform = document.getElementById('task-form');
const modalTitle = document.getElementById('modal-title');
const saveTaskBtn = document.getElementById('save-task-btn');

// Form Inputs (Modal)
const titleEl = document.getElementById('task-title-input');
const descriptionEl = document.getElementById('task-description-input');
const priorityEl = document.getElementById('task-priority-select');
const categoryEl = document.getElementById('task-category-input');
const dueDateEl = document.getElementById('task-due-date-input');

// List of Control Elements and Themes
const taskListEl = document.getElementById("task-list");
const darkModeToggle = document.getElementById('dark-mode-toggle');

// Statistics Elements
const statsTotalEl = document.getElementById('stats-total');
const statsCompletedEl = document.getElementById('stats-completed');
const statsPendingEl = document.getElementById('stats-pending');

// Filter and Search Elements
const searchInput = document.getElementById('search-input');
const filterStatus = document.getElementById('filter-status');
const filterCategory = document.getElementById('filter-category');
const sortBy = document.getElementById('sort-by');

//Import/Export Elements
const importJsonFile = document.getElementById('import-json-file');
const importJsonBtn = document.getElementById('import-json-btn');
const exportJsonBtn = document.getElementById('export-json-btn');


// =========================================================================
// MODAL CONTROL FUNCTIONS
// =========================================================================

// Function to open modal (show on screen)
const openModal = () => {
    modalTitle.textContent = 'Adicionar Nova Tarefa';
    taskmodal.classList.remove('hidden');
    taskform.reset();
};

// Function to close the modal (hide from screen)
const closeModal = () => {
    taskmodal.classList.add('hidden');
    taskform.reset();
};

// Event listeners modal
addtaskbtn.addEventListener('click', openModal);
cancelmodalbtn.addEventListener('click', closeModal);

// Closes the modal by clicking outside of it (on the dark background)
taskmodal.addEventListener('click', (e) => {
    if(e.target === taskmodal){
        closeModal();
    };
});


// =========================================================================
// CREATE TASK FUNCTIONS
// =========================================================================

const createTask = () => {
    const title = titleEl.value.trim();
    const description = descriptionEl.value.trim();
    const priority = priorityEl.value;
    const category = categoryEl.value;
    const dueDate = dueDateEl.value;

    const newTask = {
        id: nextTaskId,
        title: title,
        description: description,
        priority: priority,
        category: category,
        dueDate: dueDate,
        completed: false
    };

    nextTaskId++;

    return newTask;
};


const getPriorityColor = (priority) => {
    switch(priority){
        case 'Alta':
            return 'bg-red-100 text-red-600';
        case 'Média':
            return 'bg-yellow-100 text-yellow-600';
        case 'Baixa':
            return 'bg-green-100 text-green-600';
        default:
            return 'bg-gray-100 text-gray-600';            
    };
};


const getCategoryColor = (category) => {
    switch(category){
        case 'Pessoal':
            return 'bg-indigo-100 text-indigo-600';
        case 'Trabalho':
            return 'bg-blue-100 text-blue-600';
        case 'Estudo':
            return 'bg-purple-100 text-purple-600';
        case 'Saúde':
            return 'bg-green-100 text-green-600';
        case 'Finança':
            return 'bg-emerald-100 text-emerald-600'; 
        default:
            return 'bg-gray-100 text-gray-600';                          
    };
};


const formatDueDate = (dateString) => {
    const dateObject = new Date(dateString + 'T00:00:00');

    const options = {
        month: 'short',
        day: 'numeric'
    };

       if(isNaN(dateObject)){
        return '';
    };

    return dateObject.toLocaleDateString('pt-BR', options);
};


const renderTask = (task) => {
    const priorityClasses = getPriorityColor(task.priority);
    const categoryClasses = getCategoryColor(task.category);
    const formattedDate = formatDueDate(task.dueDate);

    const taskItemContainer = document.createElement('div');

    taskItemContainer.innerHTML = `<div data-task-id="${task.id}" class="flex items-center justify-between bg-white shadow p-4 rounded-lg border">
                <input type="checkbox" data-action="complete" class="h-5 w-5">

                <div class="flex-1 ml-4">
                    <p class="font-semibold text-gray-800">${task.title}</p>
                    <p class="text-gray-600 text-sm mt-1">${task.description}</p>

                    <div class="flex items-center gap-3 text-sm text-gray-500 mt-1">
                        <span class="${priorityClasses} px-2 py-1 rounded text-xs">${task.priority}</span>
                        <span class="${categoryClasses} px-2 py-1 rounded text-xs">${task.category}</span>
                        ${formattedDate ? `<span>📅 ${formattedDate}</span>` : ''}
                    </div>
                </div>

                <div class="flex items-center gap-2">
                    <button data-action="edit" class="p-2 rounded hover:bg-gray-100 transition">✏️</button>

                    <button data-action="delete" class="p-2 rounded hover:bg-red-100 text-red-600 transition">🗑️</button>
                </div>
            </div>`

            taskListEl.appendChild(taskItemContainer);
};


// =========================================================================
// TASK DELETE FUNCTION
// =========================================================================

taskListEl.addEventListener('click', (event) => {
    const deleteBtn = event.target.closest('[data-action="delete"]');
    if(!deleteBtn) return;

    const taskItemEl = deleteBtn.closest('[data-task-id]');
    if(!taskItemEl) return;

    const id = Number(taskItemEl.dataset.taskId);
    tasks = tasks.filter(task => task.id !== id);

    saveTasksToLocalStorage();
    taskItemEl.remove();
});


// =========================================================================
// EDIT TASK FUNCTION 
// =========================================================================

taskListEl.addEventListener('click', (event) => {
    const editBtn = event.target.closest('[data-action="edit"]');
    if(!editBtn) return;

    const taskEl = editBtn.closest('[data-task-id]');
    if(!taskEl) return;

    const id = Number(taskEl.dataset.taskId);
    const taskToEdit = tasks.find(task => task.id === id);
    if(!taskToEdit) return;

    titleEl.value = taskToEdit.title;
    descriptionEl.value = taskToEdit.description;
    priorityEl.value = taskToEdit.priority;
    categoryEl.value = taskToEdit.category;
    dueDateEl.value = taskToEdit.dueDate;

    currentTaskToEditId = id;
    
    taskmodal.classList.remove('hidden');
    modalTitle.textContent = 'Editar Tarefa';
});


taskform.addEventListener('submit', (event) => {
    event.preventDefault();

    if(currentTaskToEditId !== null){
       const taskToEdit = tasks.find(task => task.id === currentTaskToEditId);
        if (!taskToEdit) return;

        Object.assign(taskToEdit, {
        title: titleEl.value.trim(),
        description: descriptionEl.value.trim(),
        priority: priorityEl.value,
        category: categoryEl.value,
        dueDate: dueDateEl.value
        });
      
        renderTasks();
        closeModal();
        saveTasksToLocalStorage();
        currentTaskToEditId = null;
    }else {
        const newTask = createTask();
        tasks.push(newTask);
        renderTask(newTask);
        closeModal();
        saveTasksToLocalStorage();
    }
});


const renderTasks = () => {
    taskListEl.innerHTML = '';

    tasks.forEach(task => {
        renderTask(task);
    });

    tasks.forEach(task => {
        if(!task.completed) return;

        const taskEl = document.querySelector(`[data-task-id="${task.id}"]`);
        if(!taskEl) return;

        const checkbox = taskEl.querySelector('[data-action="complete"]');
        if(!checkbox) return;

        const titleElement = taskEl.querySelector('.font-semibold');
        if(!titleElement) return;

        if(checkbox){
            checkbox.checked = true;
        }

        if(titleElement){
            titleElement.classList.add('line-through', 'text-gray-400');
        }
    });
};


// =========================================================================
// SAVE LOCAL STORAGE FUNCTIONS
// =========================================================================

const saveTasksToLocalStorage = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

const loadTasksFromLocalStorage = () => {
    const savedTasks = localStorage.getItem('tasks');

    if(savedTasks){
        return JSON.parse(savedTasks);
    }

    return [];
};

tasks = loadTasksFromLocalStorage();
renderTasks();
nextTaskId = tasks.reduce((max, task) => Math.max(max, task.id), 0) +1;


// =========================================================================
// TOGGLE TASK COMPLETION FUNCTION
// =========================================================================

taskListEl.addEventListener('click', (event) => {
    const checkbox = event.target.closest('[data-action="complete"]');
    if(!checkbox) return;

    const taskEl = checkbox.closest('[data-task-id]');
    if(!taskEl) return;
    
    const id = Number(taskEl.dataset.taskId);
    const taskCompleted = tasks.find(task => task.id === id);
    if(!taskCompleted) return;

    taskCompleted.completed = checkbox.checked;

    const titleElement = taskEl.querySelector('.font-semibold');

    if(titleElement){
        if(taskCompleted.completed){
            titleElement.classList.add('line-through', 'text-gray-400');
        }else{
            titleElement.classList.remove('line-through', 'text-gray-400');
        }
    }

    saveTasksToLocalStorage(); 
});





