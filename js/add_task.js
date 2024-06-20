let assign = [];
let currentAssignIndex = 0;
let selectedPriority = null;


function setPriority(priority) {
    const buttons = document.querySelectorAll('.prio-buttons button');
    buttons.forEach(button => {
        button.classList.remove('selected');
        const img = button.querySelector('img');
        img.src = button.getAttribute('data-original-image'); // Set to original image
    });

    let button;
    if (priority === 'Urgent') {
        button = document.querySelector('.urgent-button');
    } else if (priority === 'Medium') {
        button = document.querySelector('.medium-button');
    } else if (priority === 'Low') {
        button = document.querySelector('.low-button');
    } else {
        console.error('Unknown priority:', priority);
        return;
    }

    if (button) {
        button.classList.add('selected');
        const img = button.querySelector('img');
        img.src = button.getAttribute('data-clicked-image'); // Change to clicked image
        selectedPriority = priority;
    }
}


async function submitTask(event) {
    event.preventDefault();

    let isValid = true;
    const requiredFields = [
        { id: 'title', errorId: 'title-error' },
        { id: 'dueDate', errorId: 'dueDate-error' },
        { id: 'category', errorId: 'category-error' }
    ];

    requiredFields.forEach(field => {
        const input = document.getElementById(field.id);
        const error = document.getElementById(field.errorId);
        if (!input.value) {
            if (error) {
                error.style.display = 'block';
            } else {
                console.error(`Element with id ${field.errorId} not found`);
            }
            isValid = false;
        } else {
            if (error) {
                error.style.display = 'none';
            }
        }
    });

    if (!isValid) {
        return;
    }

    let title = document.getElementById('title').value;
    let description = document.getElementById('description').value;

    let date = document.getElementById('dueDate').value;
    let userCategory = document.getElementById('category').value;

    let assignedElement = document.getElementById('assigned');
    let assignCheckboxes = assignedElement ? assignedElement.querySelectorAll('input[type="checkbox"]:checked') : [];
    let assignDetails = [];
    assignCheckboxes.forEach(checkbox => {
        let name = checkbox.value;
        let initials = filterFirstLetters(name);
        let bgNameColor = checkbox.dataset.bgColor;
        assignDetails.push({ name: name, initials: initials, bgNameColor: bgNameColor });
    });

    let subtaskItems = document.querySelectorAll('#subtaskList li');
    let subtasks = [];
    subtaskItems.forEach(item => {
        let subtaskTitle = item.textContent.trim().substring(2);
        subtasks.push({ title: subtaskTitle, done: false });
    });

    let userTask = {
        title: title,
        description: description,
        date: date,
        userCategory: userCategory,
        assign: assignDetails,
        subtasks: subtasks,
        category: "toDo",
        priority: selectedPriority
    };

    try {
        await postData("/userTask", userTask);
        window.location.href = "board.html";
    } catch (error) {
        console.error("Fehler beim Posten der Daten:", error);
    }
}


/**
 * Gets the value of the input element with id 'subtasks', trims it, and if it's not an empty string,
 * creates a new 'li' element, sets its text content to the input value prefixed with a bullet point,
 * and appends it to the 'ul' element with id 'subtaskList'.
 * Finally, it clears the input element.
 */
function addSubtaskToList() {
    let subtaskInput = document.getElementById('subtasks');
    let subtaskText = subtaskInput.value.trim();

    if (subtaskText !== '') {
        let subtaskList = document.getElementById('subtaskList');
        let newSubtaskItem = document.createElement('li');
        newSubtaskItem.textContent = '\u2022 ' + subtaskText;
        subtaskList.appendChild(newSubtaskItem);
        subtaskInput.value = '';
    }
}


/**
 * Sends a POST request to a specified path with the provided data.
 * The data is converted to a JSON string before being sent.
 * If the response is not ok, an error is logged to the console and the function returns.
 * Otherwise, the response is converted to JSON and returned.
 *
 * @param {string} path - The path to which to send the POST request.
 * @param {Object} data - The data to be sent in the body of the POST request.
 * @returns {Promise<Object>} A Promise that resolves with the JSON response, or undefined if the response was not ok.
 */
async function postData(path, data) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        console.error("Fehler beim Posten der Daten:", response.statusText);
        return;
    }

    let responseToJson = await response.json();
    return responseToJson;
}

/**
 * Fetches data from a specified path, converts the response to JSON, and adds the values to the `assign` array.
 * After the data is loaded, the `generateAssign` function is called.
 * If an error occurs during the process, it is caught and logged to the console.
 *
 * @param {string} [path="/contact"] - The path from which to fetch the data. Defaults to "/contact".
 * @returns {Promise<void>} A Promise that resolves when the operation is completed.
 */
