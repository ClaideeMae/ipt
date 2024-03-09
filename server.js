const express = require("express");
const app = express();
const port = 5000;

app.use(express.json())

app.use("/api/user", require("./routes/userRoutes"))

app.listen(port, (req, res) => {
    console.log(`http://localhost:${port}`)
})