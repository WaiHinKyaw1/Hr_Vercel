"use client";

import React, { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import { DateRangePicker } from "rsuite";
import { addDays } from "date-fns";
import "rsuite/dist/rsuite.min.css";
import dayjs from "dayjs";

type FilterDialogProps = {
  selectedDate: { start_date: string | null; end_date: string | null };
  onApplyFilter: (filters: {
    selectedDate: { start_date: string | null; end_date: string | null };
  }) => void;
  close?: () => void;
};

const predefinedRanges = [
  { label: "Today", value: [new Date(), new Date()], placement: "left" },
  {
    label: "Yesterday",
    value: [addDays(new Date(), -1), addDays(new Date(), -1)],
    placement: "left",
  },
  {
    label: "Last 7 Days",
    value: [addDays(new Date(), -7), new Date()],
    placement: "left",
  },
  {
    label: "Last 30 Days",
    value: [addDays(new Date(), -30), new Date()],
    placement: "left",
  },
];

const FilterDialog: React.FC<FilterDialogProps> = ({
  selectedDate,
  onApplyFilter,
  close,
}) => {
  const today = dayjs().format("YYYY-MM-DD");
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 600);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const applyFilters = (newFilters: {
    start_date: string | null;
    end_date: string | null;
  }) => {
    onApplyFilter({ selectedDate: newFilters });
    close?.();
  };

  const isTodaySelected =
    selectedDate.start_date === today && selectedDate.end_date === today;

  return (
    <Stack
      direction="row"
      mt={2}
      flexWrap="wrap"
    >
      <Stack minWidth={200}>
        <DateRangePicker
          showOneCalendar={isSmallScreen}
          ranges={predefinedRanges as any}
          placeholder="dd/mm/yyyy"
          value={
            selectedDate.start_date && selectedDate.end_date
              ? [
                  new Date(selectedDate.start_date),
                  new Date(selectedDate.end_date),
                ]
              : null
          }
          onChange={(dateArr) => {
            if (dateArr) {
              const updated = {
                start_date: dayjs(dateArr[0]).format("YYYY-MM-DD"),
                end_date: dayjs(dateArr[1]).format("YYYY-MM-DD"),
              };
              applyFilters(updated);
            }
          }}
          cleanable={!isTodaySelected}
          onClean={() => {
            const todayFilter = { start_date: today, end_date: today };
            applyFilters(todayFilter);
          }}
          oneTap={false}
          appearance="default"
          placement="topStart"
          preventOverflow
        />
      </Stack>
    </Stack>
  );
};

export default FilterDialog;
