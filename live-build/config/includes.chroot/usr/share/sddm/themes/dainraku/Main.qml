// DainRaku OS — SDDM Login Theme
// Dark cyberpunk aesthetic matching the OS identity
import QtQuick 2.15
import QtQuick.Controls 2.15
import QtQuick.Layouts 1.15
import SddmComponents 2.0

Rectangle {
    id: root
    width: 1920; height: 1080
    color: "#0b0e14"

    // ── Scanline overlay effect ───────────────────────────────────────────────
    Rectangle {
        anchors.fill: parent
        color: "transparent"
        Rectangle {
            width: parent.width; height: 1
            color: "#ffffff08"
            y: 0
            NumberAnimation on y {
                from: 0; to: parent.parent.height
                duration: 8000; loops: Animation.Infinite
            }
        }
    }

    // ── Grid dot background ───────────────────────────────────────────────────
    Canvas {
        anchors.fill: parent
        opacity: 0.08
        onPaint: {
            var ctx = getContext("2d");
            ctx.fillStyle = "#00f0ff";
            for (var x = 0; x < width; x += 40) {
                for (var y = 0; y < height; y += 40) {
                    ctx.beginPath(); ctx.arc(x, y, 1, 0, Math.PI * 2); ctx.fill();
                }
            }
        }
    }

    // ── Top status bar ────────────────────────────────────────────────────────
    Rectangle {
        anchors.top: parent.top; anchors.left: parent.left; anchors.right: parent.right
        height: 40; color: "#080b10"
        border.color: "#00f0ff22"; border.width: 1
        Row {
            anchors.left: parent.left; anchors.verticalCenter: parent.verticalCenter
            anchors.leftMargin: 24; spacing: 16
            Text { text: "DAINRAKU OS v1.0"; font.family: "JetBrains Mono"; font.pixelSize: 11; color: "#00f0ff"; opacity: 0.8 }
            Text { text: "//"; color: "#00f0ff44"; font.family: "JetBrains Mono"; font.pixelSize: 11 }
            Text { text: "KERNEL: LIQUORIX"; font.family: "JetBrains Mono"; font.pixelSize: 11; color: "#00f0ff60" }
        }
        Text {
            anchors.right: parent.right; anchors.rightMargin: 24; anchors.verticalCenter: parent.verticalCenter
            text: Qt.formatDateTime(new Date(), "yyyy-MM-dd  hh:mm")
            font.family: "JetBrains Mono"; font.pixelSize: 11; color: "#00f0ff60"
        }
    }

    // ── Main login panel ──────────────────────────────────────────────────────
    Rectangle {
        anchors.centerIn: parent
        width: 420; height: 460
        color: "#0d1117ee"
        border.color: "#00f0ff"
        border.width: 1
        radius: 2

        // Glow effect
        Rectangle {
            anchors.fill: parent
            color: "transparent"
            border.color: "#00f0ff"
            border.width: 1
            opacity: 0.3
            radius: parent.radius
            anchors.margins: -3
        }

        ColumnLayout {
            anchors.fill: parent
            anchors.margins: 40
            spacing: 20

            // Logo area
            ColumnLayout {
                Layout.alignment: Qt.AlignHCenter
                spacing: 4

                Row {
                    Layout.alignment: Qt.AlignHCenter
                    spacing: 6
                    Text {
                        text: "DainRaku"
                        font.family: "JetBrains Mono"; font.pixelSize: 28; font.weight: Font.Bold
                        color: "#e0e8f0"
                    }
                    Text {
                        text: " OS"
                        font.family: "JetBrains Mono"; font.pixelSize: 28; font.weight: Font.Light
                        color: "#00f0ff"
                    }
                }
                Text {
                    Layout.alignment: Qt.AlignHCenter
                    text: "Precision. Power. Penetration."
                    font.family: "JetBrains Mono"; font.pixelSize: 10
                    color: "#00f0ff80"
                    letterSpacing: 2
                }
            }

            // Divider
            Rectangle { Layout.fillWidth: true; height: 1; color: "#00f0ff30" }

            // Username
            ColumnLayout {
                Layout.fillWidth: true; spacing: 6
                Text { text: "USERNAME"; font.family: "JetBrains Mono"; font.pixelSize: 10; color: "#00f0ff80"; letterSpacing: 1 }
                ComboBox {
                    id: userField
                    Layout.fillWidth: true
                    height: 42; model: userModel; currentIndex: userModel.lastIndex
                    font.family: "JetBrains Mono"; font.pixelSize: 13
                    background: Rectangle { color: "#111820"; border.color: userField.activeFocus ? "#00f0ff" : "#00f0ff40"; border.width: 1; radius: 1 }
                    contentItem: Text { text: userField.currentText; font: userField.font; color: "#e0e8f0"; verticalAlignment: Text.AlignVCenter; leftPadding: 12 }
                }
            }

            // Password
            ColumnLayout {
                Layout.fillWidth: true; spacing: 6
                Text { text: "PASSWORD"; font.family: "JetBrains Mono"; font.pixelSize: 10; color: "#00f0ff80"; letterSpacing: 1 }
                TextField {
                    id: passField
                    Layout.fillWidth: true; height: 42
                    echoMode: TextInput.Password
                    placeholderText: "••••••••"
                    font.family: "JetBrains Mono"; font.pixelSize: 13; color: "#e0e8f0"
                    background: Rectangle { color: "#111820"; border.color: passField.activeFocus ? "#00f0ff" : "#00f0ff40"; border.width: 1; radius: 1 }
                    leftPadding: 12
                    Keys.onReturnPressed: sddm.login(userField.currentText, passField.text, session.index)
                }
            }

            // Login button
            Button {
                Layout.fillWidth: true; height: 44
                text: "AUTHENTICATE"
                font.family: "JetBrains Mono"; font.pixelSize: 12; font.weight: Font.Bold
                background: Rectangle {
                    color: parent.pressed ? "#00c4d4" : (parent.hovered ? "#00dde8" : "#00f0ff")
                    radius: 1
                }
                contentItem: Text {
                    text: parent.text; font: parent.font
                    color: "#000000"; horizontalAlignment: Text.AlignHCenter; verticalAlignment: Text.AlignVCenter
                }
                onClicked: sddm.login(userField.currentText, passField.text, session.index)
            }

            // Error message
            Text {
                id: errorMsg
                Layout.alignment: Qt.AlignHCenter
                color: "#ff4455"; font.family: "JetBrains Mono"; font.pixelSize: 11
                visible: false
            }
        }
    }

    // ── Session selector ──────────────────────────────────────────────────────
    Row {
        anchors.bottom: parent.bottom; anchors.right: parent.right
        anchors.margins: 24; spacing: 12
        Text { text: "SESSION:"; font.family: "JetBrains Mono"; font.pixelSize: 10; color: "#00f0ff60"; anchors.verticalCenter: parent.verticalCenter }
        ComboBox {
            id: session; width: 180; height: 32
            model: sessionModel; currentIndex: sessionModel.lastIndex
            font.family: "JetBrains Mono"; font.pixelSize: 11
            background: Rectangle { color: "#0d1117"; border.color: "#00f0ff40"; border.width: 1; radius: 1 }
            contentItem: Text { text: session.currentText; font: session.font; color: "#00f0ff80"; verticalAlignment: Text.AlignVCenter; leftPadding: 8 }
        }
    }

    // ── Error handling ────────────────────────────────────────────────────────
    Connections {
        target: sddm
        function onLoginFailed() {
            passField.text = "";
            errorMsg.text = "Authentication failed. Try again.";
            errorMsg.visible = true;
        }
    }

    Component.onCompleted: passField.forceActiveFocus()
}
