class pixel {
    constructor(x0, y0, c) {
        this.type = "pixel";

        this.docs = "https://inkplate.readthedocs.io/en/latest/gui-designer.html#primitives-list" // TODO TODOOT - pixel docs
        this.id = 0;

        this["location"] = {
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

        this["color"] = c;

        this.modifiers = [
            "location",
        ];

        this.z = 0;

        this.editable = {
            "location": {
                type: "coordinate",
                default: {
                    x: 10,
                    y: 10
                },
                optional: false
            },
            "color": {
                type: "int",
                min: 0,
                max: 7,
                default: 0,
                optional: false
            }
        };
    }
    getCCodeVariables() {
        return `int pixel${this.id}_x = ${parseInt(this.location.x)};\n` +
            `int pixel${this.id}_y = ${parseInt(this.location.y)};\n` +
            `int pixel${this.id}_color = ${parseInt(this.color)};\n\n`;
    }

    getCCodeDraw() {
        return `   display.drawPixel(pixel${this.id}_x, pixel${this.id}_y, pixel${this.id}_color);\n\n`;
    }

    mouseOn(x, y) {
        return (this.location.x - x) ** 2 + (this.location.y - y) ** 2 < 150;
    }

    moveDelta(dx, dy) {
        this.location.x = parseInt(this.location.x + dx);
        this.location.y = parseInt(this.location.y + dy);
    }
}

class line {
    constructor(x0, y0, x1, y1, c0, c1, t) {
        this.type = "line";

        this.docs = "https://inkplate.readthedocs.io/en/latest/gui-designer.html#line";

        this.id = 0;

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

        this.editable = {
            "start": {
                type: "coordinate",
                default: {
                    x: 10,
                    y: 10
                },
                optional: false
            },
            "end": {
                type: "coordinate",
                default: {
                    x: 500,
                    y: 500
                },
                optional: false
            },
            "color": {
                type: "int",
                min: 0,
                max: 7,
                default: 0,
                optional: false
            },
            "thickness": {
                type: "float",
                min: 1,
                max: 30,
                default: 1,
                optional: true
            },
            "gradient": {
                type: "int",
                min: 0,
                max: 7,
                default: 0,
                optional: true
            }
        };
    }

    getCCodeVariables() {
        return `int line${this.id}_start_x = ${parseInt(this.start.x)};\n` +
            `int line${this.id}_start_y = ${parseInt(this.start.y)};\n` +
            `int line${this.id}_end_x = ${parseInt(this.end.x)};\n` +
            `int line${this.id}_end_y = ${parseInt(this.end.y)};\n` +
            `int line${this.id}_color = ${parseInt(this.color)};\n` +
            `int line${this.id}_thickness = ${parseInt(this.thickness)};\n` +
            `int line${this.id}_gradient = ${parseInt(this.gradient)};\n\n`;
    }

    getCCodeDraw() {
        return `   if (line${this.id}_gradient <= line${this.id}_color && line${this.id}_thickness == 1)\n` +
            `       display.drawLine(line${this.id}_start_x, line${this.id}_start_y, line${this.id}_end_x, line${this.id}_end_y, line${this.id}_color);\n` +
            `   else if (line${this.id}_gradient <= line${this.id}_color && line${this.id}_thickness != 1)\n` +
            `       display.drawThickLine(line${this.id}_start_x, line${this.id}_start_y, line${this.id}_end_x, line${this.id}_end_y, line${this.id}_color, line${this.id}_thickness);\n` +
            `   else if (line${this.id}_gradient > line${this.id}_color && line${this.id}_thickness == 1)\n` +
            `       display.drawGradientLine(line${this.id}_start_x, line${this.id}_start_y, line${this.id}_end_x, line${this.id}_end_y, line${this.id}_color, line${this.id}_gradient, 1);\n` +
            `   else if (line${this.id}_gradient > line${this.id}_color && line${this.id}_thickness != 1)\n` +
            `       display.drawGradientLine(line${this.id}_start_x, line${this.id}_start_y, line${this.id}_end_x, line${this.id}_end_y, line${this.id}_color, line${this.id}_gradient, line${this.id}_thickness);\n\n`;
    }

