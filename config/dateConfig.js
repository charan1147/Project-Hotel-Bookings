export const toUTCDate = (dateInput) => {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) throw new Error("Invalid date");
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
};

export const getOverlapQuery = (cin, cout) => ({
  $or: [
    { checkIn: { $lt: cout }, checkOut: { $gt: cin } },
    { checkIn: { $eq: cout } },
    { checkOut: { $eq: cin } },
  ],
});
