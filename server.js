const express = require("express");
const app = express();

// Set the server to listen to 3000
app.listen(3000);

app.use("/", express.static("public"));
