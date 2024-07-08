const BASE_URL = "https://join-ac3b9-default-rtdb.europe-west1.firebasedatabase.app/";

async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        let file = element.getAttribute("w3-include-html");
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
    // Verschieben Sie die Logik, die von dem eingefügten HTML abhängt, in eine separate Funktion
    await afterHTMLIncluded();
}

async function afterHTMLIncluded() {
    showLoginInitial(); // Call showLoginInitial after the HTML has been included
    highlightActiveLinks();
    console.log("Überprüfung der URL:", window.location.pathname.includes('legalnotice.html'));
    console.log("Aktueller Pfad:", window.location.pathname);
    
    // Prüfen, ob die URL privacy-police.html enthält
    if (window.location.pathname.includes('privacy-police.html')) {
        let loginHelpElement = document.getElementById('loginHelp');
        if (loginHelpElement) {
            // Direktes Ändern des Stils, um das Element auszublenden
            loginHelpElement.style.display = 'none';
        }
    }
   
    // Prüfen, ob die URL legalnotice.html enthält
    if (window.location.pathname.includes('legalnotice.html')) {
        let loginHelpElement = document.getElementById('loginHelp');
        if (loginHelpElement) {
            // Direktes Ändern des Stils, um das Element auszublenden
            loginHelpElement.style.display = 'none';
        }
        // Fügen Sie hier weitere Aktionen hinzu, die spezifisch für legalnotice.html sind
    }
}


document.addEventListener('DOMContentLoaded', includeHTML);




function dropdownMenu() {
    document.getElementById("dropdownMenu").classList.toggle("show");
}

window.onclick = function(event) {
    if (!event.target.matches('#joinProfil')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}


function highlightActiveLinks() {
    var currentUrl = window.location.href;
    var links = document.querySelectorAll('.navbar .link');
    links.forEach(function(link) {
        // Zugriff auf den übergeordneten Container des Links
        var linkSection = link.closest('.linkSection');
        // Zugriff auf das img-Element innerhalb des Links
        var img = link.querySelector('img');
        
        if (currentUrl.includes(link.getAttribute('href'))) {
            if (linkSection) {
                linkSection.classList.add('activeLink');
                link.classList.add('activeText'); // Klasse zum Link hinzufügen
                if (img) {
                    img.classList.add('activeImage'); // Klasse zum img hinzufügen
                }
            }
        } else {
            if (linkSection) {
                linkSection.classList.remove('activeLink');
                link.classList.remove('activeText'); // Klasse vom Link entfernen
                if (img) {
                    img.classList.remove('activeImage'); // Klasse vom img entfernen
                }
            }
        }
    });
}



//function openPrivacyPolicy() {
//    window.location.href = "privacy-police.html"; 
//    disableLoginHelp();
//}

//function disableLoginHelp() {
//    document.getElementById('loginHelp').classList.add('display-none');
//}


