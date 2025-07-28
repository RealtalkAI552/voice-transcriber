import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/transcribe', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    setTranscript(data.text);
    setLoading(false);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '40px' }}>
      <h1>🎙️ RealTalk Voice Transcriber</h1>
      <input type="file" accept="audio/*" onChange={e => setFile(e.target.files[0])} />
      <br /><br />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? 'Transcribing...' : 'Transcribe'}
      </button>
      <br /><br />
      {transcript && (
        <div>
          <h3>📝 Transcript:</h3>
          <p>{transcript}</p>
        </div>
      )}
    </div>
  );
}
