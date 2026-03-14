

const firebaseConfig = {
      apiKey: "AIzaSyCn4U1J18yfbrNO2KYbH7f6S30lEC7ClkA",
      authDomain: "citihub-example.firebaseapp.com",
      projectId: "citihub-example",
      storageBucket: "citihub-example.appspot.com", // corrected bucket
      messagingSenderId: "645032109193",
      appId: "1:645032109193:web:9c54f5ff633a7d5604d258",
      measurementId: "G-FPQ0XXSGT7"
    };


// correct call
firebase.initializeApp(firebaseConfig);

 const db = firebase.firestore();

document.querySelector(".message-code-para").style.display = "none"
document.querySelector(".email-code-para").style.display = "none"
function hasNoCapitalLetters(input) {
    return /^[^A-Z]*$/.test(input);
}
function hasNoNumbers(input) {
    return /^[^0-9]*$/.test(input);
}
function hasNoLetters(input) {
    return /^[^a-zA-Z]*$/.test(input);
}
function hasNoSpecialCharacters(input) {
    return /[^\w\s]/.test(input);
}
function generateRandomNumber() {
    var result = '';
    var characters = '1234567890';
    var charactersLength = characters.length;
    for (var i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

var validationMessage = document.getElementById("emailPara");
var confirmPassPara = document.getElementById("confirm-pass-para")
confirmPassPara.textContent = "Password does'nt Match."
confirmPassPara.style.display = "none"
validationMessage.style.display = "none"
var userPara = document.getElementById("new-user");
userPara.style.display = "none";
 document.getElementById("terms-para").style.display = "none";
var newEmail = document.getElementById("newEmail");
var newPassword = document.getElementById("loginPassword");
var confirmPassword = document.getElementById("confirmPassword");
var notRobotPara = document.getElementById("not-robot-para");
notRobotPara.style.display = "none"
var newUSer = document.getElementById("username");

document.querySelector("#newEmail").addEventListener("keypress", event=>{
    if (event.keyCode === 32) {
        event.preventDefault();
    }
})





var confirmEmailInput = document.getElementById("confirmEmailCode")
document.addEventListener("input", (event)=>{
    newUSer.style.color ="black"
    newEmail.style.color = "black"
    newPassword.style.color = "black"
    userPara.style.display = "none"
    notRobotPara.style.display = "none"
    document.querySelector(".email-code-para").style.display = "none"
    confirmPassPara.style.display = "none"
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newEmail.value.endsWith("@gmail.com")) {
        validationMessage.textContent = "Email must end at @gmail.com."
        validationMessage.style.display = "block"       
    }
    if (newEmail.value.length <= 0) {
        validationMessage.style.display = "none"
        newEmail.style.color = "black"
    }
    
    if(newUSer.value.length > 0) userPara.style.display = "none";
    if(newPassword.value.length > 0 || confirmPassword.value.length > 0)confirmPassPara.style.display = "none";
    if(newPassword.value === confirmPassword.value){
        confirmPassPara.style.display = "none";
       
    }else{
        confirmPassPara.textContent = "Password does'nt Match.";
        confirmPassPara.style.display = "block";
    }
    if(newPassword.value.length <= 0){
        confirmPassPara.style.display = "none";
    }
})





let whoIsThis = ''
function validateAccount() {  
    var allRequirementsMet = false;  
    var isNotRobot = false;
    var termsChecked = false;

    // Captcha check
    const captchaResponse = grecaptcha.getResponse();
    if (!(captchaResponse.length > 0)) {
        notRobotPara.style.display = "block";
        isNotRobot = false;
    } else {
        isNotRobot = true;
        notRobotPara.style.display = "none";
    }

    // Terms check
    if (document.getElementById("termsCheckbox").checked) {
        termsChecked = true;
        document.getElementById("terms-para").style.display = "none";
    } else {
        termsChecked = false;
        document.getElementById("terms-para").style.display = "block";
    }

    // Gender radio check
    const radios = document.querySelectorAll('input[name="gender"]');
    let checked = false;
    radios.forEach(radio => {
        if (radio.checked) {
            checked = true;
        }
    });
    if (!checked) {
        alert("Please select a gender option.");
        return; // stop validation early
    }

    // Email validation
    var correctEmail = false;
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(newEmail.value) && newEmail.value.endsWith("gmail.com")) {
        validationMessage.textContent = "";
        validationMessage.style.display = "none";
        correctEmail = true;
    } else {
        validationMessage.style.display = "block";
        validationMessage.textContent = "Please enter a valid email address.";
        newEmail.style.color = "red";
        correctEmail = false;
    }

    // Username validation
    var correctUser = false;
    if (newUSer.value === "") {
        correctUser = false;
        userPara.textContent = "Please enter a Username.";
        userPara.style.display = "block";
        newUSer.style.color = "red";
    } else {
        userPara.style.display = "none";
        correctUser = true;
    }

    // Password validation
    var correctPassword = false;
    var notSameEmailandPass = false;
    if (newPassword.value === "") {  
        confirmPassPara.textContent = "Please enter a Password.";
        confirmPassPara.style.display = "block";
        correctPassword = false;
        newPassword.style.color = "red";
    } else if (newPassword.value !== confirmPassword.value) {
        confirmPassPara.textContent = "Password doesn't Match.";
        confirmPassPara.style.display = "block";
        correctPassword = false;
        newPassword.style.color = "red";
    } else {
        let errors = [];
        if (newPassword.value.length < 8) errors.push("Min 8 chars");
        if (hasNoCapitalLetters(newPassword.value)) errors.push("1 Capital");
        if (hasNoNumbers(newPassword.value)) errors.push("1 Number");
        if (hasNoLetters(newPassword.value)) errors.push("1 Letter");
        if (!hasNoSpecialCharacters(newPassword.value)) errors.push("1 Special");

        if (newPassword.value == newUSer.value || confirmPassword.value == newUSer.value) 
            errors.push("Pass ≠ User");
        if (newPassword.value == newEmail.value || confirmPassword.value == newEmail.value) 
            errors.push("Pass ≠ Email");

        if (errors.length > 0) {
            confirmPassPara.textContent = errors.join("\n");
            confirmPassPara.style.display = "block";
            correctPassword = false;
            newPassword.style.color = "red";
            notSameEmailandPass = false;
            newEmail.style.color = "red";
        } else {
            confirmPassPara.style.display = "none";
            correctPassword = true;
            notSameEmailandPass = true;
            newPassword.style.color = "black";
            newEmail.style.color = "black";
        }
    }

    // Final check
    if (correctPassword && correctEmail && correctUser && isNotRobot && termsChecked && checked) {
        allRequirementsMet = true;
        if (document.querySelector("#emailOtp").value === otp) {
            const email    = newEmail.value;
            const password = newPassword.value;
            const username = newUSer.value;
            const gender = document.querySelector('input[name="gender"]:checked').value;
            db.collection("users").add({
                username: username,
                password: password,
                email: email,
                gender: gender
            })
            .then(() => {
                 alert("Account Created Successfully!");
            })
            .catch((error) => {
                console.error("Error saving data:", error);
                alert("Failed to save data: " + error.message);
            });
                    
            newEmail.value = "";
            newUSer.value = "";
            newPassword.value = "";
            document.querySelector("#confirmPassword").value = "";
           
        } else {
            document.querySelector(".email-code-para").style.display = "block";
        }
    }
}
var otp = ''
document.querySelector(".sendOtpBtn").addEventListener("click",()=>{        
     otp = generateRandomNumber()
    alert("Your OTP is: " + otp)
})



