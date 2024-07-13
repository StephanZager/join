let currentCategory = '';
let task = [];


function generateTask() {
    const categories = ['toDo', 'inProgress', 'awaitFeedback', 'done'];
    
    categories.forEach(category => {
        let tasksInCategory = task.filter(t => t.category === category);
        let categoryElement = document.getElementById(category);
        categoryElement.innerHTML = '';

        if (tasksInCategory.length === 0) {
            categoryElement.innerHTML = generatePlaceholderHTML(category);
        } else {
            tasksInCategory.forEach(taskItem => {
                categoryElement.innerHTML += generateTaskHTML(taskItem);
                if ((taskItem.subtasks || []).length > 0) {
                    updateProgressBar(taskItem);
                }
            });
        }
    });
}


function generatePlaceholderHTML(category) {
    return `<div class="placeholder"><span>No tasks ${category}</span></div>`;
}

function generateTaskHTML(taskItem) {
    let assignArray = taskItem.assign || [];
    let initialCount = assignArray.length;
    let visibleInitials = assignArray.slice(0, 4);
    let hiddenInitialsCount = initialCount > 4 ? initialCount - 4 : 0;

    let initialsHtml = visibleInitials.map(assignData => 
        `<span class="show-initials" style="background-color: ${assignData.bgNameColor}">${assignData.initials}</span>`
    ).join('');

    if (hiddenInitialsCount > 0) {
        initialsHtml += `<span class="show-initials">+${hiddenInitialsCount}</span>`;
    }

    let priorityIcon = getPriorityIcon(taskItem.priority);
    let subtasksHtml = generateSubtasksProgressHTML(taskItem);

    return `
        <div draggable="true" ondragstart="startDragging(event, '${taskItem.firebaseId}')" ondragend="stopDragging(event)" class="taskCard" data-firebase-id="${taskItem.firebaseId}">
        <div class="taskCard-headline-board-overview">    
            <h4 class="task-category-${taskItem.userCategory}">${taskItem.userCategory}</h4>
            <img class="task-popup-arrow" src="assets/img/arrow-down-grey.png" onclick="openMoveMobileMenu('${taskItem.firebaseId}')">
        </div>    
            <p class="task-title">${taskItem.title}</p>
            <p class="task-description">${taskItem.description}</p>
            ${subtasksHtml}
            <div class="show-initials-taskcard">
                <div class="initials-container">${initialsHtml}</div>
                <img src="${priorityIcon}" alt="Image" class="taskcard-img">
            </div>
        </div>`;
}


function cleanNameForInitials(name) {
    return name.replace(" (YOU)", "");
}


function getPriorityIcon(priority) {
    const icons = {
        Urgent: './assets/img/prio-urgent-icon-unclicked.png',
        Medium: './assets/img/prio-medium-icon-unclicked.png',
        Low: './assets/img/prio-low-icon-unclicked.png'
    };
    return icons[priority] || icons['Low'];
}


function generateSubtasksProgressHTML(taskItem) {
    if (!taskItem.subtasks || taskItem.subtasks.length === 0) return '';

    let completedSubtasks = taskItem.subtasks.filter(subtask => subtask.done).length;
    return `
        <div class="progress-bar-subtask">
            <div class="progress-container">
                <div class="progress-background"></div>
                <div id="progressBar_${taskItem.firebaseId}" class="progress-bar"></div>
            </div>
            <div class="subtask-container">
                <p class="subtask-progress" id="subtaskProgress_${taskItem.firebaseId}">${completedSubtasks}/${taskItem.subtasks.length} Subtasks</p>
            </div>
        </div>`;
}


function setModalTitle(taskItem) {
    const modalTitle = document.getElementById("modalTitle");
    modalTitle.innerText = taskItem.userCategory;
    modalTitle.className = `task-category-${taskItem.userCategory.replace(/\s+/g, '-')}`;
}


