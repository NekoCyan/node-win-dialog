const Dialog = require('../index.js');

const log = new Dialog();

// Setup wintools
log.WinTools.setup();

// Screen 1366x768

const x = 1366 / 2;
const y = 768 / 2;

function cos(deg) {
    return Math.cos(deg * Math.PI / 180);
}

function sin(deg) {
    return Math.sin(deg * Math.PI / 180);
}

async function test (r = 150) {
    // move mouse (circle, r = 150)
    for (let i = 0; i < 361; i++) {
        const x_ = x + r * cos(i)
        const y_ = y + r * sin(i)
        console.log('Degree: ' + i + ' x: ' + x_ + ' y: ' + y_);
        await log.WinTools.setCursor(x_, y_);
    }
    // Play `nyancat.mp3`, duration : 10s
    log.WinTools.playMedia('./test/nyancat.mp3', 10_000);
    // Display notification (5s)
    await log.WinTools.trayBalloon('Nyancat.mp3', 'end', './test/icon.ico', 5000);
    // Press ctrl+c (stop playing)
    log.WinTools.fakeKey('ctrl', 'down');
    log.WinTools.fakeKey('c', 'down');
}

test();