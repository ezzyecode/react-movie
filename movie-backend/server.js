const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "movie_db",
});

app.get("/movies", async (req, res) => {
  try {
    const [results] = await pool.query("SELECT * FROM movies");
    res.json(results);
  } catch (err) {
    console.error("Error retrieving movies:", err);
    res.status(500).send("Error retrieving movies");
  }
});

const getMovieById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM movies WHERE id = ?", [id]);
  if (rows.length > 0) {
    return rows[0];
  } else {
    throw new Error("Movie not found");
  }
};

app.get("/movies/:id", async (req, res) => {
  const movieId = req.params.id;
  try {
    const movie = await getMovieById(movieId);
    res.json(movie);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the movie." });
  }
});

const getMoviePlayersById = async (movieId) => {
  const [rows] = await pool.query(
    "SELECT * FROM movie_players WHERE movie_id = ?",
    [movieId]
  );
  return rows;
};

app.get("/movies/:id/players", async (req, res) => {
  const movieId = req.params.id;
  try {
    const moviePlayers = await getMoviePlayersById(movieId);
    res.json(moviePlayers);
  } catch (error) {
    console.error("Error retrieving movie players:", error);
    res.status(500).send("Error retrieving movie players");
  }
});

app.post("/movies", async (req, res) => {
  try {
    const {
      tmdb_id,
      imdb_id,
      title,
      original_title,
      description,
      release_date,
      duration,
      poster_url,
      backdrop_url,
      trailer_url,
      tags,
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO movies (tmdb_id, imdb_id, title, original_title, description, release_date, duration, poster_url, backdrop_url, trailer_url, tags)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        tmdb_id,
        imdb_id,
        title,
        original_title,
        description,
        release_date,
        duration,
        poster_url,
        backdrop_url,
        trailer_url,
        tags,
      ]
    );

    const ensureGenreExists = async (genre) => {
      const [rows] = await pool.query("SELECT id FROM genres WHERE id = ?", [
        genre.id,
      ]);

      if (rows.length === 0) {
        await pool.query("INSERT INTO genres (id, name) VALUES (?, ?)", [
          genre.id,
          genre.name,
        ]);
      }
    };

    const addMovieGenres = async (movieId, genres) => {
      if (!Array.isArray(genres)) {
        console.error(
          "Error: genres is not iterable, using an empty array instead"
        );
        genres = [];
      }

      const sql = "INSERT INTO movie_genres (movie_id, genre_id) VALUES (?, ?)";
      for (const genre of genres) {
        await ensureGenreExists(genre);
        await pool.query(sql, [movieId, genre.id]);
      }
    };

    res.json({ status: "success", data: { id: result.insertId } });

    // เพิ่มข้อมูลประเภทหนังลงในตาราง movie_genres
    await addMovieGenres(result.insertId, req.body.genres);
  } catch (error) {
    console.error("Error while adding movie:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

const formatDateForMySQL = (dateString) => {
  return new Date(dateString).toISOString().slice(0, 10);
};

app.put("/movies/:movieId", async (req, res) => {
  const movieId = req.params.movieId;
  const updatedMovie = req.body;

  try {
    const formattedReleaseDate = formatDateForMySQL(updatedMovie.release_date);

    await pool.query(
      `UPDATE movies SET title = ?, original_title = ?, description = ?, release_date = ?, duration = ? WHERE id = ?`,
      [
        updatedMovie.title,
        updatedMovie.original_title,
        updatedMovie.description,
        formattedReleaseDate,
        updatedMovie.duration,
        movieId,
      ]
    );

    res.status(200).json({ message: "Movie updated successfully" });
  } catch (error) {
    console.error("Error while updating movie:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.put("/movies/:movieId/players/:playerId", async (req, res) => {
  const movieId = req.params.movieId;
  const playerId = req.params.playerId;
  const updatedPlayer = req.body;

  try {
    await pool.query(
      "UPDATE movie_players SET player_name = ?, player_url = ?, quality = ? WHERE movie_id = ? AND id = ?",
      [
        updatedPlayer.player_name,
        updatedPlayer.player_url,
        updatedPlayer.quality,
        movieId,
        playerId,
      ]
    );

    res.status(200).json({ message: "Movie player updated successfully" });
  } catch (error) {
    console.error("Error updating movie player:", error);
    res.status(500).json({ message: "Error updating movie player" });
  }
});

app.listen(4000, () => {
  console.log("Backend server is running on http://localhost:4000");
});
