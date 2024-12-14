let contacts = [];
let groupedContactsLetters = {};
let currentOpenUser = null;
let currentUser = [];

/**
 * Prevents the window from closing when the pop-up button is pressed.
 * 
 * @param {Event} event - The event object.
 */
function doNotClose(event) {
    event.stopPropagation();
}

/**
 * Gets the input from the form and adds it to the contacts array.
 * 
 */
async function submitContact() {
    let name = document.getElementById('addcontact_name').value;
    let email = document.getElementById('addcontact_email').value;
    let phone = document.getElementById('addcontact_phone').value;
  
    let contact = {
        name: name,
        email: email,
        phone: phone,
        bgNameColor: toAssignColorNameLogo(),
        firstLetters: filterFirstLetters(name),
    };
    try {
        await addContact(contact);
    } catch (error) {
        console.error("Error posting data:", error);
    }
}

/**
 * Adds a new contact to the database and updates the contact list.
 * 
 * @param {Object} newContact - The new contact object.
 */
async function addContact(newContact) {
    const response = await postData("/contact", newContact);
    newContact.id = response.name;
    contacts.push(newContact);
    filterNameAlphabet();
    filterContactAlphabet();
    generateContacts();
    selectionTheLastCreatedUser(newContact);
    cloeAddNewContactwindow();
    addNewContactConfirmation();
}

/**
 * Selects the most recent contact that was created.
 * 
 * @param {Object} newContact - The most recently created contact.
 */
function selectionTheLastCreatedUser(newContact) {
    openUserInfo(newContact.originalIndex);
    document.getElementById('userButton' + newContact.originalIndex).focus();
    slideInPopup('contactInfo');
    openUserInfoWindow();
}


/**
 * Inserts the contacts into the HTML page.
 * 
 */
async function generateContacts() {
    let contactListContainer = document.getElementById('contact');
    contactListContainer.innerHTML = '';

    let groupedContacts = filterContactAlphabet();

    for (let letter in groupedContacts) {
        let contacts = groupedContacts[letter];

        contactListContainer.innerHTML += `<div onclick="deselectUser()" class="letter"><span>${letter}</span></div>
            <div class="seperator-alphabet-container"><div class="seperator-alphabet"></div></div>`;

        for (let i = 0; i < contacts.length; i++) {
            let contact = contacts[i];
            contactListContainer.innerHTML += contactHTML(contact);
        }
    }
}

/**
 * Opens the user information panel for the specified user.
 * 
 * @param {number} index - The index of the user in the contacts array.
 */
function openUserInfo(index) {
    let userInfo = document.getElementById('contactInfo');
    let userButton = document.getElementById('userButton' + index);
    let user = contacts[index];
    deselectUser();

    if (userInfo.innerHTML === '' || currentOpenUser !== index) {
        userInfo.innerHTML = userInfoHTML(user, index);
        userButton.focus();
        userButtonClassListAdd(userButton);
        currentOpenUser = index;
    } else {
        userInfo.innerHTML = '';
        userButtonClassListRemove(userButton)
        userButton.blur();
        currentOpenUser = null;
    }
}

/**
 * Adds focus and no-hover classes to the user button.
 * 
 * @param {HTMLElement} userButton - The user button element.
 */
function userButtonClassListAdd(userButton) {
    userButton.classList.add('focus-button');
    userButton.classList.add('no-hover');
}

/**
 * Removes focus and no-hover classes from the user button.
 * 
 * @param {HTMLElement} userButton - The user button element.
 */
function userButtonClassListRemove(userButton) {
    userButton.classList.remove('focus-button');
    userButton.classList.remove('no-hover');
}

/**
 * Deselects the currently selected user.
 * 
 */
function deselectUser() {
    if (currentOpenUser !== null) {
        let userInfo = document.getElementById('contactInfo');
        let userButton = document.getElementById('userButton' + currentOpenUser);
        userInfo.innerHTML = '';
        userButton.classList.remove('focus-button', 'no-hover');
        currentOpenUser = null;
    }
}

/**
 * Submits the form with updated contact information.
 * 
 * @param {Event} event - The form submission event.
 * @param {number} i - The index of the contact in the contacts array.
 * @param {string} contactId - The ID of the contact.
 * @param {string} path - The path where the contact is stored in the database.
 */
