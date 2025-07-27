// Deploy this on Vercel. Requires OPENAI_API_KEY in your Vercel environment variables.

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  // Read incoming formdata (audio file)
  const busboy = require("busboy");
  const bb = busboy({ headers: req.headers });
  let fileBuffer = Buffer.alloc(0);

  bb.on("file", (_, file) => {
    file.on("data", (data) => {
      fileBuffer = Buffer.concat([fileBuffer, data]);
    });
  });

  bb.on("finish", async () => {
    try {
      // Call OpenAI Whisper API
      const formData = new FormData();
      formData.append("file", new Blob([fileBuffer]), "audio.webm");
      formData.append("model", "whisper-1");
      const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: formData,
      });
      const data = await response.json();
      res.status(200).json(data);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  req.pipe(bb);
}