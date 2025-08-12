'use client';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  children: string;
  className?: string;
  [key: string]: any;
}

export default function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  // Extract language from className (e.g., "language-typescript" -> "typescript")
  const language = className?.replace(/language-/, '') || 'text';
  
  // Clean up the code content
  const code = String(children).replace(/\n$/, '');

  return (
    <SyntaxHighlighter
      style={vscDarkPlus}
      language={language}
      PreTag="div"
      showLineNumbers={true}
      customStyle={{
        margin: '1.5rem 0',
        borderRadius: '8px',
        border: '1px solid #333',
        fontSize: '14px',
        lineHeight: '1.5',
      }}
      lineNumberStyle={{
        color: '#666',
        paddingRight: '1em',
        borderRight: '1px solid #333',
        marginRight: '1em',
      }}
      {...props}
    >
      {code}
    </SyntaxHighlighter>
  );
}
