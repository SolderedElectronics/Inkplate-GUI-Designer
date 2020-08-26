class Inkplate {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;

        this.scale = 1.0;

        this.xOffset = 0;
        this.yOffset = 0;

        this.outline = 0;

        this.width = 800;
        this.height = 600;

        this.cursor = {
            x: 0,
            y: 0
        };

        this.color = 0;

        this.fontSize = "32px";
        this.font = "FreeSansBold24pt7b";
    }

    scaleX(x) {
        return this.xOffset + this.outline + x;
    }

    scaleY(y) {
        return this.yOffset + this.outline + y;
    }

    setFontSize(s) {
        this.fontSize = s;
    }

    drawOutline() {
        let _width = this.width + 2 * this.outline;
        let _height = this.height + 2 * this.outline;

        this.ctx.beginPath();
        this.ctx.moveTo(this.xOffset + 0, this.yOffset + 0);
        this.ctx.lineTo(this.xOffset + this.outline, this.yOffset + this.outline);
        this.ctx.lineTo(this.xOffset + this.outline, this.yOffset + _height - this.outline);
        this.ctx.lineTo(this.xOffset + _width - this.outline, this.yOffset + _height - this.outline);
        this.ctx.lineTo(this.xOffset + _width, this.yOffset + _height);
        this.ctx.lineTo(this.xOffset, this.yOffset + _height);
        this.ctx.closePath();
        this.ctx.fillStyle = "#888888";
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.moveTo(this.xOffset + 0, this.yOffset + 0);
        this.ctx.lineTo(this.xOffset + this.outline, this.yOffset + this.outline);
        this.ctx.lineTo(this.xOffset + _width - this.outline, this.yOffset + this.outline);
        this.ctx.lineTo(this.xOffset + _width - this.outline, this.yOffset + _height - this.outline);
        this.ctx.lineTo(this.xOffset + _width, this.yOffset + _height);
        this.ctx.lineTo(this.xOffset + _width, this.yOffset);
        this.ctx.lineTo(this.xOffset, this.yOffset);
        this.ctx.closePath();
        this.ctx.fillStyle = "#999999";
        this.ctx.fill();

    }

    drawPixel(x, y, color) {
        this.ctx.fillStyle = "rgba(" + (color << 5) + "," + (color << 5) + "," + (color << 5) + "," + 1 + ")";

        let _x = this.scaleX(x);
        let _y = this.scaleY(y);

        if (0 <= _x && _x < this.width && 0 <= _y && _y < this.height)
            this.ctx.fillRect(_x, _y, 1, 1);
    }

    drawLine(x0, y0, x1, y1, c) {
        let _x0 = this.scaleX(x0);
        let _y0 = this.scaleY(y0);
        let _x1 = this.scaleX(x1);
        let _y1 = this.scaleY(y1);

        ctx.beginPath();
        ctx.moveTo(_x0, _y0);
        ctx.lineTo(_x1, _y1);

        this.ctx.strokeStyle = "rgba(" + (c << 5) + "," + (c << 5) + "," + (c << 5) + "," + 1 + ")";
        ctx.stroke();
    }

    drawFastVLine(x, y, h, c) {
        let _x0 = this.scaleX(x);
        let _y0 = this.scaleY(y);
        let _x1 = this.scaleX(x);
        let _y1 = this.scaleY(y + h);

        ctx.beginPath();
        ctx.moveTo(_x0, _y0);
        ctx.lineTo(_x1, _y1);

        this.ctx.strokeStyle = "rgba(" + (c << 5) + "," + (c << 5) + "," + (c << 5) + "," + 1 + ")";
        ctx.stroke();
    }

    drawFastHLine(x, y, w, c) {
        let _x0 = this.scaleX(x);
        let _y0 = this.scaleY(y);
        let _x1 = this.scaleX(x + w);
        let _y1 = this.scaleY(y);

        ctx.beginPath();
        ctx.moveTo(_x0, _y0);
        ctx.lineTo(_x1, _y1);

        this.ctx.strokeStyle = "rgba(" + (c << 5) + "," + (c << 5) + "," + (c << 5) + "," + 1 + ")";
        ctx.stroke();
    }

    drawThickLine(x0, y0, x1, y1, c, t) {
        let _x0 = this.scaleX(x0);
        let _y0 = this.scaleY(y0);
        let _x1 = this.scaleX(x1);
        let _y1 = this.scaleY(y1);

        this.ctx.lineWidth = t;

        ctx.beginPath();
        ctx.moveTo(_x0, _y0);
        ctx.lineTo(_x1, _y1);

        this.ctx.strokeStyle = "rgba(" + (c << 5) + "," + (c << 5) + "," + (c << 5) + "," + 1 + ")";
        ctx.stroke();

        this.ctx.lineWidth = 1;
    }

    drawGradientLine(x0, y0, x1, y1, c0, c1, t) {
        let _x0 = (x0);
        let _y0 = (y0);
        let _x1 = (x1);
        let _y1 = (y1);

        let n = c1 - c0;

        let px = (_x1 - _x0) / n;
        let py = (_y1 - _y0) / n;

        for (let i = 0; i < n; ++i) {
            if (t && Math.abs(t + 1) < 0.1)
                this.drawLine((_x0 + i * px), (_y0 + i * py),
                    (_x0 + (i + 1) * px), (_y0 + (i + 1) * py),
                    c0 + i);
            else
                this.drawThickLine((_x0 + i * px), (_y0 + i * py),
                    (_x0 + (i + 1) * px), (_y0 + (i + 1) * py),
                    c0 + i,
                    t);
        }
    }

    drawCircle(x, y, r, c) {
        this.ctx.beginPath();
        this.ctx.arc(this.scaleX(x), this.scaleY(y), r, 0, 2 * Math.PI, false);
        this.ctx.strokeStyle = "rgba(" + (c << 5) + "," + (c << 5) + "," + (c << 5) + "," + 1 + ")";
        this.ctx.stroke();
    }

    fillCircle(x, y, r, c) {
        this.ctx.beginPath();
        this.ctx.arc(this.scaleX(x), this.scaleY(y), r, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = "rgba(" + (c << 5) + "," + (c << 5) + "," + (c << 5) + "," + 1 + ")";
        this.ctx.fill();
    }

    drawTriangle(x0, y0, x1, y1, x2, y2, c) {
        const [_x0, _x1, _x2] = [x0, x1, x2].map(this.scaleX.bind(this));
        const [_y0, _y1, _y2] = [y0, y1, y2].map(this.scaleY.bind(this));

        this.ctx.beginPath();
        this.ctx.moveTo(_x0, _y0);
        this.ctx.lineTo(_x1, _y1);
        this.ctx.lineTo(_x2, _y2);
        this.ctx.lineTo(_x0, _y0);

        this.ctx.strokeStyle = "rgba(" + (c << 5) + "," + (c << 5) + "," + (c << 5) + "," + 1 + ")";
        this.ctx.stroke();
    }

    fillTriangle(x0, y0, x1, y1, x2, y2, c) {
        const [_x0, _x1, _x2] = [x0, x1, x2].map(this.scaleX.bind(this));
        const [_y0, _y1, _y2] = [y0, y1, y2].map(this.scaleY.bind(this));

        this.ctx.beginPath();
        this.ctx.moveTo(_x0, _y0);
        this.ctx.lineTo(_x1, _y1);
        this.ctx.lineTo(_x2, _y2);
        this.ctx.lineTo(_x0, _y0);

        this.ctx.fillStyle = "rgba(" + (c << 5) + "," + (c << 5) + "," + (c << 5) + "," + 1 + ")";
        this.ctx.fill();
    }

    drawRect(x, y, w, h, c) {
        const [_x0, _x1] = [x, x + w].map(this.scaleX.bind(this));
        const [_y0, _y1] = [y, y + h].map(this.scaleY.bind(this));

        this.ctx.beginPath();
        this.ctx.moveTo(_x0, _y0);
        this.ctx.lineTo(_x0, _y1);
        this.ctx.lineTo(_x1, _y1);
        this.ctx.lineTo(_x1, _y0);
        this.ctx.closePath();

        this.ctx.strokeStyle = "rgba(" + (c << 5) + "," + (c << 5) + "," + (c << 5) + "," + 1 + ")";
        this.ctx.stroke();
    }

    drawRoundRect(x, y, w, h, r, c) {
        if (Math.abs(w) < 2 * r) r = 0;
        if (Math.abs(h) < 2 * r) r = 0;

        const [_x0, _x1] = [x, x + w].map(this.scaleX.bind(this));
        const [_y0, _y1] = [y, y + h].map(this.scaleY.bind(this));

        this.ctx.beginPath();
        this.ctx.moveTo(_x0 + r, _y0);
        this.ctx.arcTo(_x1, _y0, _x1, _y1, r);
        this.ctx.arcTo(_x1, _y1, _x0, _y1, r);
        this.ctx.arcTo(_x0, _y1, _x0, _y0, r);
        this.ctx.arcTo(_x0, _y0, _x1, _y0, r);

        this.ctx.strokeStyle = "rgba(" + (c << 5) + "," + (c << 5) + "," + (c << 5) + "," + 1 + ")";
        this.ctx.stroke();
    }

    fillRect(x, y, w, h, c) {
        const [_x0, _x1] = [x, x + w].map(this.scaleX.bind(this));
        const [_y0, _y1] = [y, y + h].map(this.scaleY.bind(this));

        this.ctx.beginPath();
        this.ctx.moveTo(_x0, _y0);
        this.ctx.lineTo(_x0, _y1);
        this.ctx.lineTo(_x1, _y1);
        this.ctx.lineTo(_x1, _y0);

        this.ctx.fillStyle = "rgba(" + (c << 5) + "," + (c << 5) + "," + (c << 5) + "," + 1 + ")";
        this.ctx.fill();
    }

    fillRoundRect(x, y, w, h, r, c) {
        if (Math.abs(w) < 2 * r) r = 0;
        if (Math.abs(h) < 2 * r) r = 0;

        const [_x0, _x1] = [x, x + w].map(this.scaleX.bind(this));
        const [_y0, _y1] = [y, y + h].map(this.scaleY.bind(this));

        this.ctx.beginPath();
        this.ctx.moveTo(_x0 + r, _y0);
        this.ctx.arcTo(_x1, _y0, _x1, _y1, r);
        this.ctx.arcTo(_x1, _y1, _x0, _y1, r);
        this.ctx.arcTo(_x0, _y1, _x0, _y0, r);
        this.ctx.arcTo(_x0, _y0, _x1, _y0, r);

        this.ctx.fillStyle = "rgba(" + (c << 5) + "," + (c << 5) + "," + (c << 5) + "," + 1 + ")";
        this.ctx.fill();
    }

    drawBitmap3Bit(x, y, img, w, h) {
        this.ctx.drawImage(
            img,
            0, 0,
            img.width, img.height,
            this.scaleX(x), this.scaleY(y),
            w, h
        );
    }

    setFontColor(c) {
        this.color = c;
    }

    setFont(font) {
        this.font = font;
    }

    setCursor(x, y) {
        this.cursor.x = this.scaleX(x);
        this.cursor.y = this.scaleY(y);
    }

    print(text) {
        this.ctx.fillStyle = `rgb(${this.color << 5}, ${this.color << 5}, ${this.color << 5})`;
        this.ctx.font = this.fontSize + " Arial";

        let maxWidth = 800 - this.cursor.x + this.outline;

        let words = text.split(" ");
        let lines = [];
        let currentLine = words[0];

        for (var i = 1; i < words.length; i++) {
            let word = words[i];
            let width = ctx.measureText(currentLine + " " + word).width - screen.xOffset;
            if (width < maxWidth) {
                currentLine += " " + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);

        for (let l of lines) {
            this.ctx.fillText(l, this.cursor.x, this.cursor.y);
            this.cursor.y += parseFloat(this.fontSize);
        }
    }

    println(text) {
        print(text + "\n");
    }
}