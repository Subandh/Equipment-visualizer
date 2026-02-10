// src/pages/History.jsx
import { useNavigate } from "react-router-dom";
import { useAppData } from "../context/AppDataContext";

export default function History() {
  const navigate = useNavigate();
  const { uploadHistory, setUploadHistory, setActiveDataset } = useAppData();

  const openDataset = (item) => {
    setActiveDataset(item);
    navigate("/dashboard");
  };

  const clearHistory = () => {
    setUploadHistory([]);
    // (optional) also clear active dataset if it was from history
    // setActiveDataset(null);
  };

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>Upload History</h2>

        <button
          onClick={clearHistory}
          disabled={uploadHistory.length === 0}
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid #ddd",
            background: "white",
            cursor: uploadHistory.length ? "pointer" : "not-allowed",
          }}
        >
          Clear
        </button>
      </div>

      <p style={{ marginTop: 10 }}>Showing last 5 uploaded datasets.</p>

      {uploadHistory.length === 0 ? (
        <div style={{ marginTop: 14, border: "1px solid #eee", borderRadius: 10, padding: 14 }}>
          No uploads yet. Upload a CSV to see it here.
        </div>
      ) : (
        <div style={{ border: "1px solid #eee", borderRadius: 10, overflow: "hidden", marginTop: 14 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#fafafa" }}>
                <th style={thStyle}>File</th>
                <th style={thStyle}>Uploaded</th>
              </tr>
            </thead>
            <tbody>
              {uploadHistory.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => openDataset(item)}
                  style={{ cursor: "pointer" }}
                >
                  <td style={tdStyle}>{item.name}</td>
                  <td style={tdStyle}>{item.uploadedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const thStyle = {
  textAlign: "left",
  padding: 12,
  borderBottom: "1px solid #eee",
  fontSize: 14,
};

const tdStyle = {
  padding: 12,
  borderBottom: "1px solid #f2f2f2",
  fontSize: 14,
};
