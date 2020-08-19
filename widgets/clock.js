let clock = {
    name: "clock",
    type: "widget",
    id: 0,
    variables: {
        "center": {
            type: "coordinate",
            default: {
                x: 50,
                y: 50
            },
            value: null,
            set: function (_x, _y) {
                this.default.x = _x;
                this.default.y = _y;
            },
            distSqr: function (_x, _y) {
                return (this.default.x - _x) ** 2 + (this.default.y - _y) ** 2;
            },
        },
        "size": {
            default: 64,
            value: null
        },
        "h": {
            default: 9,
            value: null
        },
        "m": {
            default: 41,
            value: null
        },
    },
    draw: function (display) {
        let variables = {};

        for (const [key, value] of Object.entries(this.variables)) {
            if (value.value)
                variables[key] = value.value;
            else
                variables[key] = value.default;
        }

        this._draw(display, variables);
    },
    _draw: function (display, variables) {

        let r0 = variables["size"] / 2 * 0.55;
        let r1 = variables["size"] / 2 * 0.65;
        let r2 = variables["size"] / 2 * 0.9;
        let r3 = variables["size"] / 2 * 1.0;

        for (let i = 0; i < 60; ++i) {
            if (i % 5 == 0)
                display.drawThickLine(variables["center"].x + r1 * Math.cos(i / 60 * 2 * Math.PI),
                    variables["center"].y + r1 * Math.sin(i / 60 * 2 * Math.PI),
                    variables["center"].x + r3 * Math.cos(i / 60 * 2 * Math.PI),
                    variables["center"].y + r3 * Math.sin(i / 60 * 2 * Math.PI), 0, 3);
            else if (variables["size"] > 150)
                display.drawLine(variables["center"].x + r1 * Math.cos(i / 60 * 2 * Math.PI),
                    variables["center"].y + r1 * Math.sin(i / 60 * 2 * Math.PI),
                    variables["center"].x + r2 * Math.cos(i / 60 * 2 * Math.PI),
                    variables["center"].y + r2 * Math.sin(i / 60 * 2 * Math.PI), 2);
        }

        display.drawThickLine(variables["center"].x,
            variables["center"].y,
            variables["center"].x + r0 * Math.cos((variables["h"] - 3 + variables["m"] / 60) / 12 * 2 * Math.PI),
            variables["center"].y + r0 * Math.sin((variables["h"] - 3 + variables["m"] / 60) / 12 * 2 * Math.PI), 2, 2);

        display.drawThickLine(variables["center"].x,
            variables["center"].y,
            variables["center"].x + r2 * Math.cos((variables["m"] - 15) / 60 * 2 * Math.PI),
            variables["center"].y + r2 * Math.sin((variables["m"] - 15) / 60 * 2 * Math.PI), 2, 2);
    },
    getCCodeVariables: function () {
        return `` +
            `int widget${this.id}_h = ${this.variables["h"].value || this.variables["h"].default};\n` +
            `int widget${this.id}_m = ${this.variables["m"].value || this.variables["m"].default};\n` +
            `int widget${this.id}_center_x = ${this.variables["center"].value ? this.variables["center"].value.x : this.variables["center"].default.x};\n` +
            `int widget${this.id}_center_y = ${this.variables["center"].value ? this.variables["center"].value.y : this.variables["center"].default.y};\n` +
            `int widget${this.id}_size = ${this.variables["size"].value || this.variables["size"].default};\n` +
            `int widget${this.id}_r0 = (double)widget${this.id}_size / 2 * 0.55;\n` +
            `int widget${this.id}_r1 = (double)widget${this.id}_size / 2 * 0.65;\n` +
            `int widget${this.id}_r2 = (double)widget${this.id}_size / 2 * 0.9;\n` +
            `int widget${this.id}_r3 = (double)widget${this.id}_size / 2 * 1.0;\n\n`;
    },
    getCCodeDraw: function () {
        return `` +
            `   for (int i = 0; i < 60; ++i) {\n` +
            `       if (i % 5 == 0)\n` +
            `           display.drawThickLine(widget${this.id}_center_x + widget${this.id}_r1 * cos((double)i / 60.0 * 2.0 * 3.14159265),\n` +
            `               widget${this.id}_center_y + widget${this.id}_r1 * sin((double)i / 60.0 * 2.0 * 3.14159265),\n` +
            `               widget${this.id}_center_x + widget${this.id}_r3 * cos((double)i / 60.0 * 2.0 * 3.14159265),\n` +
            `               widget${this.id}_center_y + widget${this.id}_r3 * sin((double)i / 60.0 * 2.0 * 3.14159265), 0, 3);\n` +
            `       else if (widget${this.id}_size > 150)\n` +
            `               display.drawLine(widget${this.id}_center_x + widget${this.id}_r1 * cos((double)i / 60.0 * 2.0 * 3.14159265),\n` +
            `               widget${this.id}_center_y + widget${this.id}_r1 * sin((double)i / 60.0 * 2.0 * 3.14159265),\n` +
            `               widget${this.id}_center_x + widget${this.id}_r2 * cos((double)i / 60.0 * 2.0 * 3.14159265),\n` +
            `               widget${this.id}_center_y + widget${this.id}_r2 * sin((double)i / 60.0 * 2.0 * 3.14159265), 2);\n` +
            `   }\n` +
            `   display.drawThickLine(widget${this.id}_center_x,\n` +
            `   widget${this.id}_center_y,\n ` +
            `   widget${this.id}_center_x + widget${this.id}_r0 * cos((double)(widget${this.id}_h - 3.0 + widget${this.id}_m / 60.0) / 12.0 * 2.0 * 3.14159265),\n ` +
            `   widget${this.id}_center_y + widget${this.id}_r0 * sin((double)(widget${this.id}_h - 3.0 + widget${this.id}_m / 60.0) / 12.0 * 2.0 * 3.14159265), 2, 2);\n ` +
            `\n` +
            `   display.drawThickLine(widget${this.id}_center_x,\n` +
            `       widget${this.id}_center_y,\n` +
            `       widget${this.id}_center_x + widget${this.id}_r2 * cos((double)(widget${this.id}_m - 15.0) / 60.0 * 2.0 * 3.14159265),\n` +
            `       widget${this.id}_center_y + widget${this.id}_r2 * sin((double)(widget${this.id}_m - 15.0) / 60.0 * 2.0 * 3.14159265), 2, 2);\n\n`;
    },
    modifiers: ["center"],
    z: 0
};

widgets.push(clock);