import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

type LoadingProps = {
  style?: React.CSSProperties;
  open?: boolean;
};
export default function Loading({ style, open }: LoadingProps) {
  if (!open) return null;
  const flexStyle = style?.height ? null : { flex: 1 };
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 500,
        ...flexStyle,
        ...style,
      }}
    >
      <CircularProgress />
    </div>
  );
}
