// src/utils/saveVectorStore.ts

import fs from 'fs/promises';
import path from 'path';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';

const outputPath = path.join('public', 'embeddings', 'vectorstore.json');

export async function saveVectorStore(vectorStore: MemoryVectorStore) {
  const rawDocs = (vectorStore as any).docs;

  const serialized = rawDocs.map((doc: any) => ({
    pageContent: doc.pageContent,
    metadata: doc.metadata,
  }));

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(serialized, null, 2), 'utf-8');

  console.log(`🧠 Vektorový store úspěšně uložen do ${outputPath}`);
}
