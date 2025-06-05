import fs from "fs";
import path from "path";

export async function getRelevantChunks(question: string) {
  const folderPath = path.join(process.cwd(), "src/data/embeddings");
  const files = fs.readdirSync(folderPath).filter(file => file.endsWith(".json"));

  let allText = "";

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const rawData = fs.readFileSync(filePath, "utf-8");
    const json = JSON.parse(rawData);

    if (json.sections) {
      for (const section of json.sections) {
        allText += `${section.title}\n${section.content}\n\n`;
      }
    } else if (json.text) {
      allText += `${json.text}\n\n`;
    }
  }

  return allText;
}
