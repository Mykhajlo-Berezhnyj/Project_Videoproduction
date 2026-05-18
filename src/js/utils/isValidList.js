export default function isValidList(list) {
  return (Array.isArray(list) && list.every(item =>item && typeof item === "object" && "id" in item)) 
}