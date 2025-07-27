export const config = {
  api: {
    bodyParser: false,
  },
};

import { Readable } from "stream";
import formidable from "formidable";
import { createReadStream } from "fs";
import fs from "fs/promises";

const openaiApiKey = process.env.OPENAI_API_KEY;

const handler = async (req, res) => {
  const form = new formidable.IncomingForm({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Error parsing form data." });
    }

    const filePath = files.file.filepath;

    const fileStream = createReadStream(filePath);

    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: Bearer ${openaiApiKey},
      },
      body: (() => {
        const formData = new FormData();
        formData.append("file", fileStream, "audio.webm");
        formData.append("model", "whisper-1");
        return formData;
      })(),
    });

    const result = await response.json();
    res.status(200).json(result);
  });
};

export default handler;
