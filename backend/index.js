import express from "express";
import cors from "cors";

const app = express();
app.use(express.json()); // Allow JSON requests
app.use(cors()); // Allow requests from React

// Dummy search endpoint
app.post("/api/search", (req, res) => {
  console.log("Received search:", req.body);
  res.json({ message: "Search received", data: req.body });
});

app.listen(8080, () => {
  console.log("Server running on http://localhost:8080");
});
