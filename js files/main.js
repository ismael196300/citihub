
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
        if (action === 'Log Out') {
            window.location.href = 'intro.html';
        } else if (action === 'Profile') {
            window.location.href = 'userprofile.html';
        } else if (action === 'Settings') {
            alert(action + ' clicked (functionality TBD)');
        } else if (action === 'Terms & Conditions') {
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

// Add notif button

var addNotifBtn = document.querySelector('.add-notif-btn');

addNotifBtn.addEventListener('click', function() {

    var current = notifBadge.textContent.trim();

    var count = current === '' ? 1 : parseInt(current) + 1;

    notifBadge.textContent = count;

    // Show banner since notif exists

    banner.style.display = 'flex';

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