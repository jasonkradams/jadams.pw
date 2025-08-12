'use client';

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  children: string;
  className?: string;
  [key: string]: unknown;
}

export default function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  
  // Extract language from className (e.g., "language-typescript" -> "typescript")
  const language = className?.replace(/language-/, '') || 'text';
  
  // Clean up the code content
  const code = String(children).replace(/\n$/, '');

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="relative group">
      {/* Copy button */}
      <button
        onClick={copyToClipboard}
        className="absolute top-3 right-3 z-10 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-gray-600"
        title="Copy code"
      >
        {copied ? (
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Copied!
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy
          </span>
        )}
      </button>

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
    </div>
  );
}
