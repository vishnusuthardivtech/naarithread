function toggleMenu(){
    document.getElementById("navLinks").classList.toggle("show");
    document.getElementById("hamburger").classList.toggle("active");
}

/* SCROLL EFFECT */
document.addEventListener("DOMContentLoaded", function () {

  const slides = document.querySelectorAll(".slide");

  if (slides.length === 0) return;

  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach(slide => slide.classList.remove("active"));
    slides[index].classList.add("active");
  }

  setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }, 5000);

});






const track = document.getElementById("bestSellerTrack");

if (track) {
  // Duplicate content for infinite loop
  track.innerHTML += track.innerHTML;
}


document.addEventListener("DOMContentLoaded", () => {

  const slides = document.querySelectorAll(".slide");

if (slides.length > 0) {

  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach((slide) => slide.classList.remove("active"));
    slides[index].classList.add("active");
  }

  setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }, 5000);
}


});

const pdpWishlist = document.querySelector(".pdp-wishlist");

if (pdpWishlist) {
  pdpWishlist.addEventListener("click", function(){
    this.classList.toggle("active");
  });
}



const openFilter = document.getElementById("openFilter");
const closeFilter = document.getElementById("closeFilter");
const filterDrawer = document.getElementById("filterDrawer");
const applyFilter = document.getElementById("applyFilter");

if (openFilter && filterDrawer) {
  openFilter.addEventListener("click", () => {
    filterDrawer.classList.add("active");
  });
}

if (closeFilter) {
  closeFilter.addEventListener("click", () => {
    filterDrawer.classList.remove("active");
  });
}

if (applyFilter) {
  applyFilter.addEventListener("click", () => {
    filterDrawer.classList.remove("active");
  });
}

/* Mobile Footer Accordion */
/* Mobile Footer Accordion */
/* Mobile Footer Accordion */
/* Mobile Footer Accordion */
/* Mobile Footer Accordion */
/* Mobile Footer Accordion *//* Mobile Footer Accordion */
/* Mobile Footer Accordion */
/* Mobile Footer Accordion */
/* Mobile Footer Accordion */
/* Mobile Footer Accordion */
/* Mobile Footer Accordion */

document.addEventListener("DOMContentLoaded", function () {

  if (window.innerWidth <= 768) {

    const footerSections = document.querySelectorAll(".footer-links");

    footerSections.forEach(section => {
      const heading = section.querySelector("h4");

      heading.addEventListener("click", () => {
        section.classList.toggle("active");
      });

    });

  }

});



/* Dynamic Star Fill */
// in colection 2 
// in colection 2 
// in colection 2 
// in colection 2 
// in colection 2 // 
// in colection 2 

document.addEventListener("DOMContentLoaded", function () {

  document.querySelectorAll(".product-rating").forEach(ratingBox => {

    const rating = parseFloat(ratingBox.dataset.rating);
    const stars = ratingBox.querySelectorAll(".star");

    stars.forEach((star, index) => {
      if (index < Math.floor(rating)) {
        star.classList.add("active");
      }
    });

  });

});





// pdp page code ?
// pdp page code ?
// pdp page code ?
// pdp page code ?
// pdp page code ?
// pdp page code ?
// pdp page code ?
// pdp page code ?
// pdp page code ?
// pdp page code ?

// only in Product.html 

// IMAGE ARRAY
const images = [
  "featured lehengas/1.jpg",
  "featured lehengas/2.jpg",
  "featured lehengas/3.jpg",
  "featured lehengas/4.jpg",
  "featured lehengas/5.jpg",
  "featured lehengas/6.jpg"
];

let currentIndex = 0;
let thumbIndex = 0;

const mainImage = document.getElementById("mainProductImage");
const thumbnails = document.querySelectorAll("#thumbnailTrack img");
const thumbnailTrack = document.getElementById("thumbnailTrack");
const thumbImages = document.querySelectorAll("#thumbnailTrack img");




// SELECT IMAGE
function selectImage(index){
  currentIndex = index;
  mainImage.src = images[index];
  updateActiveThumb();
  syncThumbnailPosition();
}
function syncThumbnailPosition(){

  const viewport = document.querySelector(".thumb-viewport");
  const thumbWidth = thumbImages[0].offsetWidth + 12; // dynamic width
  const visibleCount = Math.floor(viewport.offsetWidth / thumbWidth);
  const maxIndex = thumbImages.length - visibleCount;

  if(currentIndex <= maxIndex){
    thumbIndex = currentIndex;
  } else {
    thumbIndex = maxIndex;
  }

  thumbnailTrack.style.transform =
    `translateX(-${thumbIndex * thumbWidth}px)`;
}



