class Screen {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;

        this.display = new Inkplate(ctx, canvas);
        this.ui = new UI(ctx, canvas);

        this.scale = 1.0;

        this.xOffset = 0;
        this.yOffset = 0;

        this.outline = 50;
        this.display.outline = this.outline;
        this.ui.outline = this.outline;

        this.width = globalW + 2 * this.outline;
        this.height = globalH + 2 * this.outline;

        this.mouse = {
            x: 0,
            y: 0,
            down: false
        }

        this.UIlines = [];

        this.canvas.addEventListener("mousemove", this.mouseMove.bind(this));
        this.canvas.addEventListener("mousedown", this.mouseDown.bind(this));
        this.canvas.addEventListener("mouseup", this.mouseUp.bind(this));

        this.mouseOnEntity = null;

        this.globalMoveState = 0;
        this.globalMoveComponent = null;
        this.globalMoveLast = null;

        this.entities = [
            //new line(0, 0, 100, 100, 0, null, 1),
            //new rect(0, 0, 100, 100, 0, false, 0, false),
            //new circle(100, 100, 50, 4, true),
            //new triangle(0, 0, 100, 100, 100, 0, 5, true),
            new text(300, 290, "Hello there!", "24px FreeSansBold24pt7b", 0)
        ];

        this.editComponent(this.entities[0]);
    }

    editComponent(component) {
        this.currentlySelected = component;

        if (component.type == "widget") {
            let widget = component;

            settingsDict["clear"]();
            settingsDict["heading"]("Editing <i>widget" + widget.id + "</i>");
            settingsDict["textArea"]("Variables Edit", {
                type: "textArea",
                default: JSON.stringify(widget.variables, undefined, 4),
                optional: false
            });
            console.log(component)
            document.getElementsByClassName("settings")[0].innerHTML += `<a style='margin-left: 25px;font-size:10px;' href='${component.infoLink.url}' target="_blank">Click for more info!</a>`;
            settingsDict["makeButton"]();
            //this.entities.push(widget);
        } else {
            let editable = component.editable;

            settingsDict["clear"]();
            settingsDict["heading"]("Editing <i>" + component.type + component.id + "</i>");

            for (const [key, value] of Object.entries(editable)) {
                settingsDict[value.type](key, {
                    value: component[key],
                    ...value,
                    name: component.type + component.id.toString()
                });
            }

            document.getElementsByClassName("settings")[0].innerHTML += `<a style='margin-left: 25px;font-size:10px;' href='${component.docs}' target="_blank">Click for more info!</a>`;
            settingsDict["makeButton"]();
        }
    }

    selectComponent(component) {
        if (!(component in primitiveDict))
            return;

        this.currentlySelected = null;

        let editable = (new primitiveDict[component]).editable;

        settingsDict["clear"]();
        settingsDict["heading"]("Create new " + component);

        for (const [key, value] of Object.entries(editable)) {
            settingsDict[value.type](key, value);
        }

        document.getElementsByClassName("settings")[0].innerHTML += `<a style='margin-left: 25px;font-size:10px' href='${(new primitiveDict[component]).docs}'>Click for more info!</a>`;
        settingsDict["makeButton"]();
        refreshEntitiesScroll();
    }


    addWidget(widgetName) {
        if (!widgets.find(el => el.name == widgetName))
            return;

        let widget = widgets.find(el => el.name == widgetName);

        this.currentlySelected = widget;

        this.entities.push({
            ..._.cloneDeep(widget)
        });

        this.entities[this.entities.length - 1].id = widgetsIdCount++;

        settingsDict["clear"]();
        settingsDict["heading"]("Editing <i>widget" + (widgetsIdCount - 1) + "</i>");
        settingsDict["textArea"]("Variables Edit", {
            type: "textArea",
            default: JSON.stringify(widget.variables, undefined, 4),
            infoLink: widget.infoLink,
            optional: false
        });

        settingsDict["makeButton"]();

        refreshEntitiesScroll();
    }

    addComponent(settings) {
        this.currentlySelected = null;

        if (settings.type == "pixel") {
            this.entities.push(new primitiveDict["pixel"](
                settings["location"].x,
                settings["location"].y,
                settings["color"]));
        } else if (settings.type == "line")
            this.entities.push(new primitiveDict["line"](
                settings["start"].x,
                settings["start"].y,
                settings["end"].x,
                settings["end"].y,
                settings["color"],
                settings["gradient"],
                settings["thickness"]));
        else if (settings.type == "rect") {
            this.entities.push(new primitiveDict["rect"](
                settings["a"].x,
                settings["a"].y,
                settings["c"].x,
                settings["c"].y,
                settings["color"],
                settings["radius"],
                settings["fill"],
            ));
        } else if (settings.type == "circle") {
            this.entities.push(new primitiveDict["circle"](
                settings["center"].x,
                settings["center"].y,
                settings["radius"],
                settings["color"],
                settings["fill"]
            ));
        } else if (settings.type == "triangle") {
            this.entities.push(new primitiveDict["triangle"](
                settings["a"].x,
                settings["a"].y,
                settings["b"].x,
                settings["b"].y,
                settings["c"].x,
                settings["c"].y,
                settings["color"],
                settings["fill"],
            ));
        } else if (settings.type == "text") {
            this.entities.push(new primitiveDict["text"](
                settings["cursor"].x,
                settings["cursor"].y,
                settings["content"],
                settings["font"],
                settings["color"],
            ));
        } else if (settings.type == "bitmap") {
            this.entities.push(new primitiveDict["bitmap"](
                settings["corner"].x,
                settings["corner"].y,
                settings["width"],
                settings["height"],
                settings["url"],
            ));
        }

        this.entities[this.entities.length - 1].id = primitiveIdCount[settings.type]++;

        refreshEntitiesScroll();
        return this.entities[this.entities.length - 1];
    }

    mouseMove(e) {
        this.UIlines = [];
        let rect = this.canvas.getBoundingClientRect();

        let x = 1 / this.scale * (e.clientX - rect.left) - this.outline - this.xOffset;
        let y = 1 / this.scale * (e.clientY - rect.top) - this.outline - this.yOffset;

        if (-7 <= x && x < globalW + 7 && -7 <= y && y < globalH + 7) {
            x = Math.min(Math.max(x, 0), globalW);
            y = Math.min(Math.max(y, 0), globalH);

            let n = 3;

            for (let i = 0; i < (1 << n) + 1; ++i) {
                let xm = i / (1 << n) * globalW;
                let ym = i / (1 << n) * globalH;

                if (document.getElementById("magnet").checked && xm - 7 <= x && x < xm + 7) {
                    x = xm;
                    this.UIlines.push({
                        a: "vertical",
                        c: x,
                        p: Math.abs((1 << (n - 1)) - i)
                    });
                }
                if (document.getElementById("magnet").checked && ym - 7 <= y && y < ym + 7) {
                    y = ym;
                    this.UIlines.push({
                        a: "horizontal",
                        c: y,
                        p: Math.abs((1 << (n - 1)) - i)
                    });
                }
            }
            this.mouse.x = x;
            this.mouse.y = y;
        }
    }

    mouseDown(e) {
        this.mouse.down = true;
    }

    mouseUp(e) {
        this.mouse.down = false;
    }

    preCalculate() {
        let ctx = this.ctx;

        this.scale = Math.min(canvas.width / this.width, canvas.height / this.height);

        ctx.scale(this.scale, this.scale);


        this.xOffset = Math.max(0, (canvas.width - this.scale * this.width) / 2);
        this.yOffset = Math.max(0, (canvas.height - this.scale * this.height) / 2);

        this.display.xOffset = this.xOffset;
        this.display.yOffset = this.yOffset;

        this.ui.xOffset = this.xOffset;
        this.ui.yOffset = this.yOffset;

        this.display.scale = Math.min(globalW / canvas.width, globalH / canvas.height);
    }

    drawOutline() {
        this.display.drawOutline();
    }

    moveEntities() {
        if (!this.mouseOnEntity || !this.mouse.down) return;

        if (this.currentlySelected != this.mouseOnComponent) {
            this.editComponent({
                type: this.mouseOnComponent.type,
                ...this.mouseOnComponent
            });
        }

        updateValues();

        this.mouseOnEntity.set(parseInt(this.mouse.x * globalW / 800), parseInt(this.mouse.y * globalH / 600));
    }

    drawEntities() {
        this.entities.sort((a, b) => {
            if (a.z > b.z) return 1;
            if (b.z > a.z) return -1;
            return 0;
        });
        for (const e of this.entities) {
            if (e.type == "pixel") {
                this.display.drawPixel(e["location"].x, e["location"].y, e["color"]);
            } else if (e.type == "line") {
                if (!e.gradient && e.thickness == 1)
                    this.display.drawLine(e["start"].x, e["start"].y, e["end"].x, e["end"].y, e["color"]);
                else if (!e.gradient && e.thickness != 1)
                    this.display.drawThickLine(e["start"].x, e["start"].y, e["end"].x, e["end"].y, e["color"], e["thickness"]);
                else if (e.gradient && e.thickness == 1)
                    this.display.drawGradientLine(e["start"].x, e["start"].y, e["end"].x, e["end"].y, e["color"], e["gradient"], 1);
                else if (e.gradient && e.thickness != 1)
                    this.display.drawGradientLine(e["start"].x, e["start"].y, e["end"].x, e["end"].y, e["color"], e["gradient"], e["thickness"]);
            } else if (e.type == "circle") {
                if (e.fill)
                    this.display.fillCircle(e["center"].x, e["center"].y, e["radius"], e["color"]);
                else
                    this.display.drawCircle(e["center"].x, e["center"].y, e["radius"], e["color"]);
            } else if (e.type == "triangle") {
                if (e.fill)
                    this.display.fillTriangle(e["a"].x, e["a"].y, e["b"].x, e["b"].y, e["c"].x, e["c"].y, e["color"]);
                else
                    this.display.drawTriangle(e["a"].x, e["a"].y, e["b"].x, e["b"].y, e["c"].x, e["c"].y, e["color"]);
            } else if (e.type == "rect") {
                if (e.radius && e.fill)
                    this.display.fillRoundRect(e["a"].x, e["a"].y, e["c"].x - e["a"].x, e["c"].y - e["a"].y, e["radius"], e["color"]);
                else if (e.radius && !e.fill)
                    this.display.drawRoundRect(e["a"].x, e["a"].y, e["c"].x - e["a"].x, e["c"].y - e["a"].y, e["radius"], e["color"]);
                else if (!e.radius && e.fill)
                    this.display.fillRect(e["a"].x, e["a"].y, e["c"].x - e["a"].x, e["c"].y - e["a"].y, e["color"]);
                else if (!e.radius && !e.fill)
                    this.display.drawRect(e["a"].x, e["a"].y, e["c"].x - e["a"].x, e["c"].y - e["a"].y, e["color"]);
            } else if (e.type == "text") {
                this.display.setFont(e["font"]);
                this.display.setFontSize(e["size"]);
                this.display.setFontColor(e["color"]);
                this.display.setCursor(e["cursor"].x, e["cursor"].y);
                this.display.print(e["content"]);
            } else if (e.type == "widget") {
                e.draw(this.display);
            } else if (e.type == "bitmap") {
                if (e.file && e.file.complete) {
                    this.display.drawBitmap3Bit(e["corner"].x, e["corner"].y, e.file, e["width"], e["height"]);
                };
            }
        }
    }

    drawMouse() {
        if (this.mouse.down)
            return;
        let p = [];
        for (const e of this.entities) {
            for (const m of e.modifiers) {
                if (e.type != "widget" && e[m].distSqr(this.mouse.x * (globalW / 800), this.mouse.y * (globalH / 600)) < 150) {
                    p.push({
                        d: e[m].distSqr(this.mouse.x * (globalW / 800), this.mouse.y * (globalH / 600)),
                        e: e[m],
                        g: e
                    });
                } else if (e.type == "widget" && e.variables[m].distSqr(this.mouse.x * (globalW / 800), this.mouse.y * (globalH / 600)) < 150) {
                    p.push({
                        d: e.variables[m].distSqr(this.mouse.x * (globalW / 800), this.mouse.y * (globalH / 600)),
                        e: e.variables[m],
                        g: e,
                    });
                }
            }
        }
        if (p.length == 0)
            this.mouseOnEntity = null;
        else {
            p.sort((a, b) => {
                if (a.d > b.d) return -1;
                if (b.d > a.d) return 1;
                return 0;
            });
            this.mouseOnEntity = p[0].e;
            this.mouseOnComponent = p[0].g;

            if (this.mouseOnComponent && this.mouseOnComponent.type == "widget") {
                if (p[0].e.value)
                    this.ui.drawPicker(p[0].e.value.x, p[0].e.value.y);
                else
                    this.ui.drawPicker(p[0].e.default.x, p[0].e.default.y);
            } else {
                this.ui.drawPicker(p[0].e.x, p[0].e.y);
            }
        }
    }

    globalMove() {
        if (this.mouseOnEntity)
            return;

        let s = null;
        for (const e of this.entities) {
            if (e.mouseOn && e.mouseOn(this.mouse.x, this.mouse.y)) {
                s = e;
                for (const m of e.modifiers) {
                    this.ui.drawPicker(e[m].x, e[m].y);
                }
                this.globalMoveState = 1;
            }
        }

        if (this.globalMoveComponent)
            this.globalMoveState = 1;

        if (this.globalMoveState == 1 && this.mouse.down) {
            if (!this.globalMoveComponent)
                this.globalMoveComponent = s;
            this.globalMoveState = 2;
        }

        if ((this.globalMoveState == 1 || this.globalMoveState == 2) && !this.mouse.down) {
            this.globalMoveState = 0;
            this.globalMoveComponent = null;
        }

        if (this.globalMoveState == 2 && this.mouse.down && this.globalMoveComponent.moveDelta) {
            this.editComponent(this.globalMoveComponent)
            this.globalMoveComponent.moveDelta(this.mouse.x - this.globalMoveLast.x, this.mouse.y - this.globalMoveLast.y);
        }

        this.globalMoveLast = {
            x: this.mouse.x,
            y: this.mouse.y
        }
    }

    draw() {
        this.ctx.fillStyle = "#f6f6f6";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

        this.preCalculate();
        this.moveEntities();
        this.drawEntities();
        this.drawMouse();
        this.globalMove();

        if (this.currentlySelected)
            for (let m of this.currentlySelected.modifiers)
                if (this.currentlySelected.type == "widget") {
                    if (this.currentlySelected.variables[m].value)
                        this.ui.drawPicker(this.currentlySelected.variables[m].value.x, this.currentlySelected.variables[m].value.y);
                    else
                        this.ui.drawPicker(this.currentlySelected.variables[m].default.x, this.currentlySelected.variables[m].default.y);
                } else {
                    this.ui.drawPicker(this.currentlySelected[m].x, this.currentlySelected[m].y);
                }

        this.drawOutline();

        for (let l of this.UIlines) {
            if (l.a == "vertical") {
                this.ui.drawAligmentLinesVertical(l.c, l.p);
            } else if (l.a == "horizontal") {
                this.ui.drawAligmentLinesHorizontal(l.c, l.p);
            }
        }
    }
}