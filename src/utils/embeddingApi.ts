import index from "@/data/embeddings/index.json";

// Vrací všechna uložená embeddingová data
export async function getAllEmbeddings(): Promise<
  { text: string; embedding: number[] }[]
> {
  return index;
}
