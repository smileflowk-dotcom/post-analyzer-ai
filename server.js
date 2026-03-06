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
const publicDir = path.join(__dirname, "public");

app.use(express.static(publicDir));

app.get("/health", (req, res) => {
  res.status(200).send("ok");
});

app.post("/analyze", async (req, res) => {
  try {
    const { post } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "OPENAI_API_KEY manquante dans Railway"
      });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

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
    console.error("Erreur /analyze :", error);
    res.status(500).json({
      error: "Erreur analyse IA"
    });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

const PORT = Number(process.env.PORT) || 8080;
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});