class UI {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;

        this.scale = 1.0;

        this.xOffset = 0;
        this.yOffset = 0;

        this.outline = 0;

        this.width = 800;
        this.height = 600;
    }

    scaleX(x) {
        return this.xOffset + this.outline + x;
    }

    scaleY(y) {
        return this.yOffset + this.outline + y;
    }

    drawPicker(x, y) {
        this.ctx.beginPath();
        this.ctx.arc(this.scaleX(x), this.scaleY(y), 5, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = 'red';
        this.ctx.fill();
    }
}