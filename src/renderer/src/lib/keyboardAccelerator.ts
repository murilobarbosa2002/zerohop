const MODIFIER_CODES = new Set(['ControlLeft', 'ControlRight', 'ShiftLeft', 'ShiftRight', 'AltLeft', 'AltRight', 'MetaLeft', 'MetaRight']);

const CODE_TO_KEY: Record<string, string> = {
  Space: 'Space',
  Tab: 'Tab',
  Backspace: 'Backspace',
  Delete: 'Delete',
  Insert: 'Insert',
  Enter: 'Return',
  NumpadEnter: 'Return',
  Escape: 'Escape',
  ArrowUp: 'Up',
  ArrowDown: 'Down',
  ArrowLeft: 'Left',
  ArrowRight: 'Right',
  Home: 'Home',
  End: 'End',
  PageUp: 'PageUp',
  PageDown: 'PageDown',
  CapsLock: 'Capslock',
  PrintScreen: 'PrintScreen',
  NumpadAdd: 'numadd',
  NumpadSubtract: 'numsub',
  NumpadMultiply: 'nummult',
  NumpadDivide: 'numdiv',
  NumpadDecimal: 'numdec',
  Backquote: '`',
  Minus: '-',
  Equal: '=',
  BracketLeft: '[',
  BracketRight: ']',
  Backslash: '\\',
  Semicolon: ';',
  Quote: "'",
  Comma: ',',
  Period: '.',
  Slash: '/'
};

for (let i = 1; i <= 24; i += 1) CODE_TO_KEY[`F${i}`] = `F${i}`;
for (let i = 0; i <= 9; i += 1) {
  CODE_TO_KEY[`Digit${i}`] = `${i}`;
  CODE_TO_KEY[`Numpad${i}`] = `num${i}`;
}
for (const letter of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') CODE_TO_KEY[`Key${letter}`] = letter;

export interface KeyboardAccelerator {
  accelerator: string;
  label: string;
}

export function keyboardEventToAccelerator(event: KeyboardEvent): KeyboardAccelerator | null {
  if (MODIFIER_CODES.has(event.code)) return null;
  const mainKey = CODE_TO_KEY[event.code];
  if (!mainKey) return null;

  const parts: string[] = [];
  if (event.ctrlKey) parts.push('Control');
  if (event.altKey) parts.push('Alt');
  if (event.shiftKey) parts.push('Shift');
  if (event.metaKey) parts.push('Super');
  parts.push(mainKey);

  return { accelerator: parts.join('+'), label: parts.join(' + ') };
}
