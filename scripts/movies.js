// --- Config ---
const TMDB_API_KEY = "27f7caeef0a1d52285c7dba40e69cf4f"; // substitui pela tua chave
const TMDB_BASE = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p/w500";

// --- Estado ---
let currentPage = 1;
let totalPages = 1;
let currentQuery = "";
let limit = 10;

// --- Elements ---
const container = document.getElementById("movies-container");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const limitSelect = document.getElementById("movie-limit");

// --- Helpers ---
function buildUrl(page, query) {
  const endpoint = query ? "/search/movie" : "/discover/movie";
  const params = new URLSearchParams({
    api_key: TMDB_API_KEY,
    language: "en-US",
    include_adult: "false",
    page: String(page),
    sort_by: query ? undefined : "popularity.desc",
    query: query || undefined,
  });
  return `${TMDB_BASE}${endpoint}?${params.toString()}`;
}

function movieCard(m) {
  const poster = m.poster_path ? `${IMG_BASE}${m.poster_path}` : "../assets/placeholder.jpg";
  const year = (m.release_date || "").slice(0, 4) || "—";
  return `
    <article class="movie-card">
      <img src="${poster}" alt="${m.title}" loading="lazy" />
      <a href="./movie.html?id=${m.id}">${m.title}</a>
      <p>${year} · ⭐ ${m.vote_average?.toFixed(1) ?? "—"}</p>
    </article>
  `;
}

function render(items) {
  container.innerHTML = items.map(movieCard).join("");
  prevBtn.disabled = currentPage <= 1;
  nextBtn.disabled = currentPage >= totalPages;
}

// --- Fetch + render ---
async function load(page = 1) {
  container.setAttribute("aria-busy", "true");
  try {
    const url = buildUrl(page, currentQuery);
    const res = await fetch(url);
    if (!res.ok) throw new Error("TMDb request failed");
    const data = await res.json();
    totalPages = data.total_pages || 1;

    // TMDb devolve 20 por página, limitamos localmente
    const items = (data.results || []).slice(0, limit);
    render(items);
  } catch (e) {
    container.innerHTML = `<p>Erro a carregar filmes.</p>`;
    console.error(e);
  } finally {
    container.setAttribute("aria-busy", "false");
  }
}

// --- Events ---
searchBtn.addEventListener("click", () => {
  currentQuery = searchInput.value.trim();
  currentPage = 1;
  load(currentPage);
});

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    currentQuery = searchInput.value.trim();
    currentPage = 1;
    load(currentPage);
  }
});

prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    load(currentPage);
  }
});

nextBtn.addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    load(currentPage);
  }
});

limitSelect.addEventListener("change", () => {
  limit = Number(limitSelect.value) || 10;
  load(currentPage);
});

// --- Init ---
load(currentPage);
