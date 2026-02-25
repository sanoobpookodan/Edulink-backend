import app from "./src/app.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  const url =
    process.env.NODE_ENV === "production"
      ? `https://yourdomain.com`
      : `http://localhost:${PORT}`;

  console.log(`Server running at ${url}`);
});
