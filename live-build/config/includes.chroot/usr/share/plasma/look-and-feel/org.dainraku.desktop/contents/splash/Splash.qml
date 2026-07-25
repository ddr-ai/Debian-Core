import QtQuick 2.5

Rectangle {
    id: root
    color: "#0b0e14"

    property int stage

    onStageChanged: {
        if (stage == 2) {
            introAnimation.running = true
        }
    }

    Item {
        id: content
        anchors.fill: parent
        opacity: 0

        Image {
            id: logo
            source: "images/logo.png"
            width: 220
            height: 220
            fillMode: Image.PreserveAspectFit
            smooth: true
            anchors.horizontalCenter: parent.horizontalCenter
            anchors.verticalCenter: parent.verticalCenter
            anchors.verticalCenterOffset: -40
        }

        Text {
            id: title
            anchors.horizontalCenter: parent.horizontalCenter
            anchors.top: logo.bottom
            anchors.topMargin: 24
            text: "DainRaku OS"
            color: "#00f0ff"
            font.pixelSize: 32
            font.family: "JetBrains Mono"
            font.bold: true
        }

        Text {
            id: tagline
            anchors.horizontalCenter: parent.horizontalCenter
            anchors.top: title.bottom
            anchors.topMargin: 8
            text: "Precision. Power. Penetration."
            color: "#e0e8f0"
            opacity: 0.6
            font.pixelSize: 14
            font.family: "JetBrains Mono"
        }

        Rectangle {
            id: barTrack
            anchors.horizontalCenter: parent.horizontalCenter
            anchors.top: tagline.bottom
            anchors.topMargin: 48
            width: 280
            height: 3
            radius: 1.5
            color: "#111820"

            Rectangle {
                id: bar
                height: parent.height
                radius: parent.radius
                color: "#00f0ff"
                width: (root.stage / 6) * parent.width

                Behavior on width {
                    NumberAnimation { duration: 250; easing.type: Easing.InOutQuad }
                }
            }
        }
    }

    OpacityAnimator {
        id: introAnimation
        running: false
        target: content
        from: 0
        to: 1
        duration: 800
        easing.type: Easing.InOutQuad
    }
}
