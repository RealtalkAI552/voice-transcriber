import { useState } from 'react';

export default function Transcribe() {
  const [file, setFile] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('audio', file);

    const response = await fetch('/api/transcribe', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    setTranscript(data.text);
    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🎙️ Voice to Text Transcriber</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        <button type="submit" disabled={!file || loading}>
          {loading ? 'Transcribing...' : 'Transcribe'}
        </button>
      </form>
      {transcript && (
        <div style={{ marginTop: 20 }}>
          <h3>📝 Transcript:</h3>
          <p>{transcript}</p>
        </div>
      )}
    </div>
  );
}
