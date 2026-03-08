'use client';

import { useState } from 'react';
import Image from 'next/image';
import CodeBlock from './CodeBlock';
import type { StructuredIngredient, StructuredStep, NutritionRow } from '@/app/recipes/recipes-index';

interface RecipeViewerProps {
  codeString: string;
  description?: string;
  image?: string;
  equipment: string[];
  ingredients: StructuredIngredient[];
  instructions: StructuredStep[];
  tips: string[];
  nutrition: NutritionRow[];
}

const SCALES = [1, 1.5, 2, 3] as const;
type Scale = typeof SCALES[number];

const FRACTIONS: Record<number, string> = {
  0.13: '⅛',
  0.25: '¼',
  0.33: '⅓',
  0.5: '½',
  0.67: '⅔',
  0.75: '¾',
  0.88: '⅞',
};

function formatQuantity(value: number): string {
  const whole = Math.floor(value);
  const frac = Math.round((value - whole) * 100) / 100;

  const fracStr = FRACTIONS[frac] ?? (frac > 0 ? frac.toString().replace('0.', '.') : '');

  if (whole === 0) return fracStr || value.toString();
  if (!fracStr) return whole.toString();
  return `${whole}${fracStr}`;
}

// Normalize measurement aliases to canonical forms
const UNIT_ALIASES: Record<string, string> = {
  teaspoon: 'tsp', teaspoons: 'tsp',
  tablespoon: 'tbsp', tablespoons: 'tbsp',
  cups: 'cup',
  'fluid ounce': 'fl oz', 'fluid ounces': 'fl oz', floz: 'fl oz',
  ounce: 'oz', ounces: 'oz',
  pound: 'lb', pounds: 'lb', lbs: 'lb',
};

// Ordered conversion steps: only fires when qty >= minQty AND result is a clean fraction
const CONVERSION_STEPS: Array<{ from: string; minQty: number; to: string; factor: number }> = [
  { from: 'tsp',   minQty: 3,  to: 'tbsp', factor: 3 },
  { from: 'tbsp',  minQty: 4,  to: 'cup',  factor: 16 },
  { from: 'fl oz', minQty: 8,  to: 'cup',  factor: 8 },
  { from: 'oz',    minQty: 16, to: 'lb',   factor: 16 },
];

// Clean cooking fractions: values a fractional part must be near to allow conversion
const CLEAN_FRACTIONS = [0, 0.125, 0.25, 1 / 3, 0.5, 2 / 3, 0.75, 0.875];
const EPSILON = 0.02;

function isCleanFraction(value: number): boolean {
  const frac = value - Math.floor(value);
  return CLEAN_FRACTIONS.some(cf => Math.abs(frac - cf) < EPSILON);
}

function convertUnit(quantity: number, measurement: string): { quantity: number; measurement: string } {
  const unit = UNIT_ALIASES[measurement.toLowerCase()] ?? measurement.toLowerCase();
  let qty = quantity;
  let meas = unit;

  // Walk the chain repeatedly to allow multi-step conversions (e.g. tsp → tbsp → cup)
  let changed = true;
  while (changed) {
    changed = false;
    for (const step of CONVERSION_STEPS) {
      if (meas === step.from && qty >= step.minQty) {
        const candidate = qty / step.factor;
        if (isCleanFraction(candidate)) {
          qty = candidate;
          meas = step.to;
          changed = true;
          break; // restart chain from new unit
        }
      }
    }
  }

  // Preserve original casing/form if no conversion happened
  if (meas === (UNIT_ALIASES[measurement.toLowerCase()] ?? measurement.toLowerCase()) && qty === quantity) {
    return { quantity, measurement };
  }
  return { quantity: qty, measurement: meas };
}

