export function normalizeProfileName(value: string): string | null {
  const name = value.trim().replace(/\s+/g, " ");
  return name.length > 0 ? name : null;
}