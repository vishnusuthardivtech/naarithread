// UI only – backend baad me
// document.querySelector("form").addEventListener("submit", e => {
//   e.preventDefault();
//   window.location.href = "dashboard.html";
// });


document.addEventListener("DOMContentLoaded", function(){

  const form = document.querySelector("form");

  const ADMIN_EMAIL = "vishnu2005suthar@gmail.com";
  const ADMIN_PASSWORD = "vishnu@2005";

  form.addEventListener("submit", function(e){

    e.preventDefault();

    const email = form.querySelector("input[type='email']").value.trim();
    const password = form.querySelector("input[type='password']").value;

    if(email === ADMIN_EMAIL && password === ADMIN_PASSWORD){

      localStorage.setItem("ntAdminLoggedIn", "true");

      window.location.href = "dashboard.html";

    } else {

      alert("Invalid admin email or password");

    }

  });

});










function toggleSidebar() {
  if (window.innerWidth <= 768) {
    document.getElementById("sidebar").classList.toggle("show");
    document.getElementById("sidebarOverlay").classList.toggle("show");
  }
}

function closeSidebar() {
  if (window.innerWidth <= 768) {
    document.getElementById("sidebar").classList.remove("show");
    document.getElementById("sidebarOverlay").classList.remove("show");
  }
}

window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    document.getElementById("sidebar")?.classList.remove("show");
    document.getElementById("sidebarOverlay")?.classList.remove("show");
  }
});

