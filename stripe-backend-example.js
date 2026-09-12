
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Feed Me backend is alive!");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Test server running on port ${PORT}`));
