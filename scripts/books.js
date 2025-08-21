const container = document.getElementById("books-container");
const limitSelector = document.getElementById("book-limit");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");

let startIndex = 0;
let limit = parseInt(limitSelector.value);
let currentQuery = "technology"; // valor inicial

// Fetch livros com base no termo atual
function fetchBooks(query = currentQuery) {
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&startIndex=${startIndex}&maxResults=${limit}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      renderBooks(data.items || []);
      prevBtn.disabled = startIndex === 0;
      nextBtn.disabled = data.totalItems <= startIndex + limit;
    })
    .catch(err => {
      container.innerHTML = "<p>Failed to load books.</p>";
      console.error(err);
    });
}

// Renderiza os livros
function renderBooks(books) {
  container.innerHTML = "";

  books.forEach(book => {
    const info = book.volumeInfo;
    const title = info.title || "No title";
    const authors = info.authors?.join(", ") || "Unknown author";
    const thumbnail = info.imageLinks?.thumbnail || "";
    const published = info.publishedDate || "N/A";

    const card = document.createElement("div");
    card.className = "book-card";
    card.innerHTML = `
      <img src="${thumbnail}" alt="${title}">
      <h3>${title}</h3>
      <p><strong>Author(s):</strong> ${authors}</p>
      <p><strong>Published:</strong> ${published}</p>
    `;
    card.addEventListener("click", () => {
      window.location.href = `book.html?id=${book.id}`;
    });
    container.appendChild(card);
  });
}

// 🔍 Evento de pesquisa
searchBtn.addEventListener("click", () => {
  const input = searchInput.value.trim();
  if (input) {
    currentQuery = input;
    startIndex = 0;
    fetchBooks(currentQuery);
  }
});

// 🔁 Alterar limite
limitSelector.addEventListener("change", () => {
  limit = parseInt(limitSelector.value);
  startIndex = 0;
  fetchBooks();
});

// ⏪ Botão anterior
prevBtn.addEventListener("click", () => {
  if (startIndex >= limit) {
    startIndex -= limit;
    fetchBooks();
  }
});

// ⏩ Botão seguinte
nextBtn.addEventListener("click", () => {
  startIndex += limit;
  fetchBooks();
});

// Carregamento inicial
fetchBooks();