function togglePasswordVisibility() {
    var imgLock = document.getElementById("logoPassword");
    var passwordInput = document.getElementById("loginPassword");
    passwordInput.type = (passwordInput.type === "password") ? "text" : "password";
    imgLock.setAttribute('title', (passwordInput.type === "password") ? 'Show Password' : 'Hide Password');
    imgLock.setAttribute('name', (passwordInput.type === "password") ? 'lock-alt' : 'lock-open-alt');
    var newImgLock = imgLock.cloneNode(true);
    imgLock.parentNode.replaceChild(newImgLock, imgLock);
}

function toggleConfirmPasswordVisibility() {
    var imgLock = document.getElementById("logoConPassword");
    var passwordInput = document.getElementById("confirmPassword");
    passwordInput.type = (passwordInput.type === "password") ? "text" : "password";
    imgLock.setAttribute('title', (passwordInput.type === "password") ? 'Show Password' : 'Hide Password');
    imgLock.setAttribute('name', (passwordInput.type === "password") ? 'lock-alt' : 'lock-open-alt');
    var newImgLock = imgLock.cloneNode(true);
    imgLock.parentNode.replaceChild(newImgLock, imgLock);
}


document.getElementById("registerForm").addEventListener("submit",(event)=>{
    event.preventDefault();
    validateAccount();
})      

// document.addEventListener("keydown",()=> {
//     validateAccount();
// });
