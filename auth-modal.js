const authModal = document.getElementById("authModal");
const closeAuth = document.getElementById("closeAuth");
const tabs = document.querySelectorAll(".tab-btn");
const forms = document.querySelectorAll(".auth-form");

// AUTO OPEN AFTER 15 SECONDS (SAFE)
// AUTO OPEN AFTER 15 SECONDS (ONLY IF NOT LOGGED IN)

if (authModal) {

  const loggedInUser = JSON.parse(localStorage.getItem("ntLoggedInUser"));

  if (!loggedInUser && !sessionStorage.getItem("authShown")) {

    setTimeout(() => {
      authModal.classList.add("active");
      document.body.style.overflow = "hidden";
      sessionStorage.setItem("authShown", "true");
    }, 15000);

  }

}


// CLOSE
if (closeAuth && authModal) {
  closeAuth.addEventListener("click", () => {
    authModal.classList.remove("active");
    document.body.style.overflow = "";
  });
}

// TAB SWITCH
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    forms.forEach(f => f.classList.remove("active"));

    tab.classList.add("active");

    const targetForm = document.getElementById(tab.dataset.tab + "Form");
    if (targetForm) {
      targetForm.classList.add("active");
    }
  });
});
