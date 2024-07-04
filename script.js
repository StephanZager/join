const BASE_URL = "https://join-ac3b9-default-rtdb.europe-west1.firebasedatabase.app/";

async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        let file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
    showLoginInitial(); // Call showLoginInitial after the HTML has been included
    highlightActiveLinks()
}



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


