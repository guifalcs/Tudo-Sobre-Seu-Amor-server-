export function validateAndParseDate(dateStr: string): Date | null {
  dateStr = dateStr.trim();

  const brRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const usRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;

  let day: number;
  let month: number;
  let year: number;

  let match = brRegex.exec(dateStr);
  if (match) {
    day = parseInt(match[1], 10);
    month = parseInt(match[2], 10) - 1;
    year = parseInt(match[3], 10);
  } else {
    match = usRegex.exec(dateStr);
    if (match) {
      month = parseInt(match[1], 10) - 1;
      day = parseInt(match[2], 10);
      year = parseInt(match[3], 10);
    } else {
      return null;
    }
  }

  const date = new Date(year, month, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

export const customDateValidator = (dateStr: string): boolean => {
  const date = validateAndParseDate(dateStr);
  return date !== null;
};
