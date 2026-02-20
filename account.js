document.addEventListener("DOMContentLoaded", function () {

  /* ================= USER CHECK ================= */

  const user = JSON.parse(localStorage.getItem("ntLoggedInUser"));

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  /* ================= WELCOME NAME ================= */

  const nameEl = document.getElementById("userName");
  if (nameEl) {
    nameEl.textContent = user.name;
  }




  /* ================= PROFILE FETCH ================= */

const profileKey = "ntProfile_" + user.email;
let profileData = JSON.parse(localStorage.getItem(profileKey)) || {};

// Fill fields
const nameInput = document.getElementById("profileName");
const emailInput = document.getElementById("profileEmail");
const phoneInput = document.getElementById("profilePhone");
const dobInput = document.getElementById("profileDob");

if (nameInput) {
  nameInput.value = profileData.name || user.name || "";
}

if (emailInput) {
  emailInput.value = user.email || "";
}

if (phoneInput) {
  phoneInput.value = profileData.phone || "";
}

if (dobInput) {
  dobInput.value = profileData.dob || "";
}




  /* ================= WISHLIST COUNT ================= */

  const wishlistKey = "wishlist_" + user.email;
  const wishlist = JSON.parse(localStorage.getItem(wishlistKey)) || [];

  const wishlistStat = document.querySelector(".stat-card:nth-child(2) h4");
  if (wishlistStat) {
    wishlistStat.textContent = wishlist.length;
  }

  /* Wishlist click → redirect */
  const wishlistMenu = document.querySelector("li:nth-child(5)");
  if (wishlistMenu) {
    wishlistMenu.addEventListener("click", function () {
      window.location.href = "wishlist.html";
    });
  }

  /* ================= ORDER COUNT ================= */

  const orderKey = "ntOrders_" + user.email;
  const orders = JSON.parse(localStorage.getItem(orderKey)) || [];

  const orderStat = document.querySelector(".stat-card:nth-child(1) h4");
  if (orderStat) {
    orderStat.textContent = orders.length;
  }

  /* ================= ADDRESS SYSTEM ================= */

  const addressKey = "ntAddress_" + user.email;
  let addresses = JSON.parse(localStorage.getItem(addressKey)) || [];

  const savedAddressStat = document.querySelector(".stat-card:nth-child(3) h4");
  if (savedAddressStat) {
    savedAddressStat.textContent = addresses.length;
  }

  const addressContainer = document.querySelector("#addressList");

  function renderAddresses() {
    if (!addressContainer) return;

    addressContainer.innerHTML = "";

    if (addresses.length === 0) {
      addressContainer.innerHTML = "<p>No saved addresses yet.</p>";
      return;
    }

    /* Sort → current address first */
    addresses.sort((a, b) => b.current - a.current);

    addresses.forEach((addr, index) => {

      const card = document.createElement("div");
      card.classList.add("address-card");

      card.innerHTML = `
  <h4>
    Saved Address
    ${addr.current ? '<span class="default-badge">Default</span>' : ''}
  </h4>
  <p>${addr.fullName}</p>
  <p>${addr.line1}${addr.line2 ? ", " + addr.line2 : ""}</p>
  <p>${addr.city}, ${addr.state} - ${addr.pincode}</p>
  <p>Phone: ${addr.phone}</p>

  <div class="address-actions">
  ${!addr.current ? '<button class="set-current-btn">Set As Default</button>' : ''}
  <button class="edit-btn">Edit</button>
  <button class="delete-btn">Delete</button>
</div>

`;


      /* Set current */
      const setCurrentBtn = card.querySelector(".set-current-btn");

if (setCurrentBtn) {
  setCurrentBtn.addEventListener("click", function () {
    addresses.forEach(a => a.current = false);
    addresses[index].current = true;
    localStorage.setItem(addressKey, JSON.stringify(addresses));
    renderAddresses();
  });
}



/* Edit */
card.querySelector(".edit-btn").addEventListener("click", function () {

  document.getElementById("addrName").value = addr.fullName;
  document.getElementById("addrPhone").value = addr.phone;
  document.getElementById("addrLine1").value = addr.line1;
  document.getElementById("addrLine2").value = addr.line2 || "";
  document.getElementById("addrCity").value = addr.city;
  document.getElementById("addrState").value = addr.state;
  document.getElementById("addrPincode").value = addr.pincode;

  // Store index for update
  document.getElementById("saveAddressBtn").setAttribute("data-edit-index", index);

  // Scroll to form
  document.getElementById("addressForm").scrollIntoView({ behavior: "smooth" });

});

      /* Delete */
      card.querySelector(".delete-btn").addEventListener("click", function () {
        addresses.splice(index, 1);
        localStorage.setItem(addressKey, JSON.stringify(addresses));
        renderAddresses();
      });

      addressContainer.appendChild(card);
    });
  }

  renderAddresses();





















  
/* ===============================
   LOAD REAL ORDERS IN ACCOUNT PAGE
================================ */
/* ===============================
   LOAD REAL ORDERS IN ACCOUNT PAGE
================================ */
/* ===============================
   LOAD REAL ORDERS IN ACCOUNT PAGE
================================ */
/* ===============================
   LOAD REAL ORDERS IN ACCOUNT PAGE
================================ */
/* ===============================
   LOAD REAL ORDERS IN ACCOUNT PAGE
================================ */

function loadAccountOrders() {

  const container = document.getElementById("accountOrdersContainer");
  if (!container) return;

  const user = JSON.parse(localStorage.getItem("ntLoggedInUser"));
  if (!user) return;

  const orderKey = "ntOrders_" + user.email;
  const orders = JSON.parse(localStorage.getItem(orderKey)) || [];

  container.innerHTML = "";

  if (orders.length === 0) {
    container.innerHTML = "<p style='color:#ccc'>You haven't ordered anything yet.</p>";
    return;
  }

  orders.slice().reverse().forEach(order => {

    order.items.forEach(item => {

      const card = document.createElement("div");
      card.classList.add("order-card");

      card.innerHTML = `
        <div class="order-flex">
          <div class="order-image">
            <img src="${item.image}" class="order-main-img">
          </div>

          <div class="order-details">
            <div class="order-id">
              <strong>Order ID:</strong> ${order.orderId}
            </div>

            <div class="order-date">${order.date}</div>

            <div class="order-meta">
              <span><strong>${item.name}</strong></span>
              <span>Qty: ${item.quantity}</span>
              <span>₹${item.price * item.quantity}</span>
            </div>

            <div class="order-status-badge">
              ${order.status}
            </div>
          </div>
        </div>
      `;

      container.appendChild(card);

    });

  });
}











  /* ================= SIDEBAR TAB SWITCH ================= */

  const tabs = document.querySelectorAll(".account-sidebar li");
  const panels = document.querySelectorAll(".account-panel");

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", function () {

      tabs.forEach(t => t.classList.remove("active"));
      this.classList.add("active");

      panels.forEach(p => p.classList.remove("active"));

const tabName = this.textContent.trim();

if (tabName === "Dashboard") {
  panels[0].classList.add("active");
}
else if (tabName === "Personal Information") {
  panels[1].classList.add("active");
}
else if (tabName === "Address Book") {
  panels[2].classList.add("active");
}
else if (tabName === "My Orders") {
  document.getElementById("ordersPanel").classList.add("active");

  // existing global order renderer
  loadAccountOrders();

}

else if (tabName === "Security") {
  panels[panels.length - 1].classList.add("active");
}


    });
  });







  /* ================= SAVE PROFILE ================= */

