export const config = {
  api: {
    bodyParser: false,
  },
};

import formidable from "formidable";
import fs from "fs";
import { Readable } from "stream";

const openaiApiKey = process.env.OPENAI_API_KEY;

async function handler(req, res) {
  const form = new formidable.IncomingForm({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Form error" });

    const file = files.file;
    const stream = fs.createReadStream(file.filepath);

    const formData = new FormData();
    formData.append("file", stream, "audio.webm");
    formData.append("model", "whisper-1");

    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: Bearer ${openaiApiKey},
      },
      body: formData,
    });

    const data = await response.json();
    res.status(200).json(data);
  });
}

export default handler;
