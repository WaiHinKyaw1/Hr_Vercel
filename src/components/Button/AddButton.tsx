import React from "react";
import { Button, Stack, Typography } from "@mui/material";
import Image from "next/image";

type AddButtonProps = {
  onClick?: () => void;
  disabled?: boolean;
};

// Page Top AddButton
export default function AddButton({ onClick, disabled = false }: AddButtonProps) {
  return (
    <Button
      onClick={onClick}
      type="button"
      disabled={disabled}
      sx={[
        {
          height: 45,
          ":hover": { opacity: 0.9 },
          backgroundColor: "#fff",
          color: "black",
          padding: 0,
          overflow: "hidden",
          width: "160px",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
        },
      ]}
      variant="outlined"
    >
      <Stack
        style={{
          height: 45,
          width: 40,
          backgroundColor: "#95D737",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image src="/icons/add.png" alt="add" width={25} height={25} />
      </Stack>
      <Typography style={{ marginLeft: 20, paddingRight: 10 }}>Add</Typography>
    </Button>
  );
}