const saveBtn = document.getElementById("saveProfileBtn");

if (saveBtn) {
  saveBtn.addEventListener("click", function () {

    const updatedProfile = {
      name: document.getElementById("profileName").value.trim(),
      phone: document.getElementById("profilePhone").value.trim(),
      dob: document.getElementById("profileDob").value
    };

    // Save profile
    localStorage.setItem("ntProfile_" + user.email, JSON.stringify(updatedProfile));

    // Update loggedInUser name
    user.name = updatedProfile.name;
    localStorage.setItem("ntLoggedInUser", JSON.stringify(user));

    // Update welcome text
    if (nameEl) {
      nameEl.textContent = updatedProfile.name;
    }

    alert("Profile updated successfully!");
  });
}






/* ================= SAVE ADDRESS ================= */

const saveAddressBtn = document.getElementById("saveAddressBtn");

if (saveAddressBtn) {
  saveAddressBtn.addEventListener("click", function () {

    const fullName = document.getElementById("addrName").value.trim();
    const phone = document.getElementById("addrPhone").value.trim();
    const line1 = document.getElementById("addrLine1").value.trim();
    const line2 = document.getElementById("addrLine2").value.trim();
    const city = document.getElementById("addrCity").value.trim();
    const state = document.getElementById("addrState").value;
    const pincode = document.getElementById("addrPincode").value.trim();

    // Validation
    if (!fullName || !phone || !line1 || !city || !state || !pincode) {
      alert("Please fill all required fields.");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      alert("Phone number must be 10 digits.");
      return;
    }

    if (!/^\d{6}$/.test(pincode)) {
      alert("Pincode must be 6 digits.");
      return;
    }

    const newAddress = {
      fullName,
      phone,
      line1,
      line2,
      city,
      state,
      pincode,
      current: addresses.length === 0
    };

   const editIndex = saveAddressBtn.getAttribute("data-edit-index");

if (editIndex !== null) {
  // Update existing
  addresses[editIndex] = {
    ...addresses[editIndex],
    fullName,
    phone,
    line1,
    line2,
    city,
    state,
    pincode
  };

  saveAddressBtn.removeAttribute("data-edit-index");
} else {
  // New address
  addresses.push({
    fullName,
    phone,
    line1,
    line2,
    city,
    state,
    pincode,
    current: addresses.length === 0
  });
}

    localStorage.setItem(addressKey, JSON.stringify(addresses));

    renderAddresses();

    // Reset form
    document.getElementById("addressForm").reset();

    alert("Address saved successfully!");
  });
}

});








