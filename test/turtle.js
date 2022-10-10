module.exports = class Turtle {
    constructor(xMax, yMax) {
        this.x = 0;
        this.y = 0;
        this.angleDeg = 0;
        this.xMax = xMax;
        this.yMax = yMax;
    }
    // Angle (deg to sin)
    get angle() {
        return this.angleDeg * Math.PI / 180;
    }
    get xCoord() {
        return this.xMax - Math.floor(this.x);
    }
    get yCoord() {
        return this.yMax - Math.floor(this.y);
    }
    // Set coordinates
    setPos(x, y) {
        this.x = x;
        this.y = y;
    }
    // Go forward
    _forward() {
        this.x += Math.sin(this.angle);
        this.y += Math.cos(this.angle);
        return {
            x: this.xCoord,
            y: this.yCoord
        };
    }
    forward(distance, slow = false) {
        if (slow) {
            const result = [];
            for (let i = 0; i < distance; i++) {
                result.push(this._forward());
            }
            return result;
        } else {
            this.x += Math.sin(this.angle) * distance;
            this.y += Math.cos(this.angle) * distance;
            return [{
                x: this.xCoord,
                y: this.yCoord
            }]
        }
    }
    _backward() {
        this.x -= Math.sin(this.angle);
        this.y -= Math.cos(this.angle);
        return {
            x: this.xCoord,
            y: this.yCoord
        };
    }
    // Go backward
    backward(distance, slow = false) {
        if (slow) {
            const result = [];
            for (let i = 0; i < distance; i++) {
                result.push(this._backward());
            }
            return result;
        } else {
            this.x -= Math.sin(this.angle) * distance;
            this.y -= Math.cos(this.angle) * distance;
            return [{
                x: this.xCoord,
                y: this.yCoord
            }]
        }
    }
    // Turn right
    right(angleDeg) {
        this.angleDeg -= angleDeg;
        while (this.angleDeg < -360) {
            this.angleDeg += 360;
        }
        while (this.angleDeg > 360) {
            this.angleDeg -= 360;
        }
    }
    // Turn left
    left(angleDeg) {
        this.right(-angleDeg);
    }
}