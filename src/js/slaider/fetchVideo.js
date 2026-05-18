import { exampleVideos } from "../../../db/videos.js";
import { getApiList } from "../service.js";
import { getLocalList } from "../utils/getLocalList.js";
import isValidList from "../utils/isValidList.js";
import { isValidTimestamp } from "../utils/isValidTimestamp.js";


export async function fetchVideo() {
  const { list, timestamp } = getLocalList();
  if (isValidList && isValidTimestamp(timestamp)) {
     return list;
  }
  const url = "/video/videos/";
  const listFromApi = await getApiList(url);
  if (!listFromApi) return null;
  const categories = [
    ...new Map(listFromApi.map((it) => [it.category.id, it.category])).values(),
  ];
  localStorage.setItem(
    "videos",
    JSON.stringify({ list: listFromApi, timestamp: Date.now() }),
  );
  localStorage.setItem(
    "categories",
    JSON.stringify({ list: categories, timestamp: Date.now() }),
  );
  return listFromApi;
}
