let globalW = 800;
let globalH = 600;

function changeInkplate() {
    if (document.getElementById("sel1").value == "Inkplate 6") {
        globalW = 800;
        globalH = 600;
    } else if (document.getElementById("sel1").value == "Inkplate 6+") {
        globalW = 1024;
        globalH = 758;
    } else if (document.getElementById("sel1").value == "Inkplate 10") {
        globalW = 1200;
        globalH = 825;
    }

    screen.ui.width = globalW;
    screen.ui.height = globalH;
}

function clear() {
    document.getElementsByClassName("settings")[0].innerHTML = "";
}

function headingTemplate(name) {
    let clone = document.getElementById("headingTemplate").content.cloneNode(true);

    clone.getElementById("content").innerHTML = name;
    document.getElementsByClassName("settings")[0].appendChild(clone);
}

function boolTemplate(name, settings) {
    let clone = document.getElementById("boolTemplate").content.cloneNode(true);

    clone.querySelector(".name").innerHTML = name.charAt(0).toUpperCase() + name.slice(1);

    if (settings.name && !settings.excludeFromC) {
        clone.querySelector(".cname").innerHTML = "Name in C code: " + settings.name + "_" + name;
    } else {
        clone.querySelector(".cname").style.display = "none";
    }

    clone.querySelector(".mainInput").id = name + "_input";
    clone.querySelector(".mainInput").min = settings.min;
    clone.querySelector(".mainInput").max = settings.max;
    clone.querySelector(".mainInput").defaultValue = settings.value || settings.default;

    if (settings.max - settings.min < 10) {
        clone.querySelector(".mainInput").type = "range";
        clone.querySelector(".mainInput").step = 1;
    }

    if (settings.optional) {
        clone.querySelector(".mainInput").disabled = true;
    } else {
        clone.querySelector(".mainCheckbox").style.display = "none";
    }

    document.getElementsByClassName("settings")[0].appendChild(clone);
}

function intTemplate(name, settings) {
    let clone = document.getElementById("intTemplate").content.cloneNode(true);

    clone.querySelector(".name").innerHTML = name.charAt(0).toUpperCase() + name.slice(1);

    if (settings.name && !settings.excludeFromC) {
        clone.querySelector(".cname").innerHTML = "Name in C code: " + settings.name + "_" + name.replaceAll(" ", "_");
    } else {
        clone.querySelector(".cname").style.display = "none";
    }

    clone.querySelector(".mainInput").id = name.replaceAll(" ", "_") + "_input";
    clone.querySelector(".mainInput").min = settings.min;
    clone.querySelector(".mainInput").max = settings.max;
    clone.querySelector(".mainInput").defaultValue = settings.value || settings.default;
    clone.querySelector(".mainInput").value = settings.value || settings.default;

    if (settings.max - settings.min < 10) {
        clone.querySelector(".mainInput").type = "range";
        clone.querySelector(".mainInput").step = 1;
    }

    if (settings.optional) {
        clone.querySelector(".mainInput").disabled = true;
    } else {
        clone.querySelector(".mainCheckbox").style.display = "none";
    }

    document.getElementsByClassName("settings")[0].appendChild(clone);
}

function floatTemplate(name, settings) {
    let clone = document.getElementById("floatTemplate").content.cloneNode(true);

    clone.querySelector(".name").innerHTML = name.charAt(0).toUpperCase() + name.slice(1);

    if (settings.name && !settings.excludeFromC) {
        clone.querySelector(".cname").innerHTML = "Name in C code: " + settings.name + "_" + name;
    } else {
        clone.querySelector(".cname").style.display = "none";
    }

    if (settings.optional) {
        clone.querySelector(".mainInput").disabled = true;
    } else {
        clone.querySelector(".mainCheckbox").style.display = "none";
    }

    clone.querySelector(".mainInput").id = name + "_input";
    clone.querySelector(".mainInput").min = settings.min;
    clone.querySelector(".mainInput").max = settings.max;
    clone.querySelector(".mainInput").defaultValue = settings.value || settings.default;

    if (settings.max - settings.min < 10) {
        clone.querySelector(".mainInput").type = "range";
    }

    document.getElementsByClassName("settings")[0].appendChild(clone);
}

function coordinateTemplate(name, settings) {
    intTemplate(name + " x", {
        ...settings,
        min: 0,
        max: globalW,
        default: settings.default.x,
        value: settings.value ? settings.value.x : null
    });
    intTemplate(name + " y", {
        ...settings,
        min: 0,
        max: globalH,
        default: settings.default.y,
        value: settings.value ? settings.value.y : null
    });
    document.getElementsByClassName("settings")[0].innerHTML += "<br>";
}

