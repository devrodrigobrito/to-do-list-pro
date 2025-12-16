// =========================================================================
// SELECTION OF DOM ELEMENTS
// =========================================================================

// Initial Status
let tasks = [];
let nextTaskId = 1;
let currentTaskToEditId = null;

// Action and Modal Elements
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

// Import/Export Elements
const importJsonFile = document.getElementById('import-json-file');
const importJsonBtn = document.getElementById('import-json-btn');
const exportJsonBtn = document.getElementById('export-json-btn');


// =========================================================================
// MODAL CONTROL FUNCTIONS
// =========================================================================

// Open modal for adding new task
const openModal = () => {
    modalTitle.textContent = 'Adicionar Nova Tarefa';
    taskmodal.classList.remove('hidden');
    taskform.reset();
};

// Close modal and reset form
const closeModal = () => {
    taskmodal.classList.add('hidden');
    taskform.reset();
};

// Event listeners modal
addtaskbtn.addEventListener('click', openModal);
cancelmodalbtn.addEventListener('click', closeModal);

// Close modal when clicking outside
taskmodal.addEventListener('click', (e) => {
    if(e.target === taskmodal){
        closeModal();
    };
});


// =========================================================================
// CREATE TASK FUNCTIONS
// =========================================================================

// Create new task object from form inputs
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


// Return Tailwind classes based on priority level
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


// Return Tailwind classes based on category
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


// Format date to locale string
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


// Render single task to DOM
const renderTask = (task) => {
    const priorityClasses = getPriorityColor(task.priority);
    const categoryClasses = getCategoryColor(task.category);
    const formattedDate = formatDueDate(task.dueDate);

    const taskItemContainer = document.createElement('div');

    taskItemContainer.innerHTML = `<div data-task-id="${task.id}" class="flex items-center justify-between bg-white dark:bg-gray-800 shadow p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <input type="checkbox" data-action="complete" class="h-5 w-5">

                <div class="flex-1 ml-4">
                    <p class="font-semibold text-gray-800 dark:text-gray-100">${task.title}</p>
                    <p class="text-gray-600 dark:text-gray-500 text-sm mt-1">${task.description}</p>

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

// Handle task deletion via event delegation
taskListEl.addEventListener('click', (event) => {
    const deleteBtn = event.target.closest('[data-action="delete"]');
    if(!deleteBtn) return;

    const taskItemEl = deleteBtn.closest('[data-task-id]');
    if(!taskItemEl) return;

    const id = Number(taskItemEl.dataset.taskId);
    tasks = tasks.filter(task => task.id !== id);

    saveTasksToLocalStorage();
    updateCounters();
    taskItemEl.remove();
});


// =========================================================================
// EDIT TASK FUNCTION 
// =========================================================================

// Handle task edit via event delegation
taskListEl.addEventListener('click', (event) => {
    const editBtn = event.target.closest('[data-action="edit"]');
    if(!editBtn) return;

    const taskEl = editBtn.closest('[data-task-id]');
    if(!taskEl) return;

    const id = Number(taskEl.dataset.taskId);
    const taskToEdit = tasks.find(task => task.id === id);
    if(!taskToEdit) return;

    // Populate form with task data
    titleEl.value = taskToEdit.title;
    descriptionEl.value = taskToEdit.description;
    priorityEl.value = taskToEdit.priority;
    categoryEl.value = taskToEdit.category;
    dueDateEl.value = taskToEdit.dueDate;

    currentTaskToEditId = id;
    
    taskmodal.classList.remove('hidden');
    modalTitle.textContent = 'Editar Tarefa';
});


// Handle form submission for both create and edit
taskform.addEventListener('submit', (event) => {
    event.preventDefault();

    // Edit existing task
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
        // Create new task
        const newTask = createTask();
        tasks.push(newTask);
        renderTask(newTask);
        closeModal();
        saveTasksToLocalStorage();
        updateCounters();
    }
});


// Render all tasks and restore completed state
const renderTasks = () => {
    taskListEl.innerHTML = '';

    tasks.forEach(task => {
        renderTask(task);
    });

    // Restore completed task styling
    tasks.forEach(task => {
        if(!task.completed) return;

     if(task.completed){
            const taskEl = document.querySelector(`[data-task-id="${task.id}"]`);
            taskEl.querySelector('[data-action="complete"]').checked = true;
            taskEl.querySelector('.font-semibold').classList.add('line-through', 'text-gray-400');
        }
    });
};


// =========================================================================
// SAVE LOCAL STORAGE FUNCTIONS
// =========================================================================

// Save tasks array to localStorage
const saveTasksToLocalStorage = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

// Load tasks from localStorage
const loadTasksFromLocalStorage = () => {
    const savedTasks = localStorage.getItem('tasks');

    if(savedTasks){
        return JSON.parse(savedTasks);
    }

    return [];
};

// Initialize tasks on page load
tasks = loadTasksFromLocalStorage();
renderTasks();
nextTaskId = tasks.reduce((max, task) => Math.max(max, task.id), 0) +1;


// =========================================================================
// TOGGLE TASK COMPLETION FUNCTION
// =========================================================================

// Handle task completion toggle via event delegation
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

    // Toggle line-through styling
    if(titleElement){
        if(taskCompleted.completed){
            titleElement.classList.add('line-through', 'text-gray-400');
        }else{
            titleElement.classList.remove('line-through', 'text-gray-400');
        }
    }

    saveTasksToLocalStorage();
    updateCounters(); 
});


// =========================================================================
// COUNTER STATUS FUNCTION
// =========================================================================

// Update statistics counters
const updateCounters = () => {
    const total = tasks.length;
    statsTotalEl.textContent = total;
    
    const complete = tasks.filter(task => task.completed).length;
    statsCompletedEl.textContent = complete;

    const pending = total - complete;
    statsPendingEl.textContent = pending;
};

updateCounters();


// =========================================================================
// FILTERING FUNCTIONS
// =========================================================================

// Apply all filters and render filtered tasks
const filterAndRenderTasks = () => {
    let filteredTasks = [...tasks];

    // Search filter
    const searchText = searchInput.value;

    if(searchText){
        const nomalizeText = searchText.toLowerCase();

      filteredTasks = filteredTasks.filter(task => {
        return task.title.toLowerCase().includes(nomalizeText) || task.description.toLowerCase().includes(nomalizeText);
    });
    }

    // Status filter (completed/pending)
    const statusFilter = filterStatus.value;

    if(statusFilter !== "all"){
        filteredTasks = filteredTasks.filter(task => {
            if(statusFilter === "completed"){
                return task.completed === true;
            }else if(statusFilter === "pending"){
                return task.completed === false;
            }
        });
    }

    // Category filter
    const categoryFilter = filterCategory.value;

    if(categoryFilter !== "todas"){
        filteredTasks = filteredTasks.filter(task => {
            return task.category === categoryFilter;
        });
    }

    // Sort tasks
    const sortValue = sortBy.value;

    if(sortValue){
        filteredTasks.sort((a,b) => {
            switch(sortValue){
                case 'date-desc':
                    return b.id - a.id;
                case 'due-asc': 
                    return new Date(a.dueDate) - new Date(b.dueDate);
                case 'priority-desc':
                    const priorityWeight = { 'Alta': 3, 'Média': 2, 'Baixa': 1 };
                    return priorityWeight[b.priority] - priorityWeight[a.priority];
                default: 
                    return 0;       
            }
        });
    }

    // Render filtered tasks
    taskListEl.innerHTML = '';
    filteredTasks.forEach(task => {
        renderTask(task);

        if(task.completed){
            const taskEl = document.querySelector(`[data-task-id="${task.id}"]`);
            taskEl.querySelector('[data-action="complete"]').checked = true;
            taskEl.querySelector('.font-semibold').classList.add('line-through', 'text-gray-400');
        }
    });
};


// Attach filter event listeners
searchInput.addEventListener('input', filterAndRenderTasks);
filterStatus.addEventListener('change', filterAndRenderTasks);
filterCategory.addEventListener('change', filterAndRenderTasks);
sortBy.addEventListener('change', filterAndRenderTasks);


// =========================================================================
// DARK MODE FUNCTION
// =========================================================================

// Toggle dark mode and save preference
const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');

    if(document.documentElement.classList.contains('dark')){
        localStorage.setItem('theme', 'dark');
    }else{
        localStorage.setItem('theme', 'light');
    } 
};

// Load dark mode preference on page load
const loadDarkModePreference = () => {
    const themePreference = localStorage.getItem('theme');

    if(themePreference === 'dark'){
        document.documentElement.classList.add('dark');
    }
};

loadDarkModePreference();

darkModeToggle.addEventListener('click', toggleDarkMode);


// =========================================================================
// JSON TASK IMPORT AND EXPORT FUNCTION
// =========================================================================

// Export tasks to JSON file
const exportTasksToJSON = () => {
    const jsonString = JSON.stringify(tasks, null, 2);
    const blob = new Blob([jsonString], {type: 'application/json'});
    const link = document.createElement('a');

    const objectURL = URL.createObjectURL(blob);
    link.href = objectURL;
    link.download = 'tarefas.json';
    link.click();

    // Clean up
    setTimeout(() => {
        URL.revokeObjectURL(objectURL);
        link.remove();
    }, 100);
};

exportJsonBtn.addEventListener('click', exportTasksToJSON);


// Import tasks from JSON file
const importTasksFromJSON = () => {
    const file = importJsonFile.files[0];

    if(!file){
        alert('Selecione um arquivo JSON primeiro!');
        return;
    };

    const reader = new FileReader();

    // Handle successful file read
    reader.onload = (event) => {
        const content = event.target.result;

        try {
            const importedTasks = JSON.parse(content);
            
            // Validate imported data
            if(Array.isArray(importedTasks)){
                tasks = importedTasks;
                renderTasks();
                updateCounters();
                saveTasksToLocalStorage();

                importJsonFile.value = '';
            }else{
                alert('O conteúdo do arquivo JSON não é um array de tarefas válido.');
            } 

        } catch (error){
           alert('Erro ao processar o arquivo. Certifique-se de que é um JSON válido.');
           importJsonFile.value = '';
           console.error('Erro de parsing JSON:', error); 
        }
    };

    // Handle file read error
    reader.onerror = () => {
        alert('Erro ao ler o arquivo. Tente novamente.');
        console.error('Erro de leitura do arquivo:', reader.error);
    };

    reader.readAsText(file);
};

importJsonBtn.addEventListener('click', importTasksFromJSON);
