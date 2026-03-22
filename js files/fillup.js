 function selectType(type) {
    document.querySelectorAll('.applicant-card').forEach(c => c.classList.remove('selected'));
    document.getElementById('type-' + type).classList.add('selected');
    document.getElementById('docs-student').style.display = 'none';
    document.getElementById('docs-employed').style.display = 'none';
    document.getElementById('docs-unemployed').style.display = 'none';
    document.getElementById('docs-placeholder').style.display = 'none';
    document.getElementById('docs-' + type).style.display = 'block';
    document.querySelector('#section-docs .section-sub').textContent = 'Upload all required documents below';
  }

  function triggerUpload(id) {
    document.getElementById(id).click();
  }

  function handleUpload(input, displayId) {
    if (input.files && input.files[0]) {
      const name = input.files[0].name;
      const display = document.getElementById(displayId);
      display.textContent = '✅ ' + name;
      display.style.color = '#1a6b3a';
      input.closest('.upload-box').classList.add('uploaded');
    }
  }

function handleSubmit() {

  let hasError = false;

  // Remove old errors
  document.querySelectorAll('.error-text').forEach(e => e.remove());
  document.querySelectorAll('.field-input').forEach(i => i.classList.remove('error'));

  // 1. Validate inputs
  const inputs = document.querySelectorAll('.field-input');

  inputs.forEach(input => {
    if (!input.value || input.value.trim() === "") {
      hasError = true;

      input.classList.add('error');

      const error = document.createElement("div");
      error.className = "error-text";
      error.textContent = "This field is required";

      input.parentElement.appendChild(error);
    }
  });

  // 2. Applicant type
  const selectedType = document.querySelector('.applicant-card.selected');

  if (!selectedType) {
    hasError = true;

    const section = document.querySelector('.applicant-types');

    const error = document.createElement("div");
    error.className = "error-text";
    error.textContent = "Please select an applicant type";

    section.appendChild(error);
  }

  // 3. Terms checkbox
  const agree = document.getElementById('agree-terms');
  if (!agree.checked) {
    hasError = true;

    const error = document.createElement("div");
    error.className = "error-text";
    error.textContent = "You must agree first";

    agree.parentElement.appendChild(error);
  }

  // ❌ STOP if errors
  if (hasError) return;

  // ✅ NOW SAFE TO SAVE
  const formData = {
    firstName: document.querySelectorAll('.field-input')[0].value,
    lastName: document.querySelectorAll('.field-input')[1].value,
    email: document.querySelectorAll('.field-input')[2].value,
    phone: document.querySelectorAll('.field-input')[3].value,
    birthDate: document.querySelectorAll('.field-input')[4].value,
    gender: document.querySelectorAll('.field-input')[5].value,
    address: document.querySelectorAll('.field-input')[6].value,

    emergencyName: document.querySelectorAll('.field-input')[7].value,
    relationship: document.querySelectorAll('.field-input')[8].value,
    emergencyPhone: document.querySelectorAll('.field-input')[9].value,
    emergencyAlt: document.querySelectorAll('.field-input')[10].value,
    emergencyAddress: document.querySelectorAll('.field-input')[11].value,

    applicantType: selectedType.id // ✅ SAFE now
  };

  sessionStorage.setItem("tenantData", JSON.stringify(formData));

  console.log("SAVED:", formData);

  // ✅ show modal AFTER saving
  document.getElementById('success-modal').style.display = 'flex';
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