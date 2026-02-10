import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SummaryCard from "../components/SummaryCard";
import TypeDoughnutChart from "../components/TypeDoughnutChart";
import DataTable from "../components/DataTable";
import { useAppData } from "../context/AppDataContext";
import { api } from "../services/api";
import { generateEquipmentPdf } from "../utils/pdfReport";

export default function Dashboard() {
  const navigate = useNavigate();
  const [showTable, setShowTable] = useState(true);

  const { activeDataset, setActiveDataset } = useAppData();

  const [dataset, setDataset] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch dataset whenever activeDataset changes
  useEffect(() => {
    const load = async () => {
      if (!activeDataset) return;

      setLoading(true);
      try {
        const data = await api.getDatasetByName(activeDataset.name);
        setDataset(data);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [activeDataset]);

  const clearActiveDataset = () => {
    setActiveDataset(null);
    navigate("/history");
  };

  // No dataset selected UI
  if (!activeDataset) {
    return (
      <div style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
        <h2>Dashboard</h2>

        <div
          style={{
            marginTop: 12,
            border: "1px solid #eee",
            borderRadius: 10,
            padding: 14,
          }}
        >
          <p style={{ margin: 0 }}>No dataset selected yet.</p>

          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <button
              onClick={() => navigate("/upload")}
              style={btnStyle}
            >
              Upload CSV
            </button>

            <button
              onClick={() => navigate("/history")}
              style={btnStyle}
            >
              View History
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state after a dataset is selected
  if (loading || !dataset) {
    return (
      <div style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
        <h2>Dashboard</h2>
        <p>Loading dataset...</p>

        <button onClick={() => navigate("/history")} style={{ ...btnStyle, marginTop: 10 }}>
          Back to History
        </button>
      </div>
    );
  }

  const { summary, distribution, table: tableRows } = dataset;

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
      <h2>Dashboard</h2>

      {/* Top actions */}
      <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
        <button onClick={() => navigate("/history")} style={btnStyle}>
          Back to History
        </button>

        <button
          onClick={() =>
            generateEquipmentPdf({
              datasetMeta: activeDataset,
              summary,
              distribution,
              tableRows,
            })
          }
          style={btnStyle}
        >
          Download PDF
        </button>

        <button onClick={clearActiveDataset} style={btnStyle}>
          Clear Active Dataset
        </button>
      </div>

      {/* Dataset info */}
      <div style={{ marginTop: 14 }}>
        <p>
          Viewing dataset: <strong>{activeDataset.name}</strong>
          <br />
          Uploaded at:{" "}
          <span style={{ opacity: 0.75 }}>{activeDataset.uploadedAt}</span>
        </p>
      </div>

      {/* Summary cards */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 18 }}>
        <SummaryCard title="Total Equipment" value={summary.total_equipment} />
        <SummaryCard title="Avg Flowrate" value={summary.avg_flowrate} />
        <SummaryCard title="Avg Pressure" value={summary.avg_pressure} />
        <SummaryCard title="Avg Temperature" value={summary.avg_temperature} />
      </div>

      {/* Type distribution */}
      <div style={{ marginTop: 28 }}>
        <h3 style={{ marginBottom: 10 }}>Equipment Type Distribution</h3>

        <div
          style={{
            display: "flex",
            gap: 18,
            flexWrap: "wrap",
            alignItems: "flex-start",
          }}
        >
          <div style={{ border: "1px solid #eee", borderRadius: 10, padding: 14 }}>
            <TypeDoughnutChart distribution={distribution} />
          </div>

          <div
            style={{
              flex: 1,
              minWidth: 260,
              border: "1px solid #eee",
              borderRadius: 10,
              padding: 14,
            }}
          >
            {Object.entries(distribution).map(([type, count]) => (
              <div
                key={type}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderBottom: "1px solid #f2f2f2",
                }}
              >
                <span>{type}</span>
                <strong>{count}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ marginTop: 28 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
            gap: 10,
          }}
        >
          <h3 style={{ margin: 0 }}>Equipment Data</h3>

          <button
            onClick={() => setShowTable((prev) => !prev)}
            style={btnStyle}
          >
            {showTable ? "Hide Table" : "Show Table"}
          </button>
        </div>

        {showTable && <DataTable rows={tableRows} />}
      </div>
    </div>
  );
}

const btnStyle = {
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid #ddd",
  background: "white",
  cursor: "pointer",
};
