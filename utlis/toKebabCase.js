export function toKebabCase(str) {
  if (!str) return ''
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')  // camelCase → camel-case
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
