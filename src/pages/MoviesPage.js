import MovieCard from '../components/MovieCard';

import React, { useState } from 'react';

const MoviesPage = () => {
    // ...
  
    return (
      <div className="movies-page">
        <h1>Movies</h1>
        <div className="movies-grid">
          {movies.slice(0, 10).map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    );
  };
  