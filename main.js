window.requestAnimationFrame(loop);

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

let screen = new Screen(ctx, canvas);

let fileTab = new FileTab();

for (let w of widgets) {
    let el = document.createElement("BUTTON");
    el.classList = "list-group-item list-group-item-action primitiveItem".split();
    el.innerHTML = w.name;
    el.onclick = () => {
        screen.addWidget(w.name)
    };
    document.getElementById("widgets").appendChild(el);
}

function loop() {
    ctx.canvas.width = document.getElementById("screen").offsetWidth * 0.99;
    ctx.canvas.height = document.getElementById("screen").offsetHeight * 0.99;

    screen.draw();

    window.requestAnimationFrame(loop);
}

function selectComponent(component) {
    screen.selectComponent(component);
}