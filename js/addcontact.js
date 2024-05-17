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
}

/**
 * closes the contact window again
 * 
 */
function cloeAddNewContactwindow() {
    document.getElementById('bg_add_new_contact').classList.add('d-none');
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
        firstLetters : filterFirstLetters(name),
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

        Object.keys(responseToJson).forEach(key => {
            let contact = responseToJson[key];

            contacts.push({
                'name': contact.name,
                'email': contact.email,
                'phone': contact.phone,
                'bgNameColor': contact.bgNameColor,
                'firstLetters': contact.firstLetters
            });
        });

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

function openUserInfo(index){
   let userInfo = document.getElementById('contactInfo')
   let user = contacts[index];
   
   userInfo.innerHTML = `
    <div class="user-info-header">
        <div style="background-color:${user.bgNameColor} ;" class="initial-user" >${user.firstLetters}</div>
        <div class="user-info-name">
            <h2 class="user-name">${user.name}</h2>
            <div class="user-edit-delete">
                <div class="user-edit-delete-section" >
                    <img src="assets/img/edit-contacts.png" alt="edit">
                    <p>Edit</p>
                </div>
                <div class="user-edit-delete-section">
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
            <a>${user.email}</a>
        </div>
        <div>
            <p>Phone</p>
            <span>${user.phone}</span>
        </div>
    </div>
   
   `
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

function filterNameAlphabet() {

    contacts.sort((a, b) => {
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1
        }
        return 0
    });

    console.log(contacts)
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




