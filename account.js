document.addEventListener("DOMContentLoaded", function () {

  const user = JSON.parse(localStorage.getItem("ntLoggedInUser"));


  if (!user) {
    // If not logged in → redirect
    window.location.href = "login.html";
    return;
  }

  document.getElementById("accountName").textContent = user.name;
  document.getElementById("accountEmail").textContent = user.email;

  // Logout button
  document.getElementById("accountLogout").addEventListener("click", function () {
  localStorage.removeItem("ntLoggedInUser");
  window.location.href = "index.html";
});


});
