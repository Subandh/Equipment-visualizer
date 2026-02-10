// DataTable.jsx
import React, { useMemo } from "react";

const DISPLAY_COLUMNS = [
  { label: "Equipment Name", keys: ["name", "equipment_name", "equipmentName", "equipment", "Equipment Name"] },
  { label: "Type", keys: ["type", "equipment_type", "equipmentType", "Type"] },
  { label: "Flowrate", keys: ["flowrate", "flow_rate", "flow", "flowRate", "Flowrate", "Flow Rate"] },
  { label: "Pressure", keys: ["pressure", "press", "Pressure"] },
  { label: "Temperature", keys: ["temperature", "temp", "Temperature"] },
];

// helper: pick first non-empty value from possible keys
function getValue(row, keys) {
  if (!row || typeof row !== "object") return "—";
  for (const k of keys) {
    const v = row[k];
    if (v !== undefined && v !== null && String(v).trim() !== "") return v;
  }
  return "—";
}

// helper: normalize a key name (optional if you want to be extra robust)
function normalizeKey(key) {
  return String(key)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

// optional: create a normalized version of each row so "Equipment Name" also works
function normalizeRow(row) {
  if (!row || typeof row !== "object") return {};
  const out = { ...row };
  for (const [k, v] of Object.entries(row)) {
    out[normalizeKey(k)] = v;
  }
  return out;
}

export default function DataTable({ rows = [] }) {
  // normalize once (prevents crashes & supports weird CSV headers)
  const safeRows = useMemo(
    () => (Array.isArray(rows) ? rows.map(normalizeRow) : []),
    [rows]
  );

  if (!safeRows.length) {
    return (
      <div style={{ border: "1px solid #eee", borderRadius: 10, padding: 12 }}>
        No data to display.
      </div>
    );
  }

  return (
    <div style={{ border: "1px solid #eee", borderRadius: 10, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#fafafa" }}>
            {DISPLAY_COLUMNS.map((c) => (
              <th key={c.label} style={thStyle}>{c.label}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {safeRows.map((r, idx) => (
            <tr key={idx}>
              {DISPLAY_COLUMNS.map((c) => (
                <td key={c.label} style={tdStyle}>
                  {getValue(r, c.keys.map(normalizeKey))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
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
