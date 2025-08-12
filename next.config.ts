import type { NextConfig } from "next";
import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  output: 'export',
  pageExtensions: ['ts', 'tsx', 'mdx'],
  experimental: {
    allowedDevOrigins: [
      '10.136.95.218', // Your local network IP
      'localhost'      // Localhost for good measure
    ]
  },
  images: {
    unoptimized: true, // Required for static exports
  },
};

// Configure MDX
const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    // If you're using remark-gfm, you'll need to install it separately
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
