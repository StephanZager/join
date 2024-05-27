let contacts = [];
let groupedContactsLetters = {};

/**
 * This prevents the window from closing when I press the pop-up button
 * 
 * @param {string} event -  
 */
function doNotClose(event) {
    event.stopPropagation();
}

/**
 * Gets the input from the form and adds it to the json array, contacts
 * window.location.href causes the browser to navigate to this URL: contact.html
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
        await postData("/contact", contact);
        window.location.href = "contact.html";
    } catch (error) {
        console.error("Fehler beim Posten der Daten:", error);
    }
}

/**
 * adds the array contact from submitContact() on firebase
 * 
 * @param {path} path - this is the path where it should save in firebase 
 * @param {json array} data - under which array it should save on firebase
 * @returns 
 */
async function postData(path, data) {

    let response = await fetch(BASE_URL + path + ".json", {
        method: "POST",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });

    let responseToJson = await response.json();
    return responseToJson;
}

/**
 * 
 * Downloads the contacts from firebease again.
 * Key is a variable that represents the current key in the responseToJson object iterated through.
 * The hasOwnProperty() method of Object instances returns a boolean indicating whether this object has the specified property as its own property (as opposed to inheriting it).
 * 
 * @param {path} path - This is the path where the data from contact is inside  
 * @returns 
 */
async function loadContact(path = "/contact") {
    try {
        let response = await fetch(BASE_URL + path + ".json");
        let responseToJson = await response.json();

        for (let key in responseToJson) {
            if (responseToJson.hasOwnProperty(key)) {
                let contact = responseToJson[key];

                contacts.push({
                    'id': key,
                    'name': contact.name,
                    'email': contact.email,
                    'phone': contact.phone,
                    'bgNameColor': contact.bgNameColor,
                    'firstLetters': contact.firstLetters
                });
            }
        }
    } catch (error) {
        console.error("Fehler beim Laden der Daten:", error);
        return null;
    }
}

/**
 * This function inserts the contacts into the HTML page
 * 
 */
function generateContacts() {
    let contactListContainer = document.getElementById('contact');
    contactListContainer.innerHTML = '';

    let groupedContacts = filterContactAlphabet();

    for (let letter in groupedContacts) {
        let contacts = groupedContacts[letter];

        contactListContainer.innerHTML += `<div class="letter"><span>${letter}</span></div>
            <div class="seperator-alphabet-container"><div class="seperator-alphabet"></div></div>`;

        for (let i = 0; i < contacts.length; i++) {
            let contact = contacts[i];

            contactListContainer.innerHTML += contactHTML(contact);
        }
    }
}



function openUserInfo(index) {
    let userInfo = document.getElementById('contactInfo')
    let user = contacts[index];

    userInfo.innerHTML = '';
    userInfo.innerHTML = userInfoHTML(user, index);

}

async function updateContact(contactId, updatedContact, path = "/contact") {
    let response = await fetch(BASE_URL + path + '/' + contactId + '.json', {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedContact)
    });
    window.location.href = "contact.html";
    return response;
}

async function submitForm(i, contactId, path ) {
    event.preventDefault();

    let updatedContact = {
        name: document.getElementById('addcontact_name').value,
        email: document.getElementById('addcontact_email').value,
        phone: document.getElementById('addcontact_phone').value,
        firstLetters: filterFirstLetters(document.getElementById('addcontact_name').value),
        bgNameColor: contacts[i].bgNameColor,
    };

    let response = await updateContact(contactId, updatedContact, path);
}

async function editUser(i, path = "/contact") {
    let contactId = contacts[i].id;
    document.getElementById('addUbdateContactPopUp').innerHTML += addUbdateContactPopUp(i, path = "/contact");
    openAddUbdateContactwindow();
    document.getElementById('addcontact_name').value = contacts[i].name;
    document.getElementById('addcontact_email').value = contacts[i].email;
    document.getElementById('addcontact_phone').value = contacts[i].phone;

    document.getElementById('form').onsubmit = function (event) {
        submitForm(i, contactId, path);
    }
    generateContacts();
}
/**
 * This function deletes the user
 * 
 * @param {*} i is the index from the user
 * @param {*} path is the path where the contacts are stored
 */
async function deleteUser(i, path = "/contact") {
    let contactId = contacts[i].id;
    contacts.splice(i, 1);

    let response = await fetch(BASE_URL + path + '/' + contactId + '.json', {
        method: "DELETE",
    });
    document.getElementById('contactInfo').innerHTML = '';
    generateContacts();
}


/**
 * This function takes the first letters of the first and last name 
 * 
 * @param {string} name - The name is in there
 * 
 */
function filterFirstLetters(name) {
    let words = name.split(' ');
    let firstLetters = words.map(word => word.charAt(0).toUpperCase()).join('');

    return firstLetters;
}

/**
 * The function generates a random color, from the array userNameColor, for the name Logo
 * 
 * @returns the random color
 */
function toAssignColorNameLogo() {
    let backgroundcolor = userNameColor[Math.floor(Math.random() * userNameColor.length)];

    return backgroundcolor;
}

/**
 * Filter the contacts by the alphabet
 * 
 */
function filterNameAlphabet() {
    contacts.sort((a, b) => a.name.localeCompare(b.name));
}

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
 * Open the contact window and add contacts
 * 
 */
function openAddNewContactwindow() {
    addNewContactPopUp();
    document.getElementById('bg_add_new_contact').classList.remove('d-none');
    document.getElementById('btn-create-addcontact').classList.remove('d-none');

}

/**
 * closes the contact window again and clears the input fields
 * 
 */
function cloeAddNewContactwindow() {
    document.getElementById('bg_add_new_contact').classList.add('d-none');
    
}

function openAddUbdateContactwindow() {
    document.getElementById('bg_add_ubdate_contact').classList.remove('d-none');
    document.getElementById('btn-create-addcontact').classList.remove('d-none');
}

/**
 * Open the contact window and add contacts
 * 
 */
function cloeAddUbdateContactwindow() {
    document.getElementById('bg_add_ubdate_contact').classList.add('d-none');
    document.getElementById('addcontact_name').value = '';
    document.getElementById('addcontact_email').value = '';
    document.getElementById('addcontact_phone').value = '';
}

function slideInOnClick() {
    let userInfo = document.querySelector('#contactInfo');    
    userInfo.classList.remove('slide-in');    
    void userInfo.offsetWidth;   
    userInfo.classList.add('slide-in');
}

function openUserInfoWindow(){
        
        document.getElementById('contactInfoContainer').style.display = 'block';
        
    
}

function closeUserInfoWindow(){
    
        document.getElementById('contactInfoContainer').style.display = 'none';
          
    
}





async function contactinit() {
    await loadContact();
    filterNameAlphabet();
    generateContacts();
    filterContactAlphabet();

    
}