// MAIN IMAGE ARROWS
function nextImage(){
  currentIndex = (currentIndex + 1) % images.length;
  selectImage(currentIndex);
}

function prevImage(){
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  selectImage(currentIndex);
}

// UPDATE ACTIVE BORDER
function updateActiveThumb(){

  if (!thumbnails || thumbnails.length === 0) return;

  thumbnails.forEach(t => t.classList.remove("active"));

  if (thumbnails[currentIndex]) {
    thumbnails[currentIndex].classList.add("active");
  }

}

// THUMBNAIL SLIDE (4 VISIBLE)
// const thumbnailTrack = document.getElementById("thumbnailTrack");
// const thumbImages = document.querySelectorAll("#thumbnailTrack img");

// let thumbIndex = 0;

function nextThumb(){

  const viewport = document.querySelector(".thumb-viewport");
  const thumbWidth = thumbImages[0].offsetWidth + 12;
  const visibleCount = Math.floor(viewport.offsetWidth / thumbWidth);
  const maxIndex = thumbImages.length - visibleCount;

  if(thumbIndex < maxIndex){
    thumbIndex++;
  }

  thumbnailTrack.style.transform =
    `translateX(-${thumbIndex * thumbWidth}px)`;
}

function prevThumb(){

  const thumbWidth = thumbImages[0].offsetWidth + 12;

  if(thumbIndex > 0){
    thumbIndex--;
  }

  thumbnailTrack.style.transform =
    `translateX(-${thumbIndex * thumbWidth}px)`;
}




// INIT
if (thumbnails && thumbnails.length > 0) {
  updateActiveThumb();
}



// SIZE SELECT
document.querySelectorAll(".size-btn").forEach(btn=>{
  btn.addEventListener("click",function(){
    document.querySelectorAll(".size-btn").forEach(b=>b.classList.remove("active"));
    this.classList.add("active");
  });
});


const sizeButtons = document.querySelectorAll(".size-btn");
const mainAddBtn = document.getElementById("mainAddBtn");
const stickyAddBtn = document.getElementById("stickyAddBtn");

let selectedSize = null;

sizeButtons.forEach(btn => {
  btn.addEventListener("click", function () {

    sizeButtons.forEach(b => b.classList.remove("active"));
    this.classList.add("active");

    selectedSize = this.innerText;

    if (mainAddBtn) mainAddBtn.disabled = false;
    if (stickyAddBtn) stickyAddBtn.disabled = false;
  });
});

// QUANTITY
let quantity = 1;
function increaseQty(){
  quantity++;
  document.getElementById("qty").innerText = quantity;
}
function decreaseQty(){
  if(quantity > 1){
    quantity--;
    document.getElementById("qty").innerText = quantity;
  }
}

// TABS
function openTab(tabId){
  document.querySelectorAll(".tab-content").forEach(tab=>{
    tab.classList.remove("active");
  });
  document.querySelectorAll(".tab-btn").forEach(btn=>{
    btn.classList.remove("active");
  });

  document.getElementById(tabId).classList.add("active");
  event.target.classList.add("active");
}

// BUTTON LOGIC
function addToCart(){
  alert("Product added to cart!");
}

function buyNow(){
  window.location.href = "cart.html";
}


// only in Product.html 
// add to cart sticky button only in mobile screen when user scroll down 
document.addEventListener("DOMContentLoaded", function () {
  const stickyBar = document.querySelector(".sticky-cart-bar");
  const pdpButtons = document.querySelector(".pdp-buttons");

  if (!stickyBar || !pdpButtons) return;

  window.addEventListener("scroll", function () {
    const rect = pdpButtons.getBoundingClientRect();

    // Show earlier (when section is near bottom of screen)
    // ifwant more early if (rect.top < window.innerHeight - 250) 
    if (rect.top < window.innerHeight - 150) {
      stickyBar.classList.add("active");
    } else {
      stickyBar.classList.remove("active");
    }
  });
});

// filter event 
// filter event 
// filter event 
// filter event 
// filter event 


