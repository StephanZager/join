/**
 * Generates the assignment contact list and displays assigned users.
 */
function generateAssign() {
    let assignContact = document.getElementById('assigned');
    let loggedInUser = localStorage.getItem('loggedInUser'); 

    if (!assignContact) {
        console.error("Element with ID 'assigned' not found.");
        return;
    }

    assignContact.innerHTML = '';
    currentAssignIndex = 0;

    filterNameAlphabet();
    moveLoggedInUserToTop(assign, loggedInUser); 
    assign.forEach(contact => {
        let label = createLabel(contact);
        assignContact.appendChild(label);
    });
}

/**
 * Toggles the visibility of the category dropdown and its arrow rotation.
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
            categoryContent.classList.remove('show');
            dropdownArrowCategory.classList.remove('rotate');
            document.removeEventListener('click', handleClickOutside);
        });
    });

    if (categoryContent.classList.contains('show')) {
        setTimeout(() => document.addEventListener('click', handleClickOutside), 0);
    }
}

/**
 * Toggles the visibility of the assignment dropdown and its arrow rotation.
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
    }

    if (dropdownContent.classList.contains('show-assign')) {
        setTimeout(() => document.addEventListener('click', handleClickOutside), 0);
    } else {
        document.removeEventListener('click', handleClickOutside);
    }
}

/**
 * Creates a label for an assigned contact with a checkbox.
 * @param {Object} assignContacts - Contact details.
 * @returns {HTMLElement} - The created label element.
 */
function createLabel(assignContacts) {
    let label = document.createElement('label');
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = assignContacts.name;
    checkbox.dataset.bgColor = assignContacts.bgNameColor;
    
    // Ändern Sie den EventListener, um die Hintergrundfarbe des Labels zu aktualisieren
    checkbox.addEventListener('change', () => {
        getAssignedDetails();
        if (checkbox.checked) {
            label.style.backgroundColor = '#2a3647';
            label.style.borderRadius = '10px';
            nameSpan.style.color = 'white';
        } else {
            label.style.backgroundColor = 'white';
            nameSpan.style.color = 'black';
        }
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
 * Moves the logged-in user to the top of the assignment list.
 * @param {Array} assign - List of assigned contacts.
 * @param {string} loggedInUser - Name of the logged-in user.
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
 * Creates an element for initials with a background color and class.
 * @param {string} text - The text for the element.
 * @param {string} bgColor - Background color for the element.
 * @param {string} className - Class to apply to the element.
 * @returns {HTMLElement} - The created element.
 */
function createInitialElement(text, bgColor, className) {
    let element = document.createElement('span');
    element.textContent = text;
    if (bgColor) {
        element.style.backgroundColor = bgColor;
    }
    element.classList.add(className);
    return element;
}

/**
 * Appends initials to the assigned initials element.
 * @param {HTMLElement} assignedInitial - The container for initials.
 * @param {Object[]} assignDetails - Details of assigned contacts.
 * @param {number} maxInitialsToShow - Maximum initials to display.
 */
function appendInitials(assignedInitial, assignDetails, maxInitialsToShow) {
    for (let i = 0; i < Math.min(assignDetails.length, maxInitialsToShow); i++) {
        let detail = assignDetails[i];
        let initialsElement = createInitialElement(filterFirstLetters(detail.name), detail.bgNameColor, 'assign-initials');
        assignedInitial.appendChild(initialsElement);
    }
}

/**
 * Appends an additional count indicator for more initials.
 * @param {HTMLElement} assignedInitial - The container for initials.
 * @param {number} count - Number of additional initials.
 */
function appendAdditionalCount(assignedInitial, count) {
    if (count > 0) {
        let additionalInitials = createInitialElement(`+${count}`, '', 'additional-initials');
        assignedInitial.appendChild(additionalInitials);
    }
}

/**
 * Displays initials of assigned contacts in the UI.
 * @param {Object[]} assignDetails - Details of assigned contacts.
 */
function showAssignInitials(assignDetails) {
    let assignedInitial = document.getElementById('assignedInitial');
    assignedInitial.innerHTML = '';
    let maxInitialsToShow = 5;

    appendInitials(assignedInitial, assignDetails, maxInitialsToShow);
    appendAdditionalCount(assignedInitial, assignDetails.length - maxInitialsToShow);
}