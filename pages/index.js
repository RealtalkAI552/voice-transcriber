export default function Home() {
  const handleRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      alert('Transcription: ' + result.text);
    };

    mediaRecorder.start();

    setTimeout(() => {
      mediaRecorder.stop();
    }, 5000); // record 5 seconds
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>🎙 Voice Transcriber</h1>
      <button onClick={handleRecording}>Start Recording</button>
    </div>
  );
}
