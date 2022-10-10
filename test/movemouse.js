const Dialog = require('../index.js');
const Turtle = require('./turtle');
const dialog = new Dialog();
const turtle = new Turtle(1920, 1080);
dialog.WinTools.setup();

async function main() {
    turtle.setPos(1920 / 2, 1080 / 2);
    turtle.right(18);
    // Draw star
    for (let i = 0; i < 5; i++) {
        const pos = turtle.forward(100, true);
        for (let i = 0; i < pos.length; i++) {
            await dialog.WinTools.setCursor(pos[i].x, pos[i].y);
        }
        turtle.right(144);
    }
}

main()