function setModalContent(taskItem) {
    document.getElementById("modalUserTitle").innerText = taskItem.title;
    document.getElementById("modalDescription").innerText = taskItem.description;
    document.getElementById("modalDate").innerText = taskItem.date;
    document.getElementById("modalSubtasks").innerHTML = generateSubtasksHTML(taskItem.firebaseId, taskItem.subtasks);
    document.getElementById("modalInitials").innerHTML = generateInitialsHTML(taskItem.assign || []);
    document.getElementById("modalPriorityIcon").src = getPriorityIcon(taskItem.priority);
    document.getElementById("modalPriorityText").innerText = taskItem.priority;
    document.getElementById("deleteTaskBtn").innerHTML = `<button onclick="deleteTask('${taskItem.firebaseId}')"><img src="assets/img/delete.png" alt="delete task">Delete</button>`;
    document.getElementById("editTaskBtn").innerHTML = `<button onclick="openEditTask('${taskItem.firebaseId}')"><img src="assets/img/edit.png" alt="edit task">Edit Task</button>`;
}


function showModal(taskItem) {
    setModalTitle(taskItem);
    setModalContent(taskItem);
    displayModal();
}


function generateInitialsHTML(assignedInitialsArray) {
    const sortedArray = assignedInitialsArray.sort((a, b) => {
        const nameA = cleanNameForInitials(a.name).toUpperCase();
        const nameB = cleanNameForInitials(b.name).toUpperCase(); 
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
    });

    return sortedArray.map(assignData => `
        <div class="assign-details">
            <span class="show-initials" style="background-color: ${assignData.bgNameColor}">
                ${assignData.initials}
            </span>
            <span class="assign-name">${cleanNameForInitials(assignData.name)}</span>
        </div>`
    ).join('');
}


function generateSubtasksHTML(firebaseId, subtasks) {
    if (!subtasks || subtasks.length === 0) return '';

    return '<ul class="popup-subtask-ul">' + subtasks.map((subtask, index) => `
        <li class="popup-subtask-list">
            <input type="checkbox" id="subtask-${firebaseId}-${index}" ${subtask.done ? 'checked' : ''} onclick="toggleSubtask('${firebaseId}', ${index})">
            <label class="break" for="subtask-${firebaseId}-${index}">${subtask.title}</label>
        </li>`
    ).join('') + '</ul>';
}


async function toggleSubtask(firebaseId, subtaskIndex) {
    const taskIndex = task.findIndex(taskItem => taskItem.firebaseId === firebaseId);
    if (taskIndex === -1) {
        console.error("Aufgabe mit der angegebenen Firebase-ID nicht gefunden:", firebaseId);
        return;
    }

    task[taskIndex].subtasks[subtaskIndex].done = !task[taskIndex].subtasks[subtaskIndex].done;

    try {
        await updateTaskInFirebase(firebaseId, { subtasks: task[taskIndex].subtasks });
        updateProgressBar(task[taskIndex]);
        updateTaskCardSubtasks(task[taskIndex]);
        updatePopupSubtasks(task[taskIndex]);
    } catch (error) {
        console.error("Fehler beim Aktualisieren der Subtask in Firebase:", error);
    }
}


function updateProgressBar(taskItem) {
    const totalSubtasks = (taskItem.subtasks || []).length;
    if (totalSubtasks === 0) return;

    const completedSubtasks = (taskItem.subtasks || []).filter(subtask => subtask.done).length;
    const progressBar = document.getElementById(`progressBar_${taskItem.firebaseId}`);

    if (!progressBar) {
        console.error(`Fortschrittsbalken für taskItem mit ID ${taskItem.firebaseId} nicht gefunden.`);
        return;
    }

    const progressPercentage = (completedSubtasks / totalSubtasks) * 100;
    progressBar.style.width = `${progressPercentage}%`;

    const subtaskProgress = document.getElementById(`subtaskProgress_${taskItem.firebaseId}`);
    if (subtaskProgress) {
        subtaskProgress.textContent = `${completedSubtasks}/${totalSubtasks} Subtasks`;
    }
}


function updatePopupSubtasks(taskItem) {
    document.getElementById("modalSubtasks").innerHTML = generateSubtasksHTML(taskItem.firebaseId, taskItem.subtasks);
}


