import React from "react";
import { Button } from "@mui/material";
import { Color } from "style";

type AddButtonProps = {
    onClick?: () => void;
    buttonText?: string;
    disabled?: boolean;
};
export default function TableTopAddButton({ onClick, buttonText = "Add", disabled = false }: AddButtonProps) {
    return (
        <Button
            onClick={onClick}
            type="button"
            disabled={disabled}
            sx={{
                ":hover": { opacity: 0.9 },
                alignItems: "center",
                color: "#005080",
                backgroundColor: "#fff",
                boxShadow: 0,
                px: 5,
                border: `1px solid ${Color.primary}`,
                borderColor: '#005080',
                borderRadius: 2,
                mb: 4
            }}
            variant="contained"
        >
            {buttonText}
        </Button>
    );
}
