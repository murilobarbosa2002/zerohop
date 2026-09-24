export function isTypingKeystroke(key: string): boolean {
  return key.length === 1 || key === 'Backspace';
}
