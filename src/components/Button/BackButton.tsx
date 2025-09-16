"use client";
import { IconButton } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function BackButton({ onClick }: { onClick?: () => void }) {
  const router = useRouter();

  return (
    <IconButton onClick={() => (onClick ? onClick() : router.back())}>
      <Image src="/icons/back.png" alt="Back Icon" width={20} height={20} />
    </IconButton>
  );
}