export default function RecipeViewer({
  codeString,
  description,
  image,
  equipment,
  ingredients,
  instructions,
  tips,
  nutrition,
}: RecipeViewerProps) {
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
          {description && (
            <p className="text-gray-300 leading-relaxed mb-6">{description}</p>
          )}

          {image && (
            <div className="relative w-full aspect-video mb-6 rounded overflow-hidden">
              <Image src={image} alt="" fill className="object-cover" />
            </div>
          )}

          {(description || image) && <hr className="border-gray-800 my-6" />}

          {ingredients.length > 0 && (
            <>
              <h2 className="text-2xl font-bold my-5 text-green-400">Ingredients</h2>
              <div className="overflow-x-auto my-6">
                <table className="w-full border-collapse text-sm">
                  <thead className="border-b border-gray-700">
                    <tr className="border-b border-gray-800">
                      <th scope="col" className="px-4 py-2 text-left text-green-400 font-semibold whitespace-nowrap">Quantity</th>
                      <th scope="col" className="px-4 py-2 text-left text-green-400 font-semibold whitespace-nowrap">Ingredient</th>
                      <th scope="col" className="px-4 py-2 text-left text-green-400 font-semibold whitespace-nowrap">Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ingredients.map((ing, i) => {
                      const scaled = ing.quantity * scale;
                      const { quantity: convertedQty, measurement: convertedUnit } = convertUnit(scaled, ing.measurement);
                      const qty = formatQuantity(convertedQty);
                      const quantity = [qty, convertedUnit].filter(p => p && p.trim()).join(' ');
                      return (
                        <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                          <td className="px-4 py-2 text-gray-300 align-top"><strong>{quantity}</strong></td>
                          <td className="px-4 py-2 text-gray-300 align-top">{ing.product.charAt(0).toUpperCase() + ing.product.slice(1)}</td>
                          <td className="px-4 py-2 text-gray-300 align-top">{ing.note ?? ''}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <hr className="border-gray-800 my-6" />
            </>
          )}

          {equipment.length > 0 && (
            <>
              <h2 className="text-2xl font-bold my-5 text-green-400">Equipment</h2>
              <ul className="my-4 pl-6 list-disc text-gray-300">
                {equipment.map((item, i) => (
                  <li key={i} className="my-1">{item}</li>
                ))}
              </ul>
              <hr className="border-gray-800 my-6" />
            </>
          )}

          {instructions.length > 0 && (
            <>
              <h2 className="text-2xl font-bold my-5 text-green-400">Instructions</h2>
              {instructions.map((step, i) => (
                <div key={i} className="mb-6">
                  <p className="font-bold text-gray-100 mb-2">
                    {i + 1}. {step.title ?? step.instruction}
                  </p>
                  {step.title && (
                    <p className="text-gray-300 leading-relaxed">{step.instruction}</p>
                  )}
                </div>
              ))}
            </>
          )}

          {tips.length > 0 && (
            <>
              <hr className="border-gray-800 my-6" />
              <h2 className="text-2xl font-bold my-5 text-green-400">Tips</h2>
              <ul className="my-4 pl-6 list-disc text-gray-300">
                {tips.map((tip, i) => (
                  <li key={i} className="my-1">{tip}</li>
                ))}
              </ul>
            </>
          )}

          {nutrition.length > 0 && (
            <>
              <hr className="border-gray-800 my-6" />
              <h2 className="text-2xl font-bold my-5 text-green-400">Nutrition (per serving)</h2>
              <div className="overflow-x-auto my-6">
                <table className="w-full border-collapse text-sm">
                  <thead className="border-b border-gray-700">
                    <tr className="border-b border-gray-800">
                      <th scope="col" className="px-4 py-2 text-left text-green-400 font-semibold whitespace-nowrap">Nutrient</th>
                      <th scope="col" className="px-4 py-2 text-left text-green-400 font-semibold whitespace-nowrap">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nutrition.map((row, i) => (
                      <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                        <td className="px-4 py-2 text-gray-300 align-top">{row.nutrient}</td>
                        <td className="px-4 py-2 text-gray-300 align-top">{row.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </article>
      ) : (
        <CodeBlock className="language-go">{codeString}</CodeBlock>
      )}
    </div>
  );
}
