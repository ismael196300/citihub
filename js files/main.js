
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
async function loadRoomStats() {
  const cached = localStorage.getItem("roomStats");

  // ✅ USE CACHE FIRST (0 reads)
  if (cached) {
    const data = JSON.parse(cached);
    updateRoomUI(data);
  }

  // ✅ FETCH ONLY ONCE
  const snapshot = await db.collection("ROOMS").get();

  const stats = {
    totalStandard: 0,
    totalPremium: 0,
    occupiedStd: 0,
    occupiedPrem: 0
  };

  snapshot.forEach(doc => {
    const d = doc.data();

    if (d.type === "Standard") {
      stats.totalStandard++;
      if (d.avail === "Occupied") stats.occupiedStd++;
    }

    if (d.type === "Premium") {
      stats.totalPremium++;
      if (d.avail === "Occupied") stats.occupiedPrem++;
    }
  });

  // ✅ SAVE CACHE (huge quota saver)
  localStorage.setItem("roomStats", JSON.stringify(stats));

  updateRoomUI(stats);
}

function updateRoomUI(stats) {
  document.getElementById("spaces-count-standard").textContent =  stats.occupiedStd + " / " + stats.totalStandard;  
  document.getElementById("spaces-count-premium").textContent = stats.occupiedPrem + " / " + stats.totalPremium;
}

loadRoomStats();
  //payment button
  var paybtn = document.querySelector('.pay-btn');
    paybtn.addEventListener('click', ()=>{
        alert('Payment successful! Thank you for your booking.');
    });
//profile button
// avatar dropdown toggle
var avatarContainer = document.querySelector('.avatar-container');
var avatar = avatarContainer.querySelector('.avatar');
avatar.addEventListener('click', function(e) {
    avatarContainer.classList.toggle('open');
    e.stopPropagation();
});
// close dropdown when clicking elsewhere
document.addEventListener('click', function() {
    avatarContainer.classList.remove('open');
});
// menu item actions
var dropdownItems = avatarContainer.querySelectorAll('.dropdown-item');
dropdownItems.forEach(function(item) {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        var action = this.textContent.trim();
        if (action === '🚪 Log Out') {
            window.location.href = 'intro.html';
        } else if (action === '👤 Profile') {
            window.location.href = 'userprofile.html';
        } else if (action === '⚙️ Settings') {
            window.location.href = 'settings.html';
        } else if (action === '📋 Terms & Conditions') {
        document.getElementById('terms-modal').style.display = 'flex';
        } else {
            alert(action + ' clicked (functionality TBD)');
        }
        avatarContainer.classList.remove('open');
    });
});
//billing banner
var banner = document.querySelector('.billing-banner');
var closeBtn = document.querySelector('.billing-banner .close-btn');
// Condition to show banner: if notif exists
var notifBadge = document.querySelector('.notif-badge');
if (notifBadge.textContent.trim() !== '') {
    banner.style.display = 'flex';
}
closeBtn.addEventListener('click', function() {
    banner.style.display = 'none';
});


// book btn
var bookBtn = document.querySelector('.book-btn');
bookBtn.addEventListener('click', function() {
     window.location.href = "booking.html";;
});
var bookBtntea = document.querySelector('.book-btn.teal');
bookBtntea.addEventListener('click', function() {
     window.location.href = "booking.html";;
});
async function updateBookingButtonState() {
    const userId = localStorage.getItem("userId");
    const buttons = document.querySelectorAll('.book-btn');

  
    buttons.forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = "0.5";
        btn.textContent = "Checking...";
    });

    const allowed = await canUserRequest(userId);

    buttons.forEach(btn => {
        if (allowed) {
            // ✅ unlock
            btn.disabled = false;
            btn.style.opacity = "1";
            btn.textContent = "Request Booking";
        } else {
            // ❌ stay locked
            btn.disabled = true;
            btn.style.opacity = "0.5";
            btn.textContent = "Request Locked";
        }
    });
}


const gender = localStorage.getItem("gender");
const username = localStorage.getItem("username");
document.getElementById("welcome-logger").textContent = `Welcome, ${username}`;
document.getElementById("btnLogout").addEventListener("click", function() {
    localStorage.setItem("loggedIn", false);
    localStorage.removeItem("gender");
    localStorage.removeItem("username");
    window.location.href = "intro.html";        
});
///load anouncements
const container = document.getElementById("bulletinList");

async function loadAnnouncements() {
  const cached = localStorage.getItem("announcements");

  // ✅ load cached first
  if (cached) {
    renderAnnouncements(JSON.parse(cached));
  }

  const snapshot = await db.collection("announcements")
    .orderBy("date", "desc")
    .limit(10)
    .get();

  const list = [];

  snapshot.forEach(doc => {
    list.push(doc.data());
  });

  localStorage.setItem("announcements", JSON.stringify(list));

  renderAnnouncements(list);
}

