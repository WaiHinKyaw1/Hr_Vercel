
"use client";

import React, { useState, useEffect } from "react";
import { Stack } from "@mui/material";
import { DateRangePicker } from "rsuite";
import { addDays } from "date-fns";
import "rsuite/dist/rsuite.min.css";
import dayjs from "dayjs";

type FilterDialogProps = {
  onApplyFilter: (filters: {
    startDate: { from: string | null; to: string | null };
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
  onApplyFilter,
  close,
}) => {
  const today = dayjs().format("YYYY-MM-DD");
  const [startDate, setStartDate] = useState<{
    from: string | null;
    to: string | null;
  }>({
    from: today,
    to: today,
  });

  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 600);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const applyFilters = (newFilters: {
    startDate?: { from: string | null; to: string | null };
  }) => {
    onApplyFilter({ startDate, ...newFilters });
    close?.();
  };

  const isTodaySelected = startDate.from === today && startDate.to === today;

  return (
    <Stack direction="row" mt={4} flexWrap="wrap">
      <Stack minWidth={200}>
        {isSmallScreen ? (
          <DateRangePicker
            showOneCalendar
            ranges={predefinedRanges as any}
            placeholder="dd/mm/yyyy"
            value={[new Date(startDate.from!), new Date(startDate.to!)]}
            onChange={(dateArr) => {
              if (dateArr) {
                const updated = {
                  from: dayjs(dateArr[0]).format("YYYY-MM-DD"),
                  to: dayjs(dateArr[1]).format("YYYY-MM-DD"),
                };
                setStartDate(updated);
                applyFilters({ startDate: updated });
              }
            }}
            cleanable={!isTodaySelected}
            onClean={() => {
              const todayFilter = { from: today, to: today };
              setStartDate(todayFilter);
              applyFilters({ startDate: todayFilter });
            }}
            oneTap={false}
            appearance="default"
            placement="topStart"
            preventOverflow
          />
        ) : (
          <DateRangePicker
            placeholder="dd/mm/yyyy"
            value={[new Date(startDate.from!), new Date(startDate.to!)]}
            onChange={(dateArr) => {
              if (dateArr) {
                const updated = {
                  from: dayjs(dateArr[0]).format("YYYY-MM-DD"),
                  to: dayjs(dateArr[1]).format("YYYY-MM-DD"),
                };
                setStartDate(updated);
                applyFilters({ startDate: updated });
              }
            }}
            cleanable={!isTodaySelected}
            onClean={() => {
              const todayFilter = { from: today, to: today };
              setStartDate(todayFilter);
              applyFilters({ startDate: todayFilter });
            }}
            oneTap={false}
            appearance="default"
            placement="topStart"
            preventOverflow
          />
        )}
      </Stack>
    </Stack>
  );
};

export default FilterDialog;
