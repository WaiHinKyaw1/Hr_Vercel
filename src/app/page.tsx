"use client"
import { Typography } from "@mui/material"
import PageHeading from "../components/Page/PageHeading"
import PageWrapper from "../components/Page/PageWrapper"

const HomePage = () => {
  return (
    <PageWrapper>
      <PageHeading title="Home"/>
      <Typography variant="h2" sx={{ fontWeight: 500, fontSize: 30, justifyContent: "center", display: "flex", marginTop: 2 }}>
                Welcome from Hr Software!
            </Typography>
    </PageWrapper>
  )
}

export default HomePage
