function toggleMenu(){
    document.getElementById("navLinks").classList.toggle("show");
    document.getElementById("hamburger").classList.toggle("active");
}

/* SCROLL EFFECT */
window.addEventListener("scroll", ()=>{
    document.getElementById("navbar")
        .classList.toggle("scrolled", window.scrollY > 10);
});

const slides = document.querySelectorAll(".slide");
let currentSlide = 0;

function showSlide(index) {
  slides.forEach((slide) => slide.classList.remove("active"));
  slides[index].classList.add("active");
}

setInterval(() => {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}, 5000); // 5 seconds





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
  thumbnails.forEach(t => t.classList.remove("active"));
  thumbnails[currentIndex].classList.add("active");
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
updateActiveThumb();


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
function getCart() {
  return JSON.parse(localStorage.getItem("ntCart")) || [];
}

// Save cart
function saveCart(cart) {
  localStorage.setItem("ntCart", JSON.stringify(cart));
}

// Update badge count
function updateCartBadge() {
  const cart = getCart();
  const badges = document.querySelectorAll(".badge");

  badges.forEach(badge => {
    badge.textContent = cart.length;
  });
}






document.addEventListener("DOMContentLoaded", function () {
  updateCartBadge();
});
