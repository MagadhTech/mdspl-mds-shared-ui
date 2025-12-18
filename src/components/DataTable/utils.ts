// export const getRowHeight = (density: DensityType): string => {
//   switch (density) {
//     case "comfortable":
//       return "64px";
//     case "compact":
//       return "40px";
//     default:
//       return "52px";
//   }
// };

// export const getCellPadding = (density: DensityType): string => {
//   switch (density) {
//     case "comfortable":
//       return "16px";
//     case "compact":
//       return "6px";
//     default:
//       return "12px";
//   }
// };

export const sortData = <T extends Record<string, unknown>>(
  data: T[],
  orderBy: string,
  order: 'asc' | 'desc',
): T[] => {
  if (!orderBy) return data;

  return [...data].sort((a, b) => {
    const aVal = a[orderBy];
    const bVal = b[orderBy];

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return order === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return order === 'asc' ? aVal - bVal : bVal - aVal;
    }
    if (aVal instanceof Date && bVal instanceof Date) {
      return order === 'asc' ? aVal.getTime() - bVal.getTime() : bVal.getTime() - aVal.getTime();
    }
    return 0;
  });
};
