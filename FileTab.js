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

                for (let en of el.entities) {
                    if (en.type == "widget") {
                        screen.entities.push(_.merge(_.cloneDeep(widgets.find(el => el.name == en.name)), en));
                        screen.entities[screen.entities.length - 1].id = widgetsIdCount++;
                    } else {
                        screen.entities.push(_.merge(new primitiveDict[en.type], en));
                        screen.entities[screen.entities.length - 1].id = primitiveIdCount[en.type]++;
                    }
                }
            });

            reader.readAsText(f);
        })
    }
}