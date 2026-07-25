import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Shield, CheckCircle, AlertTriangle, ExternalLink, Copy, Check, HardDrive, Cpu, Terminal, Loader2 } from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } }
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

interface ReleaseAsset {
  name: string;
  browser_download_url: string;
  size: number;
}

interface Release {
  tag_name: string;
  name: string;
  published_at: string;
  prerelease: boolean;
  html_url: string;
  body: string;
  assets: ReleaseAsset[];
}

// Replace with your actual GitHub org/repo once the repo is public
const GITHUB_REPO = 'dainraku-os/dainraku';
const RELEASES_API = `https://api.github.com/repos/${GITHUB_REPO}/releases`;

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const gb = bytes / (1024 ** 3);
  if (gb >= 1) return `${gb.toFixed(1)} GB`;
  const mb = bytes / (1024 ** 2);
  return `${mb.toFixed(0)} MB`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="ml-2 text-primary/60 hover:text-primary transition-colors shrink-0" title="Copy">
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
    </button>
  );
}

function ReleaseCard({ release, isLatest }: { release: Release; isLatest: boolean }) {
  const isoAsset = release.assets.find(a => a.name.endsWith('.iso'));
  const sha256Asset = release.assets.find(a => a.name.endsWith('.sha256'));

  // Extract SHA256 hash from release body if present
  const sha256Match = release.body?.match(/`([a-f0-9]{64})`/);
  const sha256Preview = sha256Match ? sha256Match[1] : null;

  return (
    <motion.div
      variants={fadeIn}
      className={`border bg-card relative overflow-hidden ${isLatest ? 'border-primary/50 glow-border' : 'border-primary/20'}`}
    >
      {isLatest && (
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
      )}

      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="font-display font-bold text-2xl text-foreground">{release.tag_name}</span>
              {isLatest && (
                <span className="px-2 py-0.5 text-xs font-mono bg-primary/20 text-primary border border-primary/40 tracking-widest">
                  LATEST
                </span>
              )}
              {release.prerelease && (
                <span className="px-2 py-0.5 text-xs font-mono bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 tracking-widest">
                  PRE-RELEASE
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground font-mono">
              Released {formatDate(release.published_at)}
            </p>
          </div>

          <a
            href={release.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs font-mono text-primary/60 hover:text-primary transition-colors"
          >
            View on GitHub <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Download assets */}
        {isoAsset ? (
          <div className="space-y-3">
            {/* Primary ISO download */}
            <a
              href={isoAsset.browser_download_url}
              className="flex items-center justify-between gap-4 p-4 border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <HardDrive className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <p className="font-mono text-sm text-foreground group-hover:text-primary transition-colors">{isoAsset.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{formatBytes(isoAsset.size)} · Bootable hybrid ISO</p>
                </div>
              </div>
              <Download className="w-5 h-5 text-primary shrink-0 group-hover:translate-y-0.5 transition-transform" />
            </a>

            {/* SHA256 checksum */}
            {sha256Asset && (
              <a
                href={sha256Asset.browser_download_url}
                className="flex items-center justify-between gap-4 p-3 border border-primary/10 bg-card hover:border-primary/30 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-primary/60 shrink-0" />
                  <div>
                    <p className="font-mono text-xs text-muted-foreground group-hover:text-foreground transition-colors">{sha256Asset.name}</p>
                    <p className="text-xs text-muted-foreground/60">SHA256 checksum file</p>
                  </div>
                </div>
                <Download className="w-4 h-4 text-primary/60 shrink-0" />
              </a>
            )}

            {/* Inline SHA256 preview */}
            {sha256Preview && (
              <div className="p-3 border border-primary/10 bg-[#0a0a0a]">
                <p className="text-xs text-muted-foreground font-mono mb-2">SHA256</p>
                <div className="flex items-center gap-2">
                  <code className="text-primary/80 text-xs font-mono break-all flex-1">{sha256Preview}</code>
                  <CopyButton text={sha256Preview} />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 border border-yellow-500/20 bg-yellow-500/5 text-yellow-400 font-mono text-sm flex items-center gap-3">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            No ISO asset attached to this release.
          </div>
        )}
      </div>
    </motion.div>
  );
}

function VerifyBlock({ version }: { version: string }) {
  const cmd = `sha256sum -c dainraku-os-${version}-amd64.iso.sha256`;
  return (
    <div className="bg-[#0a0a0a] border border-primary/30 p-4 font-mono text-sm glow-border">
      <div className="flex items-center justify-between mb-2">
        <span className="text-primary/60 text-xs">VERIFY INTEGRITY</span>
        <CopyButton text={cmd} />
      </div>
      <code className="text-primary/80">{cmd}</code>
    </div>
  );
}

export default function DownloadPage() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(RELEASES_API, {
      headers: { 'Accept': 'application/vnd.github+json' }
    })
      .then(r => {
        if (!r.ok) throw new Error(`GitHub API ${r.status}: ${r.statusText}`);
        return r.json() as Promise<Release[]>;
      })
      .then(data => {
        setReleases(data);
        setLoading(false);
      })
      .catch(e => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  const stableReleases = releases.filter(r => !r.prerelease);
  const latestStable = stableReleases[0] ?? releases[0];
  const olderReleases = releases.filter(r => r !== latestStable);

  return (
    <div className="flex flex-col min-h-screen">

      {/* Header */}
      <section className="bg-card/50 border-b border-primary/20 py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(0,240,255,0.08)_0%,transparent_60%)]" />
        <div className="container px-4 relative z-10">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-mono mb-4">
              <Download className="w-3 h-3" />
              DOWNLOAD CENTER
            </motion.div>
            <motion.h1 variants={fadeIn} className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tight mb-4">
              Get <span className="text-primary glow-text">DainRaku OS</span>
            </motion.h1>
            <motion.p variants={fadeIn} className="text-muted-foreground font-mono max-w-2xl">
              Pre-built ISOs are published automatically via GitHub Actions on every tagged release. Verify integrity with the SHA256 checksum before writing to USB.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <div className="container px-4 py-12 flex-1">
        <div className="max-w-3xl mx-auto space-y-12">

          {/* System requirements banner */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {[
              { icon: Cpu, label: 'ARCHITECTURE', value: 'x86_64 (amd64)' },
              { icon: HardDrive, label: 'MIN. USB DRIVE', value: '4 GB' },
              { icon: Terminal, label: 'BOOT MODES', value: 'UEFI & Legacy BIOS' },
            ].map(({ icon: Icon, label, value }) => (
              <motion.div key={label} variants={fadeIn} className="flex items-center gap-3 p-4 border border-primary/20 bg-card">
                <Icon className="w-5 h-5 text-primary/60 shrink-0" />
                <div>
                  <p className="text-xs font-mono text-muted-foreground tracking-widest">{label}</p>
                  <p className="text-sm font-mono text-foreground mt-0.5">{value}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Releases */}
          <section>
            <h2 className="text-2xl font-display font-bold uppercase mb-6 flex items-center gap-3">
              <span className="text-primary">{'>'}</span> Releases
            </h2>

            {loading && (
              <div className="flex items-center gap-3 p-8 border border-primary/20 bg-card text-muted-foreground font-mono text-sm">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                Fetching releases from GitHub…
              </div>
            )}

            {error && (
              <div className="p-6 border border-yellow-500/30 bg-yellow-500/5">
                <div className="flex items-center gap-3 text-yellow-400 font-mono text-sm mb-3">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  Could not load releases from GitHub API
                </div>
                <p className="text-muted-foreground text-sm font-mono mb-4">{error}</p>
                <p className="text-muted-foreground text-sm">
                  View all releases directly on{' '}
                  <a
                    href={`https://github.com/${GITHUB_REPO}/releases`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    GitHub Releases <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
              </div>
            )}

            {!loading && !error && releases.length === 0 && (
              <div className="p-8 border border-primary/20 bg-card text-center">
                <HardDrive className="w-10 h-10 text-primary/30 mx-auto mb-4" />
                <p className="font-display font-bold text-lg uppercase mb-2">No releases yet</p>
                <p className="text-muted-foreground text-sm font-mono max-w-md mx-auto">
                  The first ISO will be available once the build pipeline runs. Tag a release on GitHub or trigger a manual workflow dispatch to start the build.
                </p>
                <a
                  href={`https://github.com/${GITHUB_REPO}/actions`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 px-4 py-2 border border-primary/40 text-primary font-mono text-sm hover:bg-primary/10 transition-colors"
                >
                  View CI Pipeline <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            {!loading && !error && releases.length > 0 && (
              <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-4">
                {latestStable && (
                  <ReleaseCard release={latestStable} isLatest={true} />
                )}
                {olderReleases.map(r => (
                  <ReleaseCard key={r.tag_name} release={r} isLatest={false} />
                ))}
              </motion.div>
            )}
          </section>

          {/* Verify & write guide */}
          <section>
            <h2 className="text-2xl font-display font-bold uppercase mb-6 flex items-center gap-3">
              <span className="text-primary">{'>'}</span> Verify & Write
            </h2>
            <div className="space-y-6">

              <div>
                <p className="text-muted-foreground font-mono text-sm mb-3">
                  Always verify the SHA256 checksum after downloading to ensure the file was not corrupted or tampered with.
                </p>
                <VerifyBlock version={latestStable?.tag_name ?? 'v1.0.0'} />
              </div>

              <div>
                <p className="text-muted-foreground font-mono text-sm mb-3">
                  Write to a USB drive (replace <code className="text-primary">/dev/sdX</code> with your device):
                </p>
                <div className="bg-[#0a0a0a] border border-primary/30 p-4 font-mono text-sm glow-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-primary/60 text-xs">LINUX / MACOS</span>
                    <CopyButton text={`sudo dd if=dainraku-os-${latestStable?.tag_name ?? 'v1.0.0'}-amd64.iso of=/dev/sdX bs=4M status=progress oflag=sync`} />
                  </div>
                  <code className="text-primary/80 break-all">
                    sudo dd if=dainraku-os-{latestStable?.tag_name ?? 'v1.0.0'}-amd64.iso of=/dev/sdX bs=4M status=progress oflag=sync
                  </code>
                </div>
                <p className="text-muted-foreground text-xs font-mono mt-3">
                  Windows users can use{' '}
                  <a href="https://etcher.balena.io" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Balena Etcher
                  </a>{' '}
                  or{' '}
                  <a href="https://rufus.ie" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Rufus
                  </a>
                  .
                </p>
              </div>
            </div>
          </section>

          {/* Build-it-yourself callout */}
          <section>
            <div className="border border-primary/20 bg-card p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-display font-bold text-lg uppercase mb-2">Prefer to build from source?</h3>
                  <p className="text-muted-foreground text-sm font-mono leading-relaxed mb-4">
                    Every release is built from the open-source repository using the same <code className="text-primary">build.sh</code> script you can run yourself on any Debian 12 host.
                  </p>
                  <a
                    href="/build"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-primary/40 text-primary font-mono text-sm hover:bg-primary/10 transition-colors"
                  >
                    Read the Build Manual
                  </a>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
