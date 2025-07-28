export const config = {
  api: {
    bodyParser: false,
  },
};

import formidable from 'formidable';
import fs from 'fs';

const handler = async (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    const audio = fs.createReadStream(files.file.filepath);

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: Bearer ${process.env.OPENAI_API_KEY},
      },
      body: (() => {
        const data = new FormData();
        data.append('file', audio);
        data.append('model', 'whisper-1');
        return data;
      })(),
    });

    const data = await response.json();
    res.status(200).json({ text: data.text });
  });
};

export default handler;
