/**
 * Assigns a random color to a guest user.
 * This function uses `getRandomColor` to fetch a random color.
 * @returns {string} The assigned color value for the guest user.
 */
function assignGuestColor() {
    let color = getRandomColor();
    return color;
}

/**
 * Retrieves user inputs from the DOM and assigns a random color.
 * @returns {Object} An object containing the user's inputs and a random color.
 */
function getUserInputs() {
    return {
        color: getRandomColor(),
        email: document.getElementById("email"),
        password: document.getElementById("password"),
        confirmPassword: document.getElementById("confirmPassword"),
        userName: document.getElementById("user"),
        privacyPolicy: document.getElementById("privacyPolicy"),
    };
}

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} isPasswordValid - Whether the password and confirmation match.
 * @property {boolean} isNameValid - Whether the username meets validation rules.
 * @property {boolean} isEmailValid - Whether the email is valid.
 * @property {boolean} isPrivacyPolicyChecked - Whether the privacy policy checkbox is checked.
 * @property {boolean} mailAlreadyExists - Whether the email is already registered.
 */

/**
 * Validates user input fields asynchronously.
 *
 * @async
 * @function validateUserInputs
 * @param {string} email - The user's email address.
 * @param {string} password - The user's chosen password.
 * @param {string} confirmPassword - The password confirmation input.
 * @param {string} userName - The user's full name.
 * @param {HTMLElement} privacyPolicy - The checkbox element for privacy policy agreement.
 * @returns {Promise<ValidationResult>} The validation results.
 */
async function validateUserInputs(email, password, confirmPassword, userName, privacyPolicy) {
    const [isPasswordValid, isNameValid, isEmailValid, isPrivacyPolicyChecked, mailAlreadyExists] = 
        await Promise.all([
            checkPassword(password, confirmPassword),
            checkName(userName),
            checkEmail(email),
            checkPrivacyPolicy(privacyPolicy.checked),
            checkEmailExisting(email)
        ]);
    return {
        isPasswordValid: !!isPasswordValid,
        isNameValid: !!isNameValid,
        isEmailValid: !!isEmailValid,
        isPrivacyPolicyChecked: !!isPrivacyPolicyChecked,
        mailAlreadyExists: !!mailAlreadyExists
    };
}

/**
 * @param {string} rawEmail
 * @returns {string}
 */
function normalizeEmail(rawEmail) {
  return (rawEmail || "").trim().toLowerCase();
}

/**
 * Adds a new user to the system after validating inputs.
 * If validation fails, the password fields are cleared and the function exits early.
 * If validation passes, the user is added to the contact list and their login credentials are updated.
 *
 * @async
 * @function addUser
 * @returns {Promise<void>} A promise that resolves when the user is successfully added or exits on validation failure.
 */
async function addUser() {
    // Retrieve user input values
    const { color, email, password, confirmPassword, userName, privacyPolicy } = getUserInputs();
    
    // Validate user inputs
    const validationResults = await validateUserInputs(email, password, confirmPassword, userName, privacyPolicy);

    // If any validation fails, clear password fields and exit
    if (!validationResults.isPasswordValid || !validationResults.isNameValid || 
        !validationResults.isEmailValid || !validationResults.isPrivacyPolicyChecked || 
        validationResults.mailAlreadyExists) {
        clearData(password, confirmPassword);
        return;
    }

    // Add user to contacts and update login credentials asynchronously
    await Promise.all([
        addToContacts(email, userName, color, getInitials(userName.value)),
        updateUser({ email: normalizeEmail(email.value), password: password.value })
    ]);
}

/**
 * Adds a new user to the contacts list in the database.
 * Creates a new contact record with the provided email and user name.
 * 
 * @async
 * @function addToContacts
 * @param {HTMLInputElement} email - The email input element of the contact.
 * @param {HTMLInputElement} userName - The user name input element of the contact.
 * 
 * @returns {Promise<void>} Resolves when the contact has been added successfully.
 */
async function addToContacts(email, userName, color, initials) {
    let registerData = {
        "mail": normalizeEmail(email.value),
        "name": userName.value,
        "color": color,
        "initials": initials
    };
    await updateContacts(registerData);
}

/**
 * Clears all user data from the form.
 */
function clearAllUserData() {
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    document.getElementById("confirmPassword").value = "";
    document.getElementById("user").value = "";
    document.getElementById('privacyPolicy').checked = false;
}

/**
 * Displays a generic lookup error message and highlights the email field.
 * @param {HTMLInputElement} emailEl - The email input element.
 */
function showEmailLookupError(emailEl) {
  document.getElementById('errorMessageEmail').innerHTML =
    '<div class="errorText">We couldn’t validate your email right now. Please try again.</div>';
  emailEl.style.border = '1px solid red';
}

/**
 * Handles the API request and response parsing for checking if an email exists,
 * using the shared `fetchResource` helper.
 *
 * @async
 * @param {string} queryString - The encoded Firebase query string, beginning with "?".
 * @param {HTMLInputElement} emailEl - The email input element (used for UI updates).
 * @returns {Promise<boolean>} True if the email exists or an error occurred, otherwise false.
 */
async function performEmailLookup(queryString, emailEl) {
  const result = await fetchResource('users', 'GET', undefined, queryString);

  if (result === false) {
    showEmailLookupError(emailEl);
    return true;
  }

  const exists = !!(result && Object.keys(result).length > 0);
  if (exists) errorFunctionEmailExist();
  return exists;
}

