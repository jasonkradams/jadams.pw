export default function Footer() {
  return (
    <footer className="border-t border-gray-800 text-gray-400 py-8 mt-16">
      <div className="container mx-auto px-4 text-center text-sm">
        &copy; {new Date().getFullYear()} Jason Adams &mdash; Built with Next.js, React, and Tailwind CSS.
      </div>
    </footer>
  );
}
