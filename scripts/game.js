const params = new URLSearchParams(window.location.search);
const gameId = params.get("id");

const apiKey = "3efd2b4f9ba64a67967a1cf6c96788cd";
const url = `https://api.rawg.io/api/games/${gameId}?key=${apiKey}`;

const titleEl = document.getElementById("game-title");
const imageEl = document.getElementById("game-image");
const releaseEl = document.getElementById("game-release");
const ratingEl = document.getElementById("game-rating");
const descriptionEl = document.getElementById("game-description");


fetch(url)
  .then(res => res.json())
  .then(game => {
    titleEl.textContent = game.name;
    imageEl.src = game.background_image;
    imageEl.alt = game.name;
    releaseEl.textContent = game.released;
    ratingEl.textContent = game.rating;
    descriptionEl.innerHTML = game.description; // THIS API returns HTML!
    let rawDescription = game.description;
    // Remove tudo depois de "Español" (inclusive)
    let cleanDescription = rawDescription.split(/<p[^>]*>Español/i)[0];
    descriptionEl.innerHTML = cleanDescription;
})
  .catch(err => {
    titleEl.textContent = "Failed to load game details.";
    console.error(err);
  });


document.addEventListener("DOMContentLoaded", () => {
  const backBtn = document.getElementById("back-btn");

  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.history.back(); //Go Back
    });
  }
});

