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





