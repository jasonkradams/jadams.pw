'use client';

import { useState } from 'react';
import CodeBlock from './CodeBlock';

interface RecipeViewerProps {
  codeString: string;
  children: React.ReactNode;
}

export default function RecipeViewer({ codeString, children }: RecipeViewerProps) {
  const [view, setView] = useState<'prose' | 'code'>('prose');

  return (
    <div>
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setView('prose')}
          aria-pressed={view === 'prose'}
          className={`px-3 py-1 text-sm border rounded font-mono transition-colors ${
            view === 'prose'
              ? 'bg-green-500/20 text-green-400 border-green-500/50'
              : 'text-gray-400 border-gray-700 hover:text-green-400 hover:border-gray-500'
          }`}
        >
          prose
        </button>
        <button
          onClick={() => setView('code')}
          aria-pressed={view === 'code'}
          className={`px-3 py-1 text-sm border rounded font-mono transition-colors ${
            view === 'code'
              ? 'bg-green-500/20 text-green-400 border-green-500/50'
              : 'text-gray-400 border-gray-700 hover:text-green-400 hover:border-gray-500'
          }`}
        >
          {'<code />'}
        </button>
      </div>

      {view === 'prose' ? (
        <article className="prose prose-invert max-w-none">
          {children}
        </article>
      ) : (
        <CodeBlock className="language-go">{codeString}</CodeBlock>
      )}
    </div>
  );
}
