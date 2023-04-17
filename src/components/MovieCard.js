import React from "react";

const MovieCard = ({ movie }) => {
  const releaseYear = new Date(movie.release_date).getFullYear();

  return (
    <div className="antialiased rounded-lg overflow-hidden shadow-lg">
      <img
        src={movie.poster_url}
        alt={movie.title}
        className="w-full object-cover" 
      />

      <div className="info">
          <p className="tille">{movie.title}</p>
        <div className="year">
          <span>{releaseYear}</span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;