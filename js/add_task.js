let assign = [];
let globalSubtasks = [];
let currentAssignIndex = 0;
let selectedPriority = null;
/**
 * Resets the visual state of a collection of buttons to unselected.
 * This function iterates over an array of button elements. For each button, it performs two actions:
 * 1. Removes the 'selected' class from the button, which typically alters its appearance to indicate it is not the active selection.
 * 2. Finds the 'img' element within the button and sets its 'src' attribute to the value of the button's 'data-original-image' attribute.
 *    This step usually reverts the button's icon to its default state.
 * 
 * @param {HTMLElement[]} buttons - An array of button elements to reset.
 */
function resetButtons(buttons) {
    buttons.forEach(button => {
        button.classList.remove('selected');
        const img = button.querySelector('img');
        img.src = button.getAttribute('data-original-image');
    });
}
/**
 * Finds and returns a button element based on the specified priority within a given container.
 * This function checks the priority argument against known priority levels ('Urgent', 'Medium', 'Low').
 * Depending on the priority level, it selects and returns the corresponding button element within the container using class selectors.
 * If the priority does not match any known level, it logs an error message indicating an unknown priority.
 * 
 * @param {HTMLElement} container - The container element in which to search for the priority button.
 * @param {string} priority - The priority level for which to find the corresponding button ('Urgent', 'Medium', 'Low').
 * @returns {HTMLElement|null} The button element corresponding to the specified priority, or null if the priority is unknown.
 */
function getButtonByPriority(container, priority) {
    let button;
    if (priority === 'Urgent') {
        button = container.querySelector('.urgent-button');
    } else if (priority === 'Medium') {
        button = container.querySelector('.medium-button');
    } else if (priority === 'Low') {
        button = container.querySelector('.low-button');
    } else {
        console.error('Unknown priority:', priority);
    }
    return button;
}
/**
 * Marks a given button as selected and updates the global selectedPriority variable.
 * This function checks if the button argument is not null. If true, it proceeds to:
 * - Add the 'selected' class to the button to change its visual state.
 * - Find the 'img' element within the button and update its 'src' attribute to the value specified in the button's 'data-clicked-image' attribute.
 *   This typically changes the button's icon to indicate it has been selected.
 * - Update the global variable 'selectedPriority' with the provided priority value, effectively storing the current priority selection.
 * 
 * @param {HTMLElement} button - The button element to mark as selected.
 * @param {string} priority - The priority level associated with the button.
 */
function setButtonAsSelected(button, priority) {
    if (button) {
        button.classList.add('selected');
        const img = button.querySelector('img');
        img.src = button.getAttribute('data-clicked-image'); 
        selectedPriority = priority;
    }
}
/**
 * Sets the visual state of priority buttons based on the specified priority.
 * This function finds all containers that hold priority buttons (identified by specific class names) and performs the following actions for each container:
 * 1. Retrieves all button elements within the container.
 * 2. Resets these buttons to their default state by calling the resetButtons function.
 * 3. Finds the button that matches the specified priority by calling the getButtonByPriority function.
 * 4. Marks the found button as selected by calling the setButtonAsSelected function, passing the button and priority.
 * 
 * @param {string} priority - The priority level to set ('Urgent', 'Medium', 'Low', etc.).
 */
function setPriority(priority) {
    const containers = document.querySelectorAll('.prio-buttons, .addtask-popup-prio-buttons');
    containers.forEach(container => {
        const buttons = container.querySelectorAll('button');
        resetButtons(buttons);
        const button = getButtonByPriority(container, priority);
        setButtonAsSelected(button, priority);
    });
}
/**
 * Retrieves and displays details of assigned individuals based on selected checkboxes.
 * This function finds all checked checkboxes within the element with the ID 'assigned' and collects their values and data attributes.
 * For each checked checkbox, it extracts the name (from the checkbox's value), initials (using the filterFirstLetters function on the name),
 * and background color (from a data attribute). These details are compiled into objects and added to an array.
 * After gathering all assigned details, it updates the display of assigned initials by calling showAssignInitials with the array of details.
 * Finally, it returns the array of assigned details.
 * 
 * @returns {Array} An array of objects, each representing the details of an assigned individual, including their name, initials, and background color.
 */