document.addEventListener("DOMContentLoaded", function () {

  const filterBtn = document.querySelector(".filter-open-btn");
  const filterDrawer = document.querySelector(".filter-drawer");
  const filterClose = document.querySelector(".filter-close-btn");

  if (!filterBtn || !filterDrawer) return;

  // OPEN
  filterBtn.addEventListener("click", function () {
    filterDrawer.classList.add("active");
  });

  // CLOSE
  if (filterClose) {
    filterClose.addEventListener("click", function () {
      filterDrawer.classList.remove("active");
    });
  }

});







// add to cart toast message instaed of pop-up 
// only in Product.html 


function showCartToast() {
  const toast = document.getElementById("cartToast");
  if (!toast) return;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}







// CONNECT ADD TO CART BUTTONS WITH TOAST
// only in Product.html 

// CONNECT ADD TO CART BUTTONS WITH REAL CART SYSTEM

if (mainAddBtn) {
  mainAddBtn.addEventListener("click", function () {

    const cart = getCart();

    const product = {
      id: "ruby-lehenga",
      name: "Ruby Festive Lehenga",
      price: 4999,
      size: selectedSize,
      quantity: quantity
    };

    cart.push(product);
    saveCart(cart);

    updateCartBadge();
    showCartToast();
  });
}

if (stickyAddBtn) {
  stickyAddBtn.addEventListener("click", function () {

    const cart = getCart();

    const product = {
      id: "ruby-lehenga",
      name: "Ruby Festive Lehenga",
      price: 4999,
      size: selectedSize,
      quantity: quantity
    };

    cart.push(product);
    saveCart(cart);

    updateCartBadge();
    showCartToast();
  });
}






// =========================
// CART SYSTEM
// =========================
// only in CSSMathProduct.html when user sleect size and then closeFilter;lick on the add to cart then cart increament will be updated ok 
// Get cart from storage
// function getCart() {
//   return JSON.parse(localStorage.getItem("ntCart")) || [];
// }

// // Save cart
// function saveCart(cart) {
//   localStorage.setItem("ntCart", JSON.stringify(cart));
// }

// // Update badge count
// function updateCartBadge() {
//   const cart = getCart();
//   const cartBadges = document.querySelectorAll(".cart-badge");

//   cartBadges.forEach(badge => {
//     badge.textContent = cart.length;
//   });
// }






document.addEventListener("DOMContentLoaded", function () {
  updateCartBadge();
});














// wishlist button full logic is here
// wishlist button full logic is here
// wishlist button full logic is here
// wishlist button full logic is here
// wishlist button full logic is here
// wishlist button full logic is here
// wishlist button full logic is here
// wishlist button full logic is here
// wishlist button full logic is here
// wishlist button full logic is here
// wishlist button full logic is here
// wishlist button full logic is here
// wishlist button full logic is here
function updateWishlistBadge() {
  const wishlist = getWishlist();
  document.querySelectorAll(".wishlist-badge")
    .forEach(b => b.textContent = wishlist.length);
}



function getCurrentUser() {
  return JSON.parse(localStorage.getItem("ntLoggedInUser"));
}

function getWishlistKey() {
  const user = getCurrentUser();
  if (!user) return null;
  return "wishlist_" + user.email;
}

function getWishlist() {
  const key = getWishlistKey();
  if (!key) return [];
  return JSON.parse(localStorage.getItem(key)) || [];
}

function saveWishlist(wishlist) {
  const key = getWishlistKey();
  if (!key) return;
  localStorage.setItem(key, JSON.stringify(wishlist));
  updateWishlistBadge();
}

function updateWishlistBadge() {

  const user = getCurrentUser();
  const badges = document.querySelectorAll(".wishlist-badge");

  if (!user) {
    badges.forEach(b => b.textContent = 0);
    return;
  }

  const wishlist = getWishlist();
  badges.forEach(b => b.textContent = wishlist.length);
}




function toggleWishlist(product) {

  const user = getCurrentUser();

  if (!user) {
    const authModal = document.getElementById("authModal");
    if (authModal) authModal.classList.add("active");
    return;
  }

  let wishlist = getWishlist();

  const exists = wishlist.find(item => item.id === product.id);

  if (exists) {
    wishlist = wishlist.filter(item => item.id !== product.id);
  } else {
    wishlist.push(product);
  }

  saveWishlist(wishlist);
}


