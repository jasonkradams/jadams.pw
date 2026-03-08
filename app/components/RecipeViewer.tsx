'use client';

import { useState } from 'react';
import CodeBlock from './CodeBlock';
import type { StructuredIngredient } from '@/app/recipes/recipes-index';

interface RecipeViewerProps {
  codeString: string;
  ingredients: StructuredIngredient[];
  children: React.ReactNode;
}

const SCALES = [1, 1.5, 2, 3] as const;
type Scale = typeof SCALES[number];

const FRACTIONS: Record<number, string> = {
  0.25: '¼',
  0.33: '⅓',
  0.5: '½',
  0.67: '⅔',
  0.75: '¾',
};

function formatQuantity(value: number): string {
  const whole = Math.floor(value);
  const frac = Math.round((value - whole) * 100) / 100;

  const fracStr = FRACTIONS[frac] ?? (frac > 0 ? frac.toString().replace('0.', '.') : '');

  if (whole === 0) return fracStr || value.toString();
  if (!fracStr) return whole.toString();
  return `${whole}${fracStr}`;
}

export default function RecipeViewer({ codeString, ingredients, children }: RecipeViewerProps) {
  const [view, setView] = useState<'prose' | 'code'>('prose');
  const [scale, setScale] = useState<Scale>(1);

  return (
    <div>
      <div className="flex items-center gap-2 mb-8 flex-wrap">
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

        {view === 'prose' && ingredients.length > 0 && (
          <>
            <span className="text-gray-600 text-sm font-mono ml-2">scale:</span>
            {SCALES.map(s => (
              <button
                key={s}
                onClick={() => setScale(s)}
                aria-pressed={scale === s}
                className={`px-2 py-1 text-sm border rounded font-mono transition-colors ${
                  scale === s
                    ? 'bg-green-500/20 text-green-400 border-green-500/50'
                    : 'text-gray-400 border-gray-700 hover:text-green-400 hover:border-gray-500'
                }`}
              >
                {s}x
              </button>
            ))}
          </>
        )}
      </div>

      {view === 'prose' ? (
        <article className="prose prose-invert max-w-none">
          {ingredients.length > 0 && (
            <>
              <h2 className="text-2xl font-bold my-5 text-green-400">Ingredients</h2>
              <div className="overflow-x-auto my-6">
                <table className="w-full border-collapse text-sm">
                  <thead className="border-b border-gray-700">
                    <tr className="border-b border-gray-800">
                      <th scope="col" className="px-4 py-2 text-left text-green-400 font-semibold whitespace-nowrap">Quantity</th>
                      <th scope="col" className="px-4 py-2 text-left text-green-400 font-semibold whitespace-nowrap">Ingredient</th>
                      <th scope="col" className="px-4 py-2 text-left text-green-400 font-semibold whitespace-nowrap">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ingredients.map((ing, i) => {
                      const scaled = ing.quantity * scale;
                      const qty = formatQuantity(scaled);
                      const quantity = [qty, ing.measurement].filter(p => p && p.trim()).join(' ');
                      return (
                        <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                          <td className="px-4 py-2 text-gray-300 align-top"><strong>{quantity}</strong></td>
                          <td className="px-4 py-2 text-gray-300 align-top">{ing.product}</td>
                          <td className="px-4 py-2 text-gray-300 align-top">{ing.note ?? ''}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <hr />
            </>
          )}
          {children}
        </article>
      ) : (
        <CodeBlock className="language-go">{codeString}</CodeBlock>
      )}
    </div>
  );
}
