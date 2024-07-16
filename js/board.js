/**
 * Current category and task list.
 * @type {string}
 * @type {Array}
 */
let currentCategory = '';
let task = [];

/**
 * Generates and displays tasks for each category.
 */
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

/**
 * Generates HTML for a task item.
 * @param {Object} taskItem - Task object.
 * @returns {string} - HTML string for the task item.
 */
function generateTaskHTML(taskItem) {
    let assignArray = taskItem.assign || [];
    let initialCount = assignArray.length;
    let visibleInitials = assignArray.slice(0, 4);
    let hiddenInitialsCount = initialCount > 4 ? initialCount - 4 : 0;

    let initialsHtml = generateInitialsHtml(visibleInitials);

    if (hiddenInitialsCount > 0) {
        initialsHtml += `<span class="show-initials">+${hiddenInitialsCount}</span>`;
    }

    let priorityIcon = getPriorityIcon(taskItem.priority);
    let subtasksHtml = generateSubtasksProgressHTML(taskItem);

    return buildTaskHTML(taskItem, initialsHtml, priorityIcon, subtasksHtml);
}

/**
 * Cleans the assignee name by removing " (YOU)".
 * @param {string} name - Assignee name.
 * @returns {string} - Cleaned name.
 */
function cleanNameForInitials(name) {
    return name.replace(" (YOU)", "");
}

/**
 * Returns the URL of the priority icon.
 * @param {string} priority - Priority level.
 * @returns {string} - URL of the priority icon.
 */
function getPriorityIcon(priority) {
    const icons = {
        Urgent: './assets/img/prio-urgent-icon-unclicked.png',
        Medium: './assets/img/prio-medium-icon-unclicked.png',
        Low: './assets/img/prio-low-icon-unclicked.png'
    };
    return icons[priority] || icons['Low'];
}

/**
 * Generates HTML for subtask progress.
 * @param {Object} taskItem - Task object.
 * @returns {string} - HTML string for subtask progress.
 */
function generateSubtasksProgressHTML(taskItem) {
    if (!taskItem.subtasks || taskItem.subtasks.length === 0) return '';

    let completedSubtasks = taskItem.subtasks.filter(subtask => subtask.done).length;
    return buildSubtasksProgressHTML(taskItem, completedSubtasks);
}

/**
 * Sets the modal title based on the task category.
 * @param {Object} taskItem - Task object.
 */
function setModalTitle(taskItem) {
    const modalTitle = document.getElementById("modalTitle");
    modalTitle.innerText = taskItem.userCategory;
    modalTitle.className = `task-category-${taskItem.userCategory.replace(/\s+/g, '-')}`;
}

/**
 * Sets the modal content based on the task details.
 * @param {Object} taskItem - Task object.
 */
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

/**
 * Displays the task modal with the given task details.
 * @param {Object} taskItem - Task object.
 */
function showModal(taskItem) {
    setModalTitle(taskItem);
    setModalContent(taskItem);
    displayModal();
}

/**
 * Generates HTML for the initials of assigned users.
 * @param {Array} assignedInitialsArray - Array of assigned user data.
 * @returns {string} - HTML string for the initials.
 */
function generateInitialsHTML(assignedInitialsArray) {
    const sortedArray = assignedInitialsArray.sort((a, b) => {
        const nameA = cleanNameForInitials(a.name).toUpperCase();
        const nameB = cleanNameForInitials(b.name).toUpperCase(); 
        return nameA < nameB ? -1 : (nameA > nameB ? 1 : 0);
    });

    return buildInitialsHTML(sortedArray);
}

/**
 * Generates HTML for the subtasks of a task.
 * @param {string} firebaseId - Firebase ID of the task.
 * @param {Array} subtasks - Array of subtasks.
 * @returns {string} - HTML string for the subtasks.
 */
function generateSubtasksHTML(firebaseId, subtasks) {
    if (!subtasks || subtasks.length === 0) return '';

    return buildSubtasksHTML(firebaseId, subtasks);
}

/**
 * Toggles the completion status of a subtask.
 * @param {string} firebaseId - Firebase ID of the task.
 * @param {number} subtaskIndex - Index of the subtask.
 */
async function toggleSubtask(firebaseId, subtaskIndex) {
    const taskIndex = task.findIndex(taskItem => taskItem.firebaseId === firebaseId);
    if (taskIndex === -1) {
        console.error("Task with the given Firebase ID not found:", firebaseId);
        return;
    }

    task[taskIndex].subtasks[subtaskIndex].done = !task[taskIndex].subtasks[subtaskIndex].done;

    try {
        await updateTaskInFirebase(firebaseId, { subtasks: task[taskIndex].subtasks });
        updateProgressBar(task[taskIndex]);
        updateTaskCardSubtasks(task[taskIndex]);
        updatePopupSubtasks(task[taskIndex]);
    } catch (error) {
        console.error("Error updating subtask in Firebase:", error);
    }
}

/**
 * Updates the progress bar of a task.
 * @param {Object} taskItem - Task object.
 */
