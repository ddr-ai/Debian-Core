import { Link } from 'wouter';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Terminal, Shield, Cpu, Network, Zap, GitBranch, ArrowRight, Activity, Command, HardDrive } from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Abstract background grid */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.05)_1px,transparent_1px)] bg-[length:40px_40px]"></div>
        
        <div className="container px-4 z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div variants={fadeIn} className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              SYS.STATUS: OPERATIONAL
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-6xl md:text-8xl font-display font-bold tracking-tighter mb-6 uppercase">
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">The Weaponized</span>
              <br />
              <span className="text-primary glow-text">Debian Core</span>
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto font-sans leading-relaxed">
              DainRaku OS is a precision-engineered penetration testing distribution. Built on Debian, optimized by the Liquorix kernel, and armed with 300+ security tools. No bloat. Pure utility.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/iso-builder">
                <div className="px-8 py-4 bg-primary text-primary-foreground font-mono font-bold tracking-widest hover:bg-primary/90 transition-colors flex items-center gap-2 group w-full sm:w-auto justify-center relative overflow-hidden">
                  <span className="relative z-10 flex items-center gap-2">
                    CONFIGURE ISO <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </div>
              </Link>
              <Link href="/tools">
                <div className="px-8 py-4 bg-transparent border border-primary/50 text-primary font-mono font-bold tracking-widest hover:bg-primary/10 transition-colors w-full sm:w-auto text-center glow-border-hover">
                  BROWSE ARSENAL
                </div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-primary/20 bg-card/30 relative">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-primary/50 to-transparent"></div>
        <div className="container px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { label: "SECURITY TOOLS", value: "300+", icon: Terminal },
              { label: "TOOL CATEGORIES", value: "12", icon: Network },
              { label: "FILESYSTEM", value: "BTRFS", icon: HardDrive },
              { label: "KERNEL", value: "LIQUORIX", icon: Cpu }
            ].map((stat, i) => (
              <motion.div key={i} variants={fadeIn} className="flex flex-col items-center text-center p-6 border border-primary/10 bg-background/50 hover:border-primary/40 transition-colors relative group">
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <stat.icon className="w-8 h-8 text-primary/60 mb-4 group-hover:text-primary transition-colors" />
                <span className="text-4xl font-display font-bold text-foreground mb-1 group-hover:glow-text transition-all">{stat.value}</span>
                <span className="text-xs font-mono text-muted-foreground tracking-widest">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Feature 1: The Arsenal */}
      <section className="py-32 relative overflow-hidden">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="flex-1 space-y-6"
            >
              <div className="flex items-center gap-3 text-primary mb-4">
                <Command className="w-5 h-5" />
                <span className="font-mono text-sm tracking-widest">MODULE: ARSENAL</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tight">Curated for <span className="text-primary">Red Teams</span></h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Forget manually installing your toolchain. DainRaku ships with over 500 pre-configured, tested, and updated security tools categorized across 12 distinct attack phases. From deep reconnaissance to advanced post-exploitation.
              </p>
              <ul className="space-y-3 mt-6 font-mono text-sm text-foreground/80">
                {['[+] Zero-day exploit frameworks', '[+] Custom wordlists & dictionaries', '[+] Advanced wireless attack suites', '[+] Memory forensics & RE toolchains'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-primary">{item.substring(0,3)}</span>
                    {item.substring(3)}
                  </li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex-1 w-full"
            >
              <div className="aspect-square md:aspect-video rounded-sm border border-primary/20 bg-[#0a0a0a] p-4 font-mono text-xs overflow-hidden relative glow-border">
                <div className="absolute top-0 left-0 right-0 h-6 bg-primary/10 border-b border-primary/20 flex items-center px-2 gap-2">
                  <div className="w-2 h-2 rounded-full bg-destructive/80"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-500/80"></div>
                  <div className="w-2 h-2 rounded-full bg-green-500/80"></div>
                  <span className="ml-2 text-primary/60">root@dainraku:~#</span>
                </div>
                <div className="mt-8 text-primary/80 space-y-1 opacity-80">
                  <p className="text-foreground">root@dainraku:~# nmap -sC -sV 10.0.0.1/24</p>
                  <p>Starting Nmap 7.94 ( https://nmap.org ) at 2023-10-24 00:00 UTC</p>
                  <p>Nmap scan report for 10.0.0.1</p>
                  <p>Host is up (0.0020s latency).</p>
                  <p>Not shown: 997 closed tcp ports (reset)</p>
                  <p>PORT   STATE SERVICE VERSION</p>
                  <p>22/tcp open  ssh     OpenSSH 8.4p1</p>
                  <p>80/tcp open  http    nginx 1.18.0</p>
                  <p>443/tcp open  ssl/http nginx 1.18.0</p>
                  <p className="text-foreground mt-4">root@dainraku:~# msfconsole -q</p>
                  <p className="text-red-500">msf6 &gt; use exploit/multi/handler</p>
                  <p className="text-red-500">[*] Using configured payload generic/shell_reverse_tcp</p>
                  <p className="text-foreground animate-pulse">msf6 exploit(multi/handler) &gt; _</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature 2: Architecture */}
      <section className="py-32 bg-primary/5 border-y border-primary/10 relative">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row-reverse items-center gap-16">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="flex-1 space-y-6"
            >
               <div className="flex items-center gap-3 text-primary mb-4">
                <Zap className="w-5 h-5" />
                <span className="font-mono text-sm tracking-widest">MODULE: ARCHITECTURE</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tight">Built for <span className="text-primary">Performance</span></h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Powered by the Liquorix kernel for ultra-low latency and maximum throughput during heavy scans. BTRFS filesystem ensures you can snapshot your entire OS before a risky engagement and rollback in seconds.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="p-4 border border-primary/20 bg-background/50">
                  <Activity className="w-6 h-6 text-primary mb-2" />
                  <h3 className="font-display font-bold mb-1">LIQUORIX KERNEL</h3>
                  <p className="text-sm text-muted-foreground">Tuned for desktop responsiveness and network stack performance.</p>
                </div>
                <div className="p-4 border border-primary/20 bg-background/50">
                  <GitBranch className="w-6 h-6 text-primary mb-2" />
                  <h3 className="font-display font-bold mb-1">BTRFS SNAPSHOTS</h3>
                  <p className="text-sm text-muted-foreground">Native filesystem rollback capabilities via Timeshift.</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex-1 w-full flex justify-center"
            >
              <div className="relative w-64 h-64 md:w-96 md:h-96">
                {/* Abstract tech circular visual */}
                <div className="absolute inset-0 rounded-full border border-primary/20 animate-[spin_10s_linear_infinite]"></div>
                <div className="absolute inset-4 rounded-full border border-dashed border-primary/40 animate-[spin_15s_linear_infinite_reverse]"></div>
                <div className="absolute inset-8 rounded-full border border-primary/10"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Cpu className="w-16 h-16 text-primary glow-text" />
                </div>
                
                {/* Orbital nodes */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-[0_0_15px_rgba(0,240,255,1)]"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-[0_0_15px_rgba(0,240,255,1)]"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="py-32 relative">
        <div className="container px-4 text-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="max-w-2xl mx-auto border border-primary/30 bg-card p-12 relative glow-border overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
            <h2 className="text-3xl md:text-4xl font-display font-bold uppercase mb-4">Initialize Deployment</h2>
            <p className="text-muted-foreground font-mono mb-8">Generate your custom package list or read the compilation manual.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
               <Link href="/iso-builder">
                <div className="px-6 py-3 bg-primary text-primary-foreground font-mono font-bold tracking-wider hover:bg-primary/90 transition-colors cursor-pointer w-full sm:w-auto">
                  START BUILDER
                </div>
              </Link>
              <Link href="/build">
                <div className="px-6 py-3 border border-primary/50 text-primary font-mono tracking-wider hover:bg-primary/10 transition-colors cursor-pointer w-full sm:w-auto">
                  READ DOCS
                </div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
