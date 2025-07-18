export const generateDateRange = (startDate, endDate) => {
  if (!startDate || !endDate || new Date(startDate) > new Date(endDate)) {
    throw new Error("Invalid date range");
  }
  const dates = [];
  let currentDate = new Date(startDate);
  const lastDate = new Date(endDate);

  while (currentDate <= lastDate) {
    dates.push(new Date(currentDate).toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};
