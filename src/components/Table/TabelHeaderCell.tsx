import TableCell, { TableCellProps } from "@mui/material/TableCell";
import { Color } from "style";

export default function TableHeaderCell(props: TableCellProps) {
  return (
    <TableCell sx={{ color: Color.primary }} {...props}>
      {props.children}
    </TableCell>
  );
}
