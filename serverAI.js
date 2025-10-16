import OpenAI from "openai";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const PORT = process.env.PORT || 3001

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.post("/xi", async (req, res) => {
  const { txt } = req.body;
  const prompt = txt?.trim();

  if (!prompt) {
    return res.status(400).json({ error: "Missing input text" });
  }

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert coding assistant. Help with code fixes, explanations, and completions.",
        },
        { role: "user", content: prompt },
      ],
    });

    // ✅ Use a different variable name
    res.status(200).json({ reply: response.choices[0].message.content });
  } catch (err) {
    console.error("❌ Error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
