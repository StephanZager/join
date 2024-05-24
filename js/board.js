let currentDraggedElement;
let task = [];

// Loading tasks from Firebase
async function loadTask(path = "/userTask") {
    try {
        let response = await fetch(BASE_URL + path + ".json");
        let responseToJson = await response.json();

        if (responseToJson) {
            // Clear the task array before adding new tasks
            task = [];
            let tasksArray = Object.entries(responseToJson).map(([firebaseId, taskData]) => ({ firebaseId, ...taskData }));
            task.push(...tasksArray);
        }

        generateTask();
    } catch (error) {
        console.error("Fehler beim Laden der Daten:", error);
    }
}

// Generating the task list
function generateTask() {
    ['toDo', 'inProgress', 'awaitFeedback', 'done'].forEach(category => {
        let tasksInCategory = task.filter(t => t.category === category);
        let categoryElement = document.getElementById(category);
        categoryElement.innerHTML = ''; // Clear existing tasks

        tasksInCategory.forEach(taskItem => {
            categoryElement.innerHTML += generateTaskHTML(taskItem);
        });
    });
}

// Generating the HTML for a single task
function generateTaskHTML(taskItem) {
    let assignedInitialsArray = taskItem.assign || [];
    let initialsHtml = '';

    for (let j = 0; j < assignedInitialsArray.length; j++) {
        let assignData = assignedInitialsArray[j];
        initialsHtml += `<span class="show-initials" style="background-color: ${assignData.bgNameColor}">${assignData.initials}</span>`;
    }

    let priorityIcon;
    if (taskItem.priority === 'Urgent') {
        priorityIcon = './assets/img/prio-urgent-icon-unclicked.png';
    } else if (taskItem.priority === 'Medium') {
        priorityIcon = './assets/img/prio-medium-icon-unclicked.png';
    } else {
        priorityIcon = './assets/img/prio-low-icon-unclicked.png';
    }

    let subtasksHtml = '';
    if (taskItem.subtasks && taskItem.subtasks.length > 0) {
        let completedSubtasks = taskItem.subtasks.filter(subtask => subtask.done).length;
        subtasksHtml = `<p class="subtask-progress">${completedSubtasks}/${taskItem.subtasks.length} Subtasks</p>`;
    }

    let progressDiv = '';
    if (subtasksHtml) {
        progressDiv = `
        <div class="progress-bar-subtask">
            <div class="progress-container">
                <div class="progress-background"></div>
                <div id="progressBar_${taskItem.firebaseId}" class="progress-bar"></div>
            </div>
            <div class="subtask-container">
                ${subtasksHtml}
            </div>
        </div>`;
    }

    return `
        <div draggable="true" ondragstart="startDragging(event, '${taskItem.firebaseId}')" ondragend="stopDragging(event)" class="taskCard" data-firebase-id="${taskItem.firebaseId}">
            <h4 class="task-category-${taskItem.userCategory}">${taskItem.userCategory}</h4>
            <p class="task-title">${taskItem.title}</p>
            <p class="task-description">${taskItem.description}</p>
            ${progressDiv}
            <div class="show-initials-taskcard">
                <div class="initials-container">${initialsHtml}</div>
                <img src="${priorityIcon}" alt="Image" class="taskcard-img">
            </div>
        </div>`;
}

// Drag and drop functions
function startDragging(ev, firebaseId) {
    currentDraggedElement = firebaseId;
    ev.dataTransfer.setData("text/plain", firebaseId);
    // Füge die Drehungs-Klasse hinzu
    ev.target.classList.add('rotated');
}

function keepDragging(ev) {
    // Verhindert das Standardverhalten, damit das Element gedroppt werden kann
    ev.preventDefault();
    // Füge die Drehungs-Klasse hinzu, falls sie entfernt wurde
    if (!ev.target.classList.contains('rotated')) {
        ev.target.classList.add('rotated');
    }
}

function stopDragging(ev) {
    // Entferne die Drehungs-Klasse nach dem Drag-Vorgang
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
        generateTask(); // Refresh display after moving the task
        
        // Update progress bar
        updateProgressBar(task[taskIndex]);
    } catch (error) {
        console.error("Fehler beim Verschieben der Aufgabe:", error);
    }
}

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


