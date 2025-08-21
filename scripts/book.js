// book.js
const params = new URLSearchParams(window.location.search);
const bookId = params.get("id");

const img = document.getElementById("book-image");
const title = document.getElementById("book-title");
const authors = document.getElementById("book-authors");
const published = document.getElementById("book-date");
const description = document.getElementById("book-description");

if (!bookId) {
  document.querySelector(".container").innerHTML = "<p>Book ID not found.</p>";
} else {
  fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`)
    .then(res => res.json())
    .then(data => {
      const info = data.volumeInfo;
      img.src = info.imageLinks?.thumbnail || "";
      img.alt = info.title;
      title.textContent = info.title || "No title";
      authors.textContent = info.authors?.join(", ") || "Unknown author";
      published.textContent = info.publishedDate || "N/A";
      description.textContent = info.description || "No description available.";
    })
    .catch(err => {
      document.querySelector(".container").innerHTML = "<p>Failed to load book details.</p>";
      console.error(err);
    });
}
