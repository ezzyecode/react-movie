import React, { useState } from "react";
import { addMovie, fetchMovieFromTMDB } from "../api/moviesAPI";

function AddMovieForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tmdbId, setTmdbId] = useState("");

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    const newMovie = { title, description };
    await addMovie(newMovie);
    setTitle("");
    setDescription("");
  };

  const genresToTags = (genres, movie) => {
    const genreNames = genres.map((genre) => genre.name);
    const releaseYear = parseInt(movie.release_date.split('-')[0]);
    const thaiReleaseYear = releaseYear + 543;
    const titleWithYear = `${movie.title} ${releaseYear}`;
    const originalTitleWithYear = `${movie.original_title} ${releaseYear}`;
    const titleWithThaiYear = `${movie.title} ${thaiReleaseYear}`;
    const originalTitleWithThaiYear = `${movie.original_title} ${thaiReleaseYear}`;
    const tags = [
      movie.title,
      movie.original_title,
      titleWithYear,
      originalTitleWithYear,
      titleWithThaiYear,
      originalTitleWithThaiYear,
      ...genreNames,
    ];
    return tags.join(', ');
  };
  
  const handleTmdbSubmit = async (e) => {
    e.preventDefault();
    const tmdbMovie = await fetchMovieFromTMDB(tmdbId);
    const newMovie = {
      tmdb_id: tmdbMovie.id,
      imdb_id: tmdbMovie.imdb_id,
      title: tmdbMovie.title,
      original_title: tmdbMovie.original_title,
      description: tmdbMovie.overview,
      release_date: tmdbMovie.release_date,
      duration: tmdbMovie.runtime,
      poster_url: `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}`,
      backdrop_url: `https://image.tmdb.org/t/p/w500${tmdbMovie.backdrop_path}`,
      trailer_url: '', // You need to fetch the trailer URL separately.
      tags: genresToTags(tmdbMovie.genres, tmdbMovie),
      genres: tmdbMovie.genres,
    };
    await addMovie(newMovie);
    setTmdbId('');
  };

  return (
    <>
      {/* Form to add movie manually */}
      <form onSubmit={handleManualSubmit}>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Add Movie Manually</button>
      </form>

      {/* Form to add movie from TMDB */}
      <form onSubmit={handleTmdbSubmit}>
        <label htmlFor="tmdbId">TMDB ID:</label>
        <input
          type="text"
          id="tmdbId"
          value={tmdbId}
          onChange={(e) => setTmdbId(e.target.value)}
        />
        <button type="submit">Add Movie from TMDB</button>
      </form>
    </>
  );
}

export default AddMovieForm;
