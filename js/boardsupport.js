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
    let addTaskModel = document.getElementById("addTaskModel");
    // Überprüfen Sie die Fenstergröße, bevor Sie das Popup anzeigen
    if (window.innerWidth > 900) {
        addTaskModel.style.display = "flex";
    } else {
        addTaskModel.classList.add("hidden-responsive");
    }
}

function checkWindowSize() {
    let addTaskModel = document.getElementById("addTaskModel");
    if (window.innerWidth <= 900) {
        // Fügen Sie die Klasse 'hidden-responsive' hinzu, wenn die Fensterbreite 900px oder weniger beträgt
        addTaskModel.classList.add("hidden-responsive");
    } else {
        // Entfernen Sie die Klasse 'hidden-responsive', wenn die Fensterbreite größer als 900px ist
        // Stellen Sie sicher, dass das Element nur angezeigt wird, wenn es auch angezeigt werden soll
        if (addTaskModel.style.display === "flex") {
            addTaskModel.classList.remove("hidden-responsive");
        }
    }
}

// Überprüfen Sie die Fenstergröße beim Laden der Seite und bei Größenänderungen
window.addEventListener('load', checkWindowSize);
window.addEventListener('resize', checkWindowSize);

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