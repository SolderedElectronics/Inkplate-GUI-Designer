window.requestAnimationFrame(loop);

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

let screen = new Screen(ctx, canvas);

function loop() {
    ctx.canvas.width = document.getElementById("screen").offsetWidth * 0.99;
    ctx.canvas.height = document.getElementById("screen").offsetHeight * 0.99;

    screen.draw();

    window.requestAnimationFrame(loop);
}

function selectComponent(component) {
    screen.selectComponent(component);
}