

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

function createInitialElement(text, bgColor, className) {
    let element = document.createElement('span');
    element.textContent = text;
    if (bgColor) {
        element.style.backgroundColor = bgColor;
    }
    element.classList.add(className);
    return element;
}

function appendInitials(assignedInitial, assignDetails, maxInitialsToShow) {
    for (let i = 0; i < Math.min(assignDetails.length, maxInitialsToShow); i++) {
        let detail = assignDetails[i];
        let initialsElement = createInitialElement(filterFirstLetters(detail.name), detail.bgNameColor, 'assign-initials');
        assignedInitial.appendChild(initialsElement);
    }
}

function appendAdditionalCount(assignedInitial, count) {
    if (count > 0) {
        let additionalInitials = createInitialElement(`+${count}`, '', 'additional-initials');
        assignedInitial.appendChild(additionalInitials);
    }
}

function showAssignInitials(assignDetails) {
    let assignedInitial = document.getElementById('assignedInitial');
    assignedInitial.innerHTML = '';
    let maxInitialsToShow = 5;

    appendInitials(assignedInitial, assignDetails, maxInitialsToShow);
    appendAdditionalCount(assignedInitial, assignDetails.length - maxInitialsToShow);
}