import { useState, useEffect } from 'react';
import { Terminal, Cpu, HardDrive, GitBranch, Shield, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const sections = [
  { id: 'requirements', title: 'System Requirements', icon: Cpu },
  { id: 'quickstart', title: 'Quick Start', icon: Terminal },
  { id: 'btrfs', title: 'BTRFS Layout', icon: HardDrive },
  { id: 'packages', title: 'Package Customization', icon: Zap },
  { id: 'hardware', title: 'Hardware Detection', icon: Shield },
  { id: 'repos', title: 'Repository Switching', icon: GitBranch },
];

export default function BuildGuide() {
  const [activeSection, setActiveSection] = useState('requirements');

  // Simple scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const offsets = sections.map(s => {
        const el = document.getElementById(s.id);
        if (!el) return { id: s.id, offset: Infinity };
        return { id: s.id, offset: Math.abs(el.getBoundingClientRect().top - 150) };
      });
      const closest = offsets.reduce((prev, curr) => prev.offset < curr.offset ? prev : curr);
      setActiveSection(closest.id);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Header */}
      <section className="bg-card/50 border-b border-primary/20 py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(0,240,255,0.1)_0%,transparent_50%)]"></div>
        <div className="container px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tight mb-4">
            Build <span className="text-primary glow-text">Manual</span>
          </h1>
          <p className="text-muted-foreground font-mono max-w-2xl">
            Technical documentation for compiling, modifying, and deploying DainRaku OS from source.
          </p>
        </div>
      </section>

      <div className="container px-4 py-8 flex-1 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <aside className="md:w-64 shrink-0">
          <div className="sticky top-24 space-y-1 bg-black/40 border border-primary/20 p-2 font-mono text-sm">
            <div className="p-2 text-primary/60 border-b border-primary/10 mb-2">TABLE OF CONTENTS</div>
            {sections.map(s => {
              const Icon = s.icon;
              const isActive = activeSection === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 text-left transition-colors",
                    isActive ? "bg-primary/10 text-primary border-l-2 border-primary" : "text-muted-foreground hover:bg-primary/5 hover:text-foreground border-l-2 border-transparent"
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{s.title}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 space-y-24 pb-32">
          
          <section id="requirements" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 flex items-center justify-center border border-primary/30 text-primary">
                <Cpu className="w-5 h-5" />
              </div>
              <h2 className="text-3xl font-display font-bold uppercase">System Requirements</h2>
            </div>
            <div className="prose prose-invert prose-p:text-muted-foreground prose-headings:text-foreground max-w-none font-sans">
              <p>Building the ISO requires a Debian-based host system (Debian 12+ or Ubuntu 22.04+ recommended). The build process downloads packages, extracts them, and compresses the final filesystem, requiring significant storage and memory.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="border border-primary/20 bg-card p-4">
                  <h4 className="text-primary font-mono text-sm mb-2 uppercase">Minimum Host</h4>
                  <ul className="list-disc pl-4 space-y-1 text-sm">
                    <li>CPU: 4 Cores</li>
                    <li>RAM: 8 GB</li>
                    <li>Storage: 40 GB Free Space</li>
                    <li>OS: Debian 12 / Ubuntu 22.04</li>
                  </ul>
                </div>
                <div className="border border-primary/20 bg-card p-4">
                  <h4 className="text-primary font-mono text-sm mb-2 uppercase">Recommended Host</h4>
                  <ul className="list-disc pl-4 space-y-1 text-sm">
                    <li>CPU: 8+ Cores (parallel compression)</li>
                    <li>RAM: 16+ GB</li>
                    <li>Storage: 100 GB NVMe SSD</li>
                    <li>OS: DainRaku OS (Self-hosting)</li>
                  </ul>
                </div>
              </div>
              
              <p>Required build dependencies:</p>
              <pre className="bg-[#0a0a0a] border border-primary/30 p-4 font-mono text-sm overflow-x-auto text-primary/80 glow-border">
<code>sudo apt update
sudo apt install live-build debootstrap squashfs-tools xorriso grub-pc-bin grub-efi-amd64-bin mtools</code>
              </pre>
            </div>
          </section>

          <section id="quickstart" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 flex items-center justify-center border border-primary/30 text-primary">
                <Terminal className="w-5 h-5" />
              </div>
              <h2 className="text-3xl font-display font-bold uppercase">Quick Start</h2>
            </div>
            <div className="prose prose-invert prose-p:text-muted-foreground max-w-none font-sans">
              <p>Clone the build repository and run the automated build script. This will use the default package list containing all 300+ security tools.</p>
              
              <pre className="bg-[#0a0a0a] border border-primary/30 p-4 font-mono text-sm overflow-x-auto text-primary/80 glow-border">
<code>git clone https://github.com/dainraku-os/dainraku.git
cd dainraku
sudo bash build.sh</code>
              </pre>

              <p>The build process typically takes 30–90 minutes depending on your internet connection and CPU speed. The output will be a bootable hybrid ISO located in the <code>live-build/</code> directory.</p>
              
              <div className="bg-orange-500/10 border-l-4 border-orange-500 p-4 my-6">
                <p className="text-orange-400 font-mono text-sm m-0"><strong>WARNING:</strong> Never run the build script as root outside of an ephemeral container or dedicated VM unless you know exactly what you are doing. The chroot environment mounts crucial host directories.</p>
              </div>
            </div>
          </section>

          <section id="btrfs" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 flex items-center justify-center border border-primary/30 text-primary">
                <HardDrive className="w-5 h-5" />
              </div>
              <h2 className="text-3xl font-display font-bold uppercase">BTRFS Subvolume Layout</h2>
            </div>
            <div className="prose prose-invert prose-p:text-muted-foreground max-w-none font-sans">
              <p>DainRaku OS defaults to a BTRFS filesystem using the Ubuntu-style <code>@</code> and <code>@home</code> subvolume layout. This ensures compatibility with Timeshift for instant system snapshots.</p>
              
              <table className="w-full text-left border-collapse border border-primary/20 text-sm mt-4 mb-6">
                <thead>
                  <tr className="bg-primary/10 text-primary font-mono">
                    <th className="p-3 border-b border-primary/20">Subvolume</th>
                    <th className="p-3 border-b border-primary/20">Mount Point</th>
                    <th className="p-3 border-b border-primary/20">Purpose</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-muted-foreground">
                  <tr>
                    <td className="p-3 border-b border-primary/10">@</td>
                    <td className="p-3 border-b border-primary/10">/</td>
                    <td className="p-3 border-b border-primary/10">Root filesystem, targeted by system snapshots</td>
                  </tr>
                  <tr>
                    <td className="p-3 border-b border-primary/10">@home</td>
                    <td className="p-3 border-b border-primary/10">/home</td>
                    <td className="p-3 border-b border-primary/10">User data, excluded from system rollbacks</td>
                  </tr>
                  <tr>
                    <td className="p-3 border-b border-primary/10">@var_log</td>
                    <td className="p-3 border-b border-primary/10">/var/log</td>
                    <td className="p-3 border-b border-primary/10">Logs persist across rollbacks for debugging</td>
                  </tr>
                </tbody>
              </table>
              <p>During the Calamares installation phase, the partitioner automatically configures compression (<code>zstd:1</code>) and optimized mount options (<code>noatime,space_cache=v2,ssd</code>).</p>
            </div>
          </section>

          <section id="packages" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 flex items-center justify-center border border-primary/30 text-primary">
                <Zap className="w-5 h-5" />
              </div>
              <h2 className="text-3xl font-display font-bold uppercase">Package Customization</h2>
            </div>
            <div className="prose prose-invert prose-p:text-muted-foreground max-w-none font-sans">
              <p>You don't have to build the full 300+ tool ISO. You can provide a custom <code>.list</code> file containing only the packages you need.</p>
              <p>Place your custom list in <code>config/package-lists/</code>:</p>
              
              <pre className="bg-[#0a0a0a] border border-primary/30 p-4 font-mono text-sm overflow-x-auto text-primary/80 glow-border">
<code>{"# Create a new package list file inside live-build/config/package-lists/\necho \"nmap\" > live-build/config/package-lists/custom.list.chroot\necho \"metasploit-framework\" >> live-build/config/package-lists/custom.list.chroot\n\n# Then run the build as normal\nsudo bash build.sh"}</code>
              </pre>
              
              <p>Use the <a href="/iso-builder" className="text-primary hover:underline">ISO Builder</a> interface to visually select categories and generate this list file automatically.</p>
            </div>
          </section>

          <section id="hardware" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 flex items-center justify-center border border-primary/30 text-primary">
                <Shield className="w-5 h-5" />
              </div>
              <h2 className="text-3xl font-display font-bold uppercase">Hardware Detection</h2>
            </div>
            <div className="prose prose-invert prose-p:text-muted-foreground max-w-none font-sans">
              <p>DainRaku OS includes a custom hardware detection script that runs during the live boot phase and post-installation. It ensures maximum compatibility for pentesting hardware.</p>
              
              <ul className="list-disc pl-4 space-y-2 mt-4 text-sm text-foreground">
                <li><strong>NVIDIA Optimus:</strong> Automatically detects hybrid graphics laptops and configures Prime offloading.</li>
                <li><strong>Wireless Adapters:</strong> Ships with out-of-tree drivers for popular monitor-mode capable chipsets (Realtek RTL8812AU/RTL8814AU, Mediatek).</li>
                <li><strong>SDRs & HID:</strong> Pre-configured udev rules for HackRF, RTL-SDR, Ubertooth, and Proxmark3 ensuring user-level access.</li>
              </ul>
            </div>
          </section>

          <section id="repos" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 flex items-center justify-center border border-primary/30 text-primary">
                <GitBranch className="w-5 h-5" />
              </div>
              <h2 className="text-3xl font-display font-bold uppercase">Repository Switching</h2>
            </div>
            <div className="prose prose-invert prose-p:text-muted-foreground max-w-none font-sans">
              <p>The OS tracks Debian Testing ("Trixie") by default to provide recent packages while maintaining stability. You can seamlessly switch to "Sid" (Unstable) if you require bleeding-edge tool updates.</p>
              
              <pre className="bg-[#0a0a0a] border border-primary/30 p-4 font-mono text-sm overflow-x-auto text-primary/80 glow-border">
<code>sudo dainraku-switch-repos
sudo apt update && sudo apt full-upgrade</code>
              </pre>

              <p>The DainRaku security tools repository operates independently of the base Debian repos. It is maintained daily with automated builds from upstream tool repositories.</p>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
