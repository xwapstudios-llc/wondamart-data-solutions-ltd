/**
 * Helper function to build query string from an object
 * Filters out undefined values
 * @param params - Object containing query parameters
 * @returns Query string (without leading ?)
 */
export const buildQuery = (params: Record<string, any>): string => {
  return new URLSearchParams(
    Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== undefined)
    ) as any
  ).toString();
};

