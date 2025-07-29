// pages/api/transcribe.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  const { audioUrl } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        "Authorization": Bearer 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
      },
      body: (() => {
        const data = new FormData();
        data.append("file", audioUrl);
        data.append("model", "whisper-1");
        return data;
      })()
    });

    const data = await response.json();
    return res.status(200).json(data);

  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: "Failed to transcribe audio" });
  }
}
