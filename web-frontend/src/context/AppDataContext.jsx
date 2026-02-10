import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const [uploadHistory, setUploadHistory] = useState([]);
  const [activeDataset, setActiveDataset] = useState(null);

  // Load from localStorage once
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("uploadHistory") || "[]");
    const savedActive = JSON.parse(localStorage.getItem("activeDataset") || "null");
    setUploadHistory(savedHistory);
    setActiveDataset(savedActive);
  }, []);

  // Persist changes
  useEffect(() => {
    localStorage.setItem("uploadHistory", JSON.stringify(uploadHistory));
  }, [uploadHistory]);

  useEffect(() => {
    localStorage.setItem("activeDataset", JSON.stringify(activeDataset));
  }, [activeDataset]);

  const value = useMemo(
    () => ({
      uploadHistory,
      setUploadHistory,
      activeDataset,
      setActiveDataset,
    }),
    [uploadHistory, activeDataset]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used inside AppDataProvider");
  return ctx;
}
