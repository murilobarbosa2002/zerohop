import { useState } from 'react';
import { COPY_FEEDBACK_DURATION_MS } from '@/constants/timing';
import { COMMON_STRINGS } from '@/strings/common.strings';
import type { CopyButtonProps } from '@/components/CopyButton/CopyButton.types';

export function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleClick(): Promise<void> {
    await window.api.copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), COPY_FEEDBACK_DURATION_MS);
  }

  return (
    <button
      onClick={handleClick}
      className="bg-accent-soft text-accent rounded-full px-2.5 py-1 text-badge-xs font-bold hover:brightness-110 flex-shrink-0"
    >
      {copied ? COMMON_STRINGS.copiedButton : COMMON_STRINGS.copyButton}
    </button>
  );
}
