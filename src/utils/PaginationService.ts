export function paginateArr({ data, pageSize = 10, pageNo }: { data: any[]; pageSize?: number; pageNo: number }) {
  // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
  return data.slice((pageNo - 1) * pageSize, pageNo * pageSize);
}

export function calculateTotalPage(arrLength: number, limit?: number) {
  const _limit = limit || 10;
  return Math.ceil(arrLength / _limit);
}