async function submitForm(event, i, contactId, path) {
    event.preventDefault();
    let name = document.getElementById('addcontact_edit_name').value;
    let email = document.getElementById('addcontact_edit_email').value;
    let phone = document.getElementById('addcontact_edit_phone').value;

    let updatedContact = {
        id: contactId,
        name: name,
        email: email,
        phone: phone,
        firstLetters: filterFirstLetters(document.getElementById('addcontact_edit_name').value),
        bgNameColor: contacts[i].bgNameColor,
    };
    await addContactUbdate(i, contactId, updatedContact, path);
}

/**
 * Updates a contact in the database and the contacts array.
 * 
 * @param {number} i - The index of the contact in the contacts array.
 * @param {string} contactId - The ID of the contact.
 * @param {Object} updatedContact - The updated contact object.
 * @param {string} path - The path where the contact is stored in the database.
 */
async function addContactUbdate(i, contactId, updatedContact, path) {
    await updateContact(contactId, updatedContact, path);
    contacts[i] = updatedContact;
    let newIndex = findContactIndexById(contactId);

    if (newIndex !== -1) {
        updatedContact.originalIndex = newIndex;
        openUserInfo(newIndex);
    }
    cloeAddUbdateContactwindow();
    filterNameAlphabet();
    filterContactAlphabet();
    await generateContacts();
    selectionTheLastCreatedUser(updatedContact);
    addNewContactConfirmation();
}

/**
 * Finds the index of a contact by its ID.
 * 
 * @param {string} contactId - The ID of the contact to find.
 * @returns {number} The index of the contact, or -1 if not found.
 */
function findContactIndexById(contactId) {
    for (let i = 0; i < contacts.length; i++) {
        if (contacts[i].id === contactId) {
            return i;
        }
    }
    return -1;
}

/**
 * Opens the edit user window with the current contact information.
 * 
 * @param {number} i - The index of the contact in the contacts array.
 * @param {string} [path="/contact"] - The path where the contact is stored in the database.
 */
async function editUser(i, path = "/contact") {
    let contactId = contacts[i].id;
    document.getElementById('addUbdateContactPopUp').innerHTML = addUbdateContactPopUp(i, path);
    openAddUbdateContactwindow();
    document.getElementById('addcontact_edit_name').value = contacts[i].name;
    document.getElementById('addcontact_edit_email').value = contacts[i].email;
    document.getElementById('addcontact_edit_phone').value = contacts[i].phone;
}

/**
 * Deletes a user from the contacts array and the database.
 * 
 * @param {number} i - The index of the user in the contacts array.
 * @param {string} [path="/contact"] - The path where the contacts are stored in the database.
 */
async function deleteUser(i, path = "/contact") {
    let contactId = contacts[i].id;
    contacts.splice(i, 1);

    let response = await fetch(BASE_URL + path + '/' + contactId + '.json', {
        method: "DELETE",
    });
    document.getElementById('contactInfo').innerHTML = '';
    currentOpenUser = null;
    generateContacts();
}

/**
 * Takes the first letters of the first and last name.
 * 
 * @param {string} name - The name of the contact.
 * @returns {string} - The first letters of the first and last name.
 */
function filterFirstLetters(name) {
    let words = name.split(' ');
    let firstLetters = words.map(word => word.charAt(0).toUpperCase()).join('');
    return firstLetters;
}

/**
 * Generates a random color for the name logo from the userNameColor array.
 * 
 * @returns {string} - The random color.
 */
function toAssignColorNameLogo() {
    let backgroundcolor = userNameColor[Math.floor(Math.random() * userNameColor.length)];
    return backgroundcolor;
}

/**
 * Sorts the contacts by name in alphabetical order.
 * 
 */
