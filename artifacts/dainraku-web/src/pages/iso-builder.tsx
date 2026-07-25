import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Download, CheckSquare, Square, HardDrive, Cpu, Settings, Shield, Network, Zap, Loader2, CheckCircle2, XCircle, Clock, ExternalLink, AlertTriangle, X } from 'lucide-react';
import toolsData from '@/data/tools.json';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const BASE_SYSTEM_PACKAGES = 186; // Simulated count for base system, kernel, KDE, etc.

// ─── Types ─────────────────────────────────────────────────────────────────

type BuildStatus = 'idle' | 'triggering' | 'queued' | 'in_progress' | 'completed' | 'failed' | 'cancelled';

interface BuildRun {
  runId: number | null;
  status: BuildStatus;
  conclusion: 'success' | 'failure' | 'cancelled' | null;
  htmlUrl: string | null;
  releaseUrl: string | null;
  error: string | null;
  triggeredAt: string | null;
}

const INITIAL_RUN: BuildRun = {
  runId: null,
  status: 'idle',
  conclusion: null,
  htmlUrl: null,
  releaseUrl: null,
  error: null,
  triggeredAt: null,
};

// ─── Status helpers ──────────────────────────────────────────────────────────

function statusLabel(run: BuildRun): string {
  switch (run.status) {
    case 'triggering': return 'Dispatching workflow…';
    case 'queued': return 'Build queued — waiting for runner';
    case 'in_progress': return 'Build in progress';
    case 'completed':
      if (run.conclusion === 'success') return 'Build succeeded';
      if (run.conclusion === 'failure') return 'Build failed';
      if (run.conclusion === 'cancelled') return 'Build cancelled';
      return 'Build complete';
    case 'failed': return run.error ?? 'Request failed';
    default: return '';
  }
}

function StatusIcon({ run }: { run: BuildRun }) {
  switch (run.status) {
    case 'triggering':
    case 'queued':
    case 'in_progress':
      return <Loader2 className="w-4 h-4 animate-spin text-primary" />;
    case 'completed':
      if (run.conclusion === 'success') return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      if (run.conclusion === 'cancelled') return <XCircle className="w-4 h-4 text-yellow-400" />;
      return <XCircle className="w-4 h-4 text-red-400" />;
    case 'failed':
      return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
    default:
      return <Clock className="w-4 h-4 text-muted-foreground" />;
  }
}

// Map GitHub run status to our BuildStatus
function mapGhStatus(ghStatus: string, conclusion: string | null): BuildStatus {
  if (ghStatus === 'queued') return 'queued';
  if (ghStatus === 'in_progress') return 'in_progress';
  if (ghStatus === 'completed') return 'completed';
  return 'queued';
}

// ─── Build Status Panel ──────────────────────────────────────────────────────

