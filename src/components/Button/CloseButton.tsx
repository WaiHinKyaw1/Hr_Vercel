import React from "react";
import { IconButton } from "@mui/material";
import Image from "next/image";

interface CloseButtonProps {
    onClick?: () => void;
    type?: "button";
    style?: React.CSSProperties;
    iconColor?: "black" | "white";
}

//CloseButton

export default function CloseButton({ onClick, type = "button", style, iconColor = 'black' }: CloseButtonProps) {
    return (
        <IconButton
            onClick={onClick}
            type={type}
            style={style}
            sx={{
                color: "#fff",
                borderRadius: 2,
            }}
        >
            {
                iconColor === 'black' ? (
                    <Image
                        src="/icons/cross-black.png"
                        alt="close"
                        width={15}
                        height={15} />
                ) : (
                    <Image
                        src="/icons/cross-white.png"
                        alt="close"
                        width={15}
                        height={15} />
                )
            }
        </IconButton>
    );
}
