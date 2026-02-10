export default function SummaryCard({ title, value }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 10,
        padding: 14,
        minWidth: 150,
      }}
    >
      <div style={{ fontSize: 14, opacity: 0.7 }}>{title}</div>
      <div style={{ fontSize: 22, fontWeight: 700, marginTop: 6 }}>{value}</div>
    </div>
  );
}
