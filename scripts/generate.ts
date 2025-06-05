// scripts/generate.ts
import fs from "fs";
import path from "path";
import { config } from "dotenv";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { Document } from "langchain/document";
import { glob } from "glob";

config();

const dataDir = path.join(__dirname, "../src/data/embeddings");
const outputPath = path.join(dataDir, "vectorstore.json");

function splitText(text: string, chunkSize = 1500): string[] {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
}

async function loadAllJsonSections(): Promise<Document[]> {
  const documents: Document[] = [];
  const files = await glob(`${dataDir}/*.json`);

  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    const json = JSON.parse(content);
    const sourceName = path.basename(file, ".json");
    const sections = json.sections || [];

    if (sections.length > 0) {
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const fullText = `${section.title}\n\n${section.content}`;
        const chunks = splitText(fullText, 1500);

        chunks.forEach((chunk, j) => {
          documents.push(
            new Document({
              pageContent: chunk,
              metadata: {
                id: `${sourceName}-${i + 1}-${j + 1}`,
                title: section.title,
                index: i + 1,
                source: sourceName,
                loc: {
                  lines: {
                    from: j * 1500 + 1,
                    to: (j + 1) * 1500,
                  },
                },
              },
            })
          );
        });
      }
    } else if (json.content) {
      const chunks = splitText(json.content, 1500);
      chunks.forEach((chunk, j) => {
        documents.push(
          new Document({
            pageContent: chunk,
            metadata: {
              id: `${sourceName}-0-${j + 1}`,
              title: json.title || "Bez názvu",
              index: 0,
              source: sourceName,
              loc: {
                lines: {
                  from: j * 1500 + 1,
                  to: (j + 1) * 1500,
                },
              },
            },
          })
        );
      });
    }
  }

  return documents;
}

async function generate() {
  const docs = await loadAllJsonSections();
  console.log(`📄 Načteno ${docs.length} dokumentů`);

  const embedder = new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY });
  const vectors = [];

  for (const doc of docs) {
    const embedding = await embedder.embedQuery(doc.pageContent);
    vectors.push({
      content: doc.pageContent,
      embedding,
      metadata: doc.metadata,
    });
  }

  fs.writeFileSync(outputPath, JSON.stringify(vectors, null, 2), "utf8");
  console.log(`✅ Embeddingy uloženy do: ${outputPath}`);
}

generate().catch((err) => {
  console.error("❌ Chyba při generování embeddingů:", err);
});
