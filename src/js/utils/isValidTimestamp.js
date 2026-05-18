
export const CACHED_TTL = 2 * 60 * 60 * 1000;
export function isValidTimestamp(timestamp) {
  return (typeof timestamp === "number"
     &&timestamp<=Date.now()
     &&
    Date.now() - timestamp < CACHED_TTL
  );
}