class FileTab {
    constructor() {

    }

    exportJSON() {
        // let s = [];

        // for (let el of screen.entities) {
        //     if (el.type == "widget")
        //         continue;
        //     s.push(el.exportJSON());
        // }

        // let a = document.createElement('a');
        // a.href = "data:application/octet-stream," + encodeURIComponent(JSON.stringify(s));
        // a.download = 'primitives.json';
        // a.click();
    }

    exportC() {
        let s = `#include "Arduino.h"\n`;
        s += `#include "Inkplate.h"\n`;

        s += `\n`;
        s += `extern Inkplate display;\n`;
        s += `\n`;

        console.log(screen.entities)

        for (let el of screen.entities)
            s += el.getCCodeVariables();

        s += `void mainDraw() {\n`;

        for (let el of screen.entities)
            s += el.getCCodeDraw();

        s += `}\n`;

        let a = document.createElement('a');
        a.href = "data:application/octet-stream," + encodeURIComponent(s);
        a.download = 'generatedUI.h';
        a.click();
    }
}