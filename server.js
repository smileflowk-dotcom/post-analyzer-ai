import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// servir les fichiers du dossier public
app.use(express.static(path.join(__dirname, "public")));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// route analyse
app.post("/analyze", async (req, res) => {

  try {

    const { post } = req.body;

    const completion = await openai.chat.completions.create({

      model: "gpt-4.1-mini",

      messages: [
        {
          role: "system",
          content:
            "Analyse ce post pour les réseaux sociaux. Donne un score sur 10, explique pourquoi et propose une version améliorée."
        },
        {
          role: "user",
          content: post
        }
      ]

    });

    res.json({
      result: completion.choices[0].message.content
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Erreur analyse IA"
    });

  }

});

// fallback vers index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// IMPORTANT pour Railway
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});