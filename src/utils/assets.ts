const ASSET_VERSION = "20260710-tiny-mobile";

export function assetPath(path: string) {
  const cleanPath = path.replace(/^\/+/, "");
  const separator = cleanPath.includes("?") ? "&" : "?";
  return `${import.meta.env.BASE_URL}${cleanPath}${separator}v=${ASSET_VERSION}`;
}