function textTemplate(name, settings) {
    let clone = document.getElementById("textTemplate").content.cloneNode(true);

    clone.querySelector(".name").innerHTML = name.charAt(0).toUpperCase() + name.slice(1);

    if (settings.name && !settings.excludeFromC) {
        clone.querySelector(".cname").innerHTML = "Name in C code: " + settings.name + "_" + name;
    } else {
        clone.querySelector(".cname").style.display = "none";
    }

    if (settings.optional) {
        clone.querySelector(".mainInput").disabled = true;
    } else {
        clone.querySelector(".mainCheckbox").style.display = "none";
    }

    clone.querySelector(".mainInput").id = name + "_text_input";
    clone.querySelector(".mainInput").defaultValue = settings.value || settings.default;

    document.getElementsByClassName("settings")[0].appendChild(clone);
}

function textAreaTemplate(name, settings) {
    let clone = document.getElementById("textAreaTemplate").content.cloneNode(true);

    clone.querySelector(".name").innerHTML = name.charAt(0).toUpperCase() + name.slice(1);

    if (settings.optional) {
        clone.querySelector(".mainInput").disabled = true;
    } else {
        clone.querySelector(".mainCheckbox").style.display = "none";
    }

    if (settings.infoLink) {
        clone.querySelector(".cname").innerHTML = `<a href="${settings.infoLink.url}" target="_blank">${settings.infoLink.label}</a>`;
    } else {
        clone.querySelector(".cname").style.display = "none";
    }

    clone.querySelector(".mainInput").id = name + "_text_input";
    clone.querySelector(".mainInput").defaultValue = settings.value || settings.default;

    document.getElementsByClassName("settings")[0].appendChild(clone);
}

function fileTemplate(name, settings) {
    let clone = document.getElementById("fileTemplate").content.cloneNode(true);

    if (settings.optional) {
        clone.querySelector(".mainInput").disabled = true;
    } else {
        clone.querySelector(".mainCheckbox").style.display = "none";
    }

    if (settings.file_name) {
        clone.querySelector(".cname").innerHTML = settings.file_name;
    } else {
        clone.querySelector(".cname").style.display = "none";
    }

    clone.querySelector(".mainInput").id = name + "_input";

    document.getElementsByClassName("settings")[0].innerHTML += "<br>";
    document.getElementsByClassName("settings")[0].appendChild(clone);
}

function makeButton() {
    let clone = document.getElementById("buttonTemplate").content.cloneNode(true);

    if (document.getElementsByClassName("settings")[0].querySelector("#content").innerHTML.startsWith("Editing")) {
        clone.querySelector("#desc").innerHTML = "Remove";
        clone.querySelector("#desc").style.color = "white";
        clone.querySelector("#desc").style.backgroundColor = "red";
    }
    document.getElementsByClassName("settings")[0].innerHTML += "<br>";
    document.getElementsByClassName("settings")[0].appendChild(clone);
}



let settingsDict = {
    "clear": clear,
    "heading": headingTemplate,
    "bool": boolTemplate,
    "int": intTemplate,
    "float": floatTemplate,
    "coordinate": coordinateTemplate,
    "text": textTemplate,
    "makeButton": makeButton,
    "textArea": textAreaTemplate,
    "file": fileTemplate
}

function changeCheckbox(el) {
    let pr = el.parentElement.parentElement.parentElement;
    pr.querySelector(".mainInput").disabled = !pr.querySelector(".mainCheckbox").checked;
}

function inputChanged(el) {
    if (!document.getElementsByClassName("settings")[0].querySelector("#content").innerHTML.startsWith("Editing") && el.type == "file")
        addEntity();
    if (!document.getElementsByClassName("settings")[0].querySelector("#content").innerHTML.startsWith("Editing")) return;

    let name = el.id;
    let type = screen.currentlySelected.type;
    if (type == "widget")
        return;
    if (name.indexOf("_x_input") != -1) {
        screen.entities.find(
            el => el.type == screen.currentlySelected.type &&
            el.id == screen.currentlySelected.id
        )[name.substring(0, name.indexOf("_x_input"))].x = parseInt(el.value);
    } else if (name.indexOf("_y_input") != -1) {
        screen.entities.find(
            el => el.type == screen.currentlySelected.type &&
            el.id == screen.currentlySelected.id
        )[name.substring(0, name.indexOf("_y_input"))].y = parseInt(el.value);
    } else if (el.type == "checkbox") {
        screen.entities.find(
            el => el.type == screen.currentlySelected.type &&
            el.id == screen.currentlySelected.id
        )[name.substring(0, name.indexOf("_input"))] = el.checked;
    } else if (name.indexOf("_text_input") != -1) {
        screen.entities.find(
            el => el.type == screen.currentlySelected.type &&
            el.id == screen.currentlySelected.id
        )[name.substring(0, name.indexOf("_text_input"))] = el.value;
    } else if (el.type == "file") {
        let en = screen.entities.find(
            el => el.type == screen.currentlySelected.type &&
            el.id == screen.currentlySelected.id
        );
        en[name.substring(0, name.indexOf("_input"))] = URL.createObjectURL(el.files[0]);
        en["file"] = new Image();
        en["file"].src = en[name.substring(0, name.indexOf("_input"))];
        en["file"].onload = () => {
            screen.currentlySelected.width = en["file"].width;
            screen.currentlySelected.height = en["file"].height;
            screen.currentlySelected.file_name = el.files[0].name;
            screen.editComponent(screen.currentlySelected);
        }
    } else {
        screen.entities.find(
            el => el.type == screen.currentlySelected.type &&
            el.id == screen.currentlySelected.id
        )[name.substring(0, name.indexOf("_input"))] = parseFloat(el.value);
    }
}