    mouseOn(x, y) {
        function sqr(x) {
            return x * x
        }

        function dist2(v, w) {
            return sqr(v.x - w.x) + sqr(v.y - w.y)
        }

        function distToSegmentSquared(p, v, w) {
            var l2 = dist2(v, w);
            if (l2 == 0) return dist2(p, v);
            var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
            t = Math.max(0, Math.min(1, t));
            return dist2(p, {
                x: v.x + t * (w.x - v.x),
                y: v.y + t * (w.y - v.y)
            });
        }
        return distToSegmentSquared({
                x: x,
                y: y
            },
            this["start"],
            this["end"]) < 150;
    }

    moveDelta(dx, dy) {
        this["start"].x = parseInt(this["start"].x + dx);
        this["start"].y = parseInt(this["start"].y + dy);
        this["end"].x = parseInt(dx + this["end"].x);
        this["end"].y = parseInt(dy + this["end"].y);
    }
}

class circle {
    constructor(x0, y0, r, c, fill) {
        this.type = "circle";

        this.docs = "https://inkplate.readthedocs.io/en/latest/gui-designer.html#circle";

        this.id = 0;

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
        this.editable = {
            "center": {
                type: "coordinate",
                default: {
                    x: 400,
                    y: 300
                },
                optional: false
            },
            "radius": {
                type: "int",
                min: 0,
                max: 1500,
                default: 100,
                optional: false
            },
            "color": {
                type: "int",
                min: 0,
                max: 7,
                default: 0,
                optional: false
            },
            "fill": {
                type: "bool",
                default: true,
            },
        };
    }
    getCCodeVariables() {
        return `int circle${this.id}_center_x = ${parseInt(this.center.x)};\n` +
            `int circle${this.id}_center_y = ${parseInt(this.center.y)};\n` +
            `int circle${this.id}_fill = ${this.fill ? "1" : "-1"};\n` +
            `int circle${this.id}_radius = ${this.radius};\n` +
            `int circle${this.id}_color = ${this.color || 0};\n\n`;
    }

    getCCodeDraw() {
        return `    if (circle${this.id}_fill != -1)\n` +
            `       display.fillCircle(circle${this.id}_center_x, circle${this.id}_center_y, circle${this.id}_radius, circle${this.id}_color);\n` +
            `   else\n` +
            `       display.drawCircle(circle${this.id}_center_x, circle${this.id}_center_y, circle${this.id}_radius, circle${this.id}_color);\n\n`;
    }

    mouseOn(x, y) {
        let d = (this.center.x - x) ** 2 + (this.center.y - y) ** 2
        return (this.radius ** 2 - 1700) < d && d < (this.radius ** 2 + 1700);
    }

    moveDelta(dx, dy) {
        this.center.x = parseInt(this.center.x + dx);
        this.center.y = parseInt(this.center.y + dy);
    }
}

class rect {
    constructor(x0, y0, x1, y1, c, r, fill) {
        this.type = "rect";

        this.docs = "https://inkplate.readthedocs.io/en/latest/gui-designer.html#rectangle";

        this.id = 0;

        let self = this;

        this["a"] = {
            x: x0,
            y: y0,
            set: function (_x, _y) {
                this.x = _x;
                this.y = _y;
                self["b"].x = _x;
                self["d"].y = _y;
            },
            distSqr: function (_x, _y) {
                return (this.x - _x) ** 2 + (this.y - _y) ** 2;
            },
        }
        this["b"] = {
            x: x0,
            y: y1,
            set: function (_x, _y) {
                this.x = _x;
                this.y = _y;
                self["a"].x = _x;
                self["c"].y = _y;
            },
            distSqr: function (_x, _y) {
                return (this.x - _x) ** 2 + (this.y - _y) ** 2;
            },
        }
        this["c"] = {
            x: x1,
            y: y1,
            set: function (_x, _y) {
                this.x = _x;
                this.y = _y;
                self["b"].y = _y;
                self["d"].x = _x;
            },
            distSqr: function (_x, _y) {
                return (this.x - _x) ** 2 + (this.y - _y) ** 2;
            },
        }
        this["d"] = {
            x: x1,
            y: y0,
            set: function (_x, _y) {
                this.x = _x;
                this.y = _y;
                self["a"].y = _y;
                self["c"].x = _x;
            },
            distSqr: function (_x, _y) {
                return (this.x - _x) ** 2 + (this.y - _y) ** 2;
            },
        }
        this["fill"] = fill;
        this["radius"] = r;
        this["color"] = c;
        this.modifiers = [
            "a",
            "b",
            "c",
            "d"
        ];
        this.z = 0;
        this.editable = {
            "a": {
                type: "coordinate",
                default: {
                    x: 100,
                    y: 100
                },
                optional: false
            },
            "c": {
                type: "coordinate",
                default: {
                    x: 700,
                    y: 500
                },
                optional: false
            },
            "color": {
                type: "int",
                min: 0,
                max: 7,
                default: 0,
                optional: false
            },
            "fill": {
                type: "bool",
                default: true,
            },
            "radius": {
                type: "int",
                min: 0,
                max: globalW,
                default: 0,
                optional: true
            }
        }
    }

