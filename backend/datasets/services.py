import pandas as pd

# Logical fields your app expects
REQUIRED_LOGICAL = ["Type", "Flowrate", "Pressure", "Temperature"]

# Column aliases commonly found in datasets
ALIASES = {
    "Type": ["Type", "Equipment Type", "equipment_type", "type"],
    "Flowrate": ["Flowrate", "Flow Rate", "Flow_Rate", "flowrate", "flow_rate"],
    "Pressure": ["Pressure", "pressure", "Press", "press"],
    "Temperature": ["Temperature", "Temp", "temperature", "temp"],
}

def normalize_columns(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df.columns = [str(c).strip() for c in df.columns]
    return df

def _pick_col(df: pd.DataFrame, logical_name: str) -> str | None:
    """
    Return the actual column name in df for a logical field,
    based on ALIASES. Returns None if not found.
    """
    for c in ALIASES.get(logical_name, []):
        if c in df.columns:
            return c
    return None

def compute_metrics(df: pd.DataFrame) -> tuple[dict, dict]:
    df = normalize_columns(df)

    # Map logical fields -> actual columns present in df
    type_col = _pick_col(df, "Type")
    flow_col = _pick_col(df, "Flowrate")
    pres_col = _pick_col(df, "Pressure")
    temp_col = _pick_col(df, "Temperature")

    # numeric conversion on whichever columns exist
    for col in [flow_col, pres_col, temp_col]:
        if col:
            df[col] = pd.to_numeric(df[col], errors="coerce")

    total_equipment = int(len(df))

    def safe_mean(col: str | None):
        return round(float(df[col].mean()), 3) if col and df[col].notna().any() else None

    summary = {
        "total_equipment": total_equipment,
        "avg_flowrate": safe_mean(flow_col),
        "avg_pressure": safe_mean(pres_col),
        "avg_temperature": safe_mean(temp_col),
    }

    distribution = {}
    if type_col:
        distribution = df[type_col].fillna("Unknown").value_counts().to_dict()

    return summary, distribution

def df_to_table(df: pd.DataFrame, limit: int = 500) -> list[dict]:
    df = normalize_columns(df)
    df = df.head(limit).fillna("")
    return df.to_dict(orient="records")
