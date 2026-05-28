class UI {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;

        this.scale = 1.0;

        this.xOffset = 0;
        this.yOffset = 0;

        this.outline = 0;

        this.width = globalW;
        this.height = globalH;
    }

    scaleX(x) {
        return this.xOffset + this.outline + x * (800 / globalW);
    }

    scaleY(y) {
        return this.yOffset + this.outline + y * (600 / globalH);
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
        this.ctx.lineTo(this.scaleX(x), this.scaleY(globalH));

        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }

    drawAligmentLinesHorizontal(y, p) {
        this.ctx.beginPath();

        p += 2;
        this.ctx.strokeStyle = "#ff0000";
        this.ctx.setLineDash([15, 15, 12, 12, 10, 10, 8, 8, 6, 6, 4, 4].slice(p * 2 - 2, p * 2));

        this.ctx.moveTo(this.scaleX(0), this.scaleY(y));
        this.ctx.lineTo(this.scaleX(globalW), this.scaleY(y));

        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }
}