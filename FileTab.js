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

    save() {
        let s = {
            widgetCount: widgetsIdCount,
            primitiveCount: primitiveIdCount,
            entities: screen.entities
        };

        let a = document.createElement('a');
        a.href = "data:application/octet-stream," + encodeURIComponent(JSON.stringify(s));
        a.download = 'save.json';
        a.click();
    }

    load() {
        let a = document.createElement('input');
        a.type = "file";
        a.click();

        a.oninput = ((el) => {
            let f = el.target.files[0];
            var reader = new FileReader();

            reader.onload = (function () {
                let el = JSON.parse(reader.result);

                widgetsIdCount += el.widgetCount;
                let temp = {};
                for (const [key, value] of Object.entries(el.primitiveCount))
                    temp[key] = value + primitiveIdCount[key];
                primitiveIdCount = temp;

                // todo doo doo
            });

            reader.readAsText(f);
        })
    }
}