    getCCodeVariables() {
        return `int rect${this.id}_a_x = ${parseInt(this.a.x)};\n` +
            `int rect${this.id}_a_y = ${parseInt(this.a.y)};\n` +
            `int rect${this.id}_b_x = ${parseInt(this.c.x)};\n` +
            `int rect${this.id}_b_y = ${parseInt(this.c.y)};\n` +
            `int rect${this.id}_fill = ${this.fill ? "1" : "-1"};\n` +
            `int rect${this.id}_radius = ${this.radius ? this.radius : "-1"};\n` +
            `int rect${this.id}_color = ${this.color || 0};\n\n`;
    }

    getCCodeDraw() {
        return `    if (rect${this.id}_radius != -1 && rect${this.id}_fill != -1)\n` +
            `       display.fillRoundRect(rect${this.id}_a_x, rect${this.id}_a_y, rect${this.id}_b_x - rect${this.id}_a_x, rect${this.id}_b_y - rect${this.id}_a_y, rect${this.id}_radius, rect${this.id}_color);\n` +
            `   else if (rect${this.id}_radius != -1 && rect${this.id}_fill == -1)\n` +
            `       display.drawRoundRect(rect${this.id}_a_x, rect${this.id}_a_y, rect${this.id}_b_x - rect${this.id}_a_x, rect${this.id}_b_y - rect${this.id}_a_y, rect${this.id}_radius, rect${this.id}_color);\n` +
            `   else if (rect${this.id}_radius == -1 && rect${this.id}_fill != -1)\n` +
            `       display.fillRect(rect${this.id}_a_x, rect${this.id}_a_y, rect${this.id}_b_x - rect${this.id}_a_x, rect${this.id}_b_y - rect${this.id}_a_y, rect${this.id}_color);\n` +
            `   else if (rect${this.id}_radius == -1 && rect${this.id}_fill == -1)\n` +
            `       display.drawRect(rect${this.id}_a_x, rect${this.id}_a_y, rect${this.id}_b_x - rect${this.id}_a_x, rect${this.id}_b_y - rect${this.id}_a_y, rect${this.id}_color);\n\n`;
    }

    mouseOn(x, y) {
        function sqr(x) {
            return x * x
        }

        function dist2(v, w) {
            return sqr(v.x - w.x) + sqr(v.y - w.y)
        }

        function distToSegmentSquared(p, v, w) {
            var l2 = dist2(v, w);
            if (l2 == 0) return dist2(p, v);
            var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
            t = Math.max(0, Math.min(1, t));
            return dist2(p, {
                x: v.x + t * (w.x - v.x),
                y: v.y + t * (w.y - v.y)
            });
        }
        return distToSegmentSquared({
                    x: x,
                    y: y
                },
                this["a"],
                this["b"]) < 150 ||
            distToSegmentSquared({
                    x: x,
                    y: y
                },
                this["b"],
                this["c"]) < 150 ||
            distToSegmentSquared({
                    x: x,
                    y: y
                },
                this["c"],
                this["d"]) < 150 || distToSegmentSquared({
                    x: x,
                    y: y
                },
                this["d"],
                this["a"]) < 150;
    }

