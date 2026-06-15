import Link from "next/link";
import { Heart } from "lucide-react";
import Image from "next/image";

// Inline SVG components for brand icons that aren't in lucide-react
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const DiscordIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 5s-2.7-1.7-5.5-2.2c-.3.6-.6 1.3-.8 2-3.1-.3-6.2-.3-9.3 0-.2-.7-.5-1.4-.8-2-2.8.5-5.5 2.2-5.5 2.2C-2.2 14.8.4 23.4.4 23.4c3.3 2.5 6.4 3.1 6.4 3.1l1.1-1.4c-2.3-.7-4.1-1.7-4.1-1.7s.3.2.7.4c4 2.2 8.4 2.2 12.3.2.4-.2.9-.5 1.4-.8 0 0-1.8 1-4.1 1.7l1.1 1.4s3.1-.6 6.4-3.1c0 0 2.6-8.6-2.5-18.4zM8.5 16.5c-1.3 0-2.4-1.2-2.4-2.7 0-1.5 1.1-2.7 2.4-2.7 1.3 0 2.4 1.2 2.4 2.7 0 1.5-1.1 2.7-2.4 2.7zm7 0c-1.3 0-2.4-1.2-2.4-2.7 0-1.5 1.1-2.7 2.4-2.7 1.3 0 2.4 1.2 2.4 2.7 0 1.5-1.1 2.7-2.4 2.7z"></path>
  </svg>
);

export default function Footer() {
  const footerLinks = {
    company: [
      "About", "Blog", "Shop", "Community", "Help Center", "Pricing", "For Schools"
    ],
    practice: [
      "Challenges", "Projects", "#30DaysOfCode"
    ],
    learn1: [
      "All Courses", "Python", "Intermediate Python", "NumPy", "SQL",
      "GenAI", "Pandas", "Matplotlib", "Machine Learning", "HTML",
      "CSS", "JavaScript", "Intermediate JavaScript"
    ],
    learn2: [
      "React", "Node.js", "p5.js", "Command Line", "Git & GitHub",
      "GitHub Copilot", "C++", "C#", "Java", "Data Structures & Algorithms",
      "Phaser", "Lua", "UI/UX Design"
    ]
  };

  return (
    <footer className="w-full bg-[#0B0C10] border-t border-white/10 pt-16 pb-8 px-6 sm:px-12 mt-12">
      <div className="max-w-[1400px] mx-auto">

        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="CosmoDex Logo"
              width={32}
              height={32}
              className="object-contain"
            />
            <span className="text-xl font-bold tracking-wide text-white">CosmoDex</span>
          </div>

          <div className="flex items-center gap-2 text-text-secondary text-sm font-lato">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> in the Cosmos
          </div>
        </div>

        {/* Main Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12 mb-16">

          {/* Company */}
          <div className="flex flex-col gap-4">
            <h4 className="text-text-secondary text-xs font-bold tracking-widest uppercase mb-2">Company</h4>
            {footerLinks.company.map((link) => (
              <Link key={link} href="#" className="text-text-primary hover:text-white text-sm transition-colors w-fit">
                {link}
              </Link>
            ))}
          </div>

          {/* Practice */}
          <div className="flex flex-col gap-4">
            <h4 className="text-text-secondary text-xs font-bold tracking-widest uppercase mb-2">Practice</h4>
            {footerLinks.practice.map((link) => (
              <Link key={link} href="#" className="text-text-primary hover:text-white text-sm transition-colors w-fit">
                {link}
              </Link>
            ))}
          </div>

          {/* Learn (Spans multiple columns effectively in visual layout) */}
          <div className="flex flex-col gap-4 lg:col-span-1">
            <h4 className="text-text-secondary text-xs font-bold tracking-widest uppercase mb-2">Learn</h4>
            {footerLinks.learn1.map((link) => (
              <Link key={link} href="#" className="text-text-primary hover:text-white text-sm transition-colors w-fit">
                {link}
              </Link>
            ))}
          </div>

          {/* Learn Column 2 */}
          <div className="flex flex-col gap-4 lg:col-span-1 lg:mt-8">
            {footerLinks.learn2.map((link) => (
              <Link key={link} href="#" className="text-text-primary hover:text-white text-sm transition-colors w-fit">
                {link}
              </Link>
            ))}
          </div>

        </div>

        {/* Bottom Footer Row */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 gap-6">

          <div className="flex items-center gap-4 text-xs text-text-secondary">
            <span>© 2026 CosmoDex, Inc.</span>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
          </div>

          <div className="flex items-center gap-3">
            {[
              { icon: InstagramIcon, color: "hover:text-[#E1306C]" },
              { icon: TwitterIcon, color: "hover:text-[#1DA1F2]" },
              { icon: GithubIcon, color: "hover:text-white" },
              { icon: YoutubeIcon, color: "hover:text-[#FF0000]" },
              { icon: LinkedinIcon, color: "hover:text-[#0077B5]" },
              { icon: DiscordIcon, color: "hover:text-[#5865F2]" }
            ].map((social, idx) => {
              const Icon = social.icon;
              return (
                <Link key={idx} href="#" className={`w-8 h-8 rounded bg-white/5 flex items-center justify-center text-text-secondary transition-all ${social.color}`}>
                  <Icon className="w-4 h-4" />
                </Link>
              );
            })}
          </div>

        </div>
      </div>
    </footer>
  );
}
