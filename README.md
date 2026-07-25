# DainRaku OS

> **Precision. Power. Penetration.**

DainRaku OS is a custom Debian-based Linux distribution designed as both a professional daily driver and a complete penetration testing environment. Inspired by Kali Linux and Parrot OS, DainRaku OS ships with 300+ pre-installed security tools organized across 11 categories, a performance-tuned BTRFS filesystem, the low-latency Liquorix kernel, and KDE Plasma as the desktop environment.

---

## System Defaults

| Component       | Value                                           |
|-----------------|-------------------------------------------------|
| Base            | Debian Bookworm (Stable)                        |
| Kernel          | Liquorix (low-latency, performance-optimized)   |
| Desktop         | KDE Plasma 6                                    |
| Display Manager | SDDM (DainRaku theme)                           |
| Boot Splash     | Plymouth (DainRaku animated theme)              |
| Filesystem      | BTRFS (zstd:3, noatime, subvolumes, snapper)    |
| Terminal        | Ghostty                                         |
| Browser         | BrowserOS (open source)                         |
| Installer       | Calamares (graphical)                           |
| Swap            | ZRAM (no swap partition)                        |
| Default User    | `pentester` / password: `pentester`             |

---

## Build Requirements

| Requirement     | Minimum                        |
|-----------------|--------------------------------|
| OS              | Debian 12 (Bookworm) or Ubuntu 22.04+ |
| RAM             | 4 GB (8 GB recommended)        |
| Disk space      | 30 GB free (50 GB recommended) |
| Internet        | Required (downloads ~8 GB of packages) |
| Packages        | `live-build` `debootstrap` `curl` `gpg` `xorriso` `squashfs-tools` |

Install prerequisites:
```bash
sudo apt update && sudo apt install -y live-build debootstrap curl gpg xorriso squashfs-tools
```

---

## Quick Start

```bash
# Clone the repository
git clone https://github.com/dainraku-os/dainraku.git
cd dainraku

# Build the ISO (takes 30–90 minutes)
sudo bash build.sh

# Optional: clean previous build artifacts first
sudo bash build.sh --clean
```

The output ISO will be in `live-build/dainraku-os-amd64.iso`.

---

## Writing to USB

```bash
# Linux (replace /dev/sdX with your USB drive — double-check!)
sudo dd if=live-build/dainraku-os-amd64.iso of=/dev/sdX bs=4M status=progress oflag=sync

# Or use Etcher (cross-platform GUI)
# https://etcher.balena.io
```

---

## BTRFS Filesystem Layout

DainRaku OS uses BTRFS with the following subvolume layout, applied automatically by Calamares:

```
/              → subvolume @
/home          → subvolume @home
/var           → subvolume @var
/tmp           → subvolume @tmp
/.snapshots    → subvolume @snapshots
```

**Mount options** applied to all subvolumes:
```
compress=zstd:3   — transparent compression (fast + space-efficient)
noatime            — skip access-time writes (performance)
space_cache=v2     — faster block allocation
autodefrag         — background defragmentation
discard=async      — async TRIM for SSDs
```

**ZRAM** is used instead of a swap partition. 50% of system RAM is allocated as compressed ZRAM swap using zstd compression, significantly reducing latency vs. disk swap.

**Snapper** is pre-configured for automatic pre/post snapshots on every `apt install`, `apt upgrade`, and `apt remove` operation. Rollback a broken update in seconds.

---

## Hardware Auto-Detection

On first boot (and after installation), DainRaku OS runs `dainraku-hwdetect` automatically. This script:

- Detects **CPU** (Intel/AMD) and installs appropriate microcode
- Detects **GPU** (NVIDIA/AMD/Intel) and installs drivers/Mesa/Vulkan
- Detects **Wi-Fi chipset** and installs correct firmware (Intel, Realtek, Atheros, Broadcom, Ralink, Marvell)
- Detects **Bluetooth** adapters and enables the service
- Detects **sound hardware** (Intel DSP/HDA, AMD) and installs firmware + PipeWire
- Detects **touchpad/touchscreen** and installs libinput or Synaptics driver
- Detects **printers** (HP, Canon, Epson, Brother) and installs CUPS + vendor drivers
- Detects **hypervisor** (VMware, VirtualBox, QEMU/KVM, Hyper-V) and installs guest tools

Run it manually at any time:
```bash
sudo dainraku-hwdetect
```

Log output: `/var/log/dainraku-hwdetect.log`

---

## Repository Switching

