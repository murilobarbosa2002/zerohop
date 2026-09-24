import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import json from 'highlight.js/lib/languages/json';
import bash from 'highlight.js/lib/languages/bash';
import python from 'highlight.js/lib/languages/python';
import java from 'highlight.js/lib/languages/java';
import csharp from 'highlight.js/lib/languages/csharp';
import cpp from 'highlight.js/lib/languages/cpp';
import go from 'highlight.js/lib/languages/go';
import rust from 'highlight.js/lib/languages/rust';
import ruby from 'highlight.js/lib/languages/ruby';
import php from 'highlight.js/lib/languages/php';
import sql from 'highlight.js/lib/languages/sql';
import yaml from 'highlight.js/lib/languages/yaml';
import markdown from 'highlight.js/lib/languages/markdown';
import diff from 'highlight.js/lib/languages/diff';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('css', css);
hljs.registerLanguage('json', json);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('python', python);
hljs.registerLanguage('java', java);
hljs.registerLanguage('csharp', csharp);
hljs.registerLanguage('cpp', cpp);
hljs.registerLanguage('go', go);
hljs.registerLanguage('rust', rust);
hljs.registerLanguage('ruby', ruby);
hljs.registerLanguage('php', php);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('yaml', yaml);
hljs.registerLanguage('markdown', markdown);
hljs.registerLanguage('diff', diff);

const CODE_FENCE_PATTERN = /```(\w*)\n([\s\S]*?)(```|$)/g;

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function highlightCode(code: string, language: string): string {
  if (language && hljs.getLanguage(language)) return hljs.highlight(code, { language }).value;
  return hljs.highlightAuto(code).value;
}

export function highlightChatDraft(text: string): string {
  let result = '';
  let lastIndex = 0;
  CODE_FENCE_PATTERN.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = CODE_FENCE_PATTERN.exec(text))) {
    const [full, language, code, closingFence] = match;
    result += escapeHtml(text.slice(lastIndex, match.index));
    result += '```' + escapeHtml(language) + '\n' + highlightCode(code, language) + escapeHtml(closingFence);
    lastIndex = match.index + full.length;
  }
  result += escapeHtml(text.slice(lastIndex));
  return result;
}
