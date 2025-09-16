import React from "react";
import { Button } from "@mui/material";
import { utils, writeFile } from "xlsx-js-style";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import dayjs from "dayjs";

type AttendanceRecord = {
  scanTime: string;
  hour: string;
  remark: string;
};

type EmployeeData = {
  no: number;
  employeeName: string;
  attendance: { [key: string]: AttendanceRecord };
};

type ExportButtonProps = {
  filteredAttendances?: any[];
  selectedDateRange?: {
    start_date: string | null;
    end_date: string | null;
  };
  calDiffTime?: (params: { startTime: string; endTime: string }) => string;
  formatTime?: (time: string) => string;
  calcLateTime?: (params: {
    startTime: string | null | undefined;
    scanTime: string | null | undefined;
  }) => string | undefined;
  formatLateTime?: (time: string) => string;
};

const ExportButton: React.FC<ExportButtonProps> = ({
  filteredAttendances = [],
  selectedDateRange,
  calDiffTime,
  formatTime,
  calcLateTime,
  formatLateTime,
}) => {
  const cleanRemark = (remark: string): string => {
    if (!remark || remark.trim() === "") return "";
    
    let processedText = remark.trim();
    
    if (/^late\s+late/i.test(processedText)) {
      processedText = processedText.replace(/^late\s+/i, '');
    }
    
    if (/^early/i.test(processedText)) {
      return "";
    }
    
    if (/^late/i.test(processedText)) {
      processedText = processedText.replace(/^late/i, 'Late');
    }
    
    return processedText;
  };

  const convertApiDataToTableFormat = (attendances: any[]) => {
    if (!attendances.length) return [];

    const employeeDataList: EmployeeData[] = attendances.map((employee: any) => {
      const employeeData: EmployeeData = {
        no: employee.employee.id,
        employeeName: employee.employee.name,
        attendance: {}
      };

      employee.attendance_list.forEach((att: any) => {
        const dateKey = dayjs(att.date).format("MMM DD (ddd)");

        if (att.times.length === 0) {
          employeeData.attendance[dateKey] = {
            scanTime: "❌",
            hour: "",
            remark: ""
          };
        } else {
          let scanTimes = '';
          if (att.times.length > 1) {
            const firstTime = formatTime ? formatTime(att.times[0]) : att.times[0];
            const secondTime = formatTime ? formatTime(att.times[1]) : att.times[1];
            scanTimes = `${firstTime},\n${secondTime}`;
          } else {
            scanTimes = formatTime ? formatTime(att.times[0]) : att.times[0];
          }

          const workingHours = att.times.length > 0 && calDiffTime ? 
            calDiffTime({
              startTime: att.times[0],
              endTime: att.times[att.times.length - 1],
            }) : "";

          let remarkText = "";
          if (att.times[0] && calcLateTime && formatLateTime) {
            const lateTime = calcLateTime({
              startTime: "09:15",
              scanTime: formatLateTime(att.times[0]),
            });
            
            if (lateTime && lateTime.trim() !== "" && lateTime !== "0 min") {
              remarkText = cleanRemark(lateTime);
            }
          }

          employeeData.attendance[dateKey] = {
            scanTime: scanTimes,
            hour: workingHours,
            remark: remarkText
          };
        }
      });

      return employeeData;
    });

    return employeeDataList;
  };

  const exportToExcel = () => {
    if (!filteredAttendances || filteredAttendances.length === 0) {
      console.warn("No data available for export");
      return;
    }

    const dataToExport = convertApiDataToTableFormat(filteredAttendances);

    const allDates = new Set<string>();
    filteredAttendances.forEach((employee: any) => {
      employee.attendance_list.forEach((att: any) => {
        allDates.add(dayjs(att.date).format("MMM DD (ddd)"));
      });
    });

    const dates: string[] = Array.from(allDates).sort((a, b) => {
      return dayjs(a, "MMM DD (ddd)").diff(dayjs(b, "MMM DD (ddd)"));
    });

    if (dates.length === 0) {
      console.warn("No dates available for export");
      return;
    }

    const headerRow1: string[] = ["No.", "Employee Name"];
    const headerRow2: string[] = ["", ""];

    dates.forEach((date: string) => {
      headerRow1.push(date, "", "");
      headerRow2.push("Scan Time", "Hour", "Remark");
    });

    const excelData: (string | number)[][] = [headerRow1, headerRow2];

    dataToExport.forEach((employee: EmployeeData) => {
      const row: (string | number)[] = [employee.no, employee.employeeName];

      dates.forEach((date: string) => {
        const dayData = employee.attendance[date];
        const scanTime = dayData?.scanTime || "";
        const hour = dayData?.hour || "";
        const remark = dayData?.remark || "";

        const isAbsent = scanTime === "❌" || (!scanTime && !hour && !remark);

        if (isAbsent) {
          row.push("", "", "");
        } else {
          row.push(scanTime, hour, remark);
        }
      });

      excelData.push(row);
    });

    const ws = utils.aoa_to_sheet(excelData);

    const merges = [
      { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } },
      { s: { r: 0, c: 1 }, e: { r: 1, c: 1 } },
    ];

    dates.forEach((date: string, index: number) => {
      const startCol = 2 + (index * 3);
      merges.push({
        s: { r: 0, c: startCol },
        e: { r: 0, c: startCol + 2 }
      });
    });

    dataToExport.forEach((employee: EmployeeData, empIndex: number) => {
      const rowIndex = empIndex + 2;

      dates.forEach((date: string, dateIndex: number) => {
        const dayData = employee.attendance[date];
        const scanTime = dayData?.scanTime || "";
        const hour = dayData?.hour || "";
        const remark = dayData?.remark || "";

        const isAbsent = scanTime === "❌" || (!scanTime && !hour && !remark);

        if (isAbsent) {
          const startCol = 2 + (dateIndex * 3);

          merges.push({
            s: { r: rowIndex, c: startCol },
            e: { r: rowIndex, c: startCol + 2 }
          });

          const cellAddress = utils.encode_cell({ r: rowIndex, c: startCol });
          ws[cellAddress] = { v: "❌", t: "s" };

          for (let c = startCol + 1; c <= startCol + 2; c++) {
            const clearAddress = utils.encode_cell({ r: rowIndex, c });
            ws[clearAddress] = { v: "", t: "s" };
          }
        }
      });
    });

    ws["!merges"] = merges;

    const borderStyle = {
      style: "thin" as const,
      color: { rgb: "000000" },
    };

    const range = utils.decode_range(ws['!ref'] || 'A1:K10');

    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell_address = utils.encode_cell({ r: R, c: C });
        if (!ws[cell_address]) {
          ws[cell_address] = { v: "", t: "s" };
        }

        const cell = ws[cell_address];

        cell.s = {
          font: { name: "Arial", sz: 10 },
          alignment: { vertical: "center", horizontal: "center", wrapText: true },
          border: {
            right: borderStyle, left: borderStyle,
            bottom: borderStyle, top: borderStyle,
          },
        };

        if (R === 0) {
          cell.s.font = { ...cell.s.font, bold: true, color: { rgb: "008080" }, sz: 10 };
          cell.s.fill = { fgColor: { rgb: "F8F9FA" } };
        }
        else if (R === 1) {
          cell.s.font = { ...cell.s.font, bold: true, color: { rgb: "008080" }, sz: 10 };
          cell.s.fill = { fgColor: { rgb: "F8F9FA" } };
        }

        if (R > 1 && typeof cell.v === 'string' && cell.v.includes('Late')) {
          cell.s.font = { ...cell.s.font, color: { rgb: "FF9800" }, bold: true };
        }

        if (R > 1 && cell.v === '❌') {
          cell.s.font = { ...cell.s.font, color: { rgb: "FF0000" }, sz: 12, bold: true };
          cell.s.alignment = { vertical: "center", horizontal: "center" };
        }

        if (C === 1 && R > 1) {
          cell.s.alignment = { ...cell.s.alignment, horizontal: "left" };
        }
      }
    }

    const columnWidths = [
      { width: 8 },
      { width: 20 },
    ];
    dates.forEach(() => {
      columnWidths.push({ width: 15 }, { width: 12 }, { width: 15 });
    });
    ws["!cols"] = columnWidths;

    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, ws, "Employee Attendance");

    const startDate = selectedDateRange?.start_date ? dayjs(selectedDateRange.start_date).format("YYYY-MM-DD") : "unknown";
    const endDate = selectedDateRange?.end_date ? dayjs(selectedDateRange.end_date).format("YYYY-MM-DD") : "unknown";
    const fileName = `Employee_Attendance_${startDate}_to_${endDate}_${dayjs().format("HH-mm-ss")}.xlsx`;
    
    writeFile(workbook, fileName);
  };

  return (
    <Button
      variant="contained"
      onClick={exportToExcel}
      startIcon={<FileDownloadIcon />}
      sx={{
        backgroundColor: '#008080',
        color: 'white',
        '&:hover': { backgroundColor: '#006666' },
        textTransform: 'none',
        fontSize: '14px',
        fontWeight: 'bold',
        px: 3,
        height: 37
      }}
    >
      Export to Excel
    </Button>
  );
};

export default ExportButton;
