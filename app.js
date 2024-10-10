// Variables globales
const apiKey = "f0caf7cc"; // Clé API pour OMDb
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const moviesContainer = document.getElementById("moviesContainer");

// Gestionnaire de soumission du formulaire
searchForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (query) {
    await searchMovies(query);
  }
});

// Fonction pour rechercher les films dans l'API OMDb
async function searchMovies(query) {
  const url = `http://www.omdbapi.com/?s=${query}&apikey=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.Search && data.Search.length > 0) {
    displayMovies(data.Search);
  } else {
    moviesContainer.innerHTML = `<p>Aucun film trouvé pour "${query}"</p>`;
  }
}

let observer;

// Fonction pour afficher les films
function displayMovies(movies) {
  moviesContainer.innerHTML = "";

  // Création de l'observateur
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const movieCard = entry.target;
          movieCard.classList.add("active"); // Ajoute la classe active pour l'effet de fade-in
          observer.unobserve(movieCard); // Arrête d'observer après l'animation
        }
      });
    },
    { threshold: 0.1 }
  ); // Déclenche l'effet lorsque 10% de l'élément est visible

  movies.forEach((movie) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card", "col-md-4");
    movieCard.innerHTML = `
            <div class="card">
                <img class="card-img-top" src="${
                  movie.Poster !== "N/A" ? movie.Poster : "placeholder.jpg"
                }" alt="${movie.Title}">
                <div class="card-body">
                    <h5 class="card-title">${movie.Title}</h5>
                    <p class="card-text">Date de sortie: ${movie.Year}</p>
                    <button class="btn btn-primary" onclick="showMovieDetails('${
                      movie.imdbID
                    }')">Read More</button>
                </div>
            </div>
        `;
    moviesContainer.appendChild(movieCard);

    // Commence à observer l'élément pour l'effet de fade-in
    observer.observe(movieCard);
  });
}

async function showMovieDetails(movieId) {
  const url = `http://www.omdbapi.com/?i=${movieId}&apikey=${apiKey}`;

  const response = await fetch(url);
  const movie = await response.json();

  // Remplis la modal avec les détails du film
  if (movie.Response === "True") {
    document.getElementById("modalTitle").innerText = movie.Title;
    document.getElementById("modalImage").src = movie.Poster;
    document.getElementById("modalDescription").innerText = movie.Plot;
    document.getElementById(
      "modalReleaseDate"
    ).innerText = `Date de sortie: ${movie.Released}`;

    // Ouvre la modal
    $("#movieModal").modal("show");
  } else {
    console.error("Erreur:", movie.Error);
  }
}
