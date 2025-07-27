import { useRef, useState } from "react";

export default function Home() {
  const [audioUrl, setAudioUrl] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  // Start recording
  const startRecording = async () => {
    setTranscript("");
    setAudioUrl(null);
    audioChunks.current = [];
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new window.MediaRecorder(stream);
    mediaRecorderRef.current.ondataavailable = (e) => audioChunks.current.push(e.data);
    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
      setAudioUrl(URL.createObjectURL(audioBlob));
    };
    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  // Stop recording
  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  // Handle file upload
  const handleFile = (file) => {
    setTranscript("");
    setAudioUrl(URL.createObjectURL(file));
    setSelectedFile(file);
  };

  const [selectedFile, setSelectedFile] = useState(null);

  // Upload and transcribe
  const transcribe = async () => {
    setLoading(true);
    setTranscript("");
    const file = selectedFile || (audioUrl && await fetch(audioUrl).then(r => r.blob()));
    const formData = new FormData();
    formData.append("audio", file, "audio.webm");
    const res = await fetch("/api/transcribe", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setTranscript(data.text || data.error || "No response");
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 500, margin: "auto", padding: 32, fontFamily: "sans-serif" }}>
      <h2>🎙 Audio to Text (OpenAI Whisper)</h2>
      <div>
        {!isRecording ? (
          <button onClick={startRecording}>Start Recording</button>
        ) : (
          <button onClick={stopRecording}>Stop Recording</button>
        )}
      </div>
      <div style={{ margin: "16px 0" }}>
        <input
          type="file"
          accept="audio/*"
          onChange={e => {
            setSelectedFile(e.target.files[0]);
            handleFile(e.target.files[0]);
          }}
        />
        <div
          onDrop={e => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            setSelectedFile(file);
            handleFile(file);
          }}
          onDragOver={e => e.preventDefault()}
          style={{
            border: "2px dashed #888",
            borderRadius: 8,
            padding: 20,
            marginTop: 12,
            textAlign: "center",
            color: "#888",
            background: "#f9f9f9",
          }}
        >
          Drag and drop audio here
        </div>
      </div>
      {audioUrl && (
        <div>
          <audio src={audioUrl} controls style={{ width: "100%" }} />
          <button disabled={loading} onClick={transcribe} style={{ marginTop: 10 }}>
            {loading ? "Transcribing..." : "Transcribe"}
          </button>
        </div>
      )}
      {transcript && (
        <div style={{ marginTop: 24 }}>
          <h3>Transcript:</h3>
          <pre style={{ background: "#eee", padding: 16 }}>{transcript}</pre>
        </div>
      )}
      <footer style={{ marginTop: 32, fontSize: 12, color: "#888" }}>
        Powered by OpenAI Whisper + Vercel + Next.js
      </footer>
    </div>
  );
}