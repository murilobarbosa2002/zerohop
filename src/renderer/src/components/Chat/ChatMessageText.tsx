const URL_PATTERN = /(https?:\/\/[^\s]+)/g;
const TRAILING_PUNCTUATION_PATTERN = /[.,!?;:)\]]+$/;

export function ChatMessageText({ text }: { text: string }) {
  const parts: (string | { url: string; trailing: string })[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(URL_PATTERN)) {
    const raw = match[0];
    const matchIndex = match.index ?? 0;
    const trailingMatch = raw.match(TRAILING_PUNCTUATION_PATTERN);
    const trailing = trailingMatch ? trailingMatch[0] : '';
    const url = trailing ? raw.slice(0, -trailing.length) : raw;

    if (matchIndex > lastIndex) parts.push(text.slice(lastIndex, matchIndex));
    parts.push({ url, trailing });
    lastIndex = matchIndex + raw.length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));

  return (
    <>
      {parts.map((part, index) =>
        typeof part === 'string' ? (
          <span key={index}>{part}</span>
        ) : (
          <span key={index}>
            <button onClick={() => window.api.openExternalUrl(part.url)} className="underline hover:brightness-110 break-all text-left">
              {part.url}
            </button>
            {part.trailing}
          </span>
        )
      )}
    </>
  );
}
