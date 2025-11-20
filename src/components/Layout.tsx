"use client";
import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Loading } from "./Loading";
import useUser from "hooks/useUser";
import OfflinePreventer from "./OfflinePreventer";

interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props) => {
  const pathname = usePathname();
  const { status } = useUser();
  const router = useRouter();
  useEffect(() => {
    if (status == "unauthenticated" && pathname !== "/login" && !pathname.includes("/chk-inv/")) {
      router.replace("/login");
    }
  }, [status, pathname, router]);

  if (status == "loading") return <Loading style={{ height: "100vh" }} />;
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <OfflinePreventer />
      <div>
        {pathname !== "/login" ? (
          status == "authenticated" ? (
            <div>
              {children}
            </div>
          ) : (
            <Loading style={{ height: "100vh" }} />
          )
        ) : (
          children
        )}
      </div>
    </LocalizationProvider>
  );
};

export default Layout;
