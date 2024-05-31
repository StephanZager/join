let editTaskPopup;


function openEditTask() {
    editTaskPopup = document.createElement("div");

    editTaskPopup.className = "edit-task";
    editTaskPopup.style.position = "fixed";
    editTaskPopup.style.top = "50%";
    editTaskPopup.style.left = "50%";
    editTaskPopup.style.transform = "translate(-50%, -50%)";
    editTaskPopup.style.backgroundColor = "#fff";
    editTaskPopup.style.zIndex = "99";

    document.body.appendChild(editTaskPopup);

    editTaskPopup.innerHTML = generateEditTaskHTML();

    // Fügen Sie den Event Listener zum Button hinzu
    document.getElementById('closeEditPopupButton').addEventListener('click', closeEditTaskPopup);
}


function closeEditTaskPopup() {
    // Entfernen Sie das editTaskPopup-Element
    document.body.removeChild(editTaskPopup);
}


function generateEditTaskHTML() {
  return `
  <div class="close-edit-section">
    <span id="closeEditPopupButton" class="close-edit">&times;</span>
  </div>
    <main class="edit-task-menü" id="editTaskMainContainer">
        
            <div class="left-field-section">
                <div class="addtaks-desktop">
                    <span>Title<span style="color: red;">*</span></span>
                    <input id="editTitle" class="title-select-or-input" placeholder="Enter a title" type="text"> 
                </div>
                <div class="addtaks-desktop">
                    <span>Description</span>
                    <textarea id="editDescription" class="title-select-or-input" placeholder="Enter a Description" type="text"></textarea>
                </div>
                <div class="addtaks-desktop dropdown">
                    <button type="button" class="dropdown-button">Dropdown <img src="assets/img/arrow_drop_down.png"></button>
                    <div class="dropdown-content" id="editAssigned">
                        
                    </div>
                </div>
            </div>
            <div class="right-field-section">
                <div class="addtaks-desktop">
                    <span>Due Date <span style="color: red;">*</span></span>
                    <input id="editDate" class="title-select-or-input" type="date" placeholder="dd/mm/yyyy">
                </div>
                <div class="prio-section addtaks-desktop">
                    <span class="subheadline"><b>Prio</b></span>
                    <div class="prio-buttons">
                        <button class="urgent-button" type="button" onclick="setPriority('Urgent')">Urgent<img class="prio-icons" src="./assets/img/prio-urgent-icon-unclicked.png"></button>
                        <button class="medium-button" type="button" onclick="setPriority('Medium')">Medium<img class="prio-icons" src="./assets/img/prio-medium-icon-unclicked.png"></button>
                        <button class="low-button" type="button" onclick="setPriority('Low')">Low<img class="prio-icons" src="./assets/img/prio-low-icon-unclicked.png"></button>
                    </div>
                </div>
                <div class="addtaks-desktop">
                    <span>Category<span style="color: red;">*</span></span>
                    <select id="editCategory" class="title-select-or-input">
                        <option disabled selected hidden> Select task category</option>
                        <option>Technical Task</option>
                        <option>User Story</option>
                    </select>               
                </div>
                <div class="addtaks-desktop">
                    <span>Subtasks</span>
                    <div class="input-with-button">
                        <input id="editSubtasks" class="title-select-or-input" placeholder="Add new Subtasks">
                        <button type="button" onclick="addSubtaskToList()"><img class="input-button-img" src="assets/img/add.png" alt=""></button>
                    </div>
                    <ul id="subtaskList"></ul>
                </div>
            </div>
        </main>
        <div class="last-section" id="postEditBtnSection">
            <div class="edit-btn">
                <button type="button" id="postEditBtn" class="create-task-button" onclick="postEditTask()">Ok <img src="./assets/img/check-button-add-task.png" alt=""></button>
            </div>
        </div>
    `;
}


async function editTask(i) {
    let taskToEdit = task[i];
    let firebaseId = taskToEdit.firebaseId;

    if (!firebaseId) {
        console.error('firebaseId is undefined');
        return;
    }

    // Fülle das Bearbeitungsformular mit den aktuellen Aufgabenwerten
    document.getElementById('editTitel').value = taskToEdit.title;
    document.getElementById('editDescription').value = taskToEdit.description;
    document.getElementById('editAssigned').value = taskToEdit.assign;
    document.getElementById('editDate').value = taskToEdit.date;
    document.getElementById('editCategory').value = taskToEdit.userCategory; // Tippfehler korrigiert

    // Entferne vorhandene Event-Listener, um doppelte Aufrufe zu vermeiden
    let postEditBtn = document.getElementById('postEditBtn');
    let newPostEditBtn = postEditBtn.cloneNode(true);
    postEditBtn.parentNode.replaceChild(newPostEditBtn, postEditBtn);

    // Funktion zum Speichern der aktualisierten Aufgabe
    newPostEditBtn.addEventListener('click', async function() {
        let updatedTask = {
            title: document.getElementById('editTitel').value,
            description: document.getElementById('editDescription').value,
            assign: document.getElementById('editAssigned').value,
            date: document.getElementById('editDate').value,
            userCategory: document.getElementById('editCategory').value // Tippfehler korrigiert
        };

        try {
            await postEditTask(firebaseId, updatedTask);
        } catch (error) {
            console.error(error);
        }
    });
}

// Funktion zum Aktualisieren der Aufgabe in Firebase
async function postEditTask(firebaseId, updatedTask) {
    const url = `${BASE_URL}/tasks/${firebaseId}.json`;
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedTask)
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const responseData = await response.json();
    console.log('Updated task:', responseData);
}
