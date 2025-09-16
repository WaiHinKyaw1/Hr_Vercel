export function isValidDecimalNum(num?: string | number | null): boolean {
  if (num === null || num === undefined || num === "") {
    return true;
  }

  const numStr = String(num);
  const regex = /^-?[0-9]*(\.[0-9]*)?$/;
  return regex.test(numStr);
}

export function isValidNumberOnly(num?: string | number | null): boolean {
  if (num === null || num === undefined || num === "") {
    return true;
  }

  const numStr = String(num);
  const regex = /^-?[0-9]+$/;
  return regex.test(numStr);
}