function widgetChanged(el) {
    screen.entities.find(
        el => el.type == screen.currentlySelected.type &&
        el.id == screen.currentlySelected.id
    ).variables = JSON.parse(el.value);

    for (let l of screen.currentlySelected.modifiers) {
        let el = screen.entities.find(
            el => el.type == screen.currentlySelected.type &&
            el.id == screen.currentlySelected.id
        ).variables[l];

        el.set = function (_x, _y) {
            el.default.x = _x;
            el.default.y = _y;
        };

        el.distSqr = function (_x, _y) {
            return (el.default.x - _x) ** 2 + (el.default.y - _y) ** 2;
        };
    }
}

function updateValues() {
    let type = screen.currentlySelected.type;
    if (type == "widget")
        return;
    for (const [key, value] of Object.entries((new primitiveDict[type]).editable)) {
        if (value.type == "bool") {
            document.getElementById(key + "_input").checked = screen.currentlySelected[key];
        } else if (value.type == "int") {
            document.getElementById(key + "_input").value = parseInt(screen.currentlySelected[key]);
        } else if (value.type == "float") {
            document.getElementById(key + "_input").value = parseFloat(screen.currentlySelected[key]);
        } else if (value.type == "coordinate") {
            document.getElementById(key + "_x_input").value = parseInt(screen.currentlySelected[key].x);
            document.getElementById(key + "_y_input").value = parseInt(screen.currentlySelected[key].y);
        } else if (value.type == "text") {
            document.getElementById(key + "_text_input").value = screen.currentlySelected[key];
        }
    }
}

function addEntity() {
    let cmp = (a, b) => {
        for (const [key, value] of Object.entries(a)) {
            if (key == "type")
                continue;
            if (a[key] != b[key])
                return false;
        }
        return true;
    };

    if (document.getElementsByClassName("settings")[0].querySelector("#content").innerHTML.startsWith("Editing")) {
        screen.entities = screen.entities.filter(el => !cmp(el, screen.currentlySelected));
        screen.currentlySelected = null;
        clear();

        refreshEntitiesScroll();
        return;
    };

    let type = document.getElementsByClassName("settings")[0].querySelector("#content").innerHTML.substring("Create new ".length);

    let settings = {
        type: type
    };

    for (const [key, value] of Object.entries((new primitiveDict[type]).editable)) {
        if (value.type == "bool") {
            if (document.getElementById(key + "_input").style.display == "none")
                settings[key] = null;
            else
                settings[key] = document.getElementById(key + "_input").checked;
        } else if (value.type == "int") {
            if (document.getElementById(key + "_input").style.display == "none")
                settings[key] = null;
            else
                settings[key] = parseInt(document.getElementById(key + "_input").value);
        } else if (value.type == "float") {
            if (document.getElementById(key + "_input").style.display == "none")
                settings[key] = null;
            else
                settings[key] = parseFloat(document.getElementById(key + "_input").value);
        } else if (value.type == "coordinate") {
            if (document.getElementById(key + "_x_input").style.display == "none" || document.getElementById(key + "_y_input").style.display == "none")
                settings[key] = null;
            else
                settings[key] = {
                    x: parseInt(document.getElementById(key + "_x_input").value),
                    y: parseInt(document.getElementById(key + "_y_input").value),
                };
        } else if (value.type == "text") {
            if (document.getElementById(key + "_text_input").style.display == "none")
                settings[key] = null;
            else
                settings[key] = document.getElementById(key + "_text_input").value
        } else if (value.type == "file") {
            if (document.getElementById(key + "_input").files[0]) {
                settings[key] = URL.createObjectURL(document.getElementById(key + "_input").files[0]);
                settings["file"] = new Image();
                settings["file"].src = settings[key];
            } else {
                settings[key] = null;
            }
        }
    }

    screen.editComponent(screen.addComponent(settings));

    updateValues();
}