class line {
    constructor(x0, y0, x1, y1, c0, c1, t) {
        this.type = "line";

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
}

class circle {
    constructor(x0, y0, r, c, fill) {
        this.type = "circle";

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

}

class rect {
    constructor(x0, y0, x1, y1, c, r, fill) {
        this.type = "rect";

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
        this["fill"] = fill;
        this["radius"] = r;
        this["color"] = c;
        this.modifiers = [
            "a",
            "b"
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
                max: 800,
                default: 0,
                optional: true
            }
        }
    }

    getCCodeVariables() {
        return `int rect${this.id}_a_x = ${parseInt(this.a.x)};\n` +
            `int rect${this.id}_a_y = ${parseInt(this.a.y)};\n` +
            `int rect${this.id}_b_x = ${parseInt(this.b.x)};\n` +
            `int rect${this.id}_b_y = ${parseInt(this.b.y)};\n` +
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
}

class triangle {
    constructor(x0, y0, x1, y1, x2, y2, c, fill) {
        this.type = "triangle";

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
}

class text {
    constructor(x0, y0, text, font, c) {
        this.type = "text";

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
                    x: 100,
                    y: 100
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
                default: "24px FreeSansBold24pt7b",
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
        return `#include "Fonts/${this.font.substring(this.font.indexOf("px")+3)}.h"\n`;
    }

    getCCodeVariables() {
        return `String text${this.id}_content = "${this.content}";\n` +
            `int text${this.id}_cursor_x = ${parseInt(this.cursor.x)};\n` +
            `int text${this.id}_cursor_y = ${parseInt(this.cursor.y)};\n` +
            `const GFXfont *text${this.id}_font = &${this.font.substring(this.font.indexOf("px")+3)};\n\n`;
    }

    getCCodeDraw() {
        return `    display.setFont(text${this.id}_font);\n` +
            `    display.setTextColor(${this.color}, 7);` +
            `    display.setTextSize(1);` +
            `    display.setCursor(text${this.id}_cursor_x, text${this.id}_cursor_y);\n` +
            `    display.print(text${this.id}_content);\n` +
            `\n`;
    }
}

let primitiveDict = {
    "line": line,
    "circle": circle,
    "rect": rect,
    "triangle": triangle,
    "text": text,
};

let primitiveIdCount = {
    "line": 0,
    "circle": 0,
    "rect": 0,
    "triangle": 0,
    "text": 1,
};