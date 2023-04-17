const API_BASE_URL = 'http://localhost:4000';
const TMDB_API_KEY = '85fc3a4b9e489afc1b762f7b3c66e8c9';

export async function fetchMovies() {
  const response = await fetch(`${API_BASE_URL}/movies`);
  const data = await response.json();
  return data;
}

export async function fetchMovieFromTMDB(movieId) {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&language=th-TH`
    );
    const data = await response.json();
    return data;
  }

export async function addMovie(movie) {
  const response = await fetch(`${API_BASE_URL}/movies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(movie),
  });
  const data = await response.json();
  return data;
}
