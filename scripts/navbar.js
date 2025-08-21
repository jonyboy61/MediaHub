document.addEventListener("DOMContentLoaded", () => {
  fetch("../components/navbar.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("navbar-container").innerHTML = data;

      // Marcar link ativo com base na página atual
      const current = window.location.pathname.split("/").pop();
      const links = document.querySelectorAll(".nav-link");
      links.forEach(link => {
        if (link.getAttribute("href") === current) {
          link.classList.add("active");
        }
      });
    })
    .catch(err => console.error("Failed to load navbar:", err));
});
