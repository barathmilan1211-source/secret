const express = require("express");
const bcrypt = require("bcrypt");
const rateLimit = require("express-rate-limit");
const path = require("path");

const app = express();
app.use(express.json());

// ===========================
// BRUTE FORCE VÉDELEM
// ===========================
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: "Túl sok próbálkozás. Várj 1 percet!"
});
app.use("/login", limiter);

// ===========================
// HASH-ELT JELSZÓ
// ===========================
const storedHash = "$2b$10$gJDnzH5HNNm7JxH2AVpRaeHqof7qpnvfAF20jLfVReLnv1Sxtdyzi";

// ===========================
// FŐOLDAL → LOGIN OLDAL
// ===========================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "protected.html"));
});

// ===========================
// LOGIN API
// ===========================
app.post("/login", async (req, res) => {
  const { password } = req.body;

  const ok = await bcrypt.compare(password, storedHash);
  if (!ok) return res.json({ success: false });

  res.json({ success: true });
});

// ===========================
// VÉDETT TARTALOM
// ===========================
app.get("/protected", (req, res) => {
  res.sendFile(path.join(__dirname, "protected.html"));
});

// ===========================
// INDÍTÁS
// ===========================
app.listen(3000, () => {
  console.log("Fut: http://localhost:3000");
});
