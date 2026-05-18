import isValidList from "./utils/isValidList.js";

export const baseUrl = "https://videoproduction.onrender.com";
export const BASE_URL = `${baseUrl}/api`;

export async function getApiList(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    const res = await response.json();
    if (res.status === 200 && isValidList(res.list) && res.list.length > 0 ) {
    
      return res.list;
    } else {
      return null;
    }
  } catch (error) {
    console.log("🚀 ~ getApi ~ error:", error);
    return null;
  }
}
