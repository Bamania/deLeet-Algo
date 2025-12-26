import Link from "next/link";

// Icons as simple SVG components
const SearchIcon = () => (
  <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const WindowIcon = () => (
  <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
  </svg>
);

const DependencyIcon = () => (
  <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
  </svg>
);

const NetworkIcon = () => (
  <svg className="w-8 h-8 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
  </svg>
);

const FinTechIcon = () => (
  <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
  </svg>
);

const SocialGraphIcon = () => (
  <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const CloudIcon = () => (
  <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
  </svg>
);

const SearchRecsIcon = () => (
  <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const GitHubIcon = () => (
  <svg className="w-5 h-5 text-zinc-400 hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const implementations = [
  {
    icon: <WindowIcon />,
    title: "API Rate Limiter",
    description: "Preventing service abuse by limiting the number of requests a user can make within a specific time window.",
    tags: ["Latency: Low", "Scale: Distributed"],
    badge: "Sliding Window",
    href: "/sliding",
    comingSoon: false,
    stats: { left: "5", right: "DAG OK" },
  },
  {
    icon: <DependencyIcon />,
    title: "Dependency Resolution Engine",
    description: "Visualizing how build systems like Make, npm, or pip resolve execution order. Define tasks and dependencies to see the Directed Acyclic Graph (DAG) sort in real time.",
    tags: ["Graph Theory", "Topological Sort"],
    badge: "Topological Sort",
    href: "#",
    comingSoon: true,
    stats: { left: "5", right: "DAG OK" },
  },
  {
    icon: <NetworkIcon />,
    title: "Network Broadcast: BFS Spread",
    description: "Visualizing message propagation and shortest path discovery in social graphs. See how a single node broadcasts to the entire network layer by layer.",
    tags: ["Graph", "BFS"],
    badge: "BFS Broadcast",
    href: "#",
    comingSoon: true,
    stats: { left: "0", right: "SYNC" },
  },
];

const problemDomains = [
  { icon: <FinTechIcon />, title: "FinTech" },
  { icon: <SocialGraphIcon />, title: "Social Graph" },
  { icon: <CloudIcon />, title: "Cloud Infra" },
  { icon: <SearchRecsIcon />, title: "Search & Recs" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* Navbar */}
      <header className="border-b border-zinc-800/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white font-semibold">
            <div className="w-7 h-7 bg-orange-500 rounded flex items-center justify-center text-xs font-bold">
              de
            </div>
            <span>deLeet algo</span>
          </Link>
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <GitHubIcon />
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="inline-flex items-center gap-2 bg-zinc-800/50 text-orange-400 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 bg-orange-400 rounded-full"></span>
          REAL-WORLD ENGINEERING
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
         See Why Algorithms Exist
        </h1>
        <p className="text-zinc-400 text-lg max-w-xl mb-4 leading-relaxed">
          Demystifying data structures through real-world applications. See algorithms come alive.
          Interactive playgrounds that show how data structures solve real problems from rate limiters to search engines."
        </p>
        <p className="text-zinc-500 text-sm mb-8 italic">
          Built for builders, not grinders.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="#implementations"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Explore Patterns
          </Link>
        </div>
      </section>

      {/* High-Scale Implementations */}
      <section id="implementations" className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold">High-Scale Implementations</h2>
          <Link href="#" className="text-orange-400 hover:text-orange-300 text-sm flex items-center gap-1 transition-colors">
            View all patterns
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {implementations.map((item, index) => {
            const CardWrapper = item.comingSoon ? 'div' : Link;
            const cardProps = item.comingSoon 
              ? { className: "group bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 opacity-75 cursor-not-allowed" }
              : { href: item.href, className: "group bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-all hover:bg-zinc-900" };
            
            return (
              <CardWrapper key={index} {...cardProps as any}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <div className="flex items-center gap-2">
                      {item.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className="text-xs text-zinc-500">
                          {tag}{tagIndex < item.tags.length - 1 ? ' •' : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded font-mono">
                    {item.badge}
                  </span>
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${item.comingSoon ? 'text-white' : 'group-hover:text-orange-400'} transition-colors`}>
                  {item.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                  {item.description}
                </p>
                {item.comingSoon && (
                  <div className="flex items-center justify-end">
                    <span className="text-xs bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full font-medium">
                      Coming Soon
                    </span>
                  </div>
                )}
              </CardWrapper>
            );
          })}
        </div>
      </section>

      {/* Explore by Problem Domain */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-xl font-semibold mb-8">Explore by Problem Domain</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {problemDomains.map((domain, index) => (
            <Link
              key={index}
              href="#"
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 flex flex-col items-center gap-3 hover:border-zinc-700 transition-all hover:bg-zinc-900 group"
            >
              <div className="group-hover:text-white transition-colors">
                {domain.icon}
              </div>
              <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">
                {domain.title}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 mt-12">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-white font-semibold">
                <div className="w-7 h-7 bg-orange-500 rounded flex items-center justify-center text-xs font-bold">
                  de
                </div>
                <span>deLeet algo</span>
              </Link>
              <span className="text-zinc-600">•</span>
              <p className="text-zinc-500 text-sm">
                Bridging the gap between LeetCode and Production.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-zinc-500 text-sm">© 2025 deLeet algo.</p>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <GitHubIcon />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