// Modal-related code
document.addEventListener("DOMContentLoaded", function() {
    const modal = document.getElementById("taskModal");
    const span = document.getElementsByClassName("close")[0];

    function showModal(taskItem) {
        const modal = document.getElementById("taskModal");
        const modalTitle = document.getElementById("modalTitle");
        
        modalTitle.innerText = taskItem.userCategory;
        
        const categoryClass = `task-category-${taskItem.userCategory.replace(/\s+/g, '-')}`;
        modalTitle.classList.forEach(className => {
            if (className.startsWith('task-category-')) {
                modalTitle.classList.remove(className);
            }
        });
        modalTitle.classList.add(categoryClass);
        
        document.getElementById("modalUserTitle").innerText = taskItem.title;
        document.getElementById("modalDescription").innerText = taskItem.description;
        document.getElementById("modalDate").innerText = taskItem.date;
        document.getElementById("modalSubtasks").innerHTML = generateSubtasksHTML(taskItem.firebaseId, taskItem.subtasks);
        document.getElementById("modalInitials").innerHTML = generateInitialsHTML(taskItem.assign || []);
        document.getElementById("modalPriorityIcon").src = getPriorityIcon(taskItem.priority);
        
        // Set the priority text
        document.getElementById("modalPriorityText").innerText = taskItem.priority;
    
        modal.style.display = "block";
    }

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    function generateInitialsHTML(assignedInitialsArray) {
        let initialsHtml = '';
        assignedInitialsArray.forEach(assignData => {
            initialsHtml += `
            
                <div class="assign-details">
                    
                    <span class="show-initials" style="background-color: ${assignData.bgNameColor}">
                        ${assignData.initials}
                    </span>
                    <span class="assign-name">${assignData.name}</span>
                </div>`;
        });
    
        return initialsHtml;
    }

    function getPriorityIcon(priority) {
        if (priority === 'Urgent') {
            return './assets/img/prio-urgent-icon-unclicked.png';
        } else if (priority === 'Medium') {
            return './assets/img/prio-medium-icon-unclicked.png';
        } else {
            return './assets/img/prio-low-icon-unclicked.png';
        }
    }

    function generateSubtasksHTML(firebaseId, subtasks) {
        if (!subtasks || subtasks.length === 0) {
            return '';
        }

        let subtasksHtml = '<ul>';
        subtasks.forEach((subtask, index) => {
            subtasksHtml += `
                <li>
                    <input type="checkbox" id="subtask-${firebaseId}-${index}" ${subtask.done ? 'checked' : ''} onclick="toggleSubtask('${firebaseId}', ${index})">
                    <label for="subtask-${firebaseId}-${index}">${subtask.title}</label>
                </li>`;
        });
        subtasksHtml += '</ul>';
        return subtasksHtml;
    }

    document.addEventListener("click", function(event) {
        if (event.target.classList.contains("taskCard")) {
            const firebaseId = event.target.getAttribute("data-firebase-id");
            const taskItem = task.find(t => t.firebaseId === firebaseId);
            if (taskItem) {
                showModal(taskItem);
            }
        }
    });
});

async function toggleSubtask(firebaseId, subtaskIndex) {
    const taskIndex = task.findIndex(taskItem => taskItem.firebaseId === firebaseId);
    if (taskIndex === -1) {
        console.error("Aufgabe mit der angegebenen Firebase-ID nicht gefunden:", firebaseId);
        return;
    }

    // Reverse subtask status
    task[taskIndex].subtasks[subtaskIndex].done = !task[taskIndex].subtasks[subtaskIndex].done;

    try {
        // Update subtasks in Firebase
        await updateTaskInFirebase(firebaseId, { subtasks: task[taskIndex].subtasks });

        // Update progress bar and display in popup
        updateProgressBar(task[taskIndex]);
        updatePopupSubtasks(task[taskIndex]);
    } catch (error) {
        console.error("Fehler beim Aktualisieren der Subtask in Firebase:", error);
    }
}


function updateProgressBar(taskItem) {
    const totalSubtasks = taskItem.subtasks.length;
    const completedSubtasks = taskItem.subtasks.filter(subtask => subtask.done).length;
    const progressBar = document.getElementById(`progressBar_${taskItem.firebaseId}`);

    let progressPercentage = 0;

    if (totalSubtasks > 0) {
        progressPercentage = (completedSubtasks / totalSubtasks) * 100;
    }

    progressBar.style.width = progressPercentage + '%';
    progressBar.style.backgroundColor = 'lightblue';
}



function updatePopupSubtasks(taskItem) {
    const completedSubtasks = taskItem.subtasks.filter(subtask => subtask.done).length;
    const popupSubtasksElement = document.querySelector(`[data-firebase-id="${taskItem.firebaseId}"] .subtask-progress`);
    popupSubtasksElement.textContent = `${completedSubtasks}/${taskItem.subtasks.length} Subtasks`;
}

// Initial load of tasks
loadTask();

