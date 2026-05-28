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

        for (let i = 0; i < screen.entities.length; ++i) {
            if (screen.entities[i].type == "bitmap" && !screen.entities[i].base64) {
                let c = document.createElement('canvas');
                c.width = screen.entities[i].file.width;
                c.height = screen.entities[i].file.height;

                let ctx = c.getContext("2d");
                ctx.drawImage(screen.entities[i].file, 0, 0);

                screen.entities[i].base64 = c.toDataURL();
            }
        }

        let a = document.createElement('a');
        a.href = "data:application/octet-stream," + encodeURIComponent(JSON.stringify(s));
        a.download = 'save.json';
        a.click();

        for (let i = 0; i < screen.entities.length; ++i) {
            if (screen.entities[i].type == "bitmap" && !screen.entities[i].base64) {
                screen.entities[i].base64 = undefined;
            }
        }
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

                screen.entities = [];
                primitiveIdCount = el.primitiveCount;
                widgetsIdCount = el.widgetCount;

                for (let en of el.entities) {
                    if (en.type == "widget") {
                        screen.entities.push(_.merge(_.cloneDeep(widgets.find(el => el.name == en.name)), en));
                    } else {
                        if (en.type == "bitmap") {
                            en.url = en.base64;
                            en.base64 = undefined;
                            en.file = new Image();
                            en.file.src = en.url;
                        }
                        screen.entities.push(_.merge(new primitiveDict[en.type], en));
                    }
                }
                refreshEntitiesScroll();
            });

            reader.readAsText(f);
        })
    }
}