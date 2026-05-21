import { mediaUrl } from "./constants";

export function getMediaSource(path: string | undefined | null) {
  return mediaUrl + path;
}
