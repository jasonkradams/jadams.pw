import Header from "../components/Header";
import Footer from "../components/Footer";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Heart, Users } from "lucide-react";

export const metadata = {
  title: "What I'm Doing Now | Jason Adams",
  description: "Current activities, projects, and focus areas",
};

export default function NowPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-mono">
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-6">
            <span className="text-green-400 text-sm">{"$ cat ~/now"}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-100">
            What I&apos;m Doing Now
          </h1>
          <p className="text-xl text-gray-400 mb-8 leading-relaxed">
            A snapshot of my current activities and focus areas. Last updated{" "}
            <span className="text-green-400">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>.
          </p>
        </div>
      </section>

      {/* At Work Section */}
      <section className="py-12 px-4 bg-gray-900/50">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <Briefcase className="w-6 h-6 text-green-400" />
            <h2 className="text-2xl font-bold text-green-400">At Work</h2>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-green-400 mt-1">→</span>
              <div>
                <p className="text-gray-300 leading-relaxed">
                  Working at <span className="text-green-400 font-semibold">OpenEye</span> as a <span className="text-green-400 font-semibold">Site Reliability Engineer II</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <Heart className="w-6 h-6 text-green-400" />
            <h2 className="text-2xl font-bold text-green-400">Personally</h2>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-green-400 mt-1">→</span>
              <div>
                <p className="text-gray-300 leading-relaxed">
                  Raising two children <Badge className="bg-gray-700 text-gray-300 border border-gray-600 ml-2">(1 and 4)</Badge>
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-400 mt-1">→</span>
              <div>
                <p className="text-gray-300 leading-relaxed">
                  Hiking and biking local trails
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Volunteering Section */}
      <section className="py-12 px-4 bg-gray-900/50">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-green-400" />
            <h2 className="text-2xl font-bold text-green-400">Volunteering</h2>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-green-400 mt-1">→</span>
              <div>
                <p className="text-gray-300 leading-relaxed">
                  On the board for the <span className="text-green-400 font-semibold">Spokane Mountaineers</span>
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-400 mt-1">→</span>
              <div>
                <p className="text-gray-300 leading-relaxed">
                  Contributing to their backend website maintenance and feature work
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inspired By Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <p className="text-gray-400 leading-relaxed">
              Inspired by{" "}
              <a 
                href="https://nownownow.com/about" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-green-400 hover:text-green-300 underline"
              >
                nownownow.com/about
              </a>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
