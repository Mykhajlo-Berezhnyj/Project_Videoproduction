let categoryId = null;

export function setCategoryId(id) {
  categoryId = id === "all" ? null : parseInt(id);
}

export function getCategoryId() {
  return categoryId;
}

export function filteredList(list) {
  const id = getCategoryId();
  const filtered = id === null ?  list : list.filter((it) => it.id === id);
  return filtered;
}
