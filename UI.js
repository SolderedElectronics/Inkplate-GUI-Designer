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

    drawAligmentLinesVertical(x, p) {
        this.ctx.beginPath();

        p += 2;
        this.ctx.strokeStyle = "#ff0000";
        this.ctx.setLineDash([15, 15, 12, 12, 10, 10, 8, 8, 6, 6, 4, 4].slice(p * 2 - 2, p * 2));

        this.ctx.moveTo(this.scaleX(x), this.scaleY(0));
        this.ctx.lineTo(this.scaleX(x), this.scaleY(600));

        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }

    drawAligmentLinesHorizontal(y, p) {
        this.ctx.beginPath();

        p += 2;
        this.ctx.strokeStyle = "#ff0000";
        this.ctx.setLineDash([15, 15, 12, 12, 10, 10, 8, 8, 6, 6, 4, 4].slice(p * 2 - 2, p * 2));

        this.ctx.moveTo(this.scaleX(0), this.scaleY(y));
        this.ctx.lineTo(this.scaleX(800), this.scaleY(y));

        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }
}