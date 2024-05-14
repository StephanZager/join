const BASE_URL = "https://join-ac3b9-default-rtdb.europe-west1.firebasedatabase.app/";


function openAddNewContactwindow() {
    document.getElementById('bg_add_new_contact').classList.remove('d-none');
}


function cloeAddNewContactwindow() {
    document.getElementById('bg_add_new_contact').classList.add('d-none');
}


function doNotClose(event) {
    event.stopPropagation();
}


async function submitContact(event) {
    event.preventDefault(); // Verhindert das Standardverhalten des Formulars
    
    let name = document.getElementById('addcontact_name').value;
    let email = document.getElementById('addcontact_email').value;
    let phone = document.getElementById('addcontact_phone').value;
    
    let contact = {
        name: name,
        email: email,
        phone: phone
    };
    

    try {
        // Daten an Firebase senden
        await postData("/contact", contact); // Pfad für die DB, wo der Datensatz gespeichert werden soll
        
        // Nach dem erfolgreichen Senden des Formulars zur neuen Seite weiterleiten
        window.location.href = "contact.html"; // Ändere dies zur gewünschten URL
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

    if (!response.ok) {
        // Fehlerbehandlung hinzufügen
        console.error("Fehler beim Posten der Daten:", response.statusText);
        return;
    }

    let responseToJson = await response.json();
    return responseToJson;
}


async function loadContact(path="/contact") {
    try {
        let response = await fetch(BASE_URL + path + ".json");
        let responseToJson = await response.json();
        return responseToJson;
    } catch (error) {
        console.error("Fehler beim Laden der Daten:", error);
        return null;
    }
}

function generateContacts(contacts) {
    const contactListContainer = document.getElementById('contact');

    // Clear existing contacts
    contactListContainer.innerHTML = '';

    // Generate HTML for each contact
    for (const key in contacts) {
        if (contacts.hasOwnProperty(key)) {
            const contact = contacts[key];
            const contactHTML = `
                <div id="contact">
                    <h3>${contact.name}</h3>
                    <p>${contact.email}</p>
                    <p>${contact.phone}</p>
                </div>
            `;
            contactListContainer.innerHTML += contactHTML;
        }
    }
}

async function init() {
    const contacts = await loadContact();
    if (contacts) {
        generateContacts(contacts);
    }
}

init();