function getAssignedDetails() {
    let assignedElement = document.getElementById('assigned');
    let assignCheckboxes = assignedElement ? assignedElement.querySelectorAll('input[type="checkbox"]:checked') : [];
    let assignDetails = [];
    assignCheckboxes.forEach(checkbox => {
        let name = checkbox.value;
        let initials = filterFirstLetters(name);
        let bgNameColor = checkbox.dataset.bgColor;
        assignDetails.push({ name: name, initials: initials, bgNameColor: bgNameColor });
    });
    showAssignInitials(assignDetails); 
    return assignDetails;
}
/**
 * Displays the initials of assigned individuals up to a maximum number, and indicates if there are more.
 * This function clears the current content of the 'assignedInitial' element. It then iterates through the 'assignDetails' array,
 * but only up to a maximum of 5 individuals (or the total number of assigned individuals if fewer than 5).
 * For each individual, it:
 * - Extracts their initials using the 'filterFirstLetters' function.
 * - Sets the background color of the initials to a specified color.
 * - Creates a new 'span' element, sets its text content to the initials, applies the background color, adds a CSS class for styling,
 *   and appends it to the 'assignedInitial' element.
 * If there are more than 5 individuals assigned, it calculates the excess count and displays this as an additional 'span' element
 * (e.g., "+2") to indicate there are more assigned individuals not being shown.
 * 
 * @param {Array} assignDetails - An array of objects containing details of assigned individuals, including their names and background colors.
 */
function showAssignInitials(assignDetails) {
    let assignedInitial = document.getElementById('assignedInitial');
    assignedInitial.innerHTML = '';
    let maxInitialsToShow = 5;
    let numberOfAssignDetails = assignDetails.length;

    for (let i = 0; i < Math.min(numberOfAssignDetails, maxInitialsToShow); i++) {
        let initials = filterFirstLetters(assignDetails[i].name); 
        let bgNameColor = assignDetails[i].bgNameColor;
        let assignInitials = document.createElement('span');
        assignInitials.textContent = initials;
        assignInitials.style.backgroundColor = bgNameColor;
        assignInitials.classList.add('assign-initials');
        assignedInitial.appendChild(assignInitials);
    }if (numberOfAssignDetails > maxInitialsToShow) {
        let additionalCount = numberOfAssignDetails - maxInitialsToShow;
        let additionalInitials = document.createElement('span');
        additionalInitials.textContent = `+${additionalCount}`;
        additionalInitials.classList.add('additional-initials'); 
        assignedInitial.appendChild(additionalInitials);
    }
}
/**
 * Sorts the 'assign' array alphabetically by the 'name' property of its elements.
 * This function uses the Array.prototype.sort method with a custom comparator function.
 * The comparator leverages String.prototype.localeCompare to determine the order of elements based on the 'name' property,
 * ensuring that the 'assign' array is sorted alphabetically.
 */
function filterNameAlphabet() {
    assign.sort((a, b) => a.name.localeCompare(b.name));
}
/**
 * Retrieves subtasks from the DOM and updates the globalSubtasks array.
 * This function selects all list item elements within the element with the ID 'subtaskList'.
 * It iterates over these items, trimming the text content of each to get the subtask title.
 * Each subtask is then added to a local array as an object with the title and a 'done' property set to false.
 * After processing all items, it updates the globalSubtasks array with this local array of subtasks and returns it.
 * 
 * @returns {Array} An array of subtask objects, each containing a 'title' and 'done' status.
 */
