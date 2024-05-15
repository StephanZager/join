const BASE_URL = "https://join-ac3b9-default-rtdb.europe-west1.firebasedatabase.app/";

let contacts = [];

// nur für mich zum testen, sonst ist nacher zu viel da
async function löschen(path = '/contact') {
    let response = await fetch(BASE_URL + path + '.json', {
        method: "DELETE",
    });

}

/**
 * Open the contact window and add contacts
 */
function openAddNewContactwindow() {
    document.getElementById('bg_add_new_contact').classList.remove('d-none');
}

/**
 * closes the contact window again
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


async function submitContact() {
    let name = document.getElementById('addcontact_name').value;
    let email = document.getElementById('addcontact_email').value;
    let phone = document.getElementById('addcontact_phone').value;

    let contact = {
        name: name,
        email: email,
        phone: phone
    };
    try {
        await postData("/contact", contact);
        window.location.href = "contact.html";
    } catch (error) {
        console.error("Fehler beim Posten der Daten:", error);
    }
}


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


async function loadContact(path = "/contact") {
    try {
        let response = await fetch(BASE_URL + path + ".json");
        let responseToJson = await response.json();

        Object.keys(responseToJson).forEach(key => {
            let contact = responseToJson[key];

            contacts.push({
                'name': contact.name,
                'email': contact.email,
                'phone': contact.phone
            });
        });

        generateContacts();
    } catch (error) {
        console.error("Fehler beim Laden der Daten:", error);
        return null;
    }
}

/**
 * This function inserts the contacts into the HTML page
 */
function generateContacts() {
    const contactListContainer = document.getElementById('contact');
    contactListContainer.innerHTML = '';

    for (let i = 0; i < contacts.length; i++) {
        let contact = contacts[i];

        let contactHTML = `
                <div>
                    <div>${filterFirstLetters(contact.name)}</div>
                    <h3>${contact.name}</h3>                    
                </div>
            `;
        contactListContainer.innerHTML += contactHTML;
    }
}


/**
 * This function takes the first letters of the first and last name 
 * 
 * @param {string} name - The name is in there
 * 
 */
function filterFirstLetters(name) {  
    let words = name.split(' ');
    let firstLetters = words.map(word => word.charAt(0).toUpperCase());
    return firstLetters.join('');
}






