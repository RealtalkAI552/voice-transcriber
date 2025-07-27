import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Parsing error' });

    const filePath = files.audio[0].filepath;

    const data = new FormData();
    data.append('file', fs.createReadStream(filePath));
    data.append('model', 'whisper-1');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: Bearer ${process.env.OPENAI_API_KEY}
      },
      body: data
    });

    const json = await response.json();
    res.status(200).json({ text: json.text });
  });
}
