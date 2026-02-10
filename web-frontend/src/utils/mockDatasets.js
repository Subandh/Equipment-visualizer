export const mockDatasets = {
  "sample_equipment_data.csv": {
    summary: { total_equipment: 128, avg_flowrate: 42.7, avg_pressure: 11.9, avg_temperature: 315.4 },
    distribution: { Pump: 40, Valve: 30, Reactor: 25, HeatExchanger: 18, Compressor: 15 },
    table: [
      { name: "Pump A1", type: "Pump", flowrate: 45.2, pressure: 12.1, temperature: 310 },
      { name: "Valve V3", type: "Valve", flowrate: 20.5, pressure: 9.4, temperature: 295 },
      { name: "Reactor R2", type: "Reactor", flowrate: 60.0, pressure: 15.8, temperature: 350 },
      { name: "Heat Exchanger H1", type: "HeatExchanger", flowrate: 33.3, pressure: 10.2, temperature: 280 },
      { name: "Compressor C7", type: "Compressor", flowrate: 55.1, pressure: 18.0, temperature: 365 },
    ],
  },

  "plant_batch_A.csv": {
    summary: { total_equipment: 95, avg_flowrate: 35.1, avg_pressure: 9.8, avg_temperature: 290.2 },
    distribution: { Pump: 28, Valve: 22, Reactor: 18, HeatExchanger: 15, Compressor: 12 },
    table: [
      { name: "Pump P10", type: "Pump", flowrate: 38.4, pressure: 9.2, temperature: 285 },
      { name: "Valve V11", type: "Valve", flowrate: 18.9, pressure: 8.4, temperature: 275 },
      { name: "Reactor R5", type: "Reactor", flowrate: 49.2, pressure: 12.8, temperature: 315 },
      { name: "Heat Exchanger HX2", type: "HeatExchanger", flowrate: 29.0, pressure: 9.1, temperature: 265 },
      { name: "Compressor C2", type: "Compressor", flowrate: 44.7, pressure: 14.5, temperature: 335 },
    ],
  },

  "plant_batch_B.csv": {
    summary: { total_equipment: 110, avg_flowrate: 47.9, avg_pressure: 13.2, avg_temperature: 330.0 },
    distribution: { Pump: 35, Valve: 25, Reactor: 30, HeatExchanger: 12, Compressor: 8 },
    table: [
      { name: "Pump P21", type: "Pump", flowrate: 52.0, pressure: 13.9, temperature: 340 },
      { name: "Valve V6", type: "Valve", flowrate: 21.0, pressure: 10.0, temperature: 300 },
      { name: "Reactor R8", type: "Reactor", flowrate: 62.5, pressure: 16.2, temperature: 370 },
      { name: "Heat Exchanger HX9", type: "HeatExchanger", flowrate: 31.4, pressure: 11.5, temperature: 290 },
      { name: "Compressor C9", type: "Compressor", flowrate: 46.3, pressure: 17.2, temperature: 360 },
    ],
  },
};

// Fallback dataset if filename not found:
export const defaultMockDataset = {
  summary: { total_equipment: 60, avg_flowrate: 30.0, avg_pressure: 8.5, avg_temperature: 275.0 },
  distribution: { Pump: 20, Valve: 15, Reactor: 10, HeatExchanger: 8, Compressor: 7 },
  table: [
    { name: "Pump X1", type: "Pump", flowrate: 28.2, pressure: 8.1, temperature: 270 },
    { name: "Valve X2", type: "Valve", flowrate: 16.5, pressure: 7.4, temperature: 260 },
    { name: "Reactor X3", type: "Reactor", flowrate: 40.0, pressure: 10.8, temperature: 300 },
  ],
};
