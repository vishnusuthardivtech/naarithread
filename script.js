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


const track = document.querySelector(".best-seller-track");
const cards = document.querySelectorAll(".product-card");

let index = 0;

function autoSlide() {
  const cardWidth = cards[0].offsetWidth + 30;
  index++;

  if (index > cards.length - 1) {
    index = 0;
  }

  track.style.transform = `translateX(-${index * cardWidth}px)`;
}

setInterval(autoSlide, 3500);
document.addEventListener("DOMContentLoaded", () => {

  const slides = document.querySelectorAll(".slide");
  if (slides.length) {
    let currentSlide = 0;

    function showSlide(index) {
      slides.forEach(slide => slide.classList.remove("active"));
      slides[index].classList.add("active");
    }

    setInterval(() => {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    }, 5000);
  }

});



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

