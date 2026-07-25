#!/bin/bash
# DainRaku OS — ISO Builder
# One-command script to build the DainRaku OS live ISO.
# Must be run as root on a Debian/Ubuntu host with live-build installed.
#
# Usage: sudo bash build.sh [--clean] [--help]
set -euo pipefail

BOLD="\033[1m"
CYAN="\033[0;36m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
RED="\033[0;31m"
RESET="\033[0m"

log()  { echo -e "${CYAN}[DainRaku]${RESET} $*"; }
ok()   { echo -e "${GREEN}[OK]${RESET} $*"; }
warn() { echo -e "${YELLOW}[WARN]${RESET} $*"; }
err()  { echo -e "${RED}[ERROR]${RESET} $*"; exit 1; }

print_banner() {
cat << 'EOF'
  ██████╗  █████╗ ██╗███╗   ██╗██████╗  █████╗ ██╗  ██╗██╗   ██╗
  ██╔══██╗██╔══██╗██║████╗  ██║██╔══██╗██╔══██╗██║ ██╔╝██║   ██║
  ██║  ██║███████║██║██╔██╗ ██║██████╔╝███████║█████╔╝ ██║   ██║
  ██║  ██║██╔══██║██║██║╚██╗██║██╔══██╗██╔══██║██╔═██╗ ██║   ██║
  ██████╔╝██║  ██║██║██║ ╚████║██║  ██║██║  ██║██║  ██╗╚██████╔╝
  ╚═════╝ ╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝  OS Builder
EOF
}

print_banner
echo ""
log "DainRaku OS ISO Builder starting..."
echo ""

# ── Parse arguments ───────────────────────────────────────────────────────────
CLEAN=false
for arg in "$@"; do
    case "$arg" in
        --clean)  CLEAN=true ;;
        --help)
            echo "Usage: sudo bash build.sh [--clean]"
            echo "  --clean   Run lb clean before building (removes previous build artifacts)"
            exit 0 ;;
    esac
done

# ── Root check ────────────────────────────────────────────────────────────────
if [[ $EUID -ne 0 ]]; then
    err "This script must be run as root. Use: sudo bash build.sh"
fi

# ── Prerequisites check ───────────────────────────────────────────────────────
log "Checking prerequisites..."

REQUIRED_TOOLS=(live-build debootstrap curl gpg xorriso squashfs-tools)
MISSING=()
for tool in "${REQUIRED_TOOLS[@]}"; do
    if ! command -v "$tool" &>/dev/null && ! dpkg -l "$tool" &>/dev/null; then
        MISSING+=("$tool")
    fi
done

if [ ${#MISSING[@]} -gt 0 ]; then
    warn "Missing required packages: ${MISSING[*]}"
    log "Attempting to install missing packages..."
    apt-get update -q
    apt-get install -y "${MISSING[@]}"
fi

# ── Disk space check ──────────────────────────────────────────────────────────
AVAILABLE_GB=$(df -BG . | awk 'NR==2{print $4}' | tr -d 'G')
if [[ "$AVAILABLE_GB" -lt 30 ]]; then
    err "Insufficient disk space. Need at least 30 GB, have ${AVAILABLE_GB} GB."
fi
ok "Disk space OK: ${AVAILABLE_GB} GB available"

# ── Enter live-build directory ────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "${SCRIPT_DIR}/live-build"
log "Working directory: $(pwd)"

# ── Optional clean ────────────────────────────────────────────────────────────
if [[ "$CLEAN" == true ]]; then
    log "Cleaning previous build artifacts..."
    lb clean
    ok "Clean complete"
fi

# ── Make hook scripts executable ─────────────────────────────────────────────
chmod +x config/hooks/live/*.hook.chroot 2>/dev/null || true
chmod +x config/hooks/normal/*.hook.chroot 2>/dev/null || true
chmod +x config/includes.chroot/usr/local/bin/dainraku-* 2>/dev/null || true

# ── Run lb config ─────────────────────────────────────────────────────────────
log "Running lb config..."
bash auto/config
ok "lb config complete"

# ── Run lb build ─────────────────────────────────────────────────────────────
log "Running lb build (this will take 30-90 minutes depending on your connection)..."
START_TIME=$(date +%s)
lb build 2>&1 | tee build.log
END_TIME=$(date +%s)
ELAPSED=$(( (END_TIME - START_TIME) / 60 ))

# ── Find the output ISO ───────────────────────────────────────────────────────
ISO_FILE=$(find . -maxdepth 1 -name "*.iso" | head -1)

if [[ -z "$ISO_FILE" ]]; then
    err "Build failed — no ISO file found. Check build.log for errors."
fi

ISO_SIZE=$(du -sh "$ISO_FILE" | awk '{print $1}')
ISO_SHA256=$(sha256sum "$ISO_FILE" | awk '{print $1}')

echo ""
echo -e "${BOLD}════════════════════════════════════════════════════════${RESET}"
echo -e "${GREEN}  DainRaku OS ISO built successfully!${RESET}"
echo -e "${BOLD}════════════════════════════════════════════════════════${RESET}"
echo ""
echo "  ISO file  : ${ISO_FILE}"
echo "  Size      : ${ISO_SIZE}"
echo "  SHA256    : ${ISO_SHA256}"
echo "  Build time: ${ELAPSED} minutes"
echo ""
echo "  To write to USB:"
echo "    sudo dd if=${ISO_FILE} of=/dev/sdX bs=4M status=progress oflag=sync"
echo "    (replace /dev/sdX with your USB drive)"
echo ""
echo "  Or use Etcher: https://etcher.balena.io"
echo ""
