function test() {
    document.getElementById('test').innerHTML = `<div id="bg_add_new_contact" class="d-none">
    <div class="bg" onclick="cloeAddNewContactwindow()">
        <div onclick="doNotClose(event)">
        <div class="addcontact-container">

        <img onclick="cloeAddNewContactwindow()" class="close-botton-addcontact-destop"
            src="/assets/img/x.button.addcontact.black.png" alt="check">

        <img onclick="cloeAddNewContactwindow()" class="close-botton-addcontact"
            src="assets/img/close.button.addcontact.png.png" alt="" srcset="">
        <div class="aboveSection">
            <div class="headline">
                <img class="join-logo" src="assets/img/logo.desktop.png" alt="">
                <h2 class="h2-addcontact">Add contact</h2>
                <p class="addcontact-p-task">Tasks are better with a team!</p>
                <div class="seperator"></div>
            </div>
        </div>

        <img class="profilImgAddContact" src="assets/img/profil.img.addcontact.png.png" alt="" srcset="">

        <form id="form" action="" method="post" onsubmit="submitContact(); return false;">
            <input type="text" id="addcontact_name" name="name" required placeholder="Name" maxlength="20">
            <input type="email" id="addcontact_email" name="email" required placeholder="Email" maxlength="20">            
            <input type="tel" id="addcontact_phone" name="phone" pattern="0[\d\s-]{9,13}" placeholder="01234567890" required maxlength="14">
            <div class="form-button">
                <button type="button" class="addcontact_cancel_Button">
                    <img src="assets/img/x.button.addcontact.black.png" alt="check">Cancel
                </button>
                <div id="btn-create-addcontact" class="d-none">
                    <button type="submit" class="addcontact_Button">
                        <img src="assets/img/check.addcontact.png.png" alt="check">Create Contact
                    </button>
                </div>

                <div id="btn-save-addcontact">
                    
                </div>
                
            </div>
        </form>

        


    </div>
        
        
        
        
        
        
        
        
        
        
        </div>
    </div>
</div>`
}


function test2(i, path = "/contact") {

    return `<div id="bg_add_ubdate_contact" class="d-none">
    <div class="bg" onclick="cloeAddUbdateContactwindow()">
        <div onclick="doNotClose(event)">
        <div class="addcontact-container">

        <img onclick="cloeAddUbdateContactwindow()" class="close-botton-addcontact-destop"
            src="/assets/img/x.button.addcontact.black.png" alt="check">

        <img onclick="cloeAddNewContactwindow()" class="close-botton-addcontact"
            src="assets/img/close.button.addcontact.png.png" alt="" srcset="">
        <div class="aboveSection">
            <div class="headline">
                <img class="join-logo" src="assets/img/logo.desktop.png" alt="">
                <h2 class="h2-addcontact">Add contact</h2>
                <p class="addcontact-p-task">Tasks are better with a team!</p>
                <div class="seperator"></div>
            </div>
        </div>

        <img class="profilImgAddContact" src="assets/img/profil.img.addcontact.png.png" alt="" srcset="">

        <form id="form" action="" method="put" onsubmit="editUser(${i}, ${path = "/contact"})"; return false;">
            <input type="text" id="addcontact_name" name="name" required placeholder="Name" maxlength="20">
            <input type="email" id="addcontact_email" name="email" required placeholder="Email" maxlength="20">            
            <input type="tel" id="addcontact_phone" name="phone" pattern="0[\d\s-]{9,13}" placeholder="01234567890" required maxlength="14">
            <div class="form-button">
                <button type="button" class="addcontact_cancel_Button">
                    <img src="assets/img/x.button.addcontact.black.png" alt="check">Cancel
                </button>
                <div id="btn-create-addcontact">
                    <button type="submit" class="addcontact_Button">
                        <img src="assets/img/check.addcontact.png.png" alt="check">Save
                    </button>
                </div>

                <div id="btn-save-addcontact">
                    
                </div>
                
            </div>
        </form>

        


    </div>           
        </div>
    </div>
</div>`
}