function updateProgressBar(taskItem) {
    const totalSubtasks = (taskItem.subtasks || []).length;
    if (totalSubtasks === 0) return;

    const completedSubtasks = (taskItem.subtasks || []).filter(subtask => subtask.done).length;
    const progressBar = document.getElementById(`progressBar_${taskItem.firebaseId}`);

    if (!progressBar) {
        console.error(`Progress bar for taskItem with ID ${taskItem.firebaseId} not found.`);
        return;
    }

    const progressPercentage = (completedSubtasks / totalSubtasks) * 100;
    progressBar.style.width = `${progressPercentage}%`;

    const subtaskProgress = document.getElementById(`subtaskProgress_${taskItem.firebaseId}`);
    if (subtaskProgress) {
        subtaskProgress.textContent = `${completedSubtasks}/${totalSubtasks} Subtasks`;
    }
}

/**
 * Updates the subtasks in the task modal.
 * @param {Object} taskItem - Task object.
 */
function updatePopupSubtasks(taskItem) {
    document.getElementById("modalSubtasks").innerHTML = generateSubtasksHTML(taskItem.firebaseId, taskItem.subtasks);
}

/**
 * Updates the subtask progress in the task card.
 * @param {Object} taskItem - Task object.
 */
function updateTaskCardSubtasks(taskItem) {
    const taskCardSubtasks = document.querySelector(`[data-firebase-id="${taskItem.firebaseId}"] .subtask-progress`);
    if (taskCardSubtasks) {
        const completedSubtasks = taskItem.subtasks.filter(subtask => subtask.done).length;
        taskCardSubtasks.textContent = `${completedSubtasks}/${taskItem.subtasks.length} Subtasks`;
    }
}

/**
 * Validates required fields.
 * @returns {boolean} - True if all required fields are filled, false otherwise.
 */
function validateRequiredFields() {
    return requiredFields();
}

/**
 * Creates a task object from form inputs.
 * @returns {Object} - New task object.
 */
function createTaskObject() {
    let taskTitle = document.getElementById('title').value;
    let taskDescription = document.getElementById('taskDescription').value;
    let date = document.getElementById('dueDate').value;
    let userCategory = document.querySelector('input[name="category"]:checked')?.value;
    let assignDetails = getAssignedDetails();
    let subtasks = getSubtasks();

    return buildTaskObject(taskTitle, taskDescription, date, userCategory, assignDetails, subtasks, currentCategory, selectedPriority);
}

/**
 * Builds a task object.
 * @param {string} title - Task title.
 * @param {string} description - Task description.
 * @param {string} date - Due date.
 * @param {string} userCategory - User category.
 * @param {Array} assignDetails - Assignee details.
 * @param {Array} subtasks - Subtasks.
 * @param {string} category - Task category.
 * @param {string} priority - Priority level.
 * @returns {Object} - Task object.
 */
function buildTaskObject(title, description, date, userCategory, assignDetails, subtasks, category, priority) {
    return {
        title: title,
        description: description,
        date: date,
        category: category,
        userCategory: userCategory,
        assign: assignDetails,
        subtasks: subtasks,
        priority: priority
    };
}

/**
 * Finalizes task creation by updating the UI.
 * @param {Object} newTask - New task object.
 */
function finalizeTaskCreation(newTask) {
    task.push(newTask); 
    generateTask(); 
    closeTaskPopup(); 
    clearTaskForm(); 
}

/**
 * Creates a new task and saves it to the database.
 * @param {Event} event - Form submit event.
 */
async function createTask(event) {
    event.preventDefault();
    if (!validateRequiredFields()) return;

    const newTask = createTaskObject();

    try {
        const responseData = await postNewTask(newTask);
        newTask.firebaseId = responseData.name; 
        finalizeTaskCreation(newTask);
    } catch (error) {
        alert(`Error creating task: ${error.message}`);
    }
}

/**
 * Clears the category selection.
 */
function clearCategorySelection() {
    const categoryOptions = document.querySelectorAll('.dropdown-content-category input[type="radio"]');
    categoryOptions.forEach(option => {
        option.checked = false;
    });
    document.getElementById('categoryText').textContent = 'Category';
}

/**
 * Resets the priority selection.
 */
function resetPriority() {
    const buttons = document.querySelectorAll('.prio-buttons button');
    buttons.forEach(button => {
        button.classList.remove('selected');
        const img = button.querySelector('img');
        img.src = button.getAttribute('data-original-image'); 
    });
}

/**
 * Clears the assigned user checkboxes.
 */
function clearAssignedCheckboxes() {
    const assignedCheckboxes = document.querySelectorAll('#assigned input[type="checkbox"]');
    assignedCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
}

/**
 * Searches tasks by title or description.
 */
function searchTasks() {
    const searchTerm = document.getElementById('searchBarInput').value.toLowerCase();

    if (searchTerm.trim() !== '') {
        task.forEach(taskItem => {
            const title = taskItem.title.toLowerCase();
            const description = taskItem.description.toLowerCase();
            const taskCard = document.querySelector(`[data-firebase-id="${taskItem.firebaseId}"]`);
            taskCard.style.display = title.includes(searchTerm) || description.includes(searchTerm) ? '' : 'none';
        });
    } else {
        resetTaskCardVisibility(); 
    }
}

/**
 * Resets the visibility of all task cards.
 */
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
    loadTask();
    checkForMobile();
    console.log(isMobileDevice());
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

