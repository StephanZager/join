const BASE_URL = "https://join-ac3b9-default-rtdb.europe-west1.firebasedatabase.app/";


async function submitData(event) {
    event.preventDefault(); // Verhindert das Standardverhalten des Formulars
    
    let name = document.getElementById('userName').value;
    let email = document.getElementById('userEmail').value;
    let password = document.getElementById('userPassword').value;
    
    let userData = {
        name: name,
        email: email,
        password: password
    };
    

    try {
        // Daten an Firebase senden
        await postData("/userData", userData); // Pfad für die DB, wo der Datensatz gespeichert werden soll
        
        // Nach dem erfolgreichen Senden des Formulars zur neuen Seite weiterleiten
        window.location.href = "summary.html"; // Ändere dies zur gewünschten URL
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