import fs from 'fs/promises';
import path from 'path';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { Document } from 'langchain/document';

export async function loadVectorStoreFromJSON(filePath = 'public/vectorstore.json') {
  const fullPath = path.resolve(filePath);
  const data = await fs.readFile(fullPath, 'utf-8');
  const parsed = JSON.parse(data);

  const docs: Document[] = [];
  const vectors: number[][] = [];

  for (const item of parsed) {
    docs.push(new Document({ pageContent: item.pageContent, metadata: item.metadata || {} }));
    vectors.push(item.embedding);
  }

  const store = new MemoryVectorStore(new OpenAIEmbeddings());
  await store.addVectors(vectors, docs);

  console.log('✅ Vector store loaded from JSON');
  return store;
}
