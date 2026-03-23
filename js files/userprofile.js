    
  const avatarBtn = document.getElementById("avatarBtn");
  const avatarContainer = document.getElementById("avatarContainer");

  avatarBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    avatarContainer.classList.toggle("open");
  });

  document.addEventListener("click", function () {
    avatarContainer.classList.remove("open");
  });
