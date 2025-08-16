require("dotenv").config();
const express = require("express");
const app = express();
const { createUserTable } = require("./models/auth-model");

createUserTable()
  .then(() => console.log("Table user has been created"))
  .catch((error) => console.log(error));

app.use(express.json());

app.use("/api/auth", require("./routes/auth-route"));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Server Running");
});
