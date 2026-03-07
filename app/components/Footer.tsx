import Link from "next/link"
import { Mail } from "lucide-react"
import { SiGithub, SiLinkedin } from "react-icons/si"
import Logo from "./Logo"

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="mb-4">
              <Logo />
            </div>
            <p className="text-gray-400 leading-relaxed">
              Sharing knowledge and building the future of web development, one post at a time.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-green-400">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/" className="block text-gray-400 hover:text-green-400 transition-colors">
                Home
              </Link>
              <Link href="/#posts" className="block text-gray-400 hover:text-green-400 transition-colors">
                Blog Posts
              </Link>
              <Link href="/#about" className="block text-gray-400 hover:text-green-400 transition-colors">
                About
              </Link>
              <Link href="/now" className="block text-gray-400 hover:text-green-400 transition-colors">
                Now
              </Link>
              <Link href="/recipes" className="block text-gray-400 hover:text-green-400 transition-colors">
                Recipes
              </Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-green-400">Connect</h3>
            <div className="flex space-x-4">
              <Link href="https://github.com/jasonkradams/jadams.pw" className="text-gray-400 hover:text-green-400 transition-colors">
                <SiGithub className="w-6 h-6" />
              </Link>
              <Link href="https://www.linkedin.com/in/jasonkradams/" className="text-gray-400 hover:text-green-400 transition-colors">
                <SiLinkedin className="w-6 h-6" />
              </Link>
              <Link href="mailto:hello@jadams.pw" className="text-gray-400 hover:text-green-400 transition-colors">
                <Mail className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>
        <div className="text-center text-sm mt-8">
          &copy; {new Date().getFullYear()} Jason Adams &mdash; Built with Next.js, React, and Tailwind CSS.
        </div>
      </div>
    </footer>
  );
}