function BuildStatusPanel({ run, onDismiss }: { run: BuildRun; onDismiss: () => void }) {
  const isActive = run.status === 'triggering' || run.status === 'queued' || run.status === 'in_progress';
  const isDone = run.status === 'completed';
  const isSuccess = isDone && run.conclusion === 'success';
  const isError = run.status === 'failed' || (isDone && run.conclusion !== 'success');

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={cn(
        "relative border p-4 font-mono text-sm",
        isSuccess ? "border-green-500/40 bg-green-500/5" :
        isError ? "border-red-500/30 bg-red-500/5" :
        "border-primary/30 bg-primary/5"
      )}
    >
      {/* dismiss */}
      {!isActive && (
        <button
          onClick={onDismiss}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* header */}
      <div className="flex items-center gap-2 mb-3">
        <StatusIcon run={run} />
        <span className={cn(
          "font-bold tracking-wide text-xs uppercase",
          isSuccess ? "text-green-400" : isError ? "text-red-400" : "text-primary"
        )}>
          {statusLabel(run)}
        </span>
      </div>

      {/* progress bar */}
      {isActive && (
        <div className="h-[2px] bg-primary/20 mb-3 overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
          />
        </div>
      )}

      {/* info rows */}
      <div className="space-y-1 text-xs text-muted-foreground">
        {run.runId && (
          <div className="flex items-center justify-between">
            <span>Run ID</span>
            <span className="text-foreground">#{run.runId}</span>
          </div>
        )}
        {run.triggeredAt && (
          <div className="flex items-center justify-between">
            <span>Triggered</span>
            <span className="text-foreground">
              {new Date(run.triggeredAt).toLocaleTimeString()}
            </span>
          </div>
        )}
        {run.status !== 'idle' && run.status !== 'triggering' && (
          <div className="flex items-center justify-between">
            <span>Status</span>
            <span className="text-foreground capitalize">{run.status.replace('_', ' ')}</span>
          </div>
        )}
      </div>

      {/* action links */}
      <div className="mt-3 flex flex-col gap-2">
        {run.htmlUrl && (
          <a
            href={run.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-primary hover:underline text-xs"
          >
            <ExternalLink className="w-3 h-3" /> View run on GitHub
          </a>
        )}
        {isSuccess && run.releaseUrl && (
          <a
            href={run.releaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 gap-2 px-3 py-2 bg-green-500/20 border border-green-500/40 text-green-400 hover:bg-green-500/30 transition-colors text-xs font-bold tracking-widest"
          >
            <Download className="w-3.5 h-3.5" /> DOWNLOAD ISO
          </a>
        )}
        {isSuccess && !run.releaseUrl && (
          <p className="text-xs text-muted-foreground">
            Release being published — check{' '}
            <a
              href={run.htmlUrl ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              GitHub Actions
            </a>{' '}
            in a moment.
          </p>
        )}
        {isError && run.error && (
          <p className="text-xs text-red-400 break-all">{run.error}</p>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

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

  // Build run state
  const [build, setBuild] = useState<BuildRun>(INITIAL_RUN);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  // Collect all selected packages (flat list)
  const selectedPackages = useMemo(() => {
    const pkgs: string[] = [];
    categoryStats.forEach(c => {
      if (selected.has(c.name)) {
        pkgs.push(...Array.from(new Set(c.packages)));
      }
    });
    return pkgs;
  }, [selected, categoryStats]);

  // Poll for run status
  const pollStatus = useCallback(async (runId: number) => {
    try {
      const res = await fetch(`/api/github/runs/${runId}`);
      if (!res.ok) return;
      const data = await res.json() as {
        id: number;
        status: string;
        conclusion: string | null;
        htmlUrl: string;
        releaseUrl: string | null;
      };

      const mappedStatus = mapGhStatus(data.status, data.conclusion);

      setBuild(prev => ({
        ...prev,
        status: mappedStatus,
        conclusion: data.conclusion as BuildRun['conclusion'],
        htmlUrl: data.htmlUrl,
        releaseUrl: data.releaseUrl,
      }));

      // Stop polling when run is done
      if (data.status === 'completed') {
        if (pollRef.current) clearInterval(pollRef.current);
      }
    } catch {
      // Network error — keep polling, don't abort
    }
  }, []);

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopPolling();
  }, []);

  const triggerBuild = async () => {
    stopPolling();
    setBuild({ ...INITIAL_RUN, status: 'triggering', triggeredAt: new Date().toISOString() });

    try {
      const res = await fetch('/api/github/trigger-build', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packages: selectedPackages,
          version: `v1.0.0-custom-${Date.now()}`,
          prerelease: true,
        }),
      });

      const data = await res.json() as {
        triggered?: boolean;
        runId?: number | null;
        triggeredAt?: string;
        error?: string;
      };

      if (!res.ok || data.error) {
        setBuild(prev => ({
          ...prev,
          status: 'failed',
          error: data.error ?? `Server error ${res.status}`,
        }));
        return;
      }

      const runId = data.runId ?? null;

      setBuild(prev => ({
        ...prev,
        status: runId ? 'queued' : 'queued',
        runId,
        triggeredAt: data.triggeredAt ?? prev.triggeredAt,
      }));

      if (runId) {
        // Start polling every 8 seconds
        pollRef.current = setInterval(() => pollStatus(runId), 8000);
        // Also poll immediately
        await pollStatus(runId);
      }
    } catch (err) {
      setBuild(prev => ({
        ...prev,
        status: 'failed',
        error: err instanceof Error ? err.message : 'Unknown error',
      }));
    }
  };

  const isBuildActive = build.status === 'triggering' || build.status === 'queued' || build.status === 'in_progress';
  const showPanel = build.status !== 'idle';

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
            Select the toolchains you need. Trigger a cloud build to get a ready-to-flash ISO, or download a <code>.list</code> file to compile it yourself.
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
            <div className="sticky top-24 space-y-4">
              <div className="border border-primary/30 bg-card p-6 glow-border">
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

                {/* Primary: Trigger Cloud Build */}
                <button
                  onClick={triggerBuild}
                  disabled={isBuildActive}
                  className={cn(
                    "w-full flex items-center justify-center gap-3 font-mono font-bold tracking-widest py-4 transition-all mb-3",
                    isBuildActive
                      ? "bg-primary/30 text-primary/50 cursor-not-allowed"
                      : "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                  )}
                >
                  {isBuildActive ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Zap className="w-5 h-5" />
                  )}
                  {isBuildActive ? 'BUILDING…' : 'TRIGGER BUILD'}
                </button>

                {/* Secondary: Download list */}
                <button
                  onClick={downloadList}
                  className="w-full flex items-center justify-center gap-3 border border-primary/40 text-primary font-mono font-bold tracking-widest py-3 hover:bg-primary/10 transition-all text-sm"
                >
                  <Download className="w-4 h-4" />
                  GENERATE .LIST
                </button>

                <p className="mt-4 text-[10px] font-mono text-muted-foreground text-center leading-relaxed">
                  "Trigger Build" dispatches a GitHub Actions run and shows live status below. The ISO is published as a pre-release when ready.
                </p>
              </div>

              {/* Build Status Panel */}
              <AnimatePresence>
                {showPanel && (
                  <BuildStatusPanel
                    run={build}
                    onDismiss={() => {
                      stopPolling();
                      setBuild(INITIAL_RUN);
                    }}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
