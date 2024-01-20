const { Client } = require("pg");

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "app-avaliacao",
  password: "13102002",
  port: 5432,
});
client.connect();
