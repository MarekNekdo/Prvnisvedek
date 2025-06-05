import fs from "fs";
import path from "path";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

const VECTOR_PATH = path.join(process.cwd(), "src/data/embeddings/vectorstore.json");

// Kosinová podobnost (s typy)
function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum: number, ai: number, i: number) => sum + ai * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum: number, ai: number) => sum + ai * ai, 0));
  const normB = Math.sqrt(b.reduce((sum: number, bi: number) => sum + bi * bi, 0));
  return dotProduct / (normA * normB);
}

// Typy vektorového záznamu
interface VectorEntry {
  content: string;
  embedding: number[];
  metadata: {
    id: string;
    title: string;
    index: number;
    source: string;
    loc?: {
      lines: {
        from: number;
        to: number;
      };
    };
  };
}

export async function getRelevantSource(query: string, topK: number = 3): Promise<
  {
    title: string;
    source: string;
    score: number;
    content: string;
  }[]
> {
  const vectors: VectorEntry[] = JSON.parse(fs.readFileSync(VECTOR_PATH, "utf8"));
  const embedder = new OpenAIEmbeddings();
  const queryEmbedding = await embedder.embedQuery(query);

  const scored = vectors.map((item: VectorEntry) => ({
    ...item,
    score: cosineSimilarity(item.embedding, queryEmbedding),
  }));

  const sorted = scored.sort((a: VectorEntry & { score: number }, b: VectorEntry & { score: number }) => b.score - a.score).slice(0, topK);

  return sorted.map((item) => ({
    title: item.metadata.title,
    source: item.metadata.source,
    score: Math.round(item.score * 10000) / 10000,
    content: item.content,
  }));
}