/* ===============================
   LOGOUT SYSTEM
================================ */
/* ===============================
   LOGOUT SYSTEM
================================ */
/* ===============================
   LOGOUT SYSTEM
================================ */
/* ===============================
   LOGOUT SYSTEM
================================ */
/* ===============================
   LOGOUT SYSTEM
================================ */
/* ===============================
   LOGOUT SYSTEM
================================ */

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {

    localStorage.removeItem("ntLoggedInUser");

    window.location.href = "login.html";
  });
}



/* ===============================
   CHANGE PASSWORD SYSTEM
================================ */
/* ===============================
   CHANGE PASSWORD SYSTEM
================================ */
/* ===============================
   CHANGE PASSWORD SYSTEM
================================ */
/* ===============================
   CHANGE PASSWORD SYSTEM
================================ */
/* ===============================
   CHANGE PASSWORD SYSTEM
================================ */

const openPassBtn = document.getElementById("openChangePassword");
const passModal = document.getElementById("passwordModal");
const closePassBtn = document.getElementById("closePasswordModal");
const confirmPassBtn = document.getElementById("confirmPasswordBtn");
const passError = document.getElementById("passwordError");

if (openPassBtn) {
  openPassBtn.addEventListener("click", function () {
    passModal.classList.add("active");
  });
}

if (closePassBtn) {
  closePassBtn.addEventListener("click", function () {
    passModal.classList.remove("active");
    passError.textContent = "";
  });
}

if (confirmPassBtn) {
  confirmPassBtn.addEventListener("click", function () {

    const oldPass = document.getElementById("oldPassword").value;
    const newPass = document.getElementById("newPassword").value;
    const confirmPass = document.getElementById("confirmNewPassword").value;

    const user = JSON.parse(localStorage.getItem("ntLoggedInUser"));
    let users = JSON.parse(localStorage.getItem("ntUsers")) || [];

    const userIndex = users.findIndex(u => u.email === user.email);

    if (userIndex === -1) {
      passError.textContent = "User not found.";
      return;
    }

    if (users[userIndex].password !== oldPass) {
      passError.textContent = "Old password is incorrect.";
      return;
    }

    if (newPass !== confirmPass) {
      passError.textContent = "New passwords do not match.";
      return;
    }

    if (newPass.length < 4) {
      passError.textContent = "Password must be at least 4 characters.";
      return;
    }

    // ✅ UPDATE PASSWORD
    users[userIndex].password = newPass;

    localStorage.setItem("ntUsers", JSON.stringify(users));

    passError.style.color = "#4CAF50";
    passError.textContent = "Password updated successfully!";

    setTimeout(() => {
      passModal.classList.remove("active");
      passError.textContent = "";
      passError.style.color = "#ff4d4d";

      document.getElementById("oldPassword").value = "";
      document.getElementById("newPassword").value = "";
      document.getElementById("confirmNewPassword").value = "";
    }, 1500);

  });
}