// ==========================
// ATTACH TO BUTTONS
// ==========================

document.addEventListener("DOMContentLoaded", function () {

  updateWishlistBadge();

  const buttons = document.querySelectorAll(".wishlist-btn");

  buttons.forEach(btn => {

    const product = {
      id: btn.dataset.id,
      name: btn.dataset.name,
      price: btn.dataset.price,
      image: btn.dataset.image
    };

    // Active state on load
    const wishlist = getWishlist();
    if (wishlist.find(item => item.id === product.id)) {
      btn.classList.add("active");
    }

    btn.addEventListener("click", function (e) {
      e.preventDefault();

      toggleWishlist(product);

     const exists = getWishlist().find(item => item.id === product.id);

if (exists) {
  btn.classList.add("active");
} else {
  btn.classList.remove("active");
}

    });

  });

});
// NAVBAR WISHLIST ICON LOGIN VALIDATION
document.addEventListener("DOMContentLoaded", function(){

  const wishlistLink = document.querySelector('a[href="wishlist.html"]');

  if (!wishlistLink) return;

  wishlistLink.addEventListener("click", function(e){

    const user = JSON.parse(localStorage.getItem("ntLoggedInUser"));

    if (!user) {
      e.preventDefault();

      const authModal = document.getElementById("authModal");

      if (authModal) {
        authModal.classList.add("active");
      }
    }

  });

});





/* =========================
   CART SYSTEM – NAARITHREAD
========================= */
/* =========================
   CART SYSTEM – NAARITHREAD
========================= */
/* =========================
   CART SYSTEM – NAARITHREAD
========================= */
/* =========================
   CART SYSTEM – NAARITHREAD
========================= */
/* =========================
   CART SYSTEM – NAARITHREAD
========================= */
/* =========================
   CART SYSTEM – NAARITHREAD
========================= */


function getCurrentUser() {
  return JSON.parse(localStorage.getItem("ntLoggedInUser"));
}

function getCartKey() {
  const user = getCurrentUser();
  if (!user) return null;
  return "ntCart_" + user.email;
}

function getCart() {
  const key = getCartKey();
  if (!key) return [];
  return JSON.parse(localStorage.getItem(key)) || [];
}

function saveCart(cart) {
  const key = getCartKey();
  if (!key) return;
  localStorage.setItem(key, JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  const cart = getCart();
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);

  document.querySelectorAll(".cart-badge, .badge:not(.wishlist-badge)")
    .forEach(badge => badge.textContent = totalQty);
}








document.querySelectorAll(".cart-btn").forEach(button => {

  button.addEventListener("click", function (e) {

    e.preventDefault();
    e.stopPropagation();

    const productCard = this.closest(".product-card");

    const id = productCard.querySelector(".wishlist-btn")?.dataset.id;
    const name = productCard.querySelector(".wishlist-btn")?.dataset.name;
    const priceText = productCard.querySelector(".wishlist-btn")?.dataset.price;
    const image = productCard.querySelector(".wishlist-btn")?.dataset.image;

    if (!id) return;

    const price = parseInt(priceText.replace(/[^0-9]/g, ""));

    let cart = getCart();

    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id,
        name,
        price,
        image,
        quantity: 1
      });
    }

    saveCart(cart);

    showCartToast();


  });

});






document.addEventListener("DOMContentLoaded", updateCartBadge);








/* =========================
   CART PAGE RENDER
========================= */

function renderCartPage() {

  const container = document.getElementById("cartContainer");
  const totalBox = document.getElementById("cartTotal");

  if (!container) return; // Only run on cart page

  const cart = getCart();

  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = "<p style='text-align:center'>Your cart is empty 🛒</p>";
    totalBox.textContent = "";
    return;
  }

  let total = 0;

cart.forEach(item => {

  const numericPrice = parseInt(
    item.price.toString().replace(/[^0-9]/g, "")
  ) || 0;

  total += numericPrice * (item.quantity || 1);




    const card = document.createElement("div");
    card.classList.add("cart-card");

    card.innerHTML = `
      <div class="cart-image">
        <img src="${item.image}" />
      </div>

      <div class="cart-details">
        <h3>${item.name}</h3>
        <p class="cart-price">₹${item.price}</p>

        <div class="quantity-box">
          <button onclick="decreaseCartQty('${item.id}')">-</button>
          <span>${item.quantity}</span>
          <button onclick="increaseCartQty('${item.id}')">+</button>
        </div>

        <div class="cart-actions">
          <button class="remove-btn" onclick="removeCartItem('${item.id}')">
            Remove
          </button>
        </div>
      </div>
    `;

    container.appendChild(card);

  });

  totalBox.textContent = "Total: ₹" + total;

}









