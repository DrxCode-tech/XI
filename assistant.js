import readline from "readline";
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "You: "
});

console.log("🤖 Code Assistant ready! Type your question below...");
rl.prompt();

rl.on("line", async (line) => {
  const prompt = line.trim();
  if (prompt.toLowerCase() === "exit") {
    console.log("👋 Goodbye!");
    rl.close();
    return;
  }

  try {
    const res = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an expert coding assistant. Help with code fixes, explanations, and completions." },
        { role: "user", content: prompt }
      ]
    });

    console.log("\nAssistant:", res.choices[0].message.content, "\n");
  } catch (err) {
    console.error("❌ Error:", err.message);
  }

  rl.prompt();
});