async function loadAssign(path = "/contact") {
    try {
        let response = await fetch(BASE_URL + path + ".json");
        let responseToJson = await response.json();

        if (responseToJson) {
            let assignArray = Object.values(responseToJson);
            assign.push(...assignArray);
        }

        generateAssign();
    } catch (error) {
        console.error("Fehler beim Laden der Daten:", error);
    }
}

/**
 * Creates a label element with a checkbox and two spans for initials and name.
 * The checkbox's value and the background color of the initials span are set based on the provided assignContacts object.
 * The created label is returned.
 *
 * @param {Object} assignContacts - The object containing the name and background color.
 * @param {string} assignContacts.name - The name to be set as the checkbox value and the text content of the name span.
 * @param {string} assignContacts.bgNameColor - The background color to be set for the initials span and as a data attribute of the checkbox.
 * @returns {HTMLLabelElement} The created label element.
 */
function createLabel(assignContacts) {
    let label = document.createElement('label');
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = assignContacts.name;
    checkbox.dataset.bgColor = assignContacts.bgNameColor;

    let initials = filterFirstLetters(assignContacts.name);
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
 * Clears the inner HTML of the element with id 'assigned' and appends a label for each object in the assign array.
 * Each label is created by calling the createLabel function with the current assignContacts object.
 * If no element with id 'assigned' is found, an error is logged and the function returns.
 */
function generateAssign() {
    let assignContact = document.getElementById('assigned');

    if (!assignContact) {
        console.error("Element mit ID 'assigned' wurde nicht gefunden.");
        return;
    }

    assignContact.innerHTML = '';
    currentAssignIndex = 0;

    for (let i = 0; i < assign.length; i++) {
        let assignContacts = assign[i];
        let label = createLabel(assignContacts);
        assignContact.appendChild(label);
    }
}

/**
 * Extracts the first letter from each word in a given string, converts them to uppercase and concatenates them.
 *
 * @param {string} name - The string from which to extract the first letters.
 * @returns {string} The concatenated uppercase first letters of each word in the input string.
 */
function filterFirstLetters(name) {
    let words = name.split(' ');
    let firstLetters = words.map(word => word.charAt(0).toUpperCase()).join('');
    return firstLetters;
}

/**
 * Sets up event listeners for a dropdown menu.
 * 
 * This function is executed once the DOM is fully loaded. It sets up event listeners for the dropdown button and content, 
 * as well as a global click event listener to close the dropdown when clicked outside.
 * 
 * The dropdown button toggles the visibility of the dropdown content when clicked.
 * Clicking on the dropdown content does not close the dropdown.
 * Clicking anywhere outside the dropdown content and the dropdown button closes the dropdown.
 */
document.addEventListener('DOMContentLoaded', () => {
    const dropdownButton = document.querySelector('.dropdown-button');
    const dropdownContent = document.querySelector('.dropdown-content');

    dropdownButton.addEventListener('click', (event) => {
        event.stopPropagation();
        dropdownContent.classList.toggle('show');
    });

    dropdownContent.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    window.addEventListener('click', (event) => {
        if (!dropdownContent.contains(event.target) && !dropdownButton.contains(event.target)) {
            dropdownContent.classList.remove('show');
        }
    });
});


/**
 * Clears the subtask list both in memory and in the UI.
 * It empties the `subtaskList` array and also clears the HTML content of the element with id 'subtaskList'.
 */
function clearSubtasks() {
    const buttons = document.querySelectorAll('.prio-buttons button');
    buttons.forEach(button => {
        button.classList.remove('selected');
        const img = button.querySelector('img');
        img.src = button.getAttribute('data-original-image'); // Set to original image
    });
    subtaskList = [];
    document.getElementById('subtaskList').innerHTML = '';
}

/**
 * Sets the minimum date that can be selected in the date picker elements with IDs 'dueDate' and 'editDate' to the current date.
 * The current date is converted to the 'yyyy-mm-dd' format expected by HTML date picker elements.
 * If the 'dueDate' or 'editDate' elements do not exist, the minimum date is not set.
 */
function setMinDate() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    let currentDate = yyyy + '-' + mm + '-' + dd;

    let dueDateElement = document.getElementById('dueDate');
    let editDateElement = document.getElementById('editDate');

    if (dueDateElement) {
        dueDateElement.min = currentDate;
    } 
    if (editDateElement) {
        editDateElement.min = currentDate;
    } 
}


