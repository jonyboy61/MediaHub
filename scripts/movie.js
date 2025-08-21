// ---- CREDENCIAL TMDb ----
// Podes meter a mesma que já colocaste no movies.js
const TMDB_CREDENTIAL = "27f7caeef0a1d52285c7dba40e69cf4f";

// ---- Constantes ----
const TMDB_BASE = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p/w500";
const IS_V4 = TMDB_CREDENTIAL.startsWith("ey");

// ---- Elements ----
const detailsEl = document.querySelector(".movie-details");
const imgEl = document.getElementById("movie-image");
const titleEl = document.getElementById("movie-title");
const metaEl = document.getElementById("movie-meta");
const genresEl = document.getElementById("movie-genres");
const runtimeEl = document.getElementById("movie-runtime");
const ratingEl = document.getElementById("movie-rating");
const overviewEl = document.getElementById("movie-overview");
const homeEl = document.getElementById("movie-homepage");
const imdbEl = document.getElementById("movie-imdb");
const backBtn = document.getElementById("back-btn");

// ---- Utils ----
function qs(name) {
  const params = new URLSearchParams(location.search);
  return params.get(name);
}
function headers() {
  return IS_V4 ? { Authorization: `Bearer ${TMDB_CREDENTIAL}` } : {};
}
function api(url) {
  const u = new URL(url);
  if (!IS_V4) u.searchParams.set("api_key", TMDB_CREDENTIAL);
  return u.toString();
}
function formatRuntime(mins) {
  if (!mins && mins !== 0) return "—";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
}
function year(dateStr) {
  return dateStr ? dateStr.slice(0, 4) : "—";
}

// ---- Render ----
function renderMovie(d) {
  const poster = d.poster_path ? IMG_BASE + d.poster_path : "../assets/placeholder.jpg";

  imgEl.src = poster;
  imgEl.alt = d.title || "Movie poster";

  titleEl.textContent = d.title || "Untitled";

  const y = year(d.release_date);
  const lang = (d.original_language || "").toUpperCase();
  metaEl.textContent = `${y} · ${lang}${d.release_date ? ` · ${d.release_date}` : ""}`;

  const genres = (d.genres || []).map(g => g.name).join(", ");
  genresEl.textContent = genres ? `Genres: ${genres}` : "";

  runtimeEl.textContent = `Runtime: ${formatRuntime(d.runtime)}`;

  const vote = typeof d.vote_average === "number" ? d.vote_average.toFixed(1) : "—";
  ratingEl.textContent = `Rating: ⭐ ${vote} (${d.vote_count ?? 0})`;

  overviewEl.textContent = d.overview || "No overview available.";

  if (d.homepage) {
    homeEl.href = d.homepage;
    homeEl.hidden = false;
  } else {
    homeEl.hidden = true;
  }

  // IMDb link se disponível (via external_ids)
  if (d.external_ids?.imdb_id) {
    imdbEl.href = `https://www.imdb.com/title/${d.external_ids.imdb_id}/`;
    imdbEl.hidden = false;
  } else {
    imdbEl.hidden = true;
  }
}

// ---- Load ----
async function load() {
  detailsEl.setAttribute("aria-busy", "true");
  const id = qs("id");
  if (!id) {
    detailsEl.innerHTML = "<p style='color:#f88'>Movie id em falta.</p>";
    return;
  }

  // apendamos external_ids para conseguir link IMDb sem 2º fetch
  const url = api(`${TMDB_BASE}/movie/${id}?language=en-US&append_to_response=external_ids`);

  try {
    const res = await fetch(url, { headers: headers() });
    if (!res.ok) {
      const t = await res.text();
      detailsEl.innerHTML = `<p style="color:#f88">Erro TMDb (HTTP ${res.status})</p>`;
      console.error("TMDb error:", t);
      return;
    }
    const data = await res.json();
    renderMovie(data);
  } catch (e) {
    detailsEl.innerHTML = `<p style="color:#f88">Falha de rede/CORS</p>`;
    console.error(e);
  } finally {
    detailsEl.setAttribute("aria-busy", "false");
  }
}

// ---- Events ----
backBtn.addEventListener("click", () => {
  history.length > 1 ? history.back() : (location.href = "./movies.html");
});

// ---- Init ----
load();