function getSubtasks() {
    let subtaskItems = document.querySelectorAll('#subtaskList li');
    let subtasks = [];
    subtaskItems.forEach(item => {
        let subtaskTitle = item.textContent.trim().substring();
        subtasks.push({ title: subtaskTitle, done: false });
    });
    globalSubtasks = subtasks;
    return subtasks;
}
/**
 * Creates and returns a new user task object with the specified details.
 * This function constructs a task object using the provided parameters for the task's title, description, due date, user category,
 * assigned details, subtasks, and selected priority. It also sets the task's category to "toDo" by default.
 * 
 * @param {string} title - The title of the task.
 * @param {string} description - A description of the task.
 * @param {string} date - The due date for the task.
 * @param {string} userCategory - The category assigned to the task by the user.
 * @param {Object} assignDetails - Details about the assignment of the task.
 * @param {Array} subtasks - An array of subtasks associated with the task.
 * @param {string} selectedPriority - The priority level selected for the task.
 * @returns {Object} The newly created task object.
 */
function createUserTask(title, description, date, userCategory, assignDetails, subtasks, selectedPriority) {
    return {
        title: title,
        description: description,
        date: date,
        userCategory: userCategory,
        assign: assignDetails,
        subtasks: subtasks,
        category: "toDo",
        priority: selectedPriority
    };
}
/**
 * Sets up initial configurations and event listeners when the document content is fully loaded.
 * This function sets the default task priority to 'Medium' using the setPriority function.
 * It then retrieves the input elements for the task's title and due date by their IDs ('title' and 'dueDate', respectively).
 * For both input elements, it adds an event listener that listens for any input events.
 * Within these event listeners, if the input value is not empty, it resets the style of the border to its default by setting it to an empty string.
 * This could be used to clear any validation styles once the user starts typing in the input fields.
 */
document.addEventListener('DOMContentLoaded', function() {
    setPriority('Medium');
    let titleInput = document.getElementById('title');
    let dateInput = document.getElementById('dueDate');
    titleInput.addEventListener('input', function() {
        if (this.value !== '') {
            this.style.border = '';
        }
    });
    dateInput.addEventListener('input', function() {
        if (this.value !== '') {
            this.style.border = '';
        }
    });
});
/**
 * Submits a new task to the server asynchronously and navigates to the board page upon success.
 * This function prevents the default form submission behavior, checks if all required fields are filled,
 * and then gathers the input values for the task's title, description, due date, category, assigned details, subtasks, and priority.
 * It creates a userTask object with these details and attempts to post this data to the server using the postData function.
 * If the post is successful, it displays a confirmation message and redirects the user to the board page after a short delay.
 * In case of an error during the post operation, it logs the error to the console.
 * 
 * @param {Event} event - The event object associated with the form submission.
 */
async function submitTask(event) {
    event.preventDefault();

    if (!requiredFields()) {
        return;
    }
    let title = document.getElementById('title').value;
    let description = document.getElementById('description').value;
    let date = document.getElementById('dueDate').value;
    let userCategory = document.querySelector('input[name="category"]:checked')?.value;
    let assignDetails = getAssignedDetails();
    let subtasks = getSubtasks();
    let userTask = createUserTask(title, description, date, userCategory, assignDetails, subtasks, selectedPriority);
    try {
        await postData("/userTask", userTask);
       
        const confirmMsg = document.getElementById('confirmMsg');
        confirmMsg.style.display = 'block';
        
        setTimeout(() => {
            window.location.href = "board.html";
        }, 1000);
        
    } catch (error) {
        console.error("Fehler beim Posten der Daten:", error);
    }
}
/**
 * Adds a new subtask to the globalSubtasks array and updates the UI accordingly.
 * This function retrieves the text entered in the 'subtasks' input field, trims it, and checks if it is not empty.
 * If the input text is not empty, it:
 * - Generates a new subtask ID based on the current length of the globalSubtasks array.
 * - Adds a new subtask object to the globalSubtasks array with the entered text as the title, 'done' status as false, and the new ID.
 * - Calls renderSubtasks to update the subtask list displayed on the UI.
 * - Calls resetSubtaskFocus to clear the input field and adjust the UI state.
 * - Sets the input field value to an empty string to clear it.
 * - Calls scrollToBottomAddtask to ensure the latest added subtask is visible.
 */
