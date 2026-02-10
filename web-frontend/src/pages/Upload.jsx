import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useAppData } from "../context/AppDataContext";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { uploadHistory, setUploadHistory, setActiveDataset } = useAppData();

  const isCsvFile = (f) => {
    if (!f) return false;
    const nameOk = f.name.toLowerCase().endsWith(".csv");
    // Some browsers may not set type for CSV, so we mainly trust extension.
    const typeOk =
      !f.type || f.type.includes("csv") || f.type === "application/vnd.ms-excel";
    return nameOk && typeOk;
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0] || null;

    setMessage("");
    setError("");

    if (!selected) {
      setFile(null);
      return;
    }

    if (!isCsvFile(selected)) {
      setFile(null);
      setError("Please select a valid .csv file.");
      e.target.value = "";
      return;
    }

    setFile(selected);
  };

const handleUploadClick = async () => {
  if (!file || loading) return;

  setLoading(true);
  setError("");
  setMessage("Uploading...");

  try {
    const result = await api.uploadCsv(file);

    setLoading(false);
    setMessage("Upload successful!");

    const historyItem = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      name: result.dataset_meta.name,
      uploadedAt: result.dataset_meta.uploadedAt,
    };

    const updatedHistory = [historyItem, ...uploadHistory].slice(0, 5);
    setUploadHistory(updatedHistory);
    setActiveDataset(historyItem);

    navigate("/dashboard");
  } catch (e) {
    setLoading(false);
    setMessage("");
    setError("Upload failed. Please try again.");
  }
};

  return (
    <div style={{ maxWidth: 520, margin: "40px auto", padding: 16 }}>
      <h2>Upload CSV</h2>
      <p>Select a CSV file and upload it.</p>

      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        disabled={loading}
      />

      <div style={{ marginTop: 12 }}>
        <button onClick={handleUploadClick} disabled={!file || loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {error && (
        <div style={{ marginTop: 12, color: "crimson", fontWeight: 600 }}>
          {error}
        </div>
      )}

      {message && !error && <div style={{ marginTop: 12 }}>{message}</div>}

      <div style={{ marginTop: 12 }}>
        <strong>Selected file:</strong> {file ? file.name : "None"}
      </div>
    </div>
  );
}
