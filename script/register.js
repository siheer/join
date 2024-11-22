let logInData = [{   
        "email": "nathalie@test.de",
        "password": "test123"
    }
]; // in firebase auslagern und dort speichern

function addUser() {
    let email = document.getElementById("email");
    let password = document.getElementById("password");

    singleLogInData = {
        "email": email.value,
        "password": password.value
    };

    logInData.push(singleLogInData);
    console.log(logInData);
    email.value = "";
    password.value = "";

    // Weiterleitung zun Login-Seite + Nachricht anzeigen: "Erfolgreiche Registrierung!"
    window.location.href = "log-in.html?msg=You Signed up successfully";
}