function addSubtaskToList() {
    let subtaskInput = document.getElementById('subtasks');
    let subtaskText = subtaskInput.value.trim();
    if (subtaskText !== '') {
        let subtaskId = globalSubtasks.length; 
        globalSubtasks.push({ title: subtaskText, done: false, id: subtaskId });
        renderSubtasks();
        resetSubtaskFocus()
        subtaskInput.value = ''; 
        scrollToBottomAddtask(); 
    }
}
/**
 * Adds an event listener to the document that waits for the DOM to be fully loaded.
 * Once the DOM is loaded, it attaches another event listener to the element with the ID 'subtasks'.
 * This inner event listener listens for keydown events and checks if the 'Enter' key was pressed.
 * If the 'Enter' key is pressed, it prevents the default action (form submission) and calls the
 * addSubtaskToList function to add the subtask to the list.
 */
document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('subtasks').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            addSubtaskToList();
        }
    });
});
/**
 * Sets focus on the subtask input field, displays the confirm and delete buttons, and hides the placeholder image.
 * This function performs three main actions:
 * 1. Calls the focus() method on the input element with the ID 'subtasks' to set focus on it.
 * 2. Sets the display style of the element with the ID 'confirmAndDeleteBtnSubtask' to 'flex', making the confirm and delete buttons visible.
 * 3. Sets the display style of the element with the ID 'placeholderImgSubtask' to 'none', effectively hiding the placeholder image.
 */
function inputSetFocus() {
    document.getElementById('subtasks').focus();
    document.getElementById('confirmAndDeleteBtnSubtask').style.display = 'flex';
    document.getElementById('placeholderImgSubtask').style.display = 'none';
}
/**
 * Removes focus from the subtask input field, hides the confirm and delete buttons, and displays the placeholder image.
 * This function performs three main actions:
 * 1. Calls the blur() method on the input element with the ID 'subtasks' to remove focus from it.
 * 2. Sets the display style of the element with the ID 'confirmAndDeleteBtnSubtask' to 'none', effectively hiding it.
 * 3. Sets the display style of the element with the ID 'placeholderImgSubtask' to 'flex', making the placeholder image visible.
 */
function resetSubtaskFocus() {
    document.getElementById('subtasks').blur();
    document.getElementById('confirmAndDeleteBtnSubtask').style.display = 'none';
    document.getElementById('placeholderImgSubtask').style.display = 'flex';
}
/**
 * Replaces the content of a subtask's display element with an input field for editing the subtask's title.
 * This function targets a specific subtask's display element by its dynamically generated ID, which includes the subtask's index.
 * It then sets the innerHTML of this element to include:
 * - An input field pre-populated with the subtask's current title for editing.
 * - A delete icon that, when clicked, clears the input field's content.
 * - A confirmation (hook) icon that, when clicked, updates the subtask's title with the edited value and re-renders the subtask list.
 * 
 * @param {number} id - The index of the subtask in the globalSubtasks array being edited.
 */
function editSubtaskAddtask(id) {
    let subtaskToEdit = globalSubtasks[id];
    let editElement = document.getElementById(`subtaskToEdit${id}`);
    editElement.innerHTML = `<li class="edit-li"><input class="editInputSubtask" type="text" id="addSubtask-input${id}" value="${subtaskToEdit.title}"> <div class="edit-and-delete-img"><div class="btn-hover-task"><img src="assets/img/delete.png" onclick="clearSubtaskInput(${id})"></div> | <div class="btn-hover-task"><img src="assets/img/hook.png" onclick="confirmAddTaskSubtaskEdit(${id})"></div></div></li>`; 
}
/**
 * Updates the title of a subtask in the globalSubtasks array with a new value from an input field and re-renders the subtask list.
 * This function retrieves the edited subtask title from an input element identified by a dynamic ID that includes the subtask's index.
 * It then updates the title of the subtask at the specified index in the globalSubtasks array with this new value.
 * After updating the subtask's title, it calls renderSubtasks to refresh the displayed list of subtasks.
 * 
 * @param {number} id - The index of the subtask in the globalSubtasks array to be updated.
 */
