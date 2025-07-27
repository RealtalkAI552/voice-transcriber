import { useRef, useState } from "react";

export default function Home() {
  const [audioUrl, setAudioUrl] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  const startRecording = async () => {
    setTranscript("");
    setAudioUrl(null);
    audioChunks.current = [];

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (e) => {
      audioChunks.current.push(e.data);
    };

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      await sendToWhisper(audioBlob);
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const sendToWhisper = async (audioBlob) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", audioBlob, "audio.webm");

    const res = await fetch("/api/transcribe", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setTranscript(data.text);
    setLoading(false);
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>🎙 Voice Recorder & Transcriber</h1>

      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>

      {audioUrl && <audio src={audioUrl} controls />}
      {loading && <p>Transcribing...</p>}
      {transcript && <p><strong>Transcript:</strong> {transcript}</p>}
    </div>
  );
}
