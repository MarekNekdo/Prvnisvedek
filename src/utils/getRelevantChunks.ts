import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";
import { OpenAI } from "openai";

dotenv.config({ path: ".env.local" });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const embeddingsDir = path.join(__dirname, "..", "src", "data", "embeddings");
const outputPath = path.join(embeddingsDir, "vektorstore.json");
const indexPath = path.join(embeddingsDir, "index.json");

async function generateEmbeddings() {
  try {
    const indexData = await fs.readFile(indexPath, "utf-8");
    const files: string[] = JSON.parse(indexData);

    const embeddedChunks: {
      text: string;
      embedding: number[];
      file: string;
    }[] = [];

    for (const fileName of files) {
      const filePath = path.join(embeddingsDir, fileName);
      const fileContent = await fs.readFile(filePath, "utf-8");
      const json = JSON.parse(fileContent);

      const chunks =
        Array.isArray(json.sections) && json.sections.length > 0
          ? json.sections.map((s: any) => s.content)
          : [json.content];

      for (const chunk of chunks) {
        const embeddingResponse = await openai.embeddings.create({
          model: "text-embedding-3-small",
          input: chunk,
        });

        embeddedChunks.push({
          text: chunk,
          embedding: embeddingResponse.data[0].embedding,
          file: fileName,
        });

        console.log(`✅ Embedded chunk from ${fileName}`);
      }
    }

    await fs.writeFile(outputPath, JSON.stringify(embeddedChunks, null, 2), "utf-8");
    console.log("✅ Embedding generation complete.");
  } catch (error) {
    console.error("❌ Error generating embeddings:", error);
  }
}

generateEmbeddings();
