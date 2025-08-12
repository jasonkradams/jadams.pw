import type { MDXComponents } from 'mdx/types';
import CodeBlock from './CodeBlock';

// Define MDX components as a regular object
export const mdxComponents: MDXComponents = {
  // Customize built-in components with styling
  h1: ({ children }) => <h1 className="text-3xl font-bold my-6 text-green-400">{children}</h1>,
  h2: ({ children }) => <h2 className="text-2xl font-bold my-5 text-green-400">{children}</h2>,
  h3: ({ children }) => <h3 className="text-xl font-bold my-4 text-green-300">{children}</h3>,
  p: ({ children }) => <p className="my-4 leading-relaxed">{children}</p>,
  ul: ({ children }) => <ul className="list-disc pl-6 my-4 space-y-2">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-6 my-4 space-y-2">{children}</ol>,
  li: ({ children }) => <li className="my-1">{children}</li>,
  a: ({ children, href }) => (
    <a 
      href={href} 
      className="text-green-400 hover:underline hover:text-green-300 transition-colors"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  // Inline code (not in pre blocks)
  code: ({ children, className, ...props }) => {
    // If it's part of a pre block (syntax highlighted), use our CodeBlock component
    if (className?.startsWith('language-')) {
      return <CodeBlock className={className} {...props}>{children}</CodeBlock>;
    }
    // Otherwise, style as inline code
    return (
      <code className="bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-green-300">
        {children}
      </code>
    );
  },
  // Pre blocks for code - let the code component handle it
  pre: ({ children }) => {
    // If the child is a code element with a language class, pass it through
    if (typeof children === 'object' && children && 'props' in children) {
      const codeElement = children as any;
      if (codeElement.props?.className?.startsWith('language-')) {
        return <CodeBlock {...codeElement.props}>{codeElement.props.children}</CodeBlock>;
      }
    }
    // Otherwise, render as a regular pre block
    return (
      <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto my-6 text-sm">
        {children}
      </pre>
    );
  },
  // Add more components as needed
};