/**
 * Checks if the given email already exists in the database.
 * In case of network/HTTP errors, registration is blocked.
 *
 * @async
 * @param {HTMLInputElement} emailEl - The email input element.
 * @returns {Promise<boolean>} True if the email exists or an error occurred (stop registration), otherwise false.
 */
async function checkEmailExisting(emailEl) {
  const normalized = normalizeEmail(emailEl.value);
  const queryString = `?orderBy=${encodeURIComponent('"email"')}&equalTo=${encodeURIComponent(`"${normalized}"`)}`;
  return performEmailLookup(queryString, emailEl);
}

/**
 * Validates the user's name.
 * @param {HTMLInputElement} userName - The user name input element.
 * @returns {Promise<boolean>} True if name is valid, otherwise false.
 */
async function checkName(userName) {
    if (/\d/.test(userName.value) || userName.value.trim() === "") {
        errorFunctionName();
        return false;
    } else {
        document.getElementById('user').style.border = "1px solid lightgray";
        document.getElementById('errorMessageName').innerHTML = "";
        return true;
    }
}

/**
 * Displays an error for invalid user name.
 */
function errorFunctionName() {
    document.getElementById('errorMessageName').innerHTML = /*html*/`
        <div class="errorText">Your name cannot contain numbers or is blank.</div>`;
    document.getElementById('user').style.border = "1px solid red";
}

/**
 * Validates the password and its confirmation.
 * @param {HTMLInputElement} password - The password input element.
 * @param {HTMLInputElement} confirmPassword - The confirm password input element.
 * @returns {boolean} True if passwords are valid and match, otherwise false.
 */
function checkPassword(password, confirmPassword) {
    if (password.value !== confirmPassword.value ||
        password.value.trim() === "" ||
        password.value.length < 8 ||
        password.value.length > 40) {
        errorFunctionPassword();
        return false;
    } else {
        document.getElementById('confirmPassword').style.border = "1px solid lightgray";
        document.getElementById('password').style.border = "1px solid lightgray";
        document.getElementById('errorMessageConfirmPassword').innerHTML = "";
        return true;
    }
}

/**
 * Displays an error for invalid or mismatched passwords.
 */
function errorFunctionPassword() {
    const errorMessage = '<div class="errorText">Your passwords must match and be 8–40 characters.</div>';
    document.getElementById('errorMessageConfirmPassword').innerHTML = errorMessage;
    document.getElementById('errorMessagePassword').innerHTML = errorMessage;
    document.getElementById('confirmPassword').style.border = "1px solid red";
    document.getElementById('password').style.border = "1px solid red";
}

/**
 * Validates the email format.
 * @param {HTMLInputElement} email - The email input element.
 * @returns {Promise<boolean>} True if email is valid, otherwise false.
 */
async function checkEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value) || email.value.trim() === "") {
        errorFunctionEmail();
        return false;
    } else {
        document.getElementById('email').style.border = "1px solid lightgray";
        document.getElementById('errorMessageEmail').innerHTML = "";
        return true;
    }
}

/**
 * Displays an error for invalid email format.
 */
function errorFunctionEmail() {
    document.getElementById('errorMessageEmail').innerHTML = /*html*/`
        <div class="errorText">Please enter a valid email address</div>`;
    document.getElementById('email').style.border = "1px solid red";
}

/**
 * Displays an error if the email already exists.
 */
function errorFunctionEmailExist() {
    document.getElementById('errorMessageEmail').innerHTML = /*html*/`
        <div class="errorText">This email address is already taken</div>`;
    document.getElementById('email').style.border = "1px solid red";
}

/**
 * Checks if the privacy policy checkbox is checked.
 * @param {boolean} isChecked - The state of the privacy policy checkbox.
 * @returns {boolean} True if checked, otherwise false.
 */
async function checkPrivacyPolicy(isChecked) {
    if (isChecked) {
        document.getElementById('privacyPolicy').style.outline = "";
        document.getElementById('errorMessageprivacyPolicy').innerHTML = "";
        return true;
    } else {
        document.getElementById('errorMessageprivacyPolicy').innerHTML = /*html*/`
        <div class="errorText">please check the privacy policy</div>`;
        document.getElementById('privacyPolicy').style.outline = "2px solid red";
        return false;
    }
}

/**
 * Clears the password and confirm password fields.
 * @param {HTMLInputElement} password - The password input element.
 * @param {HTMLInputElement} confirmPassword - The confirm password input element.
 */
function clearData(password, confirmPassword) {
    password.value = "";
    confirmPassword.value = "";
}

/**
 * Sends the contact data to the database to be stored in the "contacts" collection.
 * 
 * @async
 * @function updateContacts
 * @param {Object} registerData - The contact data to be saved.
 * @param {string} registerData.name - The name of the contact.
 * @param {string} registerData.mail - The email address of the contact.
 * 
 * @returns {Promise<void>} Resolves when the contact data has been successfully saved.
 */
async function updateContacts(registerData) {
    const response = await fetch(BASE_URL + "/contacts" + ".json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
    });
    const result = await response.json();
}

/**
 * Updates the user information by sending data to the server, clearing local user data,
 * showing a toast message, and redirecting the user to the homepage.
 *
 * @async
 * @function updateUser
 * @param {Object} data - The user data to be sent to the server.
 * @returns {Promise<void>} Resolves once the operation is complete.
 */
async function updateUser(data) {
    const response = await fetch(BASE_URL + "/users" + ".json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    const result = await response.json();
    clearAllUserData();
    showToastMessage({ message: "You signed up successfully" });
    setTimeout(() => {
        window.location.href = "/index.html?msg=You Signed up successfully";
    }, 2000);
}
