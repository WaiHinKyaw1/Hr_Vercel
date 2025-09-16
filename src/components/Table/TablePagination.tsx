import { Pagination, PaginationProps } from "@mui/material";
import { calculateTotalPage } from "utils";

interface TablePaginationProps extends PaginationProps {
  totalLength?: number;
  page?: number;
}

export default function TablePagination(props: TablePaginationProps) {
  const { page = 0, totalLength = 0, ...paginationProps } = props;

  return (
    <Pagination
      color="primary"
      count={calculateTotalPage(totalLength)}
      page={page}
      variant="outlined"
      shape="rounded"
      sx={{ mt: 1 }}
      {...paginationProps}
    />
  );
}
