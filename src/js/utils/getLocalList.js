import isValidList from "./isValidList.js";

export function getLocalList(key) {
  const cached = localStorage.getItem(key);
  if (cached) {
    try {
      const { list, timestamp } = JSON.parse(cached);
      if (isValidList(list)) {
        return { list, timestamp };
      } else {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error();
      localStorage.removeItem(key);
    }
  }
  return { list: null, timestamp: null };
}
