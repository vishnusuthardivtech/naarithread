document.addEventListener("DOMContentLoaded", () => {

  const searchTrigger = document.getElementById("searchTrigger");
  const searchPanel = document.getElementById("navSearchPanel");
  const searchInput = document.getElementById("navSearchInput");
  const searchClose = document.getElementById("searchClose");

  if (!searchTrigger || !searchPanel) return;

  // OPEN SEARCH (ONLY ONE LISTENER)
  searchTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    searchPanel.classList.add("active");
    setTimeout(() => searchInput.focus(), 150);
  });

  // CLOSE SEARCH
  searchClose.addEventListener("click", () => {
    searchPanel.classList.remove("active");
  });

  // ENTER KEY
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      console.log("Search:", searchInput.value);
      searchPanel.classList.remove("active");
    }
  });

  // CLICK OUTSIDE
  document.addEventListener("click", (e) => {
  if (
    !searchPanel.contains(e.target) &&
    !searchTrigger.contains(e.target) &&
    !e.target.closest(".navbar")
  ) {
    searchPanel.classList.remove("active");
  }
  });
});
