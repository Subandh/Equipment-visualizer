import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function TypeDoughnutChart({ distribution }) {
  const labels = Object.keys(distribution);
  const values = Object.values(distribution);

const data = {
  labels,
  datasets: [
    {
      label: "Count",
      data: values,
      backgroundColor: [
        "#4F46E5",
        "#16A34A",
        "#F59E0B",
        "#DC2626",
        "#0EA5E9",
      ],
    },
  ],
};


  return (
    <div style={{ maxWidth: 420 }}>
      <Doughnut data={data} />
    </div>
  );
}
