import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { supabase } from "./supabase.js";

dotenv.config();

const app = express();
app.use(express.json());

// Servir archivos estáticos
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "../Public")));

// Registrar email en Supabase
app.post("/api/register", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({ ok: false, error: "Email is required" });
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.json({ ok: false, error: "Invalid email format" });
  }

  // Insertar en Supabase
  const { error } = await supabase
    .from("users")
    .insert({ email });

  // Si el email ya existe (constraint unique), lo consideramos éxito
  if (error) {
    if (error.code === "23505") {
      // Email duplicado - lo consideramos éxito para no revelar info
      return res.json({ ok: true });
    }

    console.error("Supabase error:", error);
    return res.json({ ok: false, error: "An error occurred. Please try again." });
  }

  res.json({ ok: true });
});

// Health check (útil para monitoreo)
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});