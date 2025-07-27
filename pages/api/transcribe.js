import formidable from "formidable";
import fs from "fs";
import { Configuration, OpenAIApi } from "openai";

export const config = {
  api: {
    bodyParser: false,
  },
};

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Make sure this is set in Vercel
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing file:", err);
      return res.status(500).json({ error: "Error parsing the file" });
    }

    const file = files.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    try {
      const transcript = await openai.createTranscription(
        fs.createReadStream(file.filepath),
        "whisper-1"
      );

      res.status(200).json({ text: transcript.data.text });
    } catch (error) {
      console.error("Whisper error:", error.response?.data || error.message);
      res.status(500).json({ error: "Transcription failed" });
    }
  });
}
