export const getTableRowNo = (page: number, arrIndx: number) => {
  return page == 1 ? arrIndx + 1 : (page - 1) * 10 + arrIndx + 1;
};
