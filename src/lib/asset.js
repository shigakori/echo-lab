export function prefixPath(path) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  if (!path) return path;
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  if (path.startsWith("/")) {
    return `${base}${path}`;
  }
  return `${base}/${path}`;
}


