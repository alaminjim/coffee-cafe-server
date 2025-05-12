const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("coffee cafe on the way to make");
});

app.listen(port, () => {
  console.log(`coffee cafe server running  on port ${port}`);
});