function updateTaskCardSubtasks(taskItem) {
    const taskCardSubtasks = document.querySelector(`[data-firebase-id="${taskItem.firebaseId}"] .subtask-progress`);
    if (taskCardSubtasks) {
        const completedSubtasks = taskItem.subtasks.filter(subtask => subtask.done).length;
        taskCardSubtasks.textContent = `${completedSubtasks}/${taskItem.subtasks.length} Subtasks`;
    }
}


function validateRequiredFields() {
    if (!requiredFields()) {
        return false;
    }
    return true;
}

function createTaskObject() {
    let taskTitle = document.getElementById('title').value;
    let taskDescription = document.getElementById('taskDescription').value;
    let date = document.getElementById('dueDate').value;
    let userCategory = document.querySelector('input[name="category"]:checked')?.value;
    let assignDetails = getAssignedDetails();
    let subtasks = getSubtasks();

    return {
        title: taskTitle,
        description: taskDescription,
        date: date,
        category: currentCategory,
        userCategory: userCategory,
        assign: assignDetails,
        subtasks: subtasks,
        priority: selectedPriority
    };
}


function finalizeTaskCreation(newTask) {
    task.push(newTask); 
    generateTask(); 
    closeTaskPopup(); 
    clearTaskForm(); 
}

async function createTask(event) {
    event.preventDefault();
    if (!validateRequiredFields()) return;

    const newTask = createTaskObject();

    try {
        const responseData = await postNewTask(newTask);
        newTask.firebaseId = responseData.name; 
        finalizeTaskCreation(newTask);
    } catch (error) {
        alert(`Fehler beim Erstellen der Aufgabe: ${error.message}`);
    }
}

function clearCategorySelection() {
    const categoryOptions = document.querySelectorAll('.dropdown-content-category input[type="radio"]');
    categoryOptions.forEach(option => {
        option.checked = false;
    });
    document.getElementById('categoryText').textContent = 'Category';
}

function resetPriority() {
    const buttons = document.querySelectorAll('.prio-buttons button');
    buttons.forEach(button => {
        button.classList.remove('selected');
        const img = button.querySelector('img');
        img.src = button.getAttribute('data-original-image'); 
    });
}

function clearAssignedCheckboxes() {
    const assignedCheckboxes = document.querySelectorAll('#assigned input[type="checkbox"]');
    assignedCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
}



function searchTasks() {
    const searchTerm = document.getElementById('searchBarInput').value.toLowerCase();

    if (searchTerm.trim() !== '') {
        task.forEach(taskItem => {
            const title = taskItem.title.toLowerCase();
            const description = taskItem.description.toLowerCase();
            const taskCard = document.querySelector(`[data-firebase-id="${taskItem.firebaseId}"]`);
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                taskCard.style.display = '';
            } else {
                taskCard.style.display = 'none';
            }
        });
    } else {
        resetTaskCardVisibility(); 
    }
}


function resetTaskCardVisibility() {
    task.forEach(taskItem => {
        const taskCard = document.querySelector(`[data-firebase-id="${taskItem.firebaseId}"]`);
        taskCard.style.display = ''; 
    });
}

/**
 * Closes the task card modal by setting its display style to 'none'.
 */
function closeTaskCard() {
    document.getElementById('taskModal').style.display = 'none';
}

/**
 * Closes the add task popup modal by setting its display style to 'none'.
 */
function closeAddTaskPopup() {
    document.getElementById('addTaskModel').style.display = 'none';
}

/**
 * Slides in a popup with the given ID.
 * @param {string} popupId - The ID of the popup to slide in.
 */
function slideInPopupTask(popupId) {
    let popup = document.getElementById(popupId);    
    popup.classList.add('slide-in'); 
}

/**
 * Ends the slide-in animation for a popup with the given ID.
 * @param {string} popupId - The ID of the popup to end the slide-in animation for.
 */
function endSlideInPopupTask(popupId) {
    let popup = document.getElementById(popupId);    
    popup.classList.remove('slide-in'); 
}

