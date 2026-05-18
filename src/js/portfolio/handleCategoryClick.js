import { filteredList, setCategoryId } from '../slaider/categoryId.js';
import { fetchVideo } from '../slaider/fetchVideo.js';
import { renderVideos } from '../slaider/renderVideos.js';
import { updatePagination } from '../slaider/updatePagination.js';
import { getLocalList } from '../utils/getLocalList.js';

export async function handleCategoryClick(categoryId) {
  setCategoryId(categoryId);
  const {list} = getLocalList('videos');
  if (!list && Array.isArray(videos)) return;
  

  const filtered = filteredList(list);
  updatePagination({
    page: 1,
    videos: filtered,
  })

}
