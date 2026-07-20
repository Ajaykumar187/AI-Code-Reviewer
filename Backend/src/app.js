const express = require("express");
const cors = require("cors");
const path = require("path");

const aiRoutes = require("./routes/ai.routes");

const app = express();

app.use(cors());

app.use(express.json());

// API Routes
app.use("/ai", aiRoutes);

// Production: Serve React build
app.use(express.static(path.join(__dirname, "../../Frontend/dist")));

app.get("*", (req, res) => {
    res.sendFile(
        path.join(__dirname, "../../Frontend/dist/index.html")
    );
});

module.exports = app;