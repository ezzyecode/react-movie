import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Form, Input, Button, DatePicker, Space, Select } from "antd";
import moment from "moment";

const { TextArea } = Input;
const { Option } = Select;

const playerNames = ["PLAYER1", "PLAYER2", "PLAYER3"];
const qualities = ["HD", "SD", "ZOOM", "SUB", "NEW", "Trend", "Upcoming"];

const MovieEditPage = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [moviePlayers, setMoviePlayers] = useState([]);

  const fetchMovieById = async (id) => {
    // ใช้ API หรือฐานข้อมูลของคุณเพื่อดึงข้อมูลหนังตาม movieId
    // ตัวอย่างเชื่อมต่อกับ API
    const response = await fetch(`http://localhost:4000/movies/${id}`);
    const data = await response.json();
    return data;
  };

  const fetchMoviePlayers = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:4000/movies/${id}/players`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching movie players:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchMovieById(movieId).then((data) => setMovie(data));
    fetchMoviePlayers(movieId).then((data) => setMoviePlayers(data));
  }, [movieId]);

  const handleChange = (name, value) => {
    setMovie({ ...movie, [name]: value });
  };

  const handlePlayerChange = (index, field, value) => {
    const updatedPlayers = [...moviePlayers];
    updatedPlayers[index][field] = value;
    setMoviePlayers(updatedPlayers);
  };

  const saveChanges = async () => {
    try {
      // บันทึกข้อมูลหนัง
      await fetch(`http://localhost:4000/movies/${movieId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(movie),
      });

      // บันทึกข้อมูล movie_players
      for (const [index, player] of moviePlayers.entries()) {
        await fetch(
          `http://localhost:4000/movies/${movieId}/players/${index}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(player),
          }
        );
      }

      console.log("Save Changes: success");
    } catch (error) {
      console.error("Save Changes: failed", error);
    }
  };

  if (!movie || !moviePlayers) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Edit Movie</h1>
      <Form
        layout="vertical"
        initialValues={{
          title: movie.title,
          original_title: movie.original_title,
          description: movie.description,
          release_date: moment(movie.release_date),
          duration: movie.duration,
          player_name: moviePlayers.player_name,
          player_url: moviePlayers.player_url,
          quality: moviePlayers.quality,
        }}
      >
        <Form.Item label="Title" name="title">
          <Input
            value={movie.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Original Title" name="original_title">
          <Input
            value={movie.original_title}
            onChange={(e) => handleChange("original_title", e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <TextArea
            value={movie.description}
            rows={4}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Release Date" name="release_date">
          <DatePicker
            value={movie.release_date}
            format="DD-MM-YYYY"
            onChange={(date) =>
              handleChange(
                "release_date",
                date ? date.format("DD-MM-YYYY") : ""
              )
            }
          />
        </Form.Item>
        <Form.Item label="Duration" name="duration">
          <Input 
          value={movie.duration}
          onChange={(e) => handleChange("duration", e.target.value)} />
        </Form.Item>
      </Form>

      <h2>Movie Players</h2>
      {moviePlayers.map((player, index) => (
        <div key={index}>
          <Form
            layout="vertical"
            initialValues={{
              [`name-${index}`]: player.player_name,
              [`url-${index}`]: player.player_url,
              quality: player.quality,
            }}
          >
            <Form.Item
              label={`Player Name (${index + 1})`}
              name={`name-${index}`}
            >
              <Select
                value={player.player_name}
                onChange={(value) =>
                  handlePlayerChange(index, "player_name", value)
                }
              >
                {playerNames.map((name) => (
                  <Option key={name} value={name}>
                    {name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            {/* ... */}
            <Form.Item label="Quality" name="quality">
            <Select
                value={player.player_name}
                onChange={(value) =>
                  handlePlayerChange(index, "quality", value)
                }
              >
                {qualities.map((quality) => (
                  <Option key={quality} value={quality}>
                    {quality}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label={`Player Url (${index + 1})`}
              name={`url-${index}`}
            >
              <Input
              value={player.player_url}
                onChange={(e) =>
                  handlePlayerChange(index, "player_url", e.target.value)
                }
              />
            </Form.Item>
          </Form>
        </div>
      ))}
      <Space>
        <Button type="primary" onClick={saveChanges}>
          Save Changes
        </Button>
        <Button type="default" onClick={() => console.log("Cancel")}>
          Cancel
        </Button>
      </Space>
    </div>
  );
};
export default MovieEditPage;
