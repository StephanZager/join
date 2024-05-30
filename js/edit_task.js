let isEditing = false;

function openTaskPopup() {
    let modal = document.getElementById('addTaskModel');
    let span = document.getElementsByClassName('close')[0];
   
    modal.style.display = 'block';
    
    span.onclick = function () {
        modal.style.display = 'none';
    }
    
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
}


function removeOnsubmit() {
    // Entfernen Sie das onsubmit-Event des Formulars
    let form = document.getElementById('addTaskFormRemove');
    if (form) {
        form.onsubmit = null;
    } else {
        console.error("Formular mit ID 'addTaskFormRemove' nicht gefunden.");
    }

    // Fügen Sie ein onclick-Event zum Bestätigungsbutton hinzu
    let confirmBtn = document.getElementById('confirmBtn');
    if (confirmBtn) {
        confirmBtn.onclick = async function(event) {
            event.preventDefault(); // Verhindert das Absenden des Formulars
            await editTask();
        };
    } else {
        console.error("Button mit ID 'confirmBtn' nicht gefunden.");
    }
}


async function editTask(){
    
    openTaskPopup();
    removeRequierdAttribute();
    let confirmBtn = document.getElementById('confirmBtn');

    confirmBtn.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
            node.textContent = 'OK';
        }
    });

    document.getElementById('test').classList.add('edit-task');
    document.getElementById('test').classList.remove('modal-addtask-popup');
    document.getElementById('maincontainerAddTask').classList.remove('maincontainer-desktop');
    document.getElementById('maincontainerAddTask').classList.add('edit-task-menü');
    document.getElementById('spanRequiredInfo').style.display = 'none';
    document.getElementById('clearBtn').style.display = 'none';
    document.getElementById('buttonLastSection').style.marginTop = '32px';
    confirmBtn.innerHTML = 'OK <img src="assets/img/check-button-add-task.png" alt="Confirm">';

}

function removeRequierdAttribute () {
    const idToRemoveRequired = ['title', 'dueDate', 'category'];

    idToRemoveRequired.forEach(elementId => {
        const element = document.getElementById(elementId);

        if (element) {
            element.removeAttribute('required');
        } else {
            console.error(`Element mit ID ${elementId} nicht gefunden.`)
        }
    });
}

function setupFormSubmit() {
    let form = document.getElementById('addTaskFormRemove');
    if (form) {
        form.onsubmit = async function(event) {
            event.preventDefault(); // Verhindert das Absenden des Formulars
            if (isEditing) {
                await editTask();
            } else {
                // Fügen Sie die Aufgabe hinzu...
            }
            isEditing = false;
        };
    } else {
        console.error("Formular mit ID 'addTaskFormRemove' nicht gefunden.");
    }
}

window.onload = function() {
    setupFormSubmit();
};

async function postEditTask(taskData) {
    let response = await fetch(BASE_URL + path + '/' + taskId + '.json', {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}