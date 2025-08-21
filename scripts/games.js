const apiKey = "3efd2b4f9ba64a67967a1cf6c96788cd";
const container = document.getElementById("games-container");
const limitSelect = document.getElementById("game-limit");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const pageType = "games";
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-btn");
let currentPage = 1;
let currentLimit = parseInt(limitSelect?.value) || 10;
let currentSearch = ""; // estado atual da pesquisa

function loadGames(page = 1, limit = 10, searchQuery = "") {
  container.innerHTML = "";

  const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : "";
  const url = `https://api.rawg.io/api/games?key=${apiKey}&page=${page}&page_size=${limit}${searchParam}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      container.innerHTML = ""; 
      data.results.forEach(game => {
        const card = document.createElement("div");
        card.classList.add("game-card");

        card.innerHTML = `
          <a href="game.html?id=${game.id}">
            <img src="${game.background_image}" alt="${game.name}" />
            <h3>${game.name}</h3>
          </a>
          <p>Released: ${game.released}</p>
          <p>Rating: ${game.rating}</p>
        `;

        container.appendChild(card);
      });

      prevBtn.disabled = page === 1;
      nextBtn.disabled = !data.next;
    })
    .catch(err => {
      container.innerHTML = "<p>Failed to load games.</p>";
      console.error(err);
    });
}


searchButton?.addEventListener("click", () => {
  currentSearch = searchInput.value.trim();
  currentPage = 1;
  loadGames(currentPage, currentLimit, currentSearch);
});

searchInput?.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    currentSearch = searchInput.value.trim();
    currentPage = 1;
    loadGames(currentPage, currentLimit, currentSearch);
  }
});

nextBtn.addEventListener("click", () =>{
    currentPage++;
    loadGames(currentPage, currentLimit, currentSearch);
});

// Quando muda o valor do seletor
/*limitSelect.addEventListener("change", () => {
  const selectedLimit = parseInt(limitSelect.value);
  loadGames(selectedLimit);
});*/

limitSelect.addEventListener("change", () => {
  currentLimit = parseInt(limitSelect.value);
  currentPage = 1; // volta à página 1
  loadGames(currentPage, currentLimit, currentSearch);
});


// Carrega os jogos pela primeira vez com 10
loadGames(currentPage, currentLimit);
