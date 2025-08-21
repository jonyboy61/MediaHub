// scripts/script.js
document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("click", () => {
    const category = card.dataset.category;
    window.location.href = `pages/${category}.html`;
  });
});

