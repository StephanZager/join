let contacts = [];


// nur für mich zum testen, sonst ist nacher zu viel da
async function löschen(path = '/contact') {
    let response = await fetch(BASE_URL + path + '.json', {
        method: "DELETE",
    });
}

/**
 * Open the contact window and add contacts
 * 
 */
function openAddNewContactwindow() {
    document.getElementById('bg_add_new_contact').classList.remove('d-none');
    document.getElementById('btn-create-addcontact').classList.remove('d-none');

}

/**
 * closes the contact window again and clears the input fields
 * 
 */
function cloeAddNewContactwindow() {
    document.getElementById('bg_add_new_contact').classList.add('d-none');
    document.getElementById('addcontact_name').value = '';
    document.getElementById('addcontact_email').value = '';
    document.getElementById('addcontact_phone').value = '';
}

/**
 * This prevents the window from closing when I press the pop-up button
 * 
 * @param {string} event -  
 */
function doNotClose(event) {
    event.stopPropagation();
}

/**
 * gets the input from the form and adds it to the json array, contacts
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
 * downloads the contacts from firebease again
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

    for (let i = 0; i < contacts.length; i++) {
        let contact = contacts[i];

        let contactHTML = `
                <div class="show-contact" onclick="openUserInfo(${i})">
                    <div style="background-color:${contact.bgNameColor} ;" class="initial-contact" >${contact.firstLetters}</div>
                    <div class="show-contact-details">
                        <span>${contact.name}</span> 
                        <span class="show-contact-email">${contact.email}</span>
                    </div>                       
                </div>
            `;
        contactListContainer.innerHTML += contactHTML;
    }
}


function openUserInfo(index) {
    let userInfo = document.getElementById('contactInfo')
    let user = contacts[index];
    console.log(user.id)
    userInfo.innerHTML = `
    <div class="user-info-header">
        <div style="background-color:${user.bgNameColor} ;" class="initial-user" >${user.firstLetters}</div>
        <div class="user-info-name">
            <h2 class="user-name">${user.name}</h2>
            <div class="user-edit-delete" >
                <div class="user-edit-delete-section" onclick="editUser(${index})">
                    <img src="assets/img/edit-contacts.png" alt="edit">
                    <p>Edit</p>
                </div>
                <div class="user-edit-delete-section" onclick="deleteUser(${index})">
                    <img src="assets/img/delete-contacts.png" alt="edit">
                    <p>Delete</p>
                </div>
            </div>
        </div>
    </div>
    <div class="contact-information-headline" >
        <span>Contact Information</span>
    </div>
    <div class="contact-info-email-phone">
        <div>
            <p>Email</p>
            <a href="mailto:${user.email}">${user.email}</a>
        </div>
        <div>
            <p>Phone</p>
            <a style="color:black;" href="tel:${user.phone}">${user.phone}</a>
        </div>
    </div>   
   `
}

async function updateContact(contactId, updatedContact, path = "/contact") {
    let response = await fetch(BASE_URL + path + '/' + contactId + '.json', {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedContact)
    });
    return response;
}

async function editUser(i, path = "/contact") {
    let contactId = contacts[i].id;
    openAddNewContactwindow();
    document.getElementById('addcontact_name').value = contacts[i].name;
    document.getElementById('addcontact_email').value = contacts[i].email;
    document.getElementById('addcontact_phone').value = contacts[i].phone;
    document.getElementById('btn-create-addcontact').classList.add('d-none');

    let updatedContact = {
        name: document.getElementById('addcontact_name').value,
        email: document.getElementById('addcontact_email').value,
        phone: document.getElementById('addcontact_phone').value,
        firstLetters: contacts[i].firstLetters,
        bgNameColor: contacts[i].bgNameColor,
    };

    let response = await updateContact(contactId, updatedContact, path);  
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


async function contactinit() {
    await loadContact();
    filterNameAlphabet();
    generateContacts();
}










//////////////////////////////////////////////////////// test für aplhabet index
//function indexAlphabet() {
//    if (sortedByLetter !== currentLetter) {
//        currentLetter = sortedByLetter;
//        renderContact.innerHTML += generateRegisterHTML(sortedByLetter);
//    }

//}

//function generateRegisterHTML(sortedByLetter) {
//    return /*html*/ `
//    <div class="letterWrapper">
//        <div class="Buchstabe">${sortedByLetter}</div>
//        <div class="divider"></div>
//    </div>
//    `;
//}

//let sortedByLetter = name.charAt(0);

//        if (sortedByLetter !== currentLetter) {
//            currentLetter = sortedByLetter;
//            renderContact.innerHTML += generateRegisterHTML(sortedByLetter);
//        }




