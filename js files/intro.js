const firebaseConfig = {
  apiKey: "AIzaSyCn4U1J18yfbrNO2KYbH7f6S30lEC7ClkA",
  authDomain: "citihub-example.firebaseapp.com",
  databaseURL: "https://citihub-example-default-rtdb.firebaseio.com",
  projectId: "citihub-example",
  storageBucket: "citihub-example.firebasestorage.app",
  messagingSenderId: "645032109193",
  appId: "1:645032109193:web:9c54f5ff633a7d5604d258",
  measurementId: "G-FPQ0XXSGT7"
};
firebase.initializeApp(firebaseConfig);

 const db = firebase.firestore();

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

function togglePasswordVisibility() {
    var imgLock = document.getElementById("logoPassword");
    var passwordInput = document.getElementById("loginPassword");
    passwordInput.type = (passwordInput.type === "password") ? "text" : "password";
    imgLock.setAttribute('title', (passwordInput.type === "password") ? 'Show Password' : 'Hide Password');
    imgLock.setAttribute('name', (passwordInput.type === "password") ? 'lock-alt' : 'lock-open-alt');
    var newImgLock = imgLock.cloneNode(true);
    imgLock.parentNode.replaceChild(newImgLock, imgLock);
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


document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const loginUsername = document.getElementById("loginUsername").value;
    const loginPassword = document.getElementById("loginPassword").value;
    db.collection("users")
    .where("username", "==", loginUsername)
    .where("password", "==", loginPassword)
    .get()
    .then((querySnapshot) => {

      if (!querySnapshot.empty) {
       
            querySnapshot.forEach((doc) => {
                    const userData = doc.data();

                    // store gender in localStorage
                    localStorage.setItem("gender", userData.gender);
                    localStorage.setItem("username", userData.username);
                    localStorage.setItem("loggedIn", true);
                    localStorage.setItem("userId", userData.id);
                });
       
        window.location.href = "main.html";

      } else {
        alert("Invalid username or password.");
      }

    })
    .catch((error) => {
      console.error("Error checking login:", error);
    });

 
});
