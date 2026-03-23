const firebaseConfig = {
  apiKey: "AIzaSyCn4U1J18yfbrNO2KYbH7f6S30lEC7ClkA",
  authDomain: "citihub-example.firebaseapp.com",
  projectId: "citihub-example",
  storageBucket: "citihub-example.appspot.com",
  messagingSenderId: "645032109193",
  appId: "1:645032109193:web:9c54f5ff633a7d5604d258",
  measurementId: "G-FPQ0XXSGT7"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ── STATE ──
let selectedBed   = null;
let currentType   = null;
let selectedLease = null;

// ── LEASE DATA ──
const leaseData = {
  standard: [
    { label: '1 – 5 Months',  price: '₱3,600', tag: 'Short Stay', tagClass: 'tag-short', desc: 'Flexible short-term stay. Great for internships or trial periods.' },
    { label: '6 – 11 Months', price: '₱2,893', tag: 'Mid Term',   tagClass: 'tag-mid',   desc: 'Best balance of flexibility and savings for semester stays.' },
    { label: '1 Year',        price: '₱1,900', tag: 'Best Value', tagClass: 'tag-best',  desc: 'Lowest monthly rate. Ideal for full academic year residents.' },
  ],
  premium: [
    { label: '1 – 5 Months',  price: '₱5,075', tag: 'Short Stay', tagClass: 'tag-short', desc: 'Flexible short-term stay with full aircon comfort.' },
    { label: '6 – 11 Months', price: '₱4,095', tag: 'Mid Term',   tagClass: 'tag-mid',   desc: 'Save more with a longer commitment. Includes all amenities.' },
    { label: '1 Year',        price: '₱2,500', tag: 'Best Value', tagClass: 'tag-best',  desc: 'Maximum savings. Full year of aircon comfort included.' },
  ]
};

// ── LOAD ROOMS FROM FIRESTORE ──
function loadRooms() {
  const userGender = (localStorage.getItem("gender") || "").toLowerCase();
  const container  = document.getElementById("roomsContainer");
  container.innerHTML = '<div style="color:#9ca3af;font-size:13px;padding:16px 0;">Loading bedspaces…</div>';

  let rooms = {};

  db.collection("ROOMS").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const data  = doc.data();
      const parts = doc.id.split("_");
      const roomId = parts[0];
      const bedNo  = parts[1];

      if (!rooms[roomId]) {
        rooms[roomId] = { type: data.type, gender: data.gender, beds: [] };
      }
      rooms[roomId].beds.push({ ...data, bedNo });
    });

    container.innerHTML = "";

    for (let roomId in rooms) {
      const room       = rooms[roomId];
      const roomGender = (room.gender || "").toLowerCase();
      const roomType   = (room.type   || "").toLowerCase();

      if (currentType && roomType !== currentType) continue;
      if (roomGender !== "mixed" && userGender !== "mixed" && roomGender !== userGender) continue;

      let bedsHTML = "";

room.beds
  .sort((a, b) => {
    const numA = parseInt(a.bedNo.toString().replace(/\D/g, "")) || 0;
    const numB = parseInt(b.bedNo.toString().replace(/\D/g, "")) || 0;
    return numA - numB;
  })
  .forEach((bed) => {

    const status = (bed.avail || "Available").toLowerCase();

    bedsHTML += `
      <div class="bed-box ${status} ${status === 'occupied' ? 'disabled' : ''}"
        data-bed="${bed.bedNo}"
        data-room="${roomId}"
        data-type="${bed.type}"
        data-gender="${bed.gender}"
        ${status === 'available' ? 'onclick="selectBed(this)"' : ''}>
        
        <div class="bed-num">${bed.bedNo}</div>

        <div class="bed-status-label">
          ${status === "occupied" ? "🔒 Occupied" : "Available"}
        </div>

      </div>
    `;
  });

      container.insertAdjacentHTML("beforeend", `
        <div class="room-section" data-type="${room.type}" data-gender="${room.gender}">
          <div class="room-section-header">
            <span class="room-section-name">${roomId}</span>
            <span class="gender-tag ${roomGender}">
              ${room.gender === "Female" ? "♀ Female" : room.gender === "Male" ? "♂ Male" : "⚥ Mixed"}
            </span>
          </div>
          <div class="beds-grid">${bedsHTML}</div>
        </div>`);
    }
  });
}

