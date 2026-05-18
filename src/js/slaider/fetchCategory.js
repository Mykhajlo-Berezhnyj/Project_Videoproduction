import { exampleCategories } from "../../../db/categories.js";
import { getApiList } from "../service.js";

export async function fetchCategory() {
  const list  = await getApiList("/video/categories/");
  
  if (!list) return null;

  localStorage.setItem("categories", JSON.stringify({list, timestamp: Date.now()}));

  return list;
}