const express = require("express");
const server = express();
const port = 3001;
const cors = require("cors");
const http = require("http").Server(server);
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:5173", // Atualize para a origem do seu cliente React
    methods: ["GET", "POST"],
  },
});

server.use(express.json());
server.use(cors());

const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

server.post("/add-avaliacao", async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const client = await pool.connect();

    const result = await client.query(
      "INSERT INTO ratings(rating, comment) VALUES ($1, $2) RETURNING *",
      [rating, comment]
    );

    const newAvaliacao = result.rows[0];

    // Emitir o evento para todos os clientes conectados
    io.emit("nova-avaliacao", newAvaliacao);

    res.status(201).json(newAvaliacao); // Retorna os dados inseridos
  } catch (error) {
    console.error("Erro ao adicionar avaliação:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

server.get("/avaliacoes", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM ratings");
    res.status(200).json(result.rows); // Retorna os dados
  } catch (error) {
    console.error("Erro ao listar as avaliações:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

http.listen(port, () => {
  console.log("Server is running in port " + port);
});