function increaseCartQty(id) {
  let cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.quantity += 1;
  saveCart(cart);
  renderCartPage();
}

function decreaseCartQty(id) {
  let cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;

  if (item.quantity > 1) {
    item.quantity -= 1;
  }

  saveCart(cart);
  renderCartPage();
}

function removeCartItem(id) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== id);
  saveCart(cart);
  renderCartPage();
}






document.addEventListener("DOMContentLoaded", renderCartPage);






function goToCheckout() {

  const cart = getCart();

  if (cart.length === 0) {
    alert("Your cart is empty 🛒");
    return;
  }

  window.location.href = "checkout.html";
}










function renderCheckout() {

  const container = document.getElementById("checkoutItems");
  const totalBox = document.getElementById("checkoutTotal");

  if (!container) return;

  const cart = getCart();

  container.innerHTML = "";   // 🔥 VERY IMPORTANT

  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    totalBox.textContent = "";
    return;
  }

  let total = 0;

  cart.forEach(item => {

    total += item.price * item.quantity;

    container.innerHTML += `
      <div class="checkout-item">
        <span>${item.name} × ${item.quantity}</span>
        <span>₹${item.price * item.quantity}</span>
      </div>
    `;
  });

  totalBox.textContent = "Total: ₹" + total;
}

document.addEventListener("DOMContentLoaded", renderCheckout);














/* ===============================
   PLACE ORDER LOGIC in checkout from 
================================ */
/* ===============================
   PLACE ORDER LOGIC in checkout from 
================================ */
/* ===============================
   PLACE ORDER LOGIC in checkout from 
================================ */
/* ===============================
   PLACE ORDER LOGIC in checkout from 
================================ */
/* ===============================
   PLACE ORDER LOGIC in checkout from 
================================ */
/* ===============================
   PLACE ORDER LOGIC in checkout from 
================================ *//* ===============================
   PLACE ORDER LOGIC in checkout from 
================================ */

/* ===============================
   PROFESSIONAL CHECKOUT VALIDATION
================================ */

function showError(inputId, message) {
  const group = document.getElementById(inputId).parentElement;
  const error = group.querySelector(".error");
  if (error) error.textContent = message;
}

function clearErrors() {
  document.querySelectorAll(".error").forEach(e => e.textContent = "");
}

document.addEventListener("DOMContentLoaded", function () {

  const placeOrderBtn = document.getElementById("placeOrderBtn");
  if (!placeOrderBtn) return;

  placeOrderBtn.addEventListener("click", function () {

    clearErrors();

    const fullName = document.getElementById("fullName").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const address1 = document.getElementById("address1").value.trim();
    const city = document.getElementById("city").value.trim();
    const state = document.getElementById("state").value;
    const pincode = document.getElementById("pincode").value.trim();

    let valid = true;

    if (!fullName) {
      showError("fullName", "Full name is required");
      valid = false;
    }

    if (!phone || phone.length < 10) {
      showError("phone", "Enter valid phone number");
      valid = false;
    }

    if (!email || !email.includes("@")) {
      showError("email", "Enter valid email");
      valid = false;
    }

    if (!address1) {
      showError("address1", "Address is required");
      valid = false;
    }

    if (!city) {
      showError("city", "City is required");
      valid = false;
    }

    if (!state) {
      showError("state", "Select your state");
      valid = false;
    }

    if (!pincode || pincode.length !== 6 || isNaN(pincode)) {
      showError("pincode", "Enter valid 6-digit pincode");
      valid = false;
    }

    if (!valid) return;











    // ===== PAYMENT VALIDATION =====

const selectedPayment = document.querySelector('input[name="payment"]:checked').value;

if (selectedPayment === "upi") {
  const upiId = document.getElementById("upiId").value.trim();
  if (!upiId.includes("@")) {
    alert("Enter valid UPI ID");
    return;
  }
}

if (selectedPayment === "card") {
  const cardNumber = document.getElementById("cardNumber").value.trim();
  const cardCvv = document.getElementById("cardCvv").value.trim();

  if (cardNumber.length < 16 || cardCvv.length !== 3) {
    alert("Enter valid card details");
    return;
  }
}

    // ===== ORDER SAVE LOGIC =====

    const cart = getCart();
    const user = getCurrentUser();
    const orderKey = "ntOrders_" + user.email;

    const existingOrders = JSON.parse(localStorage.getItem(orderKey)) || [];

    





cart.forEach(item => {

  const newOrder = {
    orderId: "NT_" + Date.now() + "_" + Math.floor(Math.random() * 1000000),
    items: [item],
    total: item.price * item.quantity,
    paymentMethod: selectedPayment,
    address: {
      fullName,
      phone,
      email,
      address1,
      city,
      state,
      pincode
    },
    date: new Date().toLocaleDateString(),
    status: "Processing"
  };

  existingOrders.push(newOrder);

});




    localStorage.setItem(orderKey, JSON.stringify(existingOrders));

    localStorage.removeItem(getCartKey());

    window.location.href = "order.html";

  });

});





