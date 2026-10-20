export function readObject(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}
export function completionPercent(completed: number, total: number) {
  return total > 0 ? Math.round(completed / total * 100) : 0;
}