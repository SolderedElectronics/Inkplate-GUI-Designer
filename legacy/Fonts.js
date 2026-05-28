class Fonts {
    constructor() {

    }

    getName(name) {
        return "_" + name.split(" ").join("_");
    }

    toHeader(name) {
        // // converter, has bugs
        // let canvas = document.createElement("canvas");
        // let ctx = canvas.getContext("2d");

        // ctx.font = name;

        // let s = "";

        // for (let i = 32; i <= 126; ++i)
        //     s += String.fromCharCode(i);

        // canvas.width = globalW;
        // canvas.height = parseInt(name) * 1.4;

        // ctx.scale(1, 1);

        // ctx.font = name;

        // let res = `const uint8_t ${this.getName(name)}Bitmaps[] PROGMEM = {\n`;
        // let glyph = `const GFXglyph ${this.getName(name)}Glyphs[] PROGMEM = {\n`
        // let ptr = 0;

        // for (let i = 0; i < s.length; ++i) {
        //     ctx.clearRect(0, 0, canvas.width, canvas.height);
        //     ctx.fillText(s[i], 0, parseInt(name));
        //     var imgData = ctx.getImageData(0, 0, ctx.measureText(s[i]).width * 1.06, canvas.height);

        //     let arr = [];

        //     glyph += `{   ${ptr}, ${Math.ceil(imgData.width / 8) * 8}, ${imgData.height}, ${parseInt(imgData.width * 1.3)}, ${0}, ${0}   },\n`;
        //     ptr += Math.ceil(imgData.width / 8) * imgData.height;

        //     for (let j = 0; j < imgData.height; ++j) {
        //         arr.push(new Array(Math.ceil(imgData.width / 8)).fill(0));
        //         for (let k = 0; k < imgData.width; ++k) {
        //             let idx = k + j * imgData.width;

        //             // imgData.data[4 * idx + 0] = 0;
        //             // imgData.data[4 * idx + 1] = 0;
        //             // imgData.data[4 * idx + 2] = 0;
        //             // imgData.data[4 * idx + 3] = 255;

        //             if (imgData.data[4 * idx + 3] > 0) {
        //                 let _k = k + (7 - imgData.width % 8);
        //                 arr[j][Math.floor(_k / 8)] |= (1 << (7 - _k % 8));
        //             }
        //         }
        //     }

        //     ctx.putImageData(imgData, 0, 0);

        //     ctx.putImageData(imgData, 200, 0);

        //     res += "// " + s[i] + "\n";
        //     for (let j = 0; j < imgData.height; ++j) {
        //         for (let k = 0; k < Math.ceil(imgData.width / 8); ++k) {
        //             res += "0x" + arr[j][k].toString(16) + ", ";
        //         }
        //         res += "\n";
        //     }
        //     res += "\n";
        // }
        // document.getElementsByClassName("wrapper")[0].appendChild(canvas);

        // glyph += "};\n"

        // res += "};\n\n";
        // res += glyph + "\n";

        // res += `const GFXfont ${this.getName(name)} PROGMEM = {\n` +
        //     `(uint8_t  *)${this.getName(name)}Bitmaps,\n` +
        //     `(GFXglyph *)${this.getName(name)}Glyphs,\n` +
        //     `0x20, 0x7E, (int)${parseInt(name) * 1.3} };\n`;

        // return res;
    }
}

let fonts = new Fonts();