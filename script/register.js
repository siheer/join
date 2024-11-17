let logInData = []; // in firebase auslagern und dort speichern

function logIn() {
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
}