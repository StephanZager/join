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

    loginSignupPolicies();
}

async function loginSignupPolicies() {
    changeUrl();
    if (window.location.pathname.includes('policy_over_signup.html')) {
        let loginHelpElement = document.getElementById('loginHelp');
        let contentMenu = document.getElementById('navbar');
        let policeElements = document.getElementById('policeLinks');
        if (loginHelpElement && contentMenu && policeElements) {
            loginHelpElement.style.display = 'none';
            contentMenu.style.display = 'none';
            policeElements.style.marginTop = 'auto';
        }
    }
    if (window.location.pathname.includes('legal_notice_over_signup.html')) {
        let loginHelpElement = document.getElementById('loginHelp');
        let contentMenu = document.getElementById('navbar');
        let policeElements = document.getElementById('policeLinks');
        if (loginHelpElement && contentMenu) {
            loginHelpElement.style.display = 'none';
            contentMenu.style.display = 'none';
            policeElements.style.marginTop = 'auto';
        }
    }
}

async function changeUrl(){
    if (window.location.pathname.includes('policy_over_signup.html')) {
        let privacyUrl = document.getElementById('privacyPolice');
        let legalUrl = document.getElementById('legalNotice');
        if (privacyUrl && legalUrl) {
            privacyUrl.href = 'policy_over_signup.html';
            legalUrl.href = 'legal_notice_over_signup.html';
        }
    }
    if (window.location.pathname.includes('legal_notice_over_signup.html')) {
        let privacyUrl = document.getElementById('privacyPolice');
        let legalUrl = document.getElementById('legalNotice');
        if (privacyUrl && legalUrl) {
            privacyUrl.href = 'policy_over_signup.html';
            legalUrl.href = 'legal_notice_over_signup.html';
        }
    }   
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
    let currentUrl = window.location.href;
    let links = document.querySelectorAll('.navbar .link, .links .link-to');
    links.forEach(function(link) {
        let linkSection = link.closest('.linkSection');
        let img = link.querySelector('img');
        
        if (currentUrl.includes(link.getAttribute('href'))) {
            // Prüfung, ob der Link eine 'link-to' Klasse hat und innerhalb eines '.links' Containers ist
            if (link.classList.contains('link-to') && link.closest('.links')) {
                link.classList.add('activeLink'); // 'activeLink' Klasse zum Link hinzufügen
            }
            if (linkSection) {
                linkSection.classList.add('activeLink');
            }
            link.classList.add('activeText');
            if (img) {
                img.classList.add('activeImage');
            }
        } else {
            if (link.classList.contains('link-to') && link.closest('.links')) {
                link.classList.remove('activeLink'); // 'activeLink' Klasse vom Link entfernen
            }
            if (linkSection) {
                linkSection.classList.remove('activeLink');
            }
            link.classList.remove('activeText');
            if (img) {
                img.classList.remove('activeImage');
            }
        }
    });
}