// ── OPEN MODAL → shows lease step first ──
function openModal(type) {
  currentType   = type;
  selectedLease = null;
  selectedBed   = null;

  // Set modal title + room label
  const isPremium = type === 'premium';
  document.getElementById('modalTitle').textContent = isPremium ? 'Aircon Room — Booking' : 'Fan Room — Booking';
  document.getElementById('lsiIcon').textContent    = isPremium ? '❄️' : '🌀';
  document.getElementById('lsiTitle').textContent   = isPremium ? 'Aircon Room' : 'Fan Room';

  // Show correct lease card set, hide the other
  document.getElementById('leaseCardsStandard').style.display = isPremium ? 'none' : 'flex';
  document.getElementById('leaseCardsPremium').style.display  = isPremium ? 'flex' : 'none';

  // Reset all card selections
  document.querySelectorAll('.lease-option-card').forEach(c => {
    c.classList.remove('selected');
    const ind = c.querySelector('.loc-select-indicator');
    if (ind) ind.textContent = '○ Select';
  });

  showLeaseStep();
  document.getElementById('bookingModal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

// ── SHOW STEP 1: LEASE TERM ──
function showLeaseStep() {
  document.getElementById('stepLease').style.display = 'block';
  document.getElementById('stepBed').style.display   = 'none';

  document.getElementById('nextToBedsBtn').style.display = 'none';
  document.getElementById('confirmBtn').style.display    = 'none';
  document.getElementById('footerBackBtn').style.display = 'none';
  document.getElementById('footerSelected').textContent  = 'Select a lease term to continue';

  document.getElementById('ms-lease').classList.add('active');
  document.getElementById('ms-bed').classList.remove('active');
}

// ── SELECT A LEASE CARD ──
function selectLease(index, card, type) {
  const containerId = type === 'premium' ? 'leaseCardsPremium' : 'leaseCardsStandard';
  document.getElementById(containerId).querySelectorAll('.lease-option-card').forEach(c => {
    c.classList.remove('selected');
    const ind = c.querySelector('.loc-select-indicator');
    if (ind) ind.textContent = '○ Select';
  });

  card.classList.add('selected');
  const ind = card.querySelector('.loc-select-indicator');
  if (ind) ind.textContent = '✓ Selected';

  selectedLease = leaseData[currentType][index];
  document.getElementById('footerSelected').textContent = `${selectedLease.label} · ${selectedLease.price}/mo`;
  document.getElementById('nextToBedsBtn').style.display = 'inline-flex';
}

// ── GO TO STEP 2: BEDSPACE ──
function goToBeds() {
  if (!selectedLease) return;

  document.getElementById('stepLease').style.display = 'none';
  document.getElementById('stepBed').style.display   = 'block';

  document.getElementById('nextToBedsBtn').style.display = 'none';
  document.getElementById('confirmBtn').style.display    = 'block';
  document.getElementById('footerBackBtn').style.display = 'inline-flex';
  document.getElementById('footerSelected').textContent  = 'No bedspace selected';

  document.getElementById('ms-lease').classList.remove('active');
  document.getElementById('ms-bed').classList.add('active');

  loadRooms();
  clearSelection();
}

// ── GO BACK TO STEP 1 ──
function goBackToLease() {
  selectedBed = null;
  showLeaseStep();

  // Re-highlight previously chosen lease card
  if (selectedLease) {
    const data        = leaseData[currentType];
    const idx         = data.findIndex(d => d.label === selectedLease.label);
    const containerId = currentType === 'premium' ? 'leaseCardsPremium' : 'leaseCardsStandard';
    const cards       = document.getElementById(containerId).querySelectorAll('.lease-option-card');
    if (cards[idx]) selectLease(idx, cards[idx], currentType);
  }
}

// ── CLOSE MODAL ──
function closeModal() {
  document.getElementById('bookingModal').style.display = 'none';
  document.body.style.overflow = '';
  selectedLease = null;
  selectedBed   = null;
  clearSelection();
}

// ── SELECT A BED ──
function selectBed(box) {
  if (box.classList.contains('occupied')) return;

  if (selectedBed) selectedBed.classList.remove('selected');

  if (selectedBed === box) {
    selectedBed = null;
    document.getElementById('footerSelected').textContent = 'No bedspace selected';
    document.getElementById('confirmBtn').classList.remove('ready');
    return;
  }

  selectedBed = box;
  box.classList.add('selected');

  const room  = box.dataset.room;
  const bed   = box.dataset.bed;
  const lease = selectedLease ? ` · ${selectedLease.label} · ${selectedLease.price}/mo` : '';
  document.getElementById('footerSelected').textContent = `${room} · Bedspace ${bed}${lease}`;
  document.getElementById('confirmBtn').classList.add('ready');
}

function clearSelection() {
  if (selectedBed) {
    selectedBed.classList.remove('selected');
    selectedBed = null;
  }
  document.getElementById('footerSelected').textContent = 'No bedspace selected';
  document.getElementById('confirmBtn').classList.remove('ready');
}

// ── CONFIRM BOOKING ──
function confirmBooking() {
  if (!selectedBed) return;

  const room  = selectedBed.dataset.room;
  const bed   = selectedBed.dataset.bed;

  const bookingData = {
    room: room,
    bed: bed,
    type: currentType,
    leaseLabel: selectedLease?.label || "",
    leasePrice: selectedLease?.price || ""
  };

 
  sessionStorage.setItem("bookingData", JSON.stringify(bookingData));

  closeModal();

  document.getElementById('successText').textContent =
    `Your request for ${room} · Bedspace ${bed} · ${bookingData.leaseLabel} (${bookingData.leasePrice}/mo) has been submitted. Fill out the form on the next page to complete your booking.`;

  document.getElementById('successModal').style.display = 'flex';

  console.log('Booking saved:', bookingData);

  // OPTIONAL: redirect to next page
  // window.location.href = "form.html";
}

// ── AUTO-OPEN FROM URL PARAM ──
const params  = new URLSearchParams(location.search);
const preType = params.get('type');
if (preType) {
  window.addEventListener('DOMContentLoaded', () => openModal(preType.toLowerCase()));
}

// ── CLOSE ON OVERLAY CLICK ──
document.getElementById('bookingModal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});
document.getElementById('successModal').addEventListener('click', function(e) {
  if (e.target === this) this.style.display = 'none';
});
