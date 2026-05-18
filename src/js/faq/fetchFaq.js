import { getApiList } from "../service.js";
import { getLocalList } from "../utils/getLocalList.js";
import isValidList from "../utils/isValidList.js";
import { isValidTimestamp } from "../utils/isValidTimestamp.js";

export async function fetchFaq() {
  const { list, timestamp } = getLocalList("faq");

  if (isValidTimestamp(timestamp)) {
    return list;
  }
  const faqList = await getApiList("/faq/");

  if (isValidList(faqList)) {
    localStorage.setItem("faq", JSON.stringify({list: faqList, timestamp: Date.now()}));
  }

  return { faqList };
}
