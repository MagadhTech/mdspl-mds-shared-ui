export const saveOrder = (pageKey: string, filters: string[]) => {
  localStorage.setItem(`FILTER_ORDER_${pageKey}`, JSON.stringify(filters));
};

export const loadOrder = (pageKey: string): string[] => {
  try {
    return JSON.parse(localStorage.getItem(`FILTER_ORDER_${pageKey}`) || '[]');
  } catch {
    return [];
  }
};
