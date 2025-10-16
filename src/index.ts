import express from "express";

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/hello", (_req, res) => {
  res.send("Hello from TypeScript + Express 👋");
});

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});