export function createTempId(parentId?: string): string {
  const suffix = globalThis.crypto?.randomUUID?.() ?? String(Date.now());

  if (parentId) {
    return `${parentId}:content:${suffix}`;
  }

  return `temp-${suffix}`;
}