function renderAnnouncements(dataList) {
  const container = document.getElementById("bulletinList");
  container.innerHTML = "";

  dataList.forEach(data => {
    const dc = data.type==='urgent'?'dot-urgent':data.type==='notice'?'dot-notice':'dot-info';
    const bc = data.type==='urgent'?'badge-urgent':data.type==='notice'?'badge-notice':'badge-general';
    const bt = data.type==='urgent'?'Urgent':data.type==='notice'?'Reminder':'General';
    const em = data.type==='urgent'?'🔴':data.type==='notice'?'⚠️':'📢';

    const div = document.createElement("div");
    div.className = "bulletin-item";

    div.innerHTML = `
      <div class="bulletin-dot ${dc}"></div>
      <div class="bulletin-content">
          <div class="bulletin-item-title">${em} ${data.title}</div>
          <div class="bulletin-item-body">${data.body}</div>
          <div class="bulletin-meta">
              <span class="bulletin-badge ${bc}">${bt}</span>
              <span class="bulletin-date">Posted: ${data.displayDate} · ${data.author}</span>
          </div>
      </div>
    `;

    container.appendChild(div);
  });
}

loadAnnouncements();
async function canUserRequest(userId) {
    const snapshot = await db.collection("bookingRequest")
        .where("userId", "==", userId)
        .where("status", "in", ["pending", "approved"])
        .get();

    return snapshot.empty; // ✅ true = allowed, false = blocked
}
function renderStatus(box, type, title, sub, icon) {
    box.className = "request-status " + type;

    box.innerHTML = `
        <div class="status-icon">${icon}</div>
        <div class="status-content">
            <div class="status-title">${title}</div>
            <div class="status-sub">${sub}</div>
        </div>
    `;
}
async function loadRequestStatus() {
    const userId = localStorage.getItem("userId");
    const box = document.getElementById("requestStatusBox");

    if (!userId || !box) return;

    const snapshot = await db.collection("bookingRequest")
        .where("userId", "==", userId)
        .orderBy("createdAt", "desc")
        .limit(1)
        .get();

    if (snapshot.empty) {
        renderStatus(
            box,
            "empty",
            "No Booking Yet",
            "You haven’t submitted any booking request.",
            "📭"
        );
        return;
    }

    const data = snapshot.docs[0].data();

    if (data.status === "pending") {
        renderStatus(
            box,
            "pending",
            "Request Pending",
            "Your booking request is under review.",
            "🟡"
        );
    } 
    else if (data.status === "approved") {
        renderStatus(
            box,
            "approved",
            "Booking Approved",
            `Room ${data.room}, Bed ${data.bed} has been reserved for you.`,
            "🟢"
        );
    } 
    else if (data.status === "rejected") {
        renderStatus(
            box,
            "rejected",
            "Request Rejected",
            "You can submit a new booking request.",
            "🔴"
        );
    }
}
updateBookingButtonState();
loadRequestStatus();
// const roomConfig = [
//   { room: "A1", type: "Standard", gender: "Female", prefix: "A" },
//   { room: "A2", type: "Standard", gender: "Female", prefix: "A" },
//   { room: "B2", type: "Standard", gender: "Female", prefix: "B" },

//   { room: "C1", type: "Standard", gender: "Male", prefix: "C" },
//   { room: "C2", type: "Standard", gender: "Male", prefix: "C" },
//   { room: "D2", type: "Standard", gender: "Male", prefix: "D" },
//   { room: "E2", type: "Standard", gender: "Male", prefix: "E" },
//   { room: "F2", type: "Standard", gender: "Male", prefix: "F" },
//   { room: "G2", type: "Standard", gender: "Mixed", prefix: "G" },

//   { room: "A3", type: "Premium", gender: "Female", prefix: "A" },
//   { room: "B3", type: "Premium", gender: "Female", prefix: "B" },

//   { room: "C3", type: "Premium", gender: "Male", prefix: "C" },
//   { room: "D3", type: "Premium", gender: "Male", prefix: "D" },
//   { room: "E3", type: "Premium", gender: "Male", prefix: "E" },
//   { room: "F3", type: "Premium", gender: "Male", prefix: "F" },
//   { room: "G3", type: "Premium", gender: "Male", prefix: "G" },
//   { room: "H3", type: "Premium", gender: "Male", prefix: "H" },
//   { room: "H2", type: "Premium", gender: "Mixed", prefix: "H" }
// ];
// const bedspaces = [];

// roomConfig.forEach(r => {
//   for (let i = 1; i <= 22; i++) {
//     bedspaces.push({
//       room: r.room,
//       bedNo: `${r.prefix}${i}`,
//       type: r.type,
//       gender: r.gender,
//       avail: "Available",
//       occupant: null
//     });
//   }
// });

// console.log("Total entries:", bedspaces.length);
// console.log(bedspaces);
// bedspaces.forEach(bed => {
//   db.collection("ROOMS")
//     .doc(`${bed.room}_${bed.bedNo}`)
//     .set(bed);
// });
