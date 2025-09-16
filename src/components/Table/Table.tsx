"use client";
import {
  Box,
  Table as MUITable,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCellProps,
  TableContainerProps,
  TableCell,
} from "@mui/material";

import { Loading } from "../Loading";
import React, { useEffect, useState } from "react";
import TableHeaderCell from "./TabelHeaderCell";
import TablePagination from "./TablePagination";

export interface TableHeaderDataType extends TableCellProps {
  text?: string;
  HeaderComponent?: React.ReactNode;
}
interface TableProps {
  children?: React.ReactNode;
  headerData?: TableHeaderDataType[];
  tableContainer?: TableContainerProps;
  onChangePage?: (page: number) => void;
  page?: number;
  totalLength?: number;
  openLoading?: boolean;
  visiblePagination?: boolean;
  handleCheckbox?: () => void;
  scrollHeight?: string;
}

export default function Table({
  headerData = [],
  tableContainer,
  children,
  onChangePage,
  page = 1,
  totalLength = 0,
  openLoading,
  visiblePagination = true,
  scrollHeight,
}: TableProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;
  return (
    <Box>
      <TableContainer
        {...tableContainer}
        style={{
          maxHeight: scrollHeight || "60vh",
          overflow: "auto",
          ...tableContainer?.style,
        }}
      >
        <MUITable
          sx={{
            borderCollapse: "separate",
            borderSpacing: 0,
          }}
        >
          <TableHead>
            <TableRow>
              {headerData.map((h, index) => {
                const { text, HeaderComponent, ...tableCellProps } = h;
                return (
                  <TableHeaderCell
                    key={index}
                    {...tableCellProps}
                    sx={{
                      position: "sticky",
                      top: 0,
                      zIndex: 2,
                      backgroundColor: "white",
                      borderTop: "1px solid #bfb2b2ff",
                      borderBottom: "1px solid #bfb2b2ff"
                    }}
                  >
                    {HeaderComponent ? HeaderComponent : text}
                  </TableHeaderCell>
                );
              })}
            </TableRow>
          </TableHead>

          {!openLoading ? <TableBody>{children}</TableBody> : null}
          {!openLoading && totalLength == 0 ? (
            <TableBody sx={{ mt: 3 }}>
              <TableRow>
                <TableCell align="center" colSpan={headerData.length}>
                  <span style={{ opacity: 0.5 }}>There is no data!</span>
                </TableCell>
              </TableRow>
            </TableBody>
          ) : null}
        </MUITable>
        <Loading open={openLoading} style={{ height: 100 }} />
      </TableContainer>
      {totalLength > 0 && !openLoading && visiblePagination ? (
        <TablePagination
          totalLength={totalLength}
          page={page}
          onChange={(e, _page) => {
            if (onChangePage) onChangePage(_page);
          }}
        />
      ) : null}
    </Box>
  );
}