    moveDelta(dx, dy) {
        this["a"].x = parseInt(dx + this["a"].x);
        this["a"].y = parseInt(dy + this["a"].y);
        this["b"].x = parseInt(dx + this["b"].x);
        this["b"].y = parseInt(dy + this["b"].y);
        this["c"].x = parseInt(dx + this["c"].x);
        this["c"].y = parseInt(dy + this["c"].y);
        this["d"].x = parseInt(dx + this["d"].x);
        this["d"].y = parseInt(dy + this["d"].y);
    }
}

class triangle {
    constructor(x0, y0, x1, y1, x2, y2, c, fill) {
        this.type = "triangle";

        this.docs = "https://inkplate.readthedocs.io/en/latest/gui-designer.html#triangle";

        this.id = 0;

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
        this.z = 0;

        this.editable = {
            "a": {
                type: "coordinate",
                default: {
                    x: 100,
                    y: 100
                },
                optional: false
            },
            "b": {
                type: "coordinate",
                default: {
                    x: 500,
                    y: 500
                },
                optional: false
            },
            "c": {
                type: "coordinate",
                default: {
                    x: 100,
                    y: 500
                },
                optional: false
            },
            "color": {
                type: "int",
                min: 0,
                max: 7,
                default: 0,
                optional: false
            },
            "fill": {
                type: "bool",
                default: true,
            },
        }
    }

    getCCodeVariables() {
        return `int triangle${this.id}_a_x = ${parseInt(this.a.x)};\n` +
            `int triangle${this.id}_a_y = ${parseInt(this.a.y)};\n` +
            `int triangle${this.id}_b_x = ${parseInt(this.b.x)};\n` +
            `int triangle${this.id}_b_y = ${parseInt(this.b.y)};\n` +
            `int triangle${this.id}_c_x = ${parseInt(this.c.x)};\n` +
            `int triangle${this.id}_c_y = ${parseInt(this.c.y)};\n` +
            `int triangle${this.id}_fill = ${this.fill ? "1" : "-1"};\n` +
            `int triangle${this.id}_radius = ${this.radius ? this.radius : "-1"};\n` +
            `int triangle${this.id}_color = ${this.color || 0};\n\n`;
    }

    getCCodeDraw() {
        return `    if (triangle${this.id}_fill != -1)\n` +
            `       display.fillTriangle(triangle${this.id}_a_x, triangle${this.id}_a_y, triangle${this.id}_b_x, triangle${this.id}_b_y, triangle${this.id}_c_x, triangle${this.id}_c_y, triangle${this.id}_color);\n` +
            `   else\n` +
            `       display.drawTriangle(triangle${this.id}_a_x, triangle${this.id}_a_y, triangle${this.id}_b_x, triangle${this.id}_b_y, triangle${this.id}_c_x, triangle${this.id}_c_y, triangle${this.id}_color);\n\n`;
    }

    mouseOn(x, y) {
        function sqr(x) {
            return x * x
        }

        function dist2(v, w) {
            return sqr(v.x - w.x) + sqr(v.y - w.y)
        }

        function distToSegmentSquared(p, v, w) {
            var l2 = dist2(v, w);
            if (l2 == 0) return dist2(p, v);
            var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
            t = Math.max(0, Math.min(1, t));
            return dist2(p, {
                x: v.x + t * (w.x - v.x),
                y: v.y + t * (w.y - v.y)
            });
        }
        return distToSegmentSquared({
                    x: x,
                    y: y
                },
                this["a"],
                this["b"]) < 150 ||
            distToSegmentSquared({
                    x: x,
                    y: y
                },
                this["b"],
                this["c"]) < 150 ||
            distToSegmentSquared({
                    x: x,
                    y: y
                },
                this["c"],
                this["a"]) < 150;
    }

