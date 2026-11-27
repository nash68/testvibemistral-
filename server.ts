import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { Mistral } from "@mistralai/mistralai";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT ?? 3000);
const MODEL = "mistral-small-latest";

if (!process.env.MISTRAL_API_KEY) {
  console.error("MISTRAL_API_KEY manquante. Lancez : export MISTRAL_API_KEY=...");
  process.exit(1);
}

const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/chat", async (req, res) => {
  const messages = req.body?.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: "Le champ 'messages' est requis." });
    return;
  }

  const sanitized = messages
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-20)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));

  try {
    const response = await client.chat.complete({
      model: MODEL,
      messages: sanitized,
    });
    const content = response.choices?.[0]?.message?.content ?? "";
    res.json({ content });
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: "Appel à l'API Mistral échoué." });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT} (modèle : ${MODEL})`);
});
