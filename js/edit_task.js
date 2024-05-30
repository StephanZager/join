function openEditTask() {
    let editTaskPopup = document.createElement('div');

    editTaskPopup.className = 'edit-task';
    editTaskPopup.style.position = 'fixed';
    editTaskPopup.style.top = '46%';
    editTaskPopup.style.left = '50%';
    editTaskPopup.style.transform = 'translate(-50%, -50%)';
    editTaskPopup.style.backgroundColor = '#fff';
    editTaskPopup.style.zIndex = '99';

    editTaskPopup.innerHTML = generateEditTaskHTML();

    document.body.appendChild(editTaskPopup);
}

function generateEditTaskHTML() {
  return `
    <main class="edit-task-menü" >
            <div class="left-field-section">
                <div class="addtaks-desktop">
                    <span>Title<span style="color: red;">*</span></span>
                    <input id="title" class="title-select-or-input" placeholder="Enter a title" type="text" required>
                    <span class="required-info">This field is required</span>
                </div>

                <div class="addtaks-desktop">
                    <span>Description</span>
                    <textarea id="description" class="title-select-or-input" placeholder="Enter a Description" type="text"></textarea>
                </div>

                <div class="addtaks-desktop dropdown">
                    <button type="button" class="dropdown-button">Dropdown <img src="assets/img/arrow_drop_down.png"></button>
                    <div class="dropdown-content" id="assigned">
                        <!-- Die Optionen mit Checkboxen werden hier generiert -->
                    </div>
                </div>
            </div>
            <div class="right-field-section">
                <div class="addtaks-desktop">
                    <span>Due Date <span style="color: red;">*</span></span>
                    <input id="dueDate" class="title-select-or-input" type="date" placeholder="dd/mm/yyyy" required>
                    <span class="required-info">This field is required</span>
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
                    <select id="category" class="title-select-or-input" required>
                        <option disabled selected hidden> Select task category</option>
                        <option>Technical Task</option>
                        <option>User Story</option>
                    </select>
                    <span class="required-info">This field is required</span>
                </div>

                <div class="addtaks-desktop">
                    <span>Subtasks</span>
                    <div class="input-with-button">
                        <input id="subtasks" class="title-select-or-input" placeholder="Add new Subtasks">
                        <button type="button" onclick="addSubtaskToList()"><img class="input-button-img" src="assets/img/add.png" alt=""></button>
                    </div>
                    <ul id="subtaskList"></ul>
                </div>
            </div>
        </main>
        <div class="last-section">
            <div class="edit-btn">
                <button type="button" class="create-task-button">Ok <img src="./assets/img/check-button-add-task.png" alt=""></button>
            </div>
        </div>
    `;
}
