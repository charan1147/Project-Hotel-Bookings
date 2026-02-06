export const generateDateRange = (start, end) => {
  const dates = [];
  let current = new Date(start);
  const last = new Date(end);

  if (current > last) throw new Error("Invalid date range");

  while (current <= last) {
    dates.push(current.toISOString().slice(0, 10));
    current.setDate(current.getDate() + 1);
  }

  return dates;
};
