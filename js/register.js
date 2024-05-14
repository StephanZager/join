function submitData(event) {
    event.preventDefault(); // Verhindert das Standardverhalten des Formulars
    
    let name = document.getElementById('userName').value;
    let email = document.getElementById('userEmail').value;
    let password = document.getElementById('userPassword').value;
    
    let userData = {
        name: name,
        email: email,
        password: password
    };
    
    // Daten an Firebase senden
    postData("/userData", userData); // pfad für die db wo der datensatz gespeichert werden soll
}

const BASE_URL = "https://join-ac3b9-default-rtdb.europe-west1.firebasedatabase.app/";

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