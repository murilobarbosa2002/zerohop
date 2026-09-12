export function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'object' && err !== null && 'type' in err) {
    return String((err as { type: unknown }).type);
  }
  return String(err);
}