DainRaku OS ships with Debian Stable (Bookworm) enabled by default. Debian Testing and Sid repositories are pre-configured but **disabled** with APT pin priority 1 (inert).

Use the interactive switcher to enable/disable rolling repos:
```bash
sudo dainraku-switch-repos
```

| Repo              | Default State | Risk Level |
|-------------------|---------------|------------|
| Debian Stable     | Enabled       | None       |
| Debian Testing    | Disabled      | Low        |
| Debian Sid        | Disabled      | Medium     |
| Debian Experimental | Disabled    | High       |

**Important:** Enabling Sid alongside other repos can cause package conflicts. Always run `sudo apt update && sudo apt dist-upgrade` after switching repos and review proposed changes before confirming.

---

## Tool Categories

| Category              | Tools | Examples                                          |
|-----------------------|-------|---------------------------------------------------|
| Reconnaissance        | 54    | Nmap, Amass, theHarvester, Shodan CLI, Sherlock   |
| Web Pentesting        | 52    | Burp Suite, SQLmap, FFUF, Gobuster, Nikto         |
| Exploitation          | 40    | Metasploit, Empire, Sliver, pwntools, Ghidra      |
| Wireless Attacks      | 40    | Aircrack-ng, Kismet, Wifiphisher, Hcxtools        |
| Password Attacks      | 48    | Hashcat, John, Hydra, Medusa, Kerbrute            |
| Forensics & RE        | 56    | Autopsy, Volatility3, Radare2, Binwalk, YARA      |
| Post-Exploitation     | 44    | BloodHound, CrackMapExec, Impacket, Ligolo-ng     |
| Sniffing & Spoofing   | 44    | Wireshark, Ettercap, Bettercap, Responder         |
| Social Engineering    | 20    | SET, Gophish, Evilginx2, PhoneInfoga              |
| Reporting             | 22    | Dradis, Faraday, CherryTree, LibreOffice          |
| Developer Tools       | 60    | Python3, Go, Docker, tmux, Neovim, fzf            |
| **Total**             | **300+** |                                                |

---

## Package List Customization

Each category corresponds to a file in `live-build/config/package-lists/`:

```
base.list.chroot        — Core system, KDE Plasma, Ghostty, BrowserOS
recon.list.chroot       — Reconnaissance & OSINT
web.list.chroot         — Web application pentesting
exploitation.list.chroot — Exploitation frameworks
wireless.list.chroot    — Wireless attacks
password.list.chroot    — Password attacks
forensics.list.chroot   — Digital forensics & reverse engineering
post-exploit.list.chroot — Post-exploitation
sniffing.list.chroot    — Sniffing & spoofing
social-eng.list.chroot  — Social engineering
reporting.list.chroot   — Reporting & documentation
dev.list.chroot         — Developer tools
```

To remove a category from your custom build, simply delete or rename the corresponding `.list.chroot` file before running `build.sh`.

Use the **Custom ISO Builder** on the DainRaku OS website to generate a custom package list for your selected categories.

---

## First Boot Checklist

1. **Change your password**: `passwd pentester`
2. **Run hardware detection**: `sudo dainraku-hwdetect`
3. **Initialize Metasploit DB**: `sudo msfdb init`
4. **Update the system**: `sudo apt update && sudo apt upgrade -y`
5. **Review BTRFS snapshots**: `sudo snapper list`

---

## Project Structure

```
dainraku/
├── build.sh                          # One-command ISO builder
├── README.md                         # This file
├── live-build/
│   ├── auto/
│   │   ├── config                    # lb config defaults
│   │   ├── build                     # lb build wrapper
│   │   └── clean                     # lb clean wrapper
│   └── config/
│       ├── package-lists/            # Tool category package lists
│       ├── hooks/live/               # Chroot hook scripts
│       ├── includes.chroot/          # Files copied into chroot
│       │   ├── etc/                  # OS configs, APT sources, preferences
│       │   ├── usr/local/bin/        # dainraku-hwdetect, dainraku-switch-repos
│       │   └── usr/share/            # Plymouth & SDDM themes
│       └── calamares/                # Installer configuration
└── artifacts/dainraku-web/           # DainRaku OS website (React + Vite)
```

---

## Contributing

Contributions are welcome! Areas where help is appreciated:

- Additional tool packages in any category
- Plymouth theme graphics (SVG assets)
- SDDM theme improvements
- Hardware detection edge cases
- Calamares module configuration
- ARM64 support (planned)

---

## License

DainRaku OS build configuration is released under the MIT License.
Individual tools included in the distribution are subject to their own licenses.

---

*DainRaku OS — Built for those who work in the shadows.*
