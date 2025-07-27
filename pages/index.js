import { useState, useRef } from "react";

export default function Home() {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("file", audioBlob, "recording.webm");

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setTranscript(data.text || "Transcription failed.");
    };

    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>🎙️ Voice Transcriber</h1>

      <button
        onClick={recording ? stopRecording : startRecording}
        style={{
          backgroundColor: recording ? "red" : "green",
          color: "white",
          padding: "1rem 2rem",
          border: "none",
          borderRadius: "5px",
          fontSize: "1rem",
          cursor: "pointer",
        }}
      >
        {recording ? "Stop Recording" : "Start Recording"}
      </button>

      <div style={{ marginTop: "2rem" }}>
        <h2>📝 Transcript</h2>
        <p>{transcript || "No transcript yet."}</p>
      </div>
    </div>
  );
}
