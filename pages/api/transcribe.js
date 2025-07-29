// pages/api/transcribe.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const formData = new FormData();
    const file = req.body.audio; // this depends on how you handle upload
    formData.append("file", file);
    formData.append("model", "whisper-1");
    formData.append("language", "en");

    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
  method: "POST",
  headers: {
    Authorization: 'Bearer {process.env.OPENAI_API_KEY}'
  },
  body: formData
});
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to transcribe audio" });
  }
}
