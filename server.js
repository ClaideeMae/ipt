const express = require("express")
const app = express();
const PORT = 5000;
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(express.json());


app.use("/api/user", require("./routes/userRoutes"));


app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`)
})