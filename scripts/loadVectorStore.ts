import fs from 'fs/promises';
import path from 'path';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { Document } from 'langchain/document';

const EMBEDDING_PATH = path.join(process.cwd(), 'public', 'embeddings', 'vectorstore.json');

export async function loadVectorStoreFromJSON(): Promise<MemoryVectorStore> {
  const raw = await fs.readFile(EMBEDDING_PATH, 'utf8');
  const parsed = JSON.parse(raw);

  const docs = parsed.documents.map(
    (doc: { pageContent: string; metadata: Record<string, any> }) =>
      new Document({ pageContent: doc.pageContent, metadata: doc.metadata })
  );

  const store = await MemoryVectorStore.fromDocuments(
    docs,
    new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY! })
  );

  return store;
}