/* ===============================
   PAYMENT TOGGLE LOGIC
================================ */
/* ===============================
   PAYMENT TOGGLE LOGIC
================================ */
/* ===============================
   PAYMENT TOGGLE LOGIC
================================ */
/* ===============================
   PAYMENT TOGGLE LOGIC
================================ */
/* ===============================
   PAYMENT TOGGLE LOGIC
================================ */

document.addEventListener("DOMContentLoaded", function () {

  const paymentRadios = document.querySelectorAll('input[name="payment"]');
  const upiSection = document.getElementById("upiSection");
  const cardSection = document.getElementById("cardSection");

  if (!paymentRadios.length) return;

  paymentRadios.forEach(radio => {
    radio.addEventListener("change", function () {

      if (this.value === "upi") {
        upiSection.classList.remove("hidden");
        cardSection.classList.add("hidden");
      }

      else if (this.value === "card") {
        cardSection.classList.remove("hidden");
        upiSection.classList.add("hidden");
      }

      else {
        upiSection.classList.add("hidden");
        cardSection.classList.add("hidden");
      }

    });
  });

});











/* ===============================
   RENDER MY ORDERS
================================ */
/* ===============================
   RENDER MY ORDERS
================================ */
/* ===============================
   RENDER MY ORDERS
================================ */
/* ===============================
   RENDER MY ORDERS
================================ */
/* ===============================
   RENDER MY ORDERS
================================ */
/* ===============================
   RENDER MY ORDERS
================================ */
/* ===============================
   RENDER MY ORDERS
================================ */

