import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [transcribing, setTranscribing] = useState(false);
  const [transcript, setTranscript] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleTranscribe = async () => {
    if (!file) return;
    setTranscribing(true);
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/transcribe", {
      method: "POST",
      body: formData
    });

    const data = await response.json();
    setTranscript(data.text);
    setTranscribing(false);
  };

  return (
    <div style={{ textAlign: "center", paddingTop: "50px" }}>
      <h1>RealTalk Voice Transcriber</h1>
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      <br /><br />
      <button onClick={handleTranscribe} disabled={transcribing}>
        {transcribing ? "Transcribing..." : "Transcribe"}
      </button>
      <br /><br />
      {transcript && (
        <div>
          <h3>Transcription Result:</h3>
          <p>{transcript}</p>
        </div>
      )}
    </div>
  );
}
