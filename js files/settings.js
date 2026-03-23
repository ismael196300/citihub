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