// Bangladeshi Taka, e.g. 125000 -> ৳1,25,000 (lakh grouping)
export const formatTaka = (amount: number) =>
  `৳${amount.toLocaleString("en-BD")}`