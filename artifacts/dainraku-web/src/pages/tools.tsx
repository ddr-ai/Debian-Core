import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ExternalLink, PackageOpen, ChevronLeft, ChevronRight, Terminal } from 'lucide-react';
import toolsData from '@/data/tools.json';
import { cn } from '@/lib/utils';

// Color map for categories
const categoryColors: Record<string, string> = {
  "Reconnaissance": "text-cyan-400 border-cyan-400/30 bg-cyan-400/10",
  "Web Pentesting": "text-purple-400 border-purple-400/30 bg-purple-400/10",
  "Exploitation": "text-red-400 border-red-400/30 bg-red-400/10",
  "Wireless": "text-blue-400 border-blue-400/30 bg-blue-400/10",
  "Password Attacks": "text-orange-400 border-orange-400/30 bg-orange-400/10",
  "Forensics": "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
  "Post-Exploitation": "text-rose-400 border-rose-400/30 bg-rose-400/10",
  "Sniffing & Spoofing": "text-teal-400 border-teal-400/30 bg-teal-400/10",
  "Social Engineering": "text-pink-400 border-pink-400/30 bg-pink-400/10",
  "Reporting": "text-green-400 border-green-400/30 bg-green-400/10",
  "Developer Tools": "text-zinc-400 border-zinc-400/30 bg-zinc-400/10",
};

const ITEMS_PER_PAGE = 50;

export default function Tools() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    toolsData.forEach(t => cats.add(t.category));
    return Array.from(cats).sort();
  }, []);

  // Filter tools
  const filteredTools = useMemo(() => {
    let filtered = toolsData;
    
    if (selectedCategory) {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }
    
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(q) || 
        t.description.toLowerCase().includes(q) ||
        t.package.toLowerCase().includes(q)
      );
    }
    
    return filtered;
  }, [search, selectedCategory]);

  // Paginate
  const totalPages = Math.ceil(filteredTools.length / ITEMS_PER_PAGE);
  const paginatedTools = filteredTools.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // Reset page when filters change
  useMemo(() => setPage(1), [search, selectedCategory]);

  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* Header */}
      <section className="bg-card/50 border-b border-primary/20 py-12 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,240,255,0.1)_0%,transparent_70%)]"></div>
        <div className="container px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tight mb-4">
            Security <span className="text-primary glow-text">Arsenal</span>
          </h1>
          <p className="text-muted-foreground font-mono max-w-2xl">
            Explore the {toolsData.length} pre-configured tools available in DainRaku OS. 
            All tools are maintained via custom APT repositories.
          </p>
        </div>
      </section>

      {/* Controls */}
      <section className="py-6 sticky top-16 z-30 bg-background/95 backdrop-blur-md border-b border-primary/10">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50" />
              <input 
                type="text" 
                placeholder="Search tools by name, package, or description..." 
                className="w-full bg-black/50 border border-primary/30 rounded-none py-2 pl-10 pr-4 font-mono text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto hide-scrollbar">
              <Filter className="w-4 h-4 text-primary/50 shrink-0" />
              <button
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  "whitespace-nowrap px-3 py-1 font-mono text-xs border transition-colors",
                  selectedCategory === null 
                    ? "bg-primary text-primary-foreground border-primary" 
                    : "border-primary/30 text-muted-foreground hover:border-primary/60 hover:text-foreground"
                )}
              >
                ALL
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "whitespace-nowrap px-3 py-1 font-mono text-xs border transition-colors",
                    selectedCategory === cat 
                      ? "bg-primary/20 text-primary border-primary" 
                      : "border-primary/30 text-muted-foreground hover:border-primary/60 hover:text-foreground"
                  )}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-8 flex-1 container px-4">
        <div className="flex justify-between items-end mb-6 font-mono text-sm text-primary/70 border-b border-primary/10 pb-2">
          <span>{filteredTools.length} MODULES FOUND</span>
          {totalPages > 1 && <span>PAGE {page}/{totalPages}</span>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {paginatedTools.map((tool, index) => (
              <motion.div
                key={tool.name}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-card border border-primary/20 p-5 flex flex-col group hover:border-primary/50 transition-colors relative"
              >
                <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a href={tool.homepage} target="_blank" rel="noreferrer" className="text-primary hover:text-primary/70">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                
                <div className="mb-3 flex justify-between items-start">
                  <h3 className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors">{tool.name}</h3>
                </div>
                
                <div className="mb-4">
                  <span className={cn(
                    "inline-flex items-center px-2 py-0.5 border text-[10px] font-mono uppercase tracking-wider",
                    categoryColors[tool.category] || "text-primary border-primary/30 bg-primary/10"
                  )}>
                    {tool.category}
                  </span>
                </div>
                
                <p className="text-muted-foreground text-sm font-sans mb-6 flex-1 line-clamp-3">
                  {tool.description}
                </p>
                
                <div className="mt-auto flex items-center gap-2 text-xs font-mono text-primary/60 bg-black/40 p-2 border border-primary/10">
                  <PackageOpen className="w-3 h-3" />
                  <span className="truncate">apt install {tool.package}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredTools.length === 0 && (
          <div className="py-20 text-center border border-dashed border-primary/30 bg-primary/5">
            <Terminal className="w-12 h-12 text-primary/30 mx-auto mb-4" />
            <h3 className="font-display font-bold text-xl text-foreground mb-2">NO MODULES FOUND</h3>
            <p className="font-mono text-sm text-muted-foreground">Adjust search parameters or category filter.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-4 font-mono">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 border border-primary/30 text-primary hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, i) => {
                const p = i + 1;
                // Show first, last, current, and adjacent pages
                if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) {
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={cn(
                        "w-8 h-8 flex items-center justify-center border transition-colors",
                        page === p ? "bg-primary text-primary-foreground border-primary" : "border-primary/30 text-muted-foreground hover:border-primary/60"
                      )}
                    >
                      {p}
                    </button>
                  );
                } else if (p === page - 2 || p === page + 2) {
                  return <span key={p} className="w-8 h-8 flex items-center justify-center text-primary/50">..</span>;
                }
                return null;
              })}
            </div>
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 border border-primary/30 text-primary hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