function confirmAddTaskSubtaskEdit(id) {
    let editedSubtask = document.getElementById(`addSubtask-input${id}`).value;
    globalSubtasks[id].title = editedSubtask;
    renderSubtasks();
}
/**
 * Clears the value of a specific subtask input element identified by a dynamic ID.
 * This function targets an input element by constructing its ID using a base string 'addSubtask-input' concatenated with the provided id parameter.
 * It then sets the value of this input element to an empty string, effectively clearing any text the user has entered.
 * 
 * @param {string|number} id - The unique identifier used to construct the input element's ID for targeting.
 */
function clearSubtaskInput(id) {
    document.getElementById(`addSubtask-input${id}`).value = '';
}
/**
 * Clears the value of the input element with the ID 'subtasks'.
 * This function is typically used to reset the subtask input field, removing any text the user has entered.
 */
function clearSubtask() {
    document.getElementById('subtasks').value = ''; 
}
/**
 * Clears the selection of category options in a dropdown and resets the displayed category text.
 * This function iterates over all radio input elements within the '.dropdown-content-category' class,
 * setting their 'checked' property to false, effectively unselecting any previously selected option.
 * It also resets the text content of the element with the ID 'categoryText' to 'Category', indicating no category is selected.
 */
function clearCategorySelection() {
    const categoryOptions = document.querySelectorAll('.dropdown-content-category input[type="radio"]');
    
    categoryOptions.forEach(option => {
        option.checked = false;
    });
    
    document.getElementById('categoryText').textContent = 'Category';
}
/**
 * Deletes a subtask from the globalSubtasks array based on the provided id and re-renders the subtask list.
 * It uses the splice method to remove the subtask at the specified index (id) from the globalSubtasks array.
 * After deletion, it calls renderSubtasks to update the UI with the current list of subtasks.
 * 
 * @param {number} id - The index of the subtask to be deleted from the globalSubtasks array.
 */
function deleteSubtask(id) {
    globalSubtasks.splice(id, 1);
    renderSubtasks();
}
/**
 * Renders subtasks as HTML elements within the 'subtaskList' container.
 * This function clears the 'subtaskList' container and then iterates over the 'globalSubtasks' array,
 * creating a new HTML structure for each subtask. This structure includes a div containing a list item for the subtask title
 * and a div with edit and delete icons, each icon having an onclick event tied to its respective function with the subtask's index as a parameter.
 * The generated HTML for each subtask is appended to the 'subtaskList' container's innerHTML.
 */
function renderSubtasks() {
    let subtaskList = document.getElementById('subtaskList');
    subtaskList.innerHTML = '';
    if (Array.isArray(globalSubtasks)) {
        globalSubtasks.forEach((subtaskToEdit, index) => {
            let subtaskItem = `
            <div id="subtaskToEdit${index}" class="subtask-item">
                <li class="addtask-subtask-li">${subtaskToEdit.title}</li>
                 <div class="edit-delete-img">
                    <div class="btn-hover-task" ><img src="assets/img/edit.png" alt="Edit" onclick="editSubtaskAddtask(${index})"></div> <div style="display: flex; align-items: center;">|</div> 
                    <div class="btn-hover-task" ><img src="assets/img/delete.png" alt="Delete" onclick="deleteSubtask(${index})"></div>
                </div>
            </div>`;
            subtaskList.innerHTML += subtaskItem;
        });
    }
}
/**
 * Scrolls the 'maincontainerAddtask' element to its bottom.
 * This function finds the element by its ID and sets its scrollTop property to the value of its scrollHeight,
 * effectively scrolling the element to the bottom. This is useful for ensuring the latest content is visible,
 * such as when adding new tasks to a list.
 */
function scrollToBottomAddtask() {
    const maincontainerAddtask = document.getElementById('maincontainerAddtask');
    if (maincontainerAddtask) {
        maincontainerAddtask.scrollTop = maincontainerAddtask.scrollHeight;
    }
}

/**
 * Asynchronously loads assignee data from a specified path and updates the global 'assign' array with the fetched data.
 * After loading, it moves the logged-in user to the top of the 'assign' array if they are present.
 * Finally, it calls `generateAssign` to update the UI with the loaded assignee data.
 * If an error occurs during the fetch operation, it logs the error.
 * 
 * @param {string} [path="/contact"] - The path from which to load the assignee data. Defaults to "/contact".
 */
