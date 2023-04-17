import React, { useState, useEffect } from "react";
import MovieCard from "./MovieCard";
import { fetchMovies } from "../api/moviesAPI";

function MoviesList() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await fetchMovies();
      setMovies(data);
    })();
  }, []);

  return (
    <div className="container mx-auto px-4 pt-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

export default MoviesList;
