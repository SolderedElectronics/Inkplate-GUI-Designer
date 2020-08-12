class line {
    constructor(x0, y0, x1, y1, c0, c1, t) {
        this.type = "line";
        this["start"] = {
            x: x0,
            y: y0,
            set: function (_x, _y) {
                this.x = _x;
                this.y = _y;
            },
            distSqr: function (_x, _y) {
                return (this.x - _x) ** 2 + (this.y - _y) ** 2;
            }
        }
        this["end"] = {
            x: x1,
            y: y1,
            set: function (_x, _y) {
                this.x = _x;
                this.y = _y;
            },
            distSqr: function (_x, _y) {
                return (this.x - _x) ** 2 + (this.y - _y) ** 2;
            }
        }
        this["color"] = c0;
        this["thickness"] = t;
        this["gradient"] = c1;

        this.modifiers = [
            "start",
            "end",
        ];
        this.z = 0
    }
}

class circle {
    constructor(x0, y0, r, c, fill) {
        this.type = "circle";
        this["center"] = {
            x: x0,
            y: y0,
            set: function (_x, _y) {
                this.x = _x;
                this.y = _y;
            },
            distSqr: function (_x, _y) {
                return (this.x - _x) ** 2 + (this.y - _y) ** 2;
            },
        }
        this["fill"] = fill;
        this["radius"] = r;
        this["color"] = c;
        this.modifiers = [
            "center",
        ];
        this.z = 0;
    }
}

class rect {
    constructor(x0, y0, x1, y1, c, rounded, r, fill) {
        this.type = "rect";
        this["a"] = {
            x: x0,
            y: y0,
            set: function (_x, _y) {
                this.x = _x;
                this.y = _y;
            },
            distSqr: function (_x, _y) {
                return (this.x - _x) ** 2 + (this.y - _y) ** 2;
            },
        }
        this["b"] = {
            x: x1,
            y: y1,
            set: function (_x, _y) {
                this.x = _x;
                this.y = _y;
            },
            distSqr: function (_x, _y) {
                return (this.x - _x) ** 2 + (this.y - _y) ** 2;
            },
        }
        this["rounded"] = rounded;
        this["r"] = r;
        this["fill"] = fill;
        this["radius"] = r;
        this["color"] = c;
        this.modifiers = [
            "a",
            "b"
        ];
        this.z = 0;
    }
}

class triangle {
    constructor(x0, y0, x1, y1, x2, y2, c, fill) {
        this.type = "triangle";
        this["a"] = {
            x: x0,
            y: y0,
            set: function (_x, _y) {
                this.x = _x;
                this.y = _y;
            },
            distSqr: function (_x, _y) {
                return (this.x - _x) ** 2 + (this.y - _y) ** 2;
            },
        }
        this["b"] = {
            x: x1,
            y: y1,
            set: function (_x, _y) {
                this.x = _x;
                this.y = _y;
            },
            distSqr: function (_x, _y) {
                return (this.x - _x) ** 2 + (this.y - _y) ** 2;
            },
        }
        this["c"] = {
            x: x2,
            y: y2,
            set: function (_x, _y) {
                this.x = _x;
                this.y = _y;
            },
            distSqr: function (_x, _y) {
                return (this.x - _x) ** 2 + (this.y - _y) ** 2;
            },
        }
        this["color"] = c;
        this["fill"] = fill;
        this.modifiers = [
            "a",
            "b",
            "c",
        ];
        this.z = 0
    }
}

class text {
    constructor(x0, y0, text, font) {
        this.type = "text";
        this["cursor"] = {
            x: x0,
            y: y0,
            set: function (_x, _y) {
                this.x = _x;
                this.y = _y;
            },
            distSqr: function (_x, _y) {
                return (this.x - _x) ** 2 + (this.y - _y) ** 2;
            },
        }
        this["content"] = text;
        this["font"] = font;
        this.modifiers = [
            "cursor"
        ];
        this.z = 0;
    }
}