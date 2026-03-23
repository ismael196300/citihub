 const firebaseConfig = {
      apiKey: "AIzaSyCn4U1J18yfbrNO2KYbH7f6S30lEC7ClkA",
      authDomain: "citihub-example.firebaseapp.com",
      projectId: "citihub-example",
      storageBucket: "citihub-example.appspot.com", // corrected bucket
      messagingSenderId: "645032109193",
      appId: "1:645032109193:web:9c54f5ff633a7d5604d258",
      measurementId: "G-FPQ0XXSGT7"
    };

firebase.initializeApp(firebaseConfig);

// Firestore reference
const db = firebase.firestore();
console.log(localStorage.getItem("userId"));

// Set today's date
  const d = new Date();
  document.getElementById('submitDate').textContent = d.toLocaleDateString('en-PH', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  function toggleSubmit() {
    const checked = document.getElementById('agree-terms').checked;
    const btn = document.getElementById('submitBtn');
    btn.disabled = !checked;
  }

 async function handleSubmit() {
  if (!document.getElementById('agree-terms').checked) return;

  const data = JSON.parse(sessionStorage.getItem("tenantData"));
  const bookingData = JSON.parse(sessionStorage.getItem("bookingData"));

  if (!data || !bookingData) {
    console.error("Missing data");
    return;
  }

  const refID = generateRefID();

  try {
    await db.collection("bookingRequest").doc(refID).set({
      referenceId: refID,
      userId: localStorage.getItem("userId"),
      // PERSONAL INFO
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      birthDate: data.birthDate,
      gender: data.gender,
      address: data.address,

      // EMERGENCY
      emergencyName: data.emergencyName,
      relationship: data.relationship,
      emergencyPhone: data.emergencyPhone,
      emergencyAlt: data.emergencyAlt,
      emergencyAddress: data.emergencyAddress,

      // BOOKING
      room: bookingData.room,
      bed: bookingData.bed,
      type: bookingData.type,
      leasePrice: bookingData.leasePrice,

      // SYSTEM
      status: "pending",
      createdAt: new Date()
    });

    console.log("Saved to Firestore");

    // show reference in UI
    document.querySelector(".modal-ref").textContent = "Reference #" + refID;

    document.getElementById('success-modal').style.display = 'flex';

    // OPTIONAL: clear storage
    sessionStorage.removeItem("tenantData");
    sessionStorage.removeItem("bookingData");

  } catch (error) {
    console.error("Error saving:", error);
  }
}
  document.addEventListener("DOMContentLoaded", () => {
  const data = JSON.parse(sessionStorage.getItem("tenantData"));
  const bookingData = JSON.parse(sessionStorage.getItem("bookingData"));


  if (data) {
    document.getElementById("firstName").textContent = data.firstName;
    document.getElementById("lastName").textContent = data.lastName;
    document.getElementById("email").textContent = data.email;
    document.getElementById("phone").textContent = data.phone;
    document.getElementById("birthDate").textContent = data.birthDate;
    document.getElementById("gender").textContent = data.gender;
    document.getElementById("address").textContent = data.address;

    document.getElementById("emergencyName").textContent = data.emergencyName;
    document.getElementById("relationship").textContent = data.relationship;
    document.getElementById("emergencyPhone").textContent = data.emergencyPhone;
    document.getElementById("emergencyAlt").textContent = data.emergencyAlt || "Not provided";
    document.getElementById("emergencyAddress").textContent = data.emergencyAddress;

    let typeText = data.applicantType.replace("type-", "");
    document.getElementById("applicantType").textContent =
      typeText.charAt(0).toUpperCase() + typeText.slice(1);
  }


  // Room Type
  const roomTypeEl = document.querySelector(".badge-teal");
  if (bookingData.type === "premium") {
    roomTypeEl.textContent = "❄️ Premium — Aircon Room";
  } else {
    roomTypeEl.textContent = "🌀 Standard — Fan Room";
  }

  // Bedspace (Room + Bed)
  document.querySelectorAll(".summary-value")[1].textContent =
    `${bookingData.room} · Bedspace ${bookingData.bed}`;

  // Monthly Rate
  document.querySelectorAll(".summary-value")[2].textContent =
    bookingData.leasePrice + " / month";
    const price = parseFloat(bookingData.leasePrice.replace(/[₱,]/g, ""));
    document.getElementById("rent").textContent = "₱" + (price * 1).toFixed(2);
    document.getElementById("deposit").textContent = "₱" + (price * 1).toFixed(2);
    document.getElementById("advance").textContent = "₱" + (price * 1).toFixed(2);
    document.getElementById("total").textContent = "₱" + (price * 3).toFixed(2);

  // OPTIONAL: Floor (if room name has floor like 3A, 2B)
  document.querySelectorAll(".summary-value")[3].textContent =
    bookingData.room.charAt(0) + " Floor";

  // Gender (from localStorage if you saved it)
  const gender = localStorage.getItem("gender") || "Not specified";
  document.querySelector(".badge-purple").textContent = capitalizeFirstLetter(gender);
});
/// captial leyyer
function capitalizeFirstLetter(text) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}
/// generate reference id
function generateRefID() {
  const random = Math.floor(10000 + Math.random() * 90000);
  const year = new Date().getFullYear();
  return `CHD-${year}-${random}`;
}
//ensure user can only submit if they don't have pending/approved requests
async function canUserRequest(userId) {
    const snapshot = await db.collection("bookingRequest")
        .where("userId", "==", userId)
        .where("status", "in", ["pending", "approved"])
        .get();

    return snapshot.empty;
}
async function protectPage() {
    const userId = localStorage.getItem("userId");

    if (!userId) {
        window.location.href = "intro.html";
        return;
    }

    const allowed = await canUserRequest(userId);

    // ❌ If NOT allowed → redirect back to main
    if (!allowed) {
        window.location.href = "main.html";
    }
}
protectPage();