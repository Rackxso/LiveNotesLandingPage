import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { supabase } from "./supabase.js";

dotenv.config();

const app = express();
app.use(express.json());

// Static files
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "../public")));

// API routes
app.post("/api/register", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({ ok: false, error: "Email missing" });
  }

  const { error } = await supabase
    .from("users")
    .insert({ email });

  if (error && error.code !== "23505") {
    console.error("Supabase error:", error);
    return res.json({ ok: false });
  }

  res.json({ ok: true });
});

// Fallback: sirve index.html para cualquier ruta no manejada
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Export para Vercel
export default app;