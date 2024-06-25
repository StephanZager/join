let currentDraggedElement;
let currentCategory = '';
let task = [];

// Laden der Aufgaben aus Firebase
async function loadTask(path = "/userTask") {
    try {
        let response = await fetch(BASE_URL + path + ".json");
        let responseToJson = await response.json();

        if (responseToJson) {
            task = Object.entries(responseToJson).map(([firebaseId, taskData]) => ({ firebaseId, ...taskData }));
        }

        generateTask();
    } catch (error) {
        console.error("Fehler beim Laden der Daten:", error);
    }
}

// Generieren der Aufgabenlisten
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

    // Debugging-Ausgabe
    console.log("Tasks generiert:", task);
}


function generatePlaceholderHTML(category) {
    return `<div class="placeholder"><span>No tasks ${category}</span></div>`;
}

// Generieren des HTML für eine einzelne Aufgabe
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
            <h4 class="task-category-${taskItem.userCategory}">${taskItem.userCategory}</h4>
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

// Drag-and-Drop-Funktionen
function startDragging(ev, firebaseId) {
    currentDraggedElement = firebaseId;
    ev.dataTransfer.setData("text/plain", firebaseId);
    ev.target.classList.add('rotated');
}

function stopDragging(ev) {
    ev.target.classList.remove('rotated');
}

function allowDrop(ev) {
    ev.preventDefault();
}

async function moveTo(category) {
    const firebaseId = currentDraggedElement;
    if (!firebaseId) {
        console.error("Keine verschobene Aufgabe gefunden.");
        return;
    }

    const taskIndex = task.findIndex(taskItem => taskItem.firebaseId === firebaseId);
    if (taskIndex === -1) {
        console.error("Aufgabe mit der angegebenen Firebase-ID nicht gefunden:", firebaseId);
        return;
    }

    try {
        task[taskIndex].category = category;
        await updateTaskInFirebase(firebaseId, { category });
        generateTask();
        if ((task[taskIndex].subtasks || []).length > 0) {
            updateProgressBar(task[taskIndex]);
        }
    } catch (error) {
        console.error("Fehler beim Verschieben der Aufgabe:", error);
    }
}

// Aktualisieren der Aufgabe in Firebase
async function updateTaskInFirebase(firebaseId, newData) {
    try {
        await fetch(`${BASE_URL}/userTask/${firebaseId}.json`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newData)
        });
        console.log("Aufgabe in Firebase erfolgreich aktualisiert.");
    } catch (error) {
        console.error("Fehler beim Aktualisieren der Aufgabe in Firebase:", error);
        throw error;
    }
}

// Modal-bezogener Code
document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("taskModal");
    const span = document.getElementsByClassName("close")[0];

    span.onclick = () => {
        modal.style.display = "none";
        endSlideInPopupTask('taskCardPoupAnimation'); // Call your additional function here
        resetTaskCardColors();
    }; 
    

    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("taskCard")) {
            const firebaseId = event.target.getAttribute("data-firebase-id");
            const taskItem = task.find(t => t.firebaseId === firebaseId);
            if (taskItem) showModal(taskItem);
        }
    });
});

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

function displayModal() {
    const modal = document.getElementById("taskModal");
    modal.style.display = "block";
    document.getElementById('modalTaskcard').classList.remove('modal-task-popup-display-none');
    setTimeout(() => {
        slideInPopupTask('taskCardPoupAnimation');
    }, 10);
}

function showModal(taskItem) {
    setModalTitle(taskItem);
    setModalContent(taskItem);
    displayModal();
}

