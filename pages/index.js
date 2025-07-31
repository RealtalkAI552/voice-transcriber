import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/transcribe', {
      method: 'POST',
      body: file,
    });

    const result = await response.json();
    setTranscription(result.text || 'Error: ' + JSON.stringify(result.error));
    setLoading(false);
  };

  return (
    <div>
      <h1>RealTalk Voice Transcriber</h1>
      <input type="file" accept="audio/*" onChange={e => setFile(e.target.files[0])} />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Transcribing...' : 'Transcribe'}
      </button>
      {transcription && (
        <div>
          <h2>Transcription:</h2>
          <p>{transcription}</p>
        </div>
      )}
    </div>
  );
}