async function loadAssign(path = "/contact") {
    try {
        let response = await fetch(BASE_URL + path + ".json");
        let responseToJson = await response.json();

        if (responseToJson) {
            let assignArray = Object.values(responseToJson);
            assign.push(...assignArray);
        }

        let loggedInUser = localStorage.getItem('loggedInUser');
        if (loggedInUser) {
            moveLoggedInUserToTop(assign, loggedInUser);
        }

        generateAssign();
    } catch (error) {
        console.error("Fehler beim Laden der Daten:", error);
    }
}
/**
 * Creates and returns a label element for an assigned contact, including a checkbox and spans for initials and name.
 * The checkbox is configured with the contact's name as its value and a custom data attribute for background color.
 * An event listener is added to the checkbox to update assigned details on change.
 * Initials are generated by filtering the first letters of the contact's name, excluding any " (YOU)" suffix.
 * Two spans are created: one for the initials, styled with a background color, and another for the full name.
 * These elements are appended to the label, which is then returned.
 * 
 * @param {Object} assignContacts - The contact object containing the name and background color.
 * @returns {HTMLElement} The label element with configured children for displaying the contact.
 */
function createLabel(assignContacts) {
    let label = document.createElement('label');
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = assignContacts.name;
    checkbox.dataset.bgColor = assignContacts.bgNameColor;
    
    checkbox.addEventListener('change', () => {
        getAssignedDetails();
    });

    let initials = filterFirstLetters(assignContacts.name.replace(" (YOU)", ""));
    let initialsSpan = document.createElement('span');
    initialsSpan.textContent = initials;
    initialsSpan.classList.add('assign-initials');
    initialsSpan.style.backgroundColor = assignContacts.bgNameColor;

    let nameSpan = document.createElement('span');
    nameSpan.textContent = assignContacts.name;
    nameSpan.classList.add('assign-name');

    label.appendChild(initialsSpan);
    label.appendChild(nameSpan);
    label.appendChild(checkbox);

    return label;
}
/**
 * Populates the 'assigned' element with labels for each contact in the 'assign' array.
 * It first clears any existing content in the 'assigned' element. Then, it filters the contacts by alphabetical order
 * and moves the logged-in user to the top of the list. For each contact in the 'assign' array, it creates a label
 * and appends it to the 'assigned' element. If the 'assigned' element is not found, it logs an error.
 */
function generateAssign() {
    let assignContact = document.getElementById('assigned');
    let loggedInUser = localStorage.getItem('loggedInUser'); 

    if (!assignContact) {
        console.error("Element mit ID 'assigned' wurde nicht gefunden.");
        return;
    }

    assignContact.innerHTML = '';
    currentAssignIndex = 0;

    filterNameAlphabet();
    moveLoggedInUserToTop(assign, loggedInUser); 
    for (let i = 0; i < assign.length; i++) {
        let assignContacts = assign[i];
        let label = createLabel(assignContacts);
        assignContact.appendChild(label);
    }
}
/**
 * Modifies the given array of assignees to move the logged-in user to the top of the list.
 * If the logged-in user's name does not already end with " (YOU)", this suffix is appended.
 * The function first finds the index of the logged-in user in the assign array by comparing
 * each contact's name (with any " (YOU)" suffix removed) to the logged-in user's name.
 * If found, the user is removed from their current position and unshifted to the front of the array.
 * 
 * @param {Object[]} assign - The array of assignee objects.
 * @param {string} loggedInUser - The name of the logged-in user to move to the top.
 */
function moveLoggedInUserToTop(assign, loggedInUser) {
    let userIndex = assign.findIndex(contact => contact.name.replace(/\s\(YOU\)$/i, '') === loggedInUser);
    
    if (userIndex !== -1) {
        let user = assign.splice(userIndex, 1)[0];
        
        if (!user.name.endsWith(" (YOU)")) {
            user.name += " (YOU)";
        }
        assign.unshift(user);
    }
}
/**
 * Extracts and returns the first letters of each word in a given name, after removing any "(YOU)" annotations.
 * The function cleans the name by removing "(YOU)" (case-insensitive), splits the name into words,
 * then maps each word to its first character, converts it to uppercase, and joins them together.
 * 
 * @param {string} name - The name string from which to extract the initials.
 * @returns {string} The concatenated first letters of each word in the name, in uppercase.
 */
