/* DainRaku OS — Calamares Installer Slideshow
 * Shown during the installation exec phase.
 * Cyberpunk dark aesthetic: #0b0e14 background, #00f0ff cyan accent.
 */
import QtQuick 2.15
import calamares.slideshow 1.0

Presentation {
    id: presentation

    // ── Slide 1 — Welcome ─────────────────────────────────────────────────────
    Slide {
        Rectangle {
            anchors.fill: parent
            color: "#0b0e14"

            // Grid-dot background
            Canvas {
                anchors.fill: parent
                opacity: 0.06
                onPaint: {
                    var ctx = getContext("2d");
                    ctx.fillStyle = "#00f0ff";
                    for (var x = 0; x < width; x += 48) {
                        for (var y = 0; y < height; y += 48) {
                            ctx.beginPath();
                            ctx.arc(x, y, 1.5, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    }
                }
            }

            Column {
                anchors.centerIn: parent
                spacing: 16

                // Wordmark
                Row {
                    anchors.horizontalCenter: parent.horizontalCenter
                    spacing: 0
                    Text {
                        text: "DainRaku"
                        font.family: "JetBrains Mono"
                        font.pixelSize: 52
                        font.weight: Font.Bold
                        color: "#e0e8f0"
                    }
                    Text {
                        text: " OS"
                        font.family: "JetBrains Mono"
                        font.pixelSize: 52
                        font.weight: Font.Light
                        color: "#00f0ff"
                    }
                }

                // Tagline
                Text {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: "Precision. Power. Penetration."
                    font.family: "JetBrains Mono"
                    font.pixelSize: 14
                    color: "#00f0ffaa"
                    letterSpacing: 3
                }

                // Separator
                Rectangle {
                    anchors.horizontalCenter: parent.horizontalCenter
                    width: 320; height: 1
                    color: "#00f0ff40"
                }

                // Status
                Text {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: "Installing DainRaku OS — please wait…"
                    font.family: "JetBrains Mono"
                    font.pixelSize: 12
                    color: "#e0e8f080"
                }
            }
        }
    }

    // ── Slide 2 — Security Tools ──────────────────────────────────────────────
    Slide {
        Rectangle {
            anchors.fill: parent
            color: "#0b0e14"

            Canvas {
                anchors.fill: parent
                opacity: 0.06
                onPaint: {
                    var ctx = getContext("2d");
                    ctx.fillStyle = "#00f0ff";
                    for (var x = 0; x < width; x += 48) {
                        for (var y = 0; y < height; y += 48) {
                            ctx.beginPath();
                            ctx.arc(x, y, 1.5, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    }
                }
            }

            Column {
                anchors.centerIn: parent
                spacing: 20

                Text {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: "SECURITY TOOLCHAIN"
                    font.family: "JetBrains Mono"
                    font.pixelSize: 11
                    color: "#00f0ff"
                    letterSpacing: 4
                }

                Text {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: "Professional-grade penetration testing"
                    font.family: "JetBrains Mono"
                    font.pixelSize: 26
                    font.weight: Font.Bold
                    color: "#e0e8f0"
                }

                Rectangle {
                    anchors.horizontalCenter: parent.horizontalCenter
                    width: 500; height: 1
                    color: "#00f0ff30"
                }

                Grid {
                    anchors.horizontalCenter: parent.horizontalCenter
                    columns: 3
                    spacing: 12

                    Repeater {
                        model: [
                            "Metasploit Framework",
                            "Nmap / Masscan",
                            "Burp Suite",
                            "Wireshark",
                            "Hashcat / John",
                            "Aircrack-ng",
                            "SQLMap",
                            "Nikto",
                            "Gobuster"
                        ]
                        delegate: Rectangle {
                            width: 160; height: 34
                            color: "#0d1117"
                            border.color: "#00f0ff30"
                            border.width: 1
                            radius: 2
                            Text {
                                anchors.centerIn: parent
                                text: modelData
                                font.family: "JetBrains Mono"
                                font.pixelSize: 11
                                color: "#00f0ffcc"
                            }
                        }
                    }
                }
            }
        }
    }

    // ── Slide 3 — Performance ─────────────────────────────────────────────────
    Slide {
        Rectangle {
            anchors.fill: parent
            color: "#0b0e14"

            Canvas {
                anchors.fill: parent
                opacity: 0.06
                onPaint: {
                    var ctx = getContext("2d");
                    ctx.fillStyle = "#00f0ff";
                    for (var x = 0; x < width; x += 48) {
                        for (var y = 0; y < height; y += 48) {
                            ctx.beginPath();
                            ctx.arc(x, y, 1.5, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    }
                }
            }

            Column {
                anchors.centerIn: parent
                spacing: 20

                Text {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: "PERFORMANCE ENGINEERING"
                    font.family: "JetBrains Mono"
                    font.pixelSize: 11
                    color: "#00f0ff"
                    letterSpacing: 4
                }

                Text {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: "Built for speed, tuned for operators"
                    font.family: "JetBrains Mono"
                    font.pixelSize: 26
                    font.weight: Font.Bold
                    color: "#e0e8f0"
                }

                Rectangle {
                    anchors.horizontalCenter: parent.horizontalCenter
                    width: 500; height: 1
                    color: "#00f0ff30"
                }

                Column {
                    anchors.horizontalCenter: parent.horizontalCenter
                    spacing: 10

                    Repeater {
                        model: [
                            { label: "Liquorix kernel   ", desc: "Low-latency, optimised for responsiveness" },
                            { label: "Zram swap         ", desc: "Compressed RAM — no swap thrash"           },
                            { label: "Btrfs + Snapper   ", desc: "Atomic snapshots and instant rollback"     },
                            { label: "ZSTD compression  ", desc: "Fast I/O with transparent compression"    }
                        ]
                        delegate: Row {
                            spacing: 12
                            Text {
                                text: modelData.label
                                font.family: "JetBrains Mono"
                                font.pixelSize: 13
                                font.weight: Font.Bold
                                color: "#00f0ff"
                            }
                            Text {
                                text: "— " + modelData.desc
                                font.family: "JetBrains Mono"
                                font.pixelSize: 13
                                color: "#e0e8f080"
                            }
                        }
                    }
                }
            }
        }
    }

    // ── Slide 4 — Almost done ─────────────────────────────────────────────────
    Slide {
        Rectangle {
            anchors.fill: parent
            color: "#0b0e14"

            Canvas {
                anchors.fill: parent
                opacity: 0.06
                onPaint: {
                    var ctx = getContext("2d");
                    ctx.fillStyle = "#00f0ff";
                    for (var x = 0; x < width; x += 48) {
                        for (var y = 0; y < height; y += 48) {
                            ctx.beginPath();
                            ctx.arc(x, y, 1.5, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    }
                }
            }

            Column {
                anchors.centerIn: parent
                spacing: 16

                Row {
                    anchors.horizontalCenter: parent.horizontalCenter
                    spacing: 0
                    Text {
                        text: "DainRaku"
                        font.family: "JetBrains Mono"
                        font.pixelSize: 46
                        font.weight: Font.Bold
                        color: "#e0e8f0"
                    }
                    Text {
                        text: " OS"
                        font.family: "JetBrains Mono"
                        font.pixelSize: 46
                        font.weight: Font.Light
                        color: "#00f0ff"
                    }
                }

                Rectangle {
                    anchors.horizontalCenter: parent.horizontalCenter
                    width: 400; height: 1
                    color: "#00f0ff40"
                }

                Text {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: "Installation almost complete."
                    font.family: "JetBrains Mono"
                    font.pixelSize: 18
                    color: "#e0e8f0"
                }

                Text {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: "Your system will reboot shortly."
                    font.family: "JetBrains Mono"
                    font.pixelSize: 13
                    color: "#00f0ff80"
                }

                Text {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: "github.com/dainraku-os/dainraku"
                    font.family: "JetBrains Mono"
                    font.pixelSize: 11
                    color: "#e0e8f040"
                }
            }
        }
    }

    // ── Auto-advance every 6 seconds ─────────────────────────────────────────
    Timer {
        interval: 6000
        running: true
        repeat: true
        onTriggered: presentation.goToNextSlide()
    }
}