    moveDelta(dx, dy) {
        this["a"].x = parseInt(dx + this["a"].x);
        this["a"].y = parseInt(dy + this["a"].y);
        this["b"].x = parseInt(dx + this["b"].x);
        this["b"].y = parseInt(dy + this["b"].y);
        this["c"].x = parseInt(dx + this["c"].x);
        this["c"].y = parseInt(dy + this["c"].y);
    }
}

class text {
    constructor(x0, y0, text, font, c) {
        this.type = "text";

        this.docs = "https://inkplate.readthedocs.io/en/latest/gui-designer.html#text";

        this.id = 0;

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
        this["color"] = c;

        this.modifiers = [
            "cursor"
        ];
        this.z = 0;

        this.editable = {
            "cursor": {
                type: "coordinate",
                default: {
                    x: 300,
                    y: 290
                },
                optional: false
            },
            "content": {
                type: "text",
                default: "Hello World",
                optional: false
            },
            "font": {
                type: "text",
                default: "FreeSansBold24pt7b",
                optional: false
            },
            "color": {
                type: "int",
                min: 0,
                max: 7,
                default: 0,
                optional: false
            },
        };
    }

    getIncludes() {
        return `#include "Fonts/${this.font.substr(this.font.indexOf(' ') + 1)}.h"\n`;
    }

    getCCodeVariables() {
        return `String text${this.id}_content = "${this.content}";\n` +
            `int text${this.id}_cursor_x = ${parseInt(this.cursor.x)};\n` +
            `int text${this.id}_cursor_y = ${parseInt(this.cursor.y)};\n` +
            `const GFXfont *text${this.id}_font = &${this.font.substr(this.font.indexOf(' ') + 1)};\n\n`;
    }

    getCCodeDraw() {
        return `    display.setFont(text${this.id}_font);\n` +
            `    display.setTextColor(${this.color}, 7);` +
            `    display.setTextSize(1);` +
            `    display.setCursor(text${this.id}_cursor_x, text${this.id}_cursor_y);\n` +
            `    display.print(text${this.id}_content);\n` +
            `\n`;
    }

    getFontSize() {
        // Get the font size in points (1/72") from the font name
        const re = /\D+(\d+)pt7b/;
        const match = this.font.match(re);
        return match[1];
    }

    getFontFamily() {
        // Get the font family based on the font name
        const re = /(\D+)\d+pt7b/;
        const match = this.font.match(re);
        return match[1];
    }

    mouseOn(x, y) {
        function sqr(x) {
            return x * x
        }

        function dist2(v, w) {
            return sqr(v.x - w.x) + sqr(v.y - w.y)
        }

        function distToSegmentSquared(p, v, w) {
            var l2 = dist2(v, w);
            if (l2 == 0) return dist2(p, v);
            var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
            t = Math.max(0, Math.min(1, t));
            return dist2(p, {
                x: v.x + t * (w.x - v.x),
                y: v.y + t * (w.y - v.y)
            });
        }
        return distToSegmentSquared({
            x: x,
            y: y
        }, {
            x: this.cursor.x,
            y: this.cursor.y
        }, {
            x: this.cursor.x + ctx.measureText(this.content).width,
            y: this.cursor.y
        }) < 2000;
    }

