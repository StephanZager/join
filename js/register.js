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
    postData(userData);
}


async function postData(userData) {
    await fetch('https://join-ac3b9-default-rtdb.europe-west1.firebasedatabase.app/', {
        method: 'POST',
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Data sent successfully:', data);
        // Hier kannst du die Daten weiterverarbeiten, wenn nötig
    })
    .catch(error => {
        console.error('Error sending data:', error);
    });
}