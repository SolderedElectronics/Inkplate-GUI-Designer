function clear() {
    document.getElementsByClassName("settings")[0].innerHTML = "";
}

function headingTemplate(name) {
    let clone = document.getElementById("headingTemplate").content.cloneNode(true);

    clone.getElementById("content").innerHTML = "Create new " + name;
    document.getElementsByClassName("settings")[0].appendChild(clone);
}

function boolTemplate(name, settings) {

}

function intTemplate(name, settings) {
    let clone = document.getElementById("intTemplate").content.cloneNode(true);

    clone.querySelector(".name").innerHTML = name;

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

function textTemplate() {

}

function makeButton() {
    let clone = document.getElementById("buttonTemplate").content.cloneNode(true);

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
    "makeButton": makeButton
}

function changeCheckbox(el) {
    let pr = el.parentElement.parentElement.parentElement;
    pr.querySelector(".mainInput").disabled = !pr.querySelector(".mainCheckbox").checked;
}

function addEntity() {
    screen.addComponent({
        type: "" // za napisat
    });
    console.log(screen)
}