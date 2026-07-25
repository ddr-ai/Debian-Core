import { useState, useMemo } from 'react';
import { Download, CheckSquare, Square, HardDrive, Cpu, Settings, Shield, Network } from 'lucide-react';
import toolsData from '@/data/tools.json';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const BASE_SYSTEM_PACKAGES = 186; // Simulated count for base system, kernel, KDE, etc.

export default function IsoBuilder() {
  // Extract categories and their tool counts
  const categoryStats = useMemo(() => {
    const stats: Record<string, { count: number, packages: string[] }> = {};
    toolsData.forEach(t => {
      if (!stats[t.category]) {
        stats[t.category] = { count: 0, packages: [] };
      }
      stats[t.category].count++;
      stats[t.category].packages.push(t.package);
    });
    return Object.entries(stats).sort((a, b) => a[0].localeCompare(b[0])).map(([name, data]) => ({
      name,
      count: data.count,
      packages: data.packages
    }));
  }, []);

  // Selected categories state (Base is always selected, so we don't store it here, just the optional ones)
  const [selected, setSelected] = useState<Set<string>>(new Set(categoryStats.map(c => c.name)));

  const toggleCategory = (category: string) => {
    const next = new Set(selected);
    if (next.has(category)) {
      next.delete(category);
    } else {
      next.add(category);
    }
    setSelected(next);
  };

  const toggleAll = () => {
    if (selected.size === categoryStats.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(categoryStats.map(c => c.name)));
    }
  };

  const totalToolsSelected = useMemo(() => {
    let count = BASE_SYSTEM_PACKAGES;
    categoryStats.forEach(c => {
      if (selected.has(c.name)) count += c.count;
    });
    return count;
  }, [selected, categoryStats]);

  const estimatedIsoSize = useMemo(() => {
    // Rough estimation: Base ~ 2.4GB, each tool ~ 3MB compressed on average
    const baseSize = 2400; 
    let extraSize = 0;
    categoryStats.forEach(c => {
      if (selected.has(c.name)) extraSize += (c.count * 3.2);
    });
    const totalMB = baseSize + extraSize;
    return (totalMB / 1024).toFixed(2);
  }, [selected, categoryStats]);

  const downloadList = () => {
    let content = "# DainRaku OS Custom Package List\n";
    content += "# Generated via Web ISO Builder\n\n";
    
    content += "## BASE SYSTEM (Mandatory — always included by live-build/config/package-lists/base.list.chroot)\n";
    content += "# The base system (KDE Plasma, Liquorix kernel, Ghostty, BrowserOS, Calamares) is\n";
    content += "# automatically included. The packages below are the OPTIONAL category selections.\n";
    content += "# Place this file at: live-build/config/package-lists/custom.list.chroot\n\n";

    categoryStats.forEach(c => {
      if (selected.has(c.name)) {
        content += `## ${c.name.toUpperCase()} (${c.count} packages)\n`;
        // Deduplicate packages just in case
        const uniquePkgs = Array.from(new Set(c.packages)).sort();
        content += uniquePkgs.join('\n') + "\n\n";
      }
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dainraku-custom.list';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* Header */}
      <section className="bg-card/50 border-b border-primary/20 py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.08)_0%,transparent_60%)]"></div>
        <div className="container px-4 relative z-10 text-center">
          <HardDrive className="w-12 h-12 text-primary mx-auto mb-6 opacity-80" />
          <h1 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tight mb-4">
            Custom <span className="text-primary glow-text">ISO Builder</span>
          </h1>
          <p className="text-muted-foreground font-mono max-w-2xl mx-auto">
            Select the toolchains you need. Generate a customized <code>.list</code> file for the DainRaku build script to compile your bespoke pentesting OS.
          </p>
        </div>
      </section>

      <section className="py-12 container px-4 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Builder Form */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Base System - Always Selected */}
            <div className="border border-primary/20 bg-background/50 p-4 flex items-start gap-4 opacity-70 grayscale-[0.5]">
              <div className="mt-1">
                <CheckSquare className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-bold text-xl text-foreground">DAINRAKU BASE SYSTEM</h3>
                <p className="text-muted-foreground font-mono text-sm mt-1 mb-2">Core OS, KDE Plasma Desktop, Liquorix Kernel, BTRFS tools, basic networking.</p>
                <div className="flex gap-4 font-mono text-xs text-primary/70">
                  <span className="flex items-center gap-1"><Cpu className="w-3 h-3" /> Core</span>
                  <span className="flex items-center gap-1"><Settings className="w-3 h-3" /> {BASE_SYSTEM_PACKAGES} pkgs</span>
                </div>
              </div>
              <div className="hidden sm:block text-right font-mono text-xs text-muted-foreground">
                MANDATORY
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-between items-end border-b border-primary/10 pb-2">
              <span className="font-display font-bold text-lg">SECURITY MODULES</span>
              <button 
                onClick={toggleAll}
                className="font-mono text-xs text-primary hover:underline"
              >
                {selected.size === categoryStats.length ? '[ DESELECT ALL ]' : '[ SELECT ALL ]'}
              </button>
            </div>

            {/* Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoryStats.map((cat, i) => {
                const isSelected = selected.has(cat.name);
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={cat.name}
                    onClick={() => toggleCategory(cat.name)}
                    className={cn(
                      "border p-4 flex items-start gap-3 cursor-pointer transition-all duration-200",
                      isSelected 
                        ? "border-primary/50 bg-primary/5 shadow-[inset_0_0_15px_rgba(0,240,255,0.05)]" 
                        : "border-primary/10 bg-background/50 hover:border-primary/30"
                    )}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isSelected ? (
                        <CheckSquare className="w-5 h-5 text-primary" />
                      ) : (
                        <Square className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <h4 className={cn(
                        "font-mono text-sm font-bold tracking-wide transition-colors",
                        isSelected ? "text-primary" : "text-foreground"
                      )}>
                        {cat.name.toUpperCase()}
                      </h4>
                      <div className="mt-2 text-xs font-mono text-muted-foreground">
                        {cat.count} packages
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

          </div>

          {/* Telemetry Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 border border-primary/30 bg-card p-6 glow-border">
              <div className="flex items-center gap-2 text-primary mb-6 border-b border-primary/20 pb-4">
                <Network className="w-5 h-5" />
                <h3 className="font-mono font-bold tracking-widest text-sm">BUILD TELEMETRY</h3>
              </div>

              <div className="space-y-6 mb-8 font-mono">
                <div>
                  <div className="text-muted-foreground text-xs mb-1">TOTAL PACKAGES</div>
                  <div className="text-4xl font-display font-bold text-foreground">
                    {totalToolsSelected}
                  </div>
                </div>

                <div>
                  <div className="text-muted-foreground text-xs mb-1">SELECTED MODULES</div>
                  <div className="text-xl text-foreground">
                    {selected.size} / {categoryStats.length}
                  </div>
                </div>

                <div>
                  <div className="text-muted-foreground text-xs mb-1">EST. ISO SIZE</div>
                  <div className="text-xl text-primary glow-text">
                    ~{estimatedIsoSize} GB
                  </div>
                </div>
              </div>

              <button
                onClick={downloadList}
                className="w-full flex items-center justify-center gap-3 bg-primary text-primary-foreground font-mono font-bold tracking-widest py-4 hover:bg-primary/90 transition-all hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]"
              >
                <Download className="w-5 h-5" />
                GENERATE .LIST
              </button>

              <p className="mt-4 text-[10px] font-mono text-muted-foreground text-center leading-relaxed">
                Save this file as <code>custom.list</code> in the <code>config/package-lists/</code> directory of the build repository before executing build.sh.
              </p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
