"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiGithub } from "react-icons/si";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-sm flex items-center justify-center">
                <span className="text-gray-950 font-bold text-sm">{"</>"}</span>
              </div>
              <span className="text-xl font-bold text-green-400">jadams.pw</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/#home" className="text-gray-300 hover:text-green-400 transition-colors">
              ~/home
            </Link>
            <Link
              href={pathname === "/" ? "#posts" : "/posts"}
              className="text-gray-300 hover:text-green-400 transition-colors"
            >
              ~/posts
            </Link>
            <Link href="/#about" className="text-gray-300 hover:text-green-400 transition-colors">
              ~/about
            </Link>
            <Link href="/#contact" className="text-gray-300 hover:text-green-400 transition-colors">
              ~/contact
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="https://github.com/jasonkradams/jadams.pw" className="text-gray-400 hover:text-green-400 transition-colors" aria-label="GitHub">
              <SiGithub className="w-5 h-5" />
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
