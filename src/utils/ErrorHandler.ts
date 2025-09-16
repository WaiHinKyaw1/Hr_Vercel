export function errorHandler(error: any) {
  alert(JSON.stringify(error?.response?.data || error));
}