function filterFirstLetters(name) {
    let cleanedName = name.replace(/\(YOU\)/ig, '');
    let words = cleanedName.split(' ');
    let firstLetters = words.map(word => word.charAt(0).toUpperCase()).join('');
    return firstLetters;
}
/**
 * Toggles the visibility and rotation state of the category dropdown menu and its arrow icon.
 * It also sets up an event listener to close the dropdown if a click occurs outside of it.
 * Additionally, it listens for changes on radio inputs within the dropdown, updating the displayed category text
 * and closing the dropdown upon selection. The outside click listener is added with a delay to prevent it from
 * immediately closing the dropdown after it is opened.
 */
function openDropdownContentCategory() {
    let categoryContent = document.getElementById('categoryContent');
    let dropdownArrowCategory = document.getElementById('dropdownArrowCategory');
    categoryContent.classList.toggle('show');
    dropdownArrowCategory.classList.toggle('rotate');

    function handleClickOutside(event) {
        if (!categoryContent.contains(event.target)) {
            categoryContent.classList.remove('show'); 
            dropdownArrowCategory.classList.remove('rotate');
            document.removeEventListener('click', handleClickOutside); 
        }
    }

    document.querySelectorAll('.dropdown-option input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function() {
            let selectedText = this.nextElementSibling.innerText; 
    
            document.getElementById('categoryText').innerText = selectedText;
            document.getElementById('category').style.border = '';
            document.getElementById('categoryContent').classList.remove('show');
            dropdownArrowCategory.classList.remove('rotate');
            document.removeEventListener('click', handleClickOutside);
        });
    });
    if (categoryContent.classList.contains('show')) {
        setTimeout(() => document.addEventListener('click', handleClickOutside), 0);
    }
}
/**
 * Toggles the visibility and rotation state of a dropdown menu and its arrow icon.
 * When the dropdown is shown, it adds an event listener to close the dropdown if a click occurs outside of it.
 * This function handles the opening and closing of the dropdown menu, as well as rotating the dropdown arrow
 * to indicate the open or closed state. The event listener for closing the dropdown on an outside click
 * is added with a delay to prevent it from immediately triggering after opening.
 */
function openDropdown() {
    let dropdownContent = document.getElementById('assigned');
    let dropdownArrowAssign = document.getElementById('dropdownArrowAssign');
    dropdownContent.classList.toggle('show-assign'); 
    dropdownArrowAssign.classList.toggle('rotate'); 
    
    function handleClickOutside(event) {
        if (!dropdownContent.contains(event.target)) {
            dropdownContent.classList.remove('show-assign'); 
            dropdownArrowAssign.classList.remove('rotate');
            document.removeEventListener('click', handleClickOutside); 
        }
    } if (dropdownContent.classList.contains('show-assign')) {
        setTimeout(() => document.addEventListener('click', handleClickOutside), 0);
    } else {
        document.removeEventListener('click', handleClickOutside);
    }
}
/**
 * Sets the minimum date attribute for task due date input fields to today's date.
 * This prevents users from selecting a due date earlier than the current date for tasks.
 * It formats today's date as YYYY-MM-DD and applies it as the minimum value to input elements with IDs 'dueDate', 'editDate', and 'taskDueDate'.
 */
function setMinDate() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); 
    let yyyy = today.getFullYear();

    let currentDate = yyyy + '-' + mm + '-' + dd;

    let dueDateElement = document.getElementById('dueDate');
    let editDateElement = document.getElementById('editDate');
    let taskDateElement = document.getElementById('taskDueDate');

    if (dueDateElement) {
        dueDateElement.min = currentDate;
    } 
    if (editDateElement) {
        editDateElement.min = currentDate;
    } 
    if (taskDateElement) {
        taskDateElement.min = currentDate;
    }
}
