// /api/proxy.js
export default async function handler(req, res) {
  const { s, ...rest } = req.query; // s = books | games | movies
  let url;

  if (s === "books") {
    const { q } = rest;
    const base = "https://www.googleapis.com/books/v1/volumes";
    const key = process.env.GOOGLE_BOOKS_KEY ? `&key=${process.env.GOOGLE_BOOKS_KEY}` : "";
    url = `${base}?q=${encodeURIComponent(q)}&maxResults=20${key}`;
  } else if (s === "games") {
    const { search, page } = rest;
    const base = "https://api.rawg.io/api/games";
    const qs = `${search ? `&search=${encodeURIComponent(search)}` : ""}${page ? `&page=${page}` : ""}`;
    url = `${base}?key=${process.env.RAWG_KEY}${qs}`;
  } else if (s === "movies") {
    const { query, page } = rest;
    const base = "https://api.themoviedb.org/3/search/movie";
    url = `${base}?api_key=${process.env.TMDB_KEY}&query=${encodeURIComponent(query)}${page ? `&page=${page}` : ""}`;
  } else {
    return res.status(400).json({ error: "service_invalid" });
  }

  try {
    const r = await fetch(url);
    const data = await r.json();
    return res.status(r.status).json(data);
  } catch {
    return res.status(500).json({ error: "server_error" });
  }
}
