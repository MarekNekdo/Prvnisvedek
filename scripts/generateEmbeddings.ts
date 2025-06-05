import fs from 'fs/promises';
import path from 'path';
import 'dotenv/config';
import { OpenAI } from 'openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Document } from 'langchain/document';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { saveVectorStore } from './saveVectorStore';



const indexPath = path.join('src', 'data', 'embeddings', 'index.json');
const dataDir = path.join('src', 'data', 'embeddings');
const outputPath = path.join('public', 'embeddings', 'vectorstore.json');

async function generateEmbeddings() {
  try {
    const indexContent = await fs.readFile(indexPath, 'utf-8');
    const fileList: string[] = JSON.parse(indexContent);

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1500,
      chunkOverlap: 100,
    });

    const allChunks: Document[] = [];

    for (const fileName of fileList) {
      const filePath = path.join(dataDir, fileName);
      try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const json = JSON.parse(fileContent);
        const sections = json.sections || [];

        for (const section of sections) {
          const chunks = await splitter.createDocuments([section.content], [
            { key: 'source', value: fileName },
            { key: 'section', value: section.title || '' },
          ]);
          allChunks.push(...chunks);
          console.log(`✅ Embedded chunk from ${fileName}`);
        }
      } catch (err) {
        console.error(`❌ Error reading or processing ${fileName}:`, err);
      }
    }

    const vectorStore = await MemoryVectorStore.fromDocuments(
      allChunks,
      new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY! })
    );

    await saveVectorStore(vectorStore);
    console.log(`✅ Vectorstore saved to ${outputPath}`);
  } catch (err) {
    console.error('❌ Error generating embeddings:', err);
  }
}

generateEmbeddings();
