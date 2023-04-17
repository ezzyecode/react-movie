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
          console.error("Error: genres is not iterable, using an empty array instead");
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

app.listen(4000, () => {
  console.log("Backend server is running on http://localhost:4000");
});
