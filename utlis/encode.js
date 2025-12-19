// utils/encode.js
export const encodeId = (id) => {
  if (!id && id !== 0) return '0' // Handle undefined/null
  return id.toString()
}