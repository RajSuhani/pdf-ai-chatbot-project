import { useState } from "react";
import { uploadPDF } from "../api";

export default function UploadBox() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Select a PDF first");

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setUploaded(false);

    try {
      await uploadPDF(formData);
      setUploaded(true);
      alert("PDF uploaded successfully");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-card">

      <h3>📄 Upload PDF</h3>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => {
          setFile(e.target.files[0]);
          setUploaded(false);
        }}
      />

      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload PDF"}
      </button>

      {uploaded && (
        <p className="success-text">
          ✅ PDF uploaded successfully
        </p>
      )}

    </div>
  );
}