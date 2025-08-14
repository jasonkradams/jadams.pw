import Link from "next/link"
import { Github, Linkedin, Mail } from "lucide-react"

export default function Footer() {
  return (
<footer className="border-t border-gray-800 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-sm flex items-center justify-center">
                  <span className="text-gray-950 font-bold text-sm">{"</>"}</span>
                </div>
                <span className="text-xl font-bold text-green-400">jadams.pw</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Sharing knowledge and building the future of web development, one post at a time.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-green-400">Quick Links</h3>
              <div className="space-y-2">
                <Link href="#home" className="block text-gray-400 hover:text-green-400 transition-colors">
                  Home
                </Link>
                <Link href="#posts" className="block text-gray-400 hover:text-green-400 transition-colors">
                  Blog Posts
                </Link>
                <Link href="#about" className="block text-gray-400 hover:text-green-400 transition-colors">
                  About
                </Link>
                <Link href="/rss" className="block text-gray-400 hover:text-green-400 transition-colors">
                  RSS Feed
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-green-400">Connect</h3>
              <div className="flex space-x-4">
                <Link href="https://github.com/jasonkradams/jadams.pw" className="text-gray-400 hover:text-green-400 transition-colors">
                  <Github className="w-6 h-6" />
                </Link>
                <Link href="https://linkedin.com" className="text-gray-400 hover:text-green-400 transition-colors">
                  <Linkedin className="w-6 h-6" />
                </Link>
                <Link href="mailto:hello@example.com" className="text-gray-400 hover:text-green-400 transition-colors">
                  <Mail className="w-6 h-6" />
                </Link>
              </div>
            </div>
          </div>
          <div className="container mx-auto px-4 text-center text-sm">
            &copy; {new Date().getFullYear()} Jason Adams &mdash; Built with Next.js, React, and Tailwind CSS.
          </div>
        </div>
      </footer>
  );
}