function filterNameAlphabet() {
    contacts.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Groups contacts by the first letter of their name.
 * 
 * @returns {Object} - The grouped contacts by the first letter.
 */
function filterContactAlphabet() {
    groupedContactsLetters = {};

    for (let i = 0; i < contacts.length; i++) {
        let contact = contacts[i];
        let firstLetter = contact.name.charAt(0).toUpperCase();

        if (!groupedContactsLetters[firstLetter]) {
            groupedContactsLetters[firstLetter] = [];
        }

        contact.originalIndex = i;
        groupedContactsLetters[firstLetter].push(contact);
    }
    return groupedContactsLetters;
}

/**
 * Opens the add new contact window.
 * 
 */
function openAddNewContactwindow() {
    addNewContactPopUp();
    document.getElementById('bg_add_new_contact').classList.remove('d-none');
    document.getElementById('btn-create-addcontact').classList.remove('d-none');
}

/**
 * Closes the add new contact window and clears the input fields.
 * 
 */
function cloeAddNewContactwindow() {
    document.getElementById('bg_add_new_contact').classList.add('d-none');
}

/**
 * Opens the add/update contact window.
 * 
 */
function openAddUbdateContactwindow() {
    document.getElementById('bg_add_ubdate_contact').classList.remove('d-none');
    document.getElementById('btn-create-addcontact').classList.remove('d-none');
}

/**
 * Closes the add/update contact window and clears the input fields.
 * 
 */
function cloeAddUbdateContactwindow() {
    document.getElementById('bg_add_ubdate_contact').classList.add('d-none');
    document.getElementById('addcontact_edit_name').value = '';
    document.getElementById('addcontact_edit_email').value = '';
    document.getElementById('addcontact_edit_phone').value = '';
}

/**
 * Opens the user information window.
 * 
 */
function openUserInfoWindow() {
    document.getElementById('contactInfoContainer').style.display = 'block';

    if (window.innerWidth < 700) {
        document.getElementById('userList').style.display = 'none';
    }
}

/**
 * Closes the user information window.
 * 
 */
function closeUserInfoWindow() {
    document.getElementById('contactInfoContainer').style.display = 'none';

    if (window.innerWidth < 700) {
        document.getElementById('userList').style.display = 'flex';

    }
}

/**
 * Opens the user delete/edit window.
 * 
 */
function openUserDeleteEditWindow() {
    document.getElementById('userDeleteHandy').innerHTML = getUserEditDeleteHTML(currentOpenUser);
    document.getElementById('bg-edit-delete').style.display = 'flex';
    document.getElementById('userDeleteHandy').style.display = 'block';
}

/**
 * Closes the user delete/edit window.
 * 
 */
function closeUserDeleteEditWindow() {
    document.getElementById('userDeleteHandy').innerHTML = '';
}

/**
 * Displays a confirmation message after a new contact has been added.
 * 
 */
async function addNewContactConfirmation() {
    let contactConfirmation = document.getElementById('contactConfirmation');
    contactConfirmation.classList.add('show-overlay-menu-user-info');
    contactConfirmation.innerHTML = `<img class="show-overlay-menu-user-info" src="assets/img/add-user-confirmation.png" alt="check">`;

    setTimeout(() => {
        contactConfirmation.innerHTML = '';
        contactConfirmation.classList.remove('show-overlay-menu-user-info');
    }, 3000);
}

/**
 * Adds the 'slide-in' class to the popup element with the specified ID to initiate a slide-in animation.
 * 
 * @param {string} popupId - The ID of the popup element to be animated.
 */
function slideInPopup(popupId) {
    let popup = document.getElementById(popupId);
    popup.classList.add('slide-in');
}

/**
 * Adjusts the visibility of elements based on the screen size.
 * 
 */
function adjustVisibilityBasedOnScreenSize() {
    if (currentOpenUser !== null) {
        document.getElementById('userList').style.display = 'none';
    }
    if (window.innerWidth < 700) {
        if (currentOpenUser === null) {
            document.getElementById('contactInfoContainer').style.display = 'none';
        }
    }
    if (window.innerWidth > 700) {
        document.getElementById('userList').style.display = 'flex';
        document.getElementById('contactInfoContainer').style.display = 'block';
    }
}

window.onload = adjustVisibilityBasedOnScreenSize;
window.onresize = adjustVisibilityBasedOnScreenSize;

/**
 * Initializes the contacts, filters, and generates the contacts list.
 * 
 */
async function contactinit() {
    await loadContact();
    filterNameAlphabet();
    filterContactAlphabet();
    await generateContacts();
    adjustVisibilityBasedOnScreenSize();
}