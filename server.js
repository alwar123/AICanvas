import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { HfInference } from "@huggingface/inference";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const hf = new HfInference(process.env.HF_TOKEN);

app.post("/generate", async (req, res) => {
  try {
    const { prompt, width = 512, height = 512 } = req.body;

    const image = await hf.textToImage({
      model: "stabilityai/sdxl-turbo",
      inputs: prompt,
      parameters: { width, height }
    });

    res.setHeader("Content-Type", "image/png");
    res.send(Buffer.from(await image.arrayBuffer()));

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("✅ Server running at http://localhost:3000");
});
