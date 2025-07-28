import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Github, Twitter, Linkedin, Mail, Calendar, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function Component() {
  const blogPosts = [
    {
      title: "Building Scalable APIs with Node.js and TypeScript",
      excerpt:
        "Learn how to architect robust backend services using modern JavaScript technologies and best practices for production environments.",
      date: "2024-01-15",
      readTime: "8 min read",
      tags: ["Node.js", "TypeScript", "API Design"],
    },
    {
      title: "Advanced React Patterns: Compound Components",
      excerpt:
        "Explore advanced React patterns that will make your components more flexible, reusable, and maintainable in large applications.",
      date: "2024-01-10",
      readTime: "12 min read",
      tags: ["React", "JavaScript", "Design Patterns"],
    },
    {
      title: "Database Optimization Techniques for High-Traffic Apps",
      excerpt:
        "Deep dive into database indexing, query optimization, and caching strategies to handle millions of requests efficiently.",
      date: "2024-01-05",
      readTime: "15 min read",
      tags: ["Database", "Performance", "PostgreSQL"],
    },
  ]

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-mono">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-sm flex items-center justify-center">
                <span className="text-gray-950 font-bold text-sm">{"</>"}</span>
              </div>
              <span className="text-xl font-bold text-green-400">jadams.pw</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#home" className="text-gray-300 hover:text-green-400 transition-colors">
                ~/home
              </Link>
              <Link href="#posts" className="text-gray-300 hover:text-green-400 transition-colors">
                ~/posts
              </Link>
              <Link href="#about" className="text-gray-300 hover:text-green-400 transition-colors">
                ~/about
              </Link>
              <Link href="#contact" className="text-gray-300 hover:text-green-400 transition-colors">
                ~/contact
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="https://github.com" className="text-gray-400 hover:text-green-400 transition-colors">
                <Github className="w-5 h-5" />
              </Link>
              <Link href="https://twitter.com" className="text-gray-400 hover:text-green-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="mb-6">
            <span className="text-green-400 text-sm">{"$ whoami"}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="text-gray-100">Building the future,</span>
            <br />
            <span className="text-green-400">one commit at a time</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            Welcome to my corner of the internet where I share insights about software engineering, system design, and
            the latest in tech. Join me on this journey of continuous learning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-green-500 hover:bg-green-600 text-gray-950 font-semibold px-8 py-3">
              Read Latest Posts
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-3 bg-transparent"
            >
              Subscribe to Newsletter
            </Button>
          </div>
        </div>
      </section>

      {/* Recent Posts Section */}
      <section id="posts" className="py-20 px-4 bg-gray-900/50">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-4 text-green-400">{"$ ls ~/recent-posts"}</h2>
            <p className="text-gray-400 text-lg">Latest thoughts and tutorials from the development trenches</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post, index) => (
              <Card
                key={index}
                className="bg-gray-800 border-gray-700 hover:border-green-500/50 transition-all duration-300 group"
              >
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                    <Clock className="w-4 h-4 ml-2" />
                    <span>{post.readTime}</span>
                  </div>
                  <CardTitle className="text-gray-100 group-hover:text-green-400 transition-colors">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="text-gray-400 leading-relaxed">{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, tagIndex) => (
                      <Badge
                        key={tagIndex}
                        variant="secondary"
                        className="bg-gray-700 text-gray-300 hover:bg-green-500/20 hover:text-green-400"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="ghost" className="text-green-400 hover:text-green-300 hover:bg-green-500/10 p-0">
                    Read more →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" className="border-green-500 text-green-400 hover:bg-green-500/10 bg-transparent">
              View All Posts
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-green-400">{"$ cat ~/about.txt"}</h2>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>{"> Jason Adams - Senior Software Engineer & Tech Leader"}</p>
                <p>{"> Passionate about building scalable systems and crafting elegant technical solutions"}</p>
                <p>{"> Expertise in full-stack development, cloud architecture, and DevOps practices"}</p>
                <p>{"> Currently focused on modern web technologies, microservices, and developer experience"}</p>
                <p>{"> Open source contributor and advocate for clean, maintainable code"}</p>
              </div>
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4 text-green-400">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "JavaScript",
                    "TypeScript",
                    "React",
                    "Node.js",
                    "Python",
                    "Go",
                    "PostgreSQL",
                    "MongoDB",
                    "Docker",
                    "Kubernetes",
                    "AWS",
                    "GCP",
                  ].map((tech) => (
                    <Badge key={tech} className="bg-gray-800 text-gray-300 border border-gray-600">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="mt-8">
                <Button
                  variant="outline"
                  className="border-green-500 text-green-400 hover:bg-green-500/10 bg-transparent"
                  asChild
                >
                  <Link href="https://www.linkedin.com/in/jasonkradams/" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="w-4 h-4 mr-2" />
                    Connect on LinkedIn
                  </Link>
                </Button>
              </div>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="text-green-400 mb-2">{"$ git log --oneline --graph"}</div>
              <div className="space-y-2 text-sm text-gray-400 font-mono">
                <div>{"* f8a9b2c Launched jadams.pw tech blog"}</div>
                <div>{"* e7d6c5b Implemented microservices architecture"}</div>
                <div>{"* b4a3f9e Led team migration to cloud-native stack"}</div>
                <div>{"* a1b2c3d Optimized CI/CD pipeline performance"}</div>
                <div>{"* g7h8i9j Initial commit: Engineering excellence"}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold mb-4 text-green-400">{"$ subscribe --newsletter"}</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Get the latest posts and insights delivered directly to your inbox. No spam, just quality content about
            software development.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your.email@domain.com"
              className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-md text-gray-100 placeholder-gray-400 focus:outline-none focus:border-green-500"
            />
            <Button className="bg-green-500 hover:bg-green-600 text-gray-950 font-semibold px-6">Subscribe</Button>
          </div>
        </div>
      </section>

      {/* Footer */}
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
                <Link href="https://github.com" className="text-gray-400 hover:text-green-400 transition-colors">
                  <Github className="w-6 h-6" />
                </Link>
                <Link href="https://twitter.com" className="text-gray-400 hover:text-green-400 transition-colors">
                  <Twitter className="w-6 h-6" />
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
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>{"© 2024 jadams.pw. Built with Next.js and hosted on GitHub Pages."}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