function renderOrders() {

  const container = document.getElementById("ordersContainer");
  if (!container) return;

  const user = getCurrentUser();
  if (!user) return;

  const orderKey = "ntOrders_" + user.email;
  const orders = JSON.parse(localStorage.getItem(orderKey)) || [];

  container.innerHTML = "";

  if (orders.length === 0) {
    container.innerHTML = "<p style='text-align:center'>No orders yet.</p>";
    return;
  }

  orders.slice().reverse().forEach(order => {

  const item = order.items[0]; // only one product per order

  const card = document.createElement("div");
  card.classList.add("order-card");

  const statusClass =
    order.status === "Paid" ? "status-paid" : "status-processing";

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

        <div class="order-bottom">

          <div class="order-status-badge ${statusClass}">
            ${order.status}
          </div>

          ${order.status === "Processing" ? `
            <button class="cancel-order-btn"
              onclick="cancelOrder('${order.orderId}')">
              Cancel Order
            </button>
          ` : ""}

        </div>

      </div>

    </div>
  `;

  container.appendChild(card);
  card.classList.add("active");


});


  

}




document.addEventListener("DOMContentLoaded", renderOrders);



 /* ===============================
   CANCEL ORDER LOGIC
================================ */

let selectedCancelOrderId = null;

// Open modal
function cancelOrder(orderId) {
  selectedCancelOrderId = orderId;

  const modal = document.getElementById("cancelModal");
  if (modal) modal.classList.add("active");
}




function showCancelToast() {
  const toast = document.getElementById("cancelToast");
  if (!toast) return;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}



document.addEventListener("DOMContentLoaded", function () {

  const modal = document.getElementById("cancelModal");
  const noBtn = document.getElementById("cancelNoBtn");
  const yesBtn = document.getElementById("cancelYesBtn");

  if (!modal) return;

  if (noBtn) {
    noBtn.addEventListener("click", function () {
      modal.classList.remove("active");
selectedCancelOrderId = null;

    });
  }

  if (yesBtn) {
    yesBtn.addEventListener("click", function () {

      const user = getCurrentUser();
      const orderKey = "ntOrders_" + user.email;

      let orders = JSON.parse(localStorage.getItem(orderKey)) || [];

      orders = orders.filter(order => order.orderId !== selectedCancelOrderId);

localStorage.setItem(orderKey, JSON.stringify(orders));

selectedCancelOrderId = null;   // ✅ VERY IMPORTANT

modal.classList.remove("active");

renderOrders();

showCancelToast();

      

    });
  }

});









// reavel animation js code 
// reavel animation js code 
// reavel animation js code 
// reavel animation js code 
// reavel animation js code // reavel animation js code 
// reavel animation js code 
// reavel animation js code 
// reavel animation js code 
// reavel animation js code 
// reavel animation js code 
// reavel animation js code 
// reavel animation js code 
// reavel animation js code 


document.addEventListener("DOMContentLoaded", function () {

  const elements = document.querySelectorAll(
    ".product-card, .wishlist-card, .about-row, .order-card, .footer-links, .hero-section"
  );

  function revealOnScroll() {

    const windowHeight = window.innerHeight;

    elements.forEach(el => {

      const elementTop = el.getBoundingClientRect().top;
      const revealPoint = 100;

      if (elementTop < windowHeight - revealPoint) {
        el.classList.add("active");
      }

    });

  }

  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll();

});

document.addEventListener("DOMContentLoaded", function () {

  const elements = document.querySelectorAll(
    ".product-card, .wishlist-card, .about-row, .order-card, .footer-links, .hero-section, .contact-section, .contact-form, .contact-info , .contact-row"
  );

  function revealOnScroll() {
    const windowHeight = window.innerHeight;

    elements.forEach(el => {
      const elementTop = el.getBoundingClientRect().top;
      const revealPoint = 100;

      if (elementTop < windowHeight - revealPoint) {
        el.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll();
});










/* ===============================
   WISHLIST PAGE FULL RENDER LOGIC
================================ */

function renderWishlistPage() {

  const grid = document.getElementById("wishlistGrid");
  if (!grid) return; // Only run on wishlist.html

  const user = getCurrentUser();
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const wishlist = getWishlist();
  const empty = document.getElementById("wishlistEmpty");
  const count = document.getElementById("wishlistCount");

  grid.innerHTML = "";
  count.textContent = wishlist.length;

  if (wishlist.length === 0) {
    empty.style.display = "block";
    return;
  }

  empty.style.display = "none";

  wishlist.forEach(item => {

    const card = document.createElement("div");
    card.className = "wishlist-card active";

    card.innerHTML = `
      <div class="wishlist-image">
        <img src="${item.image}" />
        <button class="remove-btn">✕</button>
      </div>

      <div class="wishlist-info">
        <h3>${item.name}</h3>
        <p class="price">${item.price}</p>
        <button class="move-btn">Move to Cart</button>
      </div>
    `;

    /* ================= REMOVE ================= */

    card.querySelector(".remove-btn").addEventListener("click", function () {

      const updatedWishlist = getWishlist().filter(p => p.id !== item.id);
      saveWishlist(updatedWishlist);

      renderWishlistPage();
    });

    /* ================= MOVE TO CART ================= */

    card.querySelector(".move-btn").addEventListener("click", function () {

      let cart = getCart();

      const cleanPrice = parseInt(
        item.price.toString().replace(/[^0-9]/g, "")
      );

      const existingItem = cart.find(p => p.id === item.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          id: item.id,
          name: item.name,
          price: cleanPrice,
          image: item.image,
          quantity: 1
        });
      }

      saveCart(cart);

      // Remove from wishlist
      const updatedWishlist = getWishlist().filter(p => p.id !== item.id);
      saveWishlist(updatedWishlist);

      renderWishlistPage();
    });

    grid.appendChild(card);
  });
}

/* ===============================
   RUN WISHLIST PAGE ON LOAD
================================ */

document.addEventListener("DOMContentLoaded", function () {
  renderWishlistPage();
});











