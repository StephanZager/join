/**
 * Clears all inputs and selections within the task form and resets global subtasks.
 */
function clearTaskForm() {
    clearAssignedCheckboxes();
    resetPriority();
    clearCategorySelection();
    
    document.getElementById('title').value = '';
    document.getElementById('taskDescription').value = '';
    document.getElementById('assignedInitial').innerHTML = '';
    document.getElementById('dueDate').value = '';
    document.getElementById('subtaskList').innerHTML = '';
    globalSubtasks = [];
}

/**
 * Opens the 'addTaskModel' popup by setting its display style to 'flex' or adding a hidden class.
 * @param {string} category - The category of the task to be added.
 */
function openTaskPopup(category) {
    currentCategory = category;
    let addTaskModel = document.getElementById("addTaskModel");
    if (window.innerWidth > 900) {
        addTaskModel.style.display = "flex";
    } else {
        addTaskModel.classList.add("hidden-responsive");
    }
}

/**
 * Adjusts the visibility of the 'addTaskModel' element based on the window's width.
 */
function checkWindowSize() {
    let addTaskModel = document.getElementById("addTaskModel");
    if (window.innerWidth <= 900) {
        addTaskModel.classList.add("hidden-responsive");
    } else {
        if (addTaskModel.style.display === "flex") {
            addTaskModel.classList.remove("hidden-responsive");
        }
    }
}

window.addEventListener('load', checkWindowSize);
window.addEventListener('resize', checkWindowSize);

/**
 * Closes the 'addTaskModel' popup by setting its display style to 'none'.
 */
function closeTaskPopup() {
    document.getElementById("addTaskModel").style.display = "none";
}

/**
 * Displays the task modal.
 */
function displayModal() {
    const modal = document.getElementById("taskModal");
    modal.style.display = "flex";
    document.getElementById('modalTaskcard').classList.remove('modal-task-popup-display-none');
    setTimeout(() => {
        slideInPopupTask('taskCardPoupAnimation');
    }, 10);
}

document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("click", function (event) {
        const isPopupArrow = event.target.closest(".task-popup-arrow");
        if (isPopupArrow) {
            return; 
        }

        const taskCard = event.target.closest(".taskCard");
        if (taskCard) {
            const firebaseId = taskCard.getAttribute("data-firebase-id");
            const taskItem = task.find(t => t.firebaseId === firebaseId);
            if (taskItem) showModal(taskItem);
        }
    });
});

/**
 * Opens the task window by navigating to 'addtask.html'.
 */
function openTaskWindow() {
    window.location.href = "addtask.html";
}