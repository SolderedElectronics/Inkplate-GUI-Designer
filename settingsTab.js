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

    clone.querySelector(".name").innerHTML = name;

    clone.querySelector(".mainInput").id = name + "_input";
    clone.querySelector(".mainInput").min = settings.min;
    clone.querySelector(".mainInput").max = settings.max;
    clone.querySelector(".mainInput").defaultValue = settings.default;

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

    clone.querySelector(".name").innerHTML = name;

    clone.querySelector(".mainInput").id = name + "_input";
    clone.querySelector(".mainInput").min = settings.min;
    clone.querySelector(".mainInput").max = settings.max;
    clone.querySelector(".mainInput").defaultValue = settings.default;

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

    clone.querySelector(".name").innerHTML = name;

    if (settings.optional) {
        clone.querySelector(".mainInput").disabled = true;
    } else {
        clone.querySelector(".mainCheckbox").style.display = "none";
    }

    clone.querySelector(".mainInput").id = name + "_input";
    clone.querySelector(".mainInput").min = settings.min;
    clone.querySelector(".mainInput").max = settings.max;
    clone.querySelector(".mainInput").defaultValue = settings.default;

    if (settings.max - settings.min < 10) {
        clone.querySelector(".mainInput").type = "range";
    }

    document.getElementsByClassName("settings")[0].appendChild(clone);
}

function coordinateTemplate(name, settings) {
    intTemplate(name + "_x", {
        ...settings,
        min: 0,
        max: 800,
        default: settings.default.x
    });
    intTemplate(name + "_y", {
        ...settings,
        min: 0,
        max: 600,
        default: settings.default.y
    });
    document.getElementsByClassName("settings")[0].innerHTML += "<br>";
}

function textTemplate(name, settings) {
    let clone = document.getElementById("textTemplate").content.cloneNode(true);

    clone.querySelector(".name").innerHTML = name;

    if (settings.optional) {
        clone.querySelector(".mainInput").disabled = true;
    } else {
        clone.querySelector(".mainCheckbox").style.display = "none";
    }

    clone.querySelector(".mainInput").id = name + "_text_input";
    clone.querySelector(".mainInput").defaultValue = settings.default;

    document.getElementsByClassName("settings")[0].appendChild(clone);
}

function textAreaTemplate(name, settings) {
    let clone = document.getElementById("textAreaTemplate").content.cloneNode(true);

    clone.querySelector(".name").innerHTML = name;

    if (settings.optional) {
        clone.querySelector(".mainInput").disabled = true;
    } else {
        clone.querySelector(".mainCheckbox").style.display = "none";
    }

    clone.querySelector(".mainInput").id = name + "_text_input";
    clone.querySelector(".mainInput").defaultValue = settings.default;

    document.getElementsByClassName("settings")[0].appendChild(clone);
}

function makeButton() {
    let clone = document.getElementById("buttonTemplate").content.cloneNode(true);

    if (document.getElementsByClassName("settings")[0].querySelector("#content").innerHTML.startsWith("Editing"))
        clone.querySelector("#desc").innerHTML = "Remove";

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
    "textArea": textAreaTemplate
}

function changeCheckbox(el) {
    let pr = el.parentElement.parentElement.parentElement;
    pr.querySelector(".mainInput").disabled = !pr.querySelector(".mainCheckbox").checked;
}

function inputChanged(el) {
    if (!document.getElementsByClassName("settings")[0].querySelector("#content").innerHTML.startsWith("Editing")) return;

    let name = el.id;
    let type = screen.currentlySelected.type;
    if (type == "widget")
        return;
    if (name.indexOf("_x_input") != -1) {
        screen.currentlySelected[name.substring(0, name.indexOf("_x_input"))].x = parseInt(el.value);
    } else if (name.indexOf("_y_input") != -1) {
        screen.currentlySelected[name.substring(0, name.indexOf("_y_input"))].y = parseInt(el.value);
    } else if (el.type == "checkbox") {
        screen.entities.find(
            el => el.type == screen.currentlySelected.type &&
            el.id == screen.currentlySelected.id
        )[name.substring(0, name.indexOf("_input"))] = el.checked;
    } else if (name.indexOf("_text_input") != -1) {
        screen.currentlySelected[name.substring(0, name.indexOf("_text_input"))] = el.value;
    } else {
        screen.entities.find(
            el => el.type == screen.currentlySelected.type &&
            el.id == screen.currentlySelected.id
        )[name.substring(0, name.indexOf("_input"))] = parseFloat(el.value);
    }
}

function widgetChanged(el) {
    screen.currentlySelected.variables = JSON.parse(el.value);
}

function textAreaChange() {
    // tu tu tu promjene todo
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
        }
    }

    screen.editComponent(screen.addComponent(settings));

    updateValues();
}