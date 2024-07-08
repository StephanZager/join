function clearSubtasks() {
    const buttons = document.querySelectorAll('.prio-buttons');
    buttons.forEach(button => {
        button.classList.remove('selected');
        const img = button.querySelector('img');
        img.src = button.getAttribute('data-original-image'); // Set to original image
    });
    subtaskList = [];
    document.getElementById('subtaskList').innerHTML = '';
    assignDetails = [];
    document.getElementById('assignedInitial').innerHTML = '';
    clearCategorySelection();
}

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
 * Opens the 'addTaskModel' popup by setting its display style to 'block'.
 */
function openTaskPopup(category) {
    currentCategory = category;
    document.getElementById("addTaskModel").style.display = "flex";
}

/**
 * Closes the 'addTaskModel' popup by setting its display style to 'none'.
 */
function closeTaskPopup() {
    document.getElementById("addTaskModel").style.display = "none";
}

function displayModal() {
    const modal = document.getElementById("taskModal");
    modal.style.display = "block";
    document.getElementById('modalTaskcard').classList.remove('modal-task-popup-display-none');
    setTimeout(() => {
        slideInPopupTask('taskCardPoupAnimation');
    }, 10);
}

// Modal-bezogener Code
document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("taskCard")) {
            const firebaseId = event.target.getAttribute("data-firebase-id");
            const taskItem = task.find(t => t.firebaseId === firebaseId);
            if (taskItem) showModal(taskItem);
        }
    });
});




/**
 * Opens the task window by navigating to 'addtask_desktop.html'.
 */
function openTaskWindow() {
    window.location.href = "addtask_desktop.html";
}