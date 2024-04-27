const express = require("express");
require("dotenv").config();
const port = process.env.PORT || 5000;
const cors = require("cors");
// Init Express
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

app.get("/sadi", (req, res) => {
  res.send("Hello Im From Sadi Route");
});

// Listen Server
app.listen(port, () => {
  console.log(`Server is Running On PORT ${port}`);
});
