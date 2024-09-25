// lib/helpers/index.ts
export const numberWithCommas = (x: any) => {
  if (typeof x !== 'string') return ''; // Handle non-string input
  const parts = x.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join('.');
};