    moveDelta(dx, dy) {
        this["cursor"].x += parseInt(dx);
        this["cursor"].y += parseInt(dy);
    }
}

class bitmap {
    constructor(x0, y0, w, h, url) {
        this.type = "bitmap";

        this.docs = "https://inkplate.readthedocs.io/en/latest/gui-designer.html#bitmap";

        this.id = 0;

        this["corner"] = {
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

        this["width"] = w;
        this["height"] = h;

        this["url"] = url;
        this.file = null;

        this["file_name"] = 0;

        this.modifiers = [
            "corner"
        ];

        this.z = 0;

        this.editable = {
            "corner": {
                type: "coordinate",
                default: {
                    x: 100,
                    y: 100
                },
                optional: false
            },
            "width": {
                type: "int",
                min: 0,
                max: 800,
                default: 0,
                optional: false
            },
            "height": {
                type: "int",
                min: 0,
                max: 600,
                default: 0,
                optional: false
            },
            "Maintain aspect ratio": {
                type: "bool",
                default: true,
                excludeFromC: true
            },
            "url": {
                type: "file",
                default: "",
                optional: false
            }
        }
    }

    getCCodeVariables() {
        if (!this.file)
            return "";

        let img = this.file;
        let canvas = document.createElement("canvas");

        canvas.width = this["width"];
        canvas.height = this["height"];

        let ctx = canvas.getContext("2d");

        ctx.drawImage(
            img,
            0, 0,
            img.width, img.height,
            0, 0,
            canvas.width, canvas.height
        );

        let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        for (let i = 1; i < canvas.height - 1; ++i)
            for (let j = 1; j < canvas.width - 1; ++j)
                imgData.data[4 * (j + i * canvas.width)] = parseInt(
                    (0.3 * imgData.data[4 * (j + i * canvas.width)]) +
                    (0.59 * imgData.data[4 * (j + i * canvas.width) + 1]) +
                    (0.11 * imgData.data[4 * (j + i * canvas.width) + 2]));


        let depth = 3;

        for (let i = 1; i < canvas.height - 1; ++i) {
            for (let j = 1; j < canvas.width - 1; ++j) {
                let oldpixel = imgData.data[4 * (j + i * canvas.width)];

                let newpixel = oldpixel & (depth == 3 ? 0xE0 : 0x80);

                imgData.data[4 * (j + i * canvas.width)] = newpixel;

                let quant_error = oldpixel - newpixel;

                imgData.data[4 * ((j + 1) + (i + 0) * canvas.width)] += Math.floor(quant_error * 7 / 16);
                imgData.data[4 * ((j - 1) + (i + 1) * canvas.width)] += Math.floor(quant_error * 3 / 16);
                imgData.data[4 * ((j + 0) + (i + 1) * canvas.width)] += Math.floor(quant_error * 5 / 16);
                imgData.data[4 * ((j + 1) + (i + 1) * canvas.width)] += Math.floor(quant_error * 1 / 16);
            }
        }


        let s = `` +
            `int bitmap${this.id}_x = ${this["corner"].x};\n` +
            `int bitmap${this.id}_y = ${this["corner"].y};\n` +
            `const int bitmap${this.id}_w = ${this["width"]};\n` +
            `const int bitmap${this.id}_h = ${this["height"]};\n` +
            `const uint8_t bitmap${this.id}_content[] PROGMEM = {\n`;

        let last = 0;

        for (let i = 0; i < canvas.height; ++i) {
            for (let j = 0; j < canvas.width; ++j) {
                let val = parseInt(imgData.data[4 * (j + canvas.width * i) + 0]);

                if (j % 2 == 0)
                    last = val & 0xF0;
                else {
                    last |= (val >> 4) & 0x0F;

                    s += `0x${last.toString(16)},`;
                    last = 0;
                }
            }
            if (canvas.height % 2 != 0) {
                s += `0x${last.toString(16)},`;
                last = 0;
            }
            s += "\n";
        }
        s += `};\n`;

        return s;
    }

    getCCodeDraw() {
        if (!this.file)
            return "";

        return `    display.drawBitmap3Bit(bitmap${this.id}_x, bitmap${this.id}_y, bitmap${this.id}_content, bitmap${this.id}_w, bitmap${this.id}_h);\n`;
    }

    mouseOn(x, y) {
        return (this["corner"].x < x && x < this["corner"].x + this["width"] &&
            this["corner"].y < y && y < this["corner"].y + this["height"]);
    }

    moveDelta(dx, dy) {
        this["corner"].x += parseInt(dx);
        this["corner"].y += parseInt(dy);
    }
}

let primitiveDict = {
    "pixel": pixel,
    "line": line,
    "circle": circle,
    "rect": rect,
    "triangle": triangle,
    "text": text,
    "bitmap": bitmap,
};

let primitiveIdCount = {
    "pixel": 0,
    "line": 0,
    "circle": 0,
    "rect": 0,
    "triangle": 0,
    "text": 1,
    "bitmap": 0
};
