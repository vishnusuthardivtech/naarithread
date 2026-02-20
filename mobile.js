const collectionsTrigger = document.querySelector(".collections-trigger");
const mobileCollections = document.getElementById("mobileCollections");
const closeCollections = document.getElementById("closeCollections");

if (collectionsTrigger) {
  collectionsTrigger.addEventListener("click", (e) => {
    if (window.innerWidth < 769) {
      e.preventDefault();
      e.stopPropagation();

      mobileCollections.classList.add("active");
      document.body.classList.add("menu-open");
    }
  });
}

if (closeCollections && mobileCollections) {
  closeCollections.addEventListener("click", () => {
    mobileCollections.classList.remove("active");
    document.body.classList.remove("menu-open");
  });
}


window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    mobileCollections.classList.remove("active");
    document.body.classList.remove("menu-open");
  }
});

