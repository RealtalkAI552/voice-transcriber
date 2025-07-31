export const config = {
  api: {
    bodyParser: false,
 },
};

import formidable from 'formidable';
import fs from 'fs';

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new formidable.IncomingForm({ multiples: false });
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Form parsing error:', err);
      return res.status(500).json({ error: 'Form parsing failed' });
    }
    
    const file = files.file;
    const fileStream = fs.createReadStream(file[0].filepath);
    const formData = new FormData();
    formData.append('file', fileStream);
    formData.append('model', 'whisper-1');
    
    try {
      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: formData,
      });
      
      const data = await response.json();
      res.status(200).json({ text: data.text });
    } catch (error) {
      console.error('OpenAI API Error:', error);
      res.status(500).json({ error: 'Transcription failed' });
    }
  });
};

export default handler;
