let digitalClock = {
    name: "Digital clock",
    type: "widget",
    id: 0,
    infoLink: {
        label: "Click here for info!",
        url: "https://inkplate.readthedocs.io/en/latest/gui-designer.html#editing-widgets"
    },
    variables: {
        "location": {
            type: "coordinate",
            default: {
                x: 15,
                y: 15
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
        let bitmask = [119, 48, 93, 121, 58, 107, 111, 49, 127, 59];

        let triangleX = [83, 101, 108, 101, 108, 277, 101, 108, 277, 257, 277, 108, 257, 277, 286, 76, 60, 98, 60, 98, 80, 80, 39, 60, 80, 39, 55, 31, 55, 73, 31, 73, 52, 31, 9, 52, 9, 52, 20, 61, 86, 80, 86, 80, 233, 233, 227, 80, 233, 227, 252, 260, 292, 305, 305, 260, 240, 305, 281, 240, 240, 281, 260, 259, 234, 276, 234, 276, 256, 256, 214, 234, 214, 256, 237, 38, 27, 60, 38, 60, 207, 207, 38, 212, 212, 207, 230];
        let triangleY = [30, 13, 60, 13, 60, 14, 13, 60, 14, 57, 14, 60, 57, 14, 29, 36, 47, 61, 47, 61, 198, 198, 201, 47, 198, 201, 219, 252, 232, 253, 252, 253, 390, 252, 406, 390, 406, 390, 416, 227, 202, 249, 202, 249, 203, 203, 247, 249, 203, 247, 224, 60, 35, 49, 49, 60, 200, 50, 201, 200, 200, 201, 220, 231, 252, 252, 252, 252, 403, 403, 390, 252, 390, 403, 415, 439, 424, 392, 439, 392, 394, 394, 439, 439, 439, 394, 424];

        let maxX = 310;
        let maxY = 440;

        for (let i = 0; i < 4; ++i) {
            for (let j = 0; j < triangleX.length; j += 3) {
                let b = bitmask[[Math.floor(variables["h"] / 10 % 10), Math.floor(variables["h"] % 10), Math.floor(variables["m"] / 10 % 10), Math.floor(variables["m"] % 10)][i]];
                if (b & (1 << parseInt((j - 1) / (3 * 4)))) {
                    display.fillTriangle(
                        i * maxX / maxY * variables["size"] * 1.1 + variables["location"].x + maxX / maxY * variables["size"] * triangleX[j + 0] / maxX,
                        variables["location"].y + variables["size"] * triangleY[j + 0] / maxY,

                        i * maxX / maxY * variables["size"] * 1.1 + variables["location"].x + maxX / maxY * variables["size"] * triangleX[j + 1] / maxX,
                        variables["location"].y + variables["size"] * triangleY[j + 1] / maxY,

                        i * maxX / maxY * variables["size"] * 1.1 + variables["location"].x + maxX / maxY * variables["size"] * triangleX[j + 2] / maxX,
                        variables["location"].y + variables["size"] * triangleY[j + 2] / maxY,

                        0);
                }
            }
        }

        let r = 0.05 * variables["size"];

        display.fillCircle(variables["location"].x + 4 * maxX / maxY * variables["size"] * 1.075 / 2, variables["location"].y + variables["size"] * 0.4, r, 0);
        display.fillCircle(variables["location"].x + 4 * maxX / maxY * variables["size"] * 1.075 / 2, variables["location"].y + variables["size"] * 0.6, r, 0);
    },
    getCCodeVariables: function () {
        return `` +
            `int digital_clock${this.id}_h = ${this.variables["h"].value || this.variables["h"].default};\n` +
            `int digital_clock${this.id}_m = ${this.variables["m"].value || this.variables["m"].default};\n` +
            `int digital_clock${this.id}_location_x = ${this.variables["location"].value ? this.variables["location"].value.x : this.variables["location"].default.x};\n` +
            `int digital_clock${this.id}_location_y = ${this.variables["location"].value ? this.variables["location"].value.y : this.variables["location"].default.y};\n` +
            `int digital_clock${this.id}_size = ${this.variables["size"].value || this.variables["size"].default};\n` +
            `int digital_clock${this.id}_bitmask[] = {119, 48, 93, 121, 58, 107, 111, 49, 127, 59};\n` +
            `int digital_clock${this.id}_triangleX[] = {83, 101, 108, 101, 108, 277, 101, 108, 277, 257, 277, 108, 257, 277, 286, 76, 60, 98, 60, 98, 80, 80, 39, 60, 80, 39, 55, 31, 55, 73, 31, 73, 52, 31, 9, 52, 9, 52, 20, 61, 86, 80, 86, 80, 233, 233, 227, 80, 233, 227, 252, 260, 292, 305, 305, 260, 240, 305, 281, 240, 240, 281, 260, 259, 234, 276, 234, 276, 256, 256, 214, 234, 214, 256, 237, 38, 27, 60, 38, 60, 207, 207, 38, 212, 212, 207, 230};\n` +
            `int digital_clock${this.id}_triangleY[] = {30, 13, 60, 13, 60, 14, 13, 60, 14, 57, 14, 60, 57, 14, 29, 36, 47, 61, 47, 61, 198, 198, 201, 47, 198, 201, 219, 252, 232, 253, 252, 253, 390, 252, 406, 390, 406, 390, 416, 227, 202, 249, 202, 249, 203, 203, 247, 249, 203, 247, 224, 60, 35, 49, 49, 60, 200, 50, 201, 200, 200, 201, 220, 231, 252, 252, 252, 252, 403, 403, 390, 252, 390, 403, 415, 439, 424, 392, 439, 392, 394, 394, 439, 439, 439, 394, 424};\n` +
            `int digital_clock${this.id}_maxX = 310;\n` +
            `int digital_clock${this.id}_maxY = 440;\n` +
            `\n`;
    },
    getCCodeDraw: function () {
        return `    for (int i = 0; i < 4; ++i) {\n` +
            `        for (int j = 0; j < sizeof(digital_clock${this.id}_triangleX) / sizeof(digital_clock${this.id}_triangleX[0]); j += 3) {\n` +
            `            int temp[4] = {digital_clock${this.id}_h / 10 % 10, digital_clock${this.id}_h % 10, digital_clock${this.id}_m / 10 % 10, digital_clock${this.id}_m % 10};\n` +
            `            int b = digital_clock${this.id}_bitmask[temp[i]];\n` +
            `            if (b & (1 << ((j - 1) / (3 * 4)))) {\n` +
            `                display.fillTriangle(\n` +
            `                    (int)((float)i * (float)digital_clock${this.id}_maxX / (float)digital_clock${this.id}_maxY * (float)digital_clock${this.id}_size * 1.1 + (float)digital_clock${this.id}_location_x + (float)digital_clock${this.id}_maxX / (float)digital_clock${this.id}_maxY * (float)digital_clock${this.id}_size * (float)digital_clock${this.id}_triangleX[j + 0] / (float)digital_clock${this.id}_maxX),\n` +
            `                    (int)((float)digital_clock${this.id}_location_y + (float)digital_clock${this.id}_size * (float)digital_clock${this.id}_triangleY[j + 0] / (float)digital_clock${this.id}_maxY),\n` +
            `\n` +
            `                    (int)((float)i * (float)digital_clock${this.id}_maxX / (float)digital_clock${this.id}_maxY * (float)digital_clock${this.id}_size * 1.1 + (float)digital_clock${this.id}_location_x + (float)digital_clock${this.id}_maxX / (float)digital_clock${this.id}_maxY * (float)digital_clock${this.id}_size * (float)digital_clock${this.id}_triangleX[j + 1] / (float)digital_clock${this.id}_maxX),\n` +
            `                    (int)((float)digital_clock${this.id}_location_y + (float)digital_clock${this.id}_size * (float)digital_clock${this.id}_triangleY[j + 1] / (float)digital_clock${this.id}_maxY),\n` +
            `\n` +
            `                    (int)((float)i * (float)digital_clock${this.id}_maxX / (float)digital_clock${this.id}_maxY * (float)digital_clock${this.id}_size * 1.1 + (float)digital_clock${this.id}_location_x + (float)digital_clock${this.id}_maxX / (float)digital_clock${this.id}_maxY * (float)digital_clock${this.id}_size * (float)digital_clock${this.id}_triangleX[j + 2] / (float)digital_clock${this.id}_maxX),\n` +
            `                    (int)((float)digital_clock${this.id}_location_y + (float)digital_clock${this.id}_size * (float)digital_clock${this.id}_triangleY[j + 2] / (float)digital_clock${this.id}_maxY),\n` +
            `\n` +
            `                    0);\n` +
            `            }\n` +
            `        }\n` +
            `    }\n` +
            `\n` +
            `    int digital_clock${this.id}_r = 0.05 * (float)digital_clock${this.id}_size;\n` +
            `\n` +
            `    display.fillCircle((int)((float)digital_clock${this.id}_location_x + 4.0 * (float)digital_clock${this.id}_maxX / (float)digital_clock${this.id}_maxY * (float)digital_clock${this.id}_size * 1.075 / 2.0), (int)((float)digital_clock${this.id}_location_y + (float)digital_clock${this.id}_size * 0.4), digital_clock${this.id}_r, 0);\n` +
            `    display.fillCircle((int)((float)digital_clock${this.id}_location_x + 4.0 * (float)digital_clock${this.id}_maxX / (float)digital_clock${this.id}_maxY * (float)digital_clock${this.id}_size * 1.075 / 2.0), (int)((float)digital_clock${this.id}_location_y + (float)digital_clock${this.id}_size * 0.6), digital_clock${this.id}_r, 0);\n`;

    },

    modifiers: ["location"],
    z: 0
};

widgets.push(digitalClock);