function generateInitialsHTML(assignedInitialsArray) {
    // Sortiert die Liste alphabetisch nach dem bereinigten Namen
    const sortedArray = assignedInitialsArray.sort((a, b) => {
        const nameA = cleanNameForInitials(a.name).toUpperCase(); // Groß-/Kleinschreibung ignorieren
        const nameB = cleanNameForInitials(b.name).toUpperCase(); // Groß-/Kleinschreibung ignorieren
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
            <label for="subtask-${firebaseId}-${index}">${subtask.title}</label>
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
/**
 * Updates the progress bar and subtask count for a given task item.
 * The progress bar's width is set to the percentage of completed subtasks.
 * The subtask count is updated with the format 'completed/total Subtasks'.
 * If the task item has no subtasks or the progress bar is not found, the function returns early.
 * @param {Object} taskItem - The task item to update the progress bar for. Must have a `firebaseId` and `subtasks` property.
 */
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
/**
 * Updates the subtasks in the popup for a given task item.
 * The 'modalSubtasks' element's innerHTML is set to the result of the `generateSubtasksHTML` function.
 * Assumes that a function named `generateSubtasksHTML` is defined elsewhere.
 * @param {Object} taskItem - The task item to update the popup subtasks for. Must have a `firebaseId` and `subtasks` property.
 */
function updatePopupSubtasks(taskItem) {
    document.getElementById("modalSubtasks").innerHTML = generateSubtasksHTML(taskItem.firebaseId, taskItem.subtasks);
}
/**
 * Updates the subtask count on the task card for a given task item.
 * The subtask count is updated with the format 'completed/total Subtasks'.
 * If the task card's subtask element is not found, the function returns early.
 * @param {Object} taskItem - The task item to update the task card subtasks for. Must have a `firebaseId` and `subtasks` property.
 */
function updateTaskCardSubtasks(taskItem) {
    const taskCardSubtasks = document.querySelector(`[data-firebase-id="${taskItem.firebaseId}"] .subtask-progress`);
    if (taskCardSubtasks) {
        const completedSubtasks = taskItem.subtasks.filter(subtask => subtask.done).length;
        taskCardSubtasks.textContent = `${completedSubtasks}/${taskItem.subtasks.length} Subtasks`;
    }
}









async function createTask(event) {
    event.preventDefault();
    
    // Debugging-Ausgabe
    console.log("createTask aufgerufen");

    let taskTitle = document.getElementById('taskTitle').value;
    let taskDescription = document.getElementById('taskDescription').value;
    let userCategory = document.getElementById('category').value;
    let assignDetails = getAssignedDetails();
    let subtasks = getSubtasks();

    // Überprüfen Sie, ob currentCategory korrekt gesetzt ist
    if (!currentCategory) {
        console.error('Kategorie nicht gesetzt');
        alert('Bitte wählen Sie eine Kategorie aus.');
        return;
    }

    const newTask = {
        title: taskTitle,
        description: taskDescription,
        category: currentCategory, // Verwenden der aktuellen Kategorie
        userCategory: userCategory,
        assign: assignDetails,
        subtasks: subtasks,
        priority: selectedPriority
    };

    try {
        const response = await fetch(`${BASE_URL}/userTask.json`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newTask),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        newTask.firebaseId = responseData.name; // Setzen der Firebase-ID des neuen Tasks

        // Debugging-Ausgabe
        console.log("Neuer Task erstellt:", newTask);

        task.push(newTask); // Hinzufügen des neuen Tasks zur lokalen Task-Liste
        generateTask(); // Aktualisieren der Anzeige
        closeTaskPopup(); // Schließen des Popups nach der Erstellung

    } catch (error) {
        console.error('Fehler beim Erstellen der Aufgabe:', error);
        alert(`Fehler beim Erstellen der Aufgabe: ${error.message}`);
    }
}










/**
 * Opens the 'addTaskModel' popup by setting its display style to 'block'.
 */
function openTaskPopup(category) {
    currentCategory = category;
    console.log('Kategorie gesetzt:', currentCategory); // Debugging-Ausgabe
    document.getElementById("addTaskModel").style.display = "block";
}

/**
 * Closes the 'addTaskModel' popup by setting its display style to 'none'.
 */
function closeTaskPopup() {
    document.getElementById("addTaskModel").style.display = "none";
}

/**
 * Deletes a task with the given Firebase ID by sending a DELETE request to the server.
 * If the request is successful, the task is also removed from the `task` array and the tasks are regenerated.
 * If the 'taskModal' element exists, its display style is set to 'none'.
 * If an error occurs during the request, it is logged to the console and an alert is shown with the error message.
 * @param {string} firebaseId - The Firebase ID of the task to delete.
 */
async function deleteTask(firebaseId) {
    try {
        let response = await fetch(BASE_URL + `/userTask/${firebaseId}.json`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        task = task.filter(t => t.firebaseId !== firebaseId);
        generateTask();

        const modal = document.getElementById("taskModal");
        if (modal) {
            modal.style.display = "none";
        }
    } catch (error) {
        console.error('Fehler beim Löschen der Aufgabe:', error);
        alert(`Fehler beim Löschen der Aufgabe: ${error.message}`);
    }
}
/**
 * Searches tasks based on the input from the 'searchBarInput' element.
 * If the search term is found in the title or description of a task, the task card's background color is set to yellow.
 * If the search term is not found, the task card's background color is reset.
 * If the search term is empty, all task card colors are reset.
 * Assumes that `task` is an array of objects, each with a `title`, `description`, and `firebaseId` property.
 * Also assumes that a function named `resetTaskCardColors` is defined elsewhere.
 */
function searchTasks() {
    const searchTerm = document.getElementById('searchBarInput').value.toLowerCase(); 

    if (searchTerm.trim() !== '') {
        task.forEach(taskItem => {
            const title = taskItem.title.toLowerCase();
            const description = taskItem.description.toLowerCase();
            const taskCard = document.querySelector(`[data-firebase-id="${taskItem.firebaseId}"]`);

            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                taskCard.style.backgroundColor = 'yellow';
            } else {
                taskCard.style.backgroundColor = '';
            }
        });
    } else { 
        resetTaskCardColors();
    }
}
/**
 * Resets the background color of all task cards.
 * Assumes that `task` is an array of objects, each with a `firebaseId` property.
 */
function resetTaskCardColors() {
    task.forEach(taskItem => {
        const taskCard = document.querySelector(`[data-firebase-id="${taskItem.firebaseId}"]`);
        taskCard.style.backgroundColor = ''; 
    });
}

// Add the event listener when the document is loaded
document.addEventListener('DOMContentLoaded', (event) => {
    /**
     * Closes the task popup when the 'closePopupButton' is clicked.
     * Assumes that a function named `closeTaskPopup` is defined elsewhere.
     */
    document.getElementById('closePopupButton').addEventListener('click', closeTaskPopup);
});

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

/**
 * Opens the task window by navigating to 'addtask_desktop.html'.
 */
function openTaskWindow() {
    window.location.href = "addtask_desktop.html";
}
