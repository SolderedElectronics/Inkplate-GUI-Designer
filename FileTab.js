class FileTab {
    constructor() {

    }

    exportC() {
        let s = `#include "Arduino.h"\n`;
        s += `#include "Inkplate.h"\n`;

        let alreadyIncluded = [];
        for (let el of screen.entities) {
            if (el.getIncludes) {
                let t = el.getIncludes();

                if (alreadyIncluded.indexOf(t) != -1)
                    continue;

                alreadyIncluded.push(t);
                s += t;
            }
        }

        s += `\n`;
        s += `extern Inkplate display;\n`;
        s += `\n`;

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