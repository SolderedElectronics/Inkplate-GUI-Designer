let graph = {
    name: "graph",
    type: "widget",
    variables: {
        "a": {
            type: "int[]",
            cName: "&a",
            default: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
            value: null
        },
        "t1": {
            type: "int",
            cName: "&t1",
            default: 1,
            value: null
        },
        "h": {
            type: "string",
            cName: "&h",
            default: "lololo",
            value: null
        },
        "corner": {
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

        this._draw(display, variables)
    },
    _draw: function (display, variables) {
        for (let i = 0; i < 10; ++i) {
            display.setCursor(100, 100);
            display.print(variables["h"])
            display.drawLine(variables["corner"].x + 100 + i * 20, variables["corner"].y + 100, variables["corner"].x + 100 + i * 20, variables["corner"].y + 100 + variables["a"][i] * 4, 0);
        }
    },
    cCode: `
        for(int i = 0; i < 10; ++i)
            display.drawLine(100 + i * 20, 100, 100 + i * 20, 100 + a[i] * 4, 0);
    `,
    modifiers: ["corner"],
    editable: {
        "h": {
            type: "text",
            default: "lololo",
            optional: false
        }
    },
    z: 0
}

let widgets = [
    graph
]