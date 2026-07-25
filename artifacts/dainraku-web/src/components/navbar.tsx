import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Terminal, Shield, Wrench, HardDrive, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const [location] = useLocation();

  const navLinks = [
    { href: '/', label: 'OVERVIEW', icon: Shield },
    { href: '/tools', label: 'ARSENAL', icon: Wrench },
    { href: '/build', label: 'BUILD DOCS', icon: Terminal },
    { href: '/iso-builder', label: 'ISO BUILDER', icon: HardDrive },
    { href: '/download', label: 'DOWNLOAD', icon: Download },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 border-b border-primary/20 bg-background/80 backdrop-blur-md z-40">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(0,240,255,0.05)_50%,transparent_100%)] opacity-50 bg-[length:200%_100%] animate-pulse"></div>
      
      <div className="container mx-auto h-full flex items-center justify-between px-4 relative z-10">
        <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-8 h-8 rounded-sm bg-primary/10 border border-primary/50 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Terminal className="w-4 h-4 text-primary" />
            </div>
            <span className="font-display font-bold text-xl tracking-widest text-primary glow-text">
              DAINRAKU<span className="text-foreground">_OS</span>
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location === link.href;
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href}>
                <div className={cn(
                  "relative px-4 py-2 flex items-center gap-2 cursor-pointer transition-colors duration-200",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}>
                  <Icon className="w-4 h-4" />
                  <span className="font-mono text-sm tracking-wider">{link.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary shadow-[0_0_8px_rgba(0,240,255,0.8)]"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="md:hidden flex items-center">
          <div className="w-8 h-8 border border-primary/30 flex flex-col justify-center items-center gap-[4px] cursor-pointer">
            <div className="w-4 h-[1px] bg-primary"></div>
            <div className="w-4 h-[1px] bg-primary"></div>
            <div className="w-4 h-[1px] bg-primary"></div>
          </div>
        </div>
      </div>
    </nav>
  );
}
