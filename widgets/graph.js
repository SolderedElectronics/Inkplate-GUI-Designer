let graph = {
    name: "Graph",
    type: "widget",
    id: 0,
    variables: {
        "n": {
            default: 32,
            value: null
        },
        "data": {
            default: new Array(32).fill(0),
            value: null
        },
        "corner1": {
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
        "corner2": {
            type: "coordinate",
            default: {
                x: 500,
                y: 500
            },
            value: null,
            set: function (_x, _y) {
                this.default.x = _x;
                this.default.y = _y;
            },
            distSqr: function (_x, _y) {
                return (this.default.x - _x) ** 2 + (this.default.y - _y) ** 2;
            },
        }
    },
    draw: function (display) {
        let variables = {};

        for (const [key, value] of Object.entries(this.variables)) {
            if (value.value)
                variables[key] = value.value;
            else
                variables[key] = value.default;
        }

        let d = [];

        if (variables["data"].every(el => el == 0)) {
            for (let i = 0; i < variables["n"]; ++i)
                d.push(Math.sin(Math.PI * 3 * i / variables["n"] - (Date.now() % 5000) / (5000 / Math.PI / 2)));
            variables["data"] = d;
        }

        this._draw(display, variables)
    },
    _draw: function (display, variables) {
        let textMargin = 68;
        let minData = 1e9;
        let maxData = -1e9;

        for (let i = 0; i < variables["n"]; ++i) {
            minData = Math.min(minData, variables["data"][i]);
            maxData = Math.max(maxData, variables["data"][i]);
        }
        let span = Math.max(0.3, Math.abs(maxData - minData));
        let prev_x = -1;
        let prev_y = -1;

        for (let i = 0; i < variables["n"]; ++i) {
            let tx = variables["corner1"].x + i * (variables["corner2"].x - variables["corner1"].x - textMargin) / variables["n"];
            let v = variables["data"][i];
            let h = ((v - minData) * Math.abs(variables["corner2"].y - variables["corner1"].y) / span);
            let ty = variables["corner2"].y - h;

            if (i) {
                let dy = (ty - prev_y) / ((variables["corner2"].x - variables["corner1"].x - textMargin) / variables["n"]);

                for (let j = 0; j < (variables["corner2"].x - variables["corner1"].x) / variables["n"] + 1; ++j)
                    display.drawGradientLine(prev_x + j,
                        Math.round(prev_y + dy * j),
                        prev_x + j,
                        variables["corner2"].y, 3, 7);
            }

            prev_x = tx;
            prev_y = ty;
        }

        for (let i = 0; i < variables["n"]; ++i) {
            let tx = variables["corner1"].x + i * (variables["corner2"].x - variables["corner1"].x - textMargin) / variables["n"];
            let v = variables["data"][i];
            let h = ((v - minData) * Math.abs(variables["corner2"].y - variables["corner1"].y) / span);
            let ty = variables["corner2"].y - h;

            if (i) {
                display.drawThickLine(prev_x, prev_y, tx, ty, 0, 5.0);
            }

            prev_x = tx;
            prev_y = ty;
        }

        for (let i = 0; i < 4; ++i) {
            display.drawFastHLine(variables["corner1"].x, variables["corner1"].y + i * (variables["corner2"].y - variables["corner1"].y) / 4, variables["corner2"].x - variables["corner1"].x, 4);
            display.setCursor(variables["corner2"].x - textMargin + 10, variables["corner1"].y + i * (variables["corner2"].y - variables["corner1"].y) / 4 + 23);
            display.print((minData + (maxData - minData) * (4 - i) / 4).toFixed(2));
        }
        for (let i = 0; i < 5; ++i)
            display.drawFastVLine(variables["corner1"].x + i * (variables["corner2"].x - variables["corner1"].x) / 5, variables["corner1"].y, variables["corner2"].y - variables["corner1"].y, 4);

        display.drawFastVLine(variables["corner2"].x - textMargin + 2, variables["corner1"].y, variables["corner2"].y - variables["corner1"].y, 4);
        display.drawThickLine(variables["corner1"].x, variables["corner2"].y, variables["corner2"].x, variables["corner2"].y, 0, 3);

    },
    getCCodeVariables: function () {
        return `` +
            `int widget${this.id}_n = ${this.variables["n"].value || this.variables["n"].default};\n` +
            `\n` +
            `int widget${this.id}_corner1_x = ${this.variables["corner1"].value ? this.variables["corner1"].value.x : this.variables["corner1"].default.x};\n` +
            `int widget${this.id}_corner2_y = ${this.variables["corner1"].value ? this.variables["corner1"].value.y : this.variables["corner1"].default.y};\n` +
            `\n` +
            `int widget${this.id}_corner2_x = ${this.variables["corner2"].value ? this.variables["corner2"].value.x : this.variables["corner2"].default.x};\n` +
            `int widget${this.id}_corner1_y = ${this.variables["corner2"].value ? this.variables["corner2"].value.y : this.variables["corner2"].default.y};\n` +
            `\n` +
            `double widget${this.id}_data[128] = ${JSON.stringify(this.variables["data"].value || this.variables["data"].default).replace("[", "{").replace("]", "}")};\n` +
            `\n`;
    },
    getCCodeDraw: function () {
        return `` +
            `   int widget${this.id}_textMargin = 68;\n` +
            `   double widget${this.id}_minData = 1e9F;\n` +
            `   double widget${this.id}_maxData = -1e9F;\n` +
            `\n` +
            `   for (int i = 0; i < widget${this.id}_n; ++i)\n` +
            `   {\n` +
            `       widget${this.id}_minData = min(widget${this.id}_minData, widget${this.id}_data[i]);\n` +
            `       widget${this.id}_maxData = max(widget${this.id}_maxData, widget${this.id}_data[i]);\n` +
            `   }\n` +
            `\n` +
            `   double widget${this.id}_span = max(0.3D, fabs(widget${this.id}_maxData - widget${this.id}_minData));\n` +
            `   int widget${this.id}_prev_x = -1;\n` +
            `   int widget${this.id}_prev_y = -1;\n` +
            `\n` +
            `   for (int i = 0; i < widget${this.id}_n; ++i)\n` +
            `   {\n` +
            `       int tx = widget${this.id}_corner1_x + i * (widget${this.id}_corner2_x - widget${this.id}_corner1_x - widget${this.id}_textMargin) / widget${this.id}_n;\n` +
            `       double v = widget${this.id}_data[i];\n` +
            `       int h = ((v - widget${this.id}_minData) * abs(widget${this.id}_corner1_y - widget${this.id}_corner2_y) / widget${this.id}_span);\n` +
            `       int ty = widget${this.id}_corner1_y - h;\n` +
            `\n` +
            `       if (i)\n` +
            `       {\n` +
            `           double dy = (ty - widget${this.id}_prev_y) / ((widget${this.id}_corner2_x - widget${this.id}_corner1_x - widget${this.id}_textMargin) / widget${this.id}_n);\n` +
            `\n` +
            `           for (int j = 0; j < (widget${this.id}_corner2_x - widget${this.id}_corner1_x) / widget${this.id}_n + 1; ++j)\n` +
            `               display.drawGradientLine(widget${this.id}_prev_x + j,\n` +
            `                                        round(widget${this.id}_prev_y + dy * j),\n` +
            `                                        widget${this.id}_prev_x + j,\n` +
            `                                        widget${this.id}_corner1_y, 3, 7);\n` +
            `       }\n` +
            `\n` +
            `       widget${this.id}_prev_x = tx;\n` +
            `       widget${this.id}_prev_y = ty;\n` +
            `   }\n` +
            `\n` +
            `   for (int i = 0; i < widget${this.id}_n; ++i)\n` +
            `   {\n` +
            `       int tx = widget${this.id}_corner1_x + i * (widget${this.id}_corner2_x - widget${this.id}_corner1_x - widget${this.id}_textMargin) / widget${this.id}_n;\n` +
            `       double v = widget${this.id}_data[i];\n` +
            `       int h = ((v - widget${this.id}_minData) * abs(widget${this.id}_corner1_y - widget${this.id}_corner2_y) / widget${this.id}_span);\n` +
            `       int ty = widget${this.id}_corner1_y - h;\n` +
            `\n` +
            `       if (i)\n` +
            `       {\n` +
            `           display.drawThickLine(widget${this.id}_prev_x, widget${this.id}_prev_y, tx, ty, 0, 5.0);\n` +
            `       }\n` +
            `\n` +
            `       widget${this.id}_prev_x = tx;\n` +
            `       widget${this.id}_prev_y = ty;\n` +
            `   }\n` +
            `\n` +
            `   for (int i = 0; i < 4; ++i) {\n` +
            `       display.drawFastHLine(widget${this.id}_corner1_x, widget${this.id}_corner2_y + i * (widget${this.id}_corner1_y - widget${this.id}_corner2_y) / 4, widget${this.id}_corner2_x - widget${this.id}_corner1_x, 4);\n` +
            `       display.setCursor(widget${this.id}_corner2_x - widget${this.id}_textMargin + 10, widget${this.id}_corner1_y + (4 - i) * (widget${this.id}_corner2_y - widget${this.id}_corner1_y) / 4 + 23);\n` +
            `       display.setTextColor(0, 7);\n` +
            `       display.setTextSize(3);\n` +
            `       display.print(String((widget${this.id}_minData + (widget${this.id}_maxData - widget${this.id}_minData) * (4 - i) / 4)));\n` +
            `   }\n` +
            `   for (int i = 0; i < 5; ++i)\n` +
            `       display.drawFastVLine(widget${this.id}_corner1_x + i * (widget${this.id}_corner2_x - widget${this.id}_corner1_x) / 5, widget${this.id}_corner2_y, widget${this.id}_corner1_y - widget${this.id}_corner2_y, 4);\n` +
            `\n` +
            `   display.drawFastVLine(widget${this.id}_corner2_x - widget${this.id}_textMargin + 2, widget${this.id}_corner2_y, widget${this.id}_corner1_y - widget${this.id}_corner2_y, 4);\n` +
            `   display.drawThickLine(widget${this.id}_corner1_x, widget${this.id}_corner1_y, widget${this.id}_corner2_x, widget${this.id}_corner1_y, 0, 3);\n\n`;
    },
    modifiers: ["corner1", "corner2"],
    z: 0
}

widgets.push(graph);