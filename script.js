// =========================================================================
// SELECTION OF DOM ELEMENTS
// =========================================================================

// Initial Status
let tasks = [];
let nextTaskId = 1;

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
    const priority = priorityEl.options[priorityEl.selectedIndex].textContent;
    const category = categoryEl.options[categoryEl.selectedIndex].textContent;
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


const renderTask = (task) => {
    const priorityClasses = getPriorityColor(task.priority);
    const categoryClasses = getCategoryColor(task.category);
    const listItem = document.createElement('div');

    listItem.innerHTML = `<div data-task-id="${task.id}" class="flex items-center justify-between bg-white shadow p-4 rounded-lg border">
                <input type="checkbox" class="h-5 w-5">

                <div class="flex-1 ml-4">
                    <p class="font-semibold text-gray-800">${task.title}</p>
                    <p class="text-gray-600 text-sm mt-1">${task.description}</p>

                    <div class="flex items-center gap-3 text-sm text-gray-500 mt-1">
                        <span class="${priorityClasses} px-2 py-1 rounded text-xs">${task.priority}</span>
                        <span class="${categoryClasses} px-2 py-1 rounded text-xs">${task.category}</span>
                        <span>📅 ${task.dueDate}</span>
                    </div>
                </div>

                <div class="flex items-center gap-2">
                    <button data-action="edit" data-task-id="${task.id}" class="p-2 rounded hover:bg-gray-100 transition">✏️</button>

                    <button data-action="delete" data-task-id="${task.id}" class="p-2 rounded hover:bg-red-100 text-red-600 transition">🗑️</button>
                </div>
            </div>`

            taskListEl.appendChild(listItem);
};



const handleTaskSubmit = (event) => {
    event.preventDefault();

    const newTask = createTask();
    renderTask(newTask);
    taskform.reset();
};

taskform.addEventListener('submit', handleTaskSubmit);





