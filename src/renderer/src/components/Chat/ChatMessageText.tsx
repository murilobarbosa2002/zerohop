import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import type { Components } from 'react-markdown';

const MARKDOWN_COMPONENTS: Components = {
  a: ({ href, children }) => (
    <button onClick={() => href && window.api.openExternalUrl(href)} className="underline hover:brightness-110 break-all text-left inline">
      {children}
    </button>
  ),
  p: ({ children }) => <p className="whitespace-pre-wrap break-words">{children}</p>,
  code: ({ className, children }) => <code className={className}>{children}</code>,
  pre: ({ children }) => <pre className="bg-bg border border-border rounded-lg p-2 my-1.5 overflow-x-auto text-xs">{children}</pre>,
  ul: ({ children }) => <ul className="list-disc pl-4">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-4">{children}</ol>
};

export function ChatMessageText({ text }: { text: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]} components={MARKDOWN_COMPONENTS}>
      {text}
    </ReactMarkdown>
  );
}
