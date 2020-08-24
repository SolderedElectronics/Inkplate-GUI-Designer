#include "Arduino.h"
#include "Inkplate.h"
#include "Fonts/FreeSansBold24pt7b.h"

extern Inkplate display;

String text0_content = "Hello there!";
int text0_cursor_x = 300;
int text0_cursor_y = 290;
const GFXfont *text0_font = &FreeSansBold24pt7b;

int digital_clock0_h = 9;
int digital_clock0_m = 41;
int digital_clock0_location_x = 114;
int digital_clock0_location_y = 83;
int digital_clock0_size = 64;
int digital_clock0_bitmask[] = {119, 48, 93, 121, 58, 107, 111, 49, 127, 59};
int digital_clock0_triangleX[] = {83, 101, 108, 101, 108, 277, 101, 108, 277, 257, 277, 108, 257, 277, 286, 76, 60, 98, 60, 98, 80, 80, 39, 60, 80, 39, 55, 31, 55, 73, 31, 73, 52, 31, 9, 52, 9, 52, 20, 61, 86, 80, 86, 80, 233, 233, 227, 80, 233, 227, 252, 260, 292, 305, 305, 260, 240, 305, 281, 240, 240, 281, 260, 259, 234, 276, 234, 276, 256, 256, 214, 234, 214, 256, 237, 38, 27, 60, 38, 60, 207, 207, 38, 212, 212, 207, 230};
int digital_clock0_triangleY[] = {30, 13, 60, 13, 60, 14, 13, 60, 14, 57, 14, 60, 57, 14, 29, 36, 47, 61, 47, 61, 198, 198, 201, 47, 198, 201, 219, 252, 232, 253, 252, 253, 390, 252, 406, 390, 406, 390, 416, 227, 202, 249, 202, 249, 203, 203, 247, 249, 203, 247, 224, 60, 35, 49, 49, 60, 200, 50, 201, 200, 200, 201, 220, 231, 252, 252, 252, 252, 403, 403, 390, 252, 390, 403, 415, 439, 424, 392, 439, 392, 394, 394, 439, 439, 439, 394, 424};
int digital_clock0_maxX = 310;
int digital_clock0_maxY = 440;

void mainDraw() {
    display.setFont(text0_font);
    display.setTextColor(0, 7);    display.setTextSize(1);    display.setCursor(text0_cursor_x, text0_cursor_y);
    display.print(text0_content);

    for (int i = 0; i < 4; ++i) {
        for (int j = 0; j < sizeof(digital_clock0_triangleX) / sizeof(digital_clock0_triangleX[0]); j += 3) {
            int temp[4] = {digital_clock0_h / 10 % 10, digital_clock0_h % 10, digital_clock0_m / 10 % 10, digital_clock0_m % 10};
            int b = digital_clock0_bitmask[temp[i]];
            if (b & (1 << ((j - 1) / (3 * 4)))) {
                display.fillTriangle(
                    (int)((float)i * (float)digital_clock0_maxX / (float)digital_clock0_maxY * (float)digital_clock0_size * 1.1 + (float)digital_clock0_location_x + (float)digital_clock0_maxX / (float)digital_clock0_maxY * (float)digital_clock0_size * (float)digital_clock0_triangleX[j + 0] / (float)digital_clock0_maxX),
                    (int)((float)digital_clock0_location_y + (float)digital_clock0_size * (float)digital_clock0_triangleY[j + 0] / (float)digital_clock0_maxY),

                    (int)((float)i * (float)digital_clock0_maxX / (float)digital_clock0_maxY * (float)digital_clock0_size * 1.1 + (float)digital_clock0_location_x + (float)digital_clock0_maxX / (float)digital_clock0_maxY * (float)digital_clock0_size * (float)digital_clock0_triangleX[j + 1] / (float)digital_clock0_maxX),
                    (int)((float)digital_clock0_location_y + (float)digital_clock0_size * (float)digital_clock0_triangleY[j + 1] / (float)digital_clock0_maxY),

                    (int)((float)i * (float)digital_clock0_maxX / (float)digital_clock0_maxY * (float)digital_clock0_size * 1.1 + (float)digital_clock0_location_x + (float)digital_clock0_maxX / (float)digital_clock0_maxY * (float)digital_clock0_size * (float)digital_clock0_triangleX[j + 2] / (float)digital_clock0_maxX),
                    (int)((float)digital_clock0_location_y + (float)digital_clock0_size * (float)digital_clock0_triangleY[j + 2] / (float)digital_clock0_maxY),

                    0);
            }
        }
    }

    int digital_clock0_r = 0.05 * (float)digital_clock0_size;

    display.fillCircle((int)((float)digital_clock0_location_x + 4.0 * (float)digital_clock0_maxX / (float)digital_clock0_maxY * (float)digital_clock0_size * 1.075 / 2.0), (int)((float)digital_clock0_location_y + (float)digital_clock0_size * 0.4), digital_clock0_r, 0);
    display.fillCircle((int)((float)digital_clock0_location_x + 4.0 * (float)digital_clock0_maxX / (float)digital_clock0_maxY * (float)digital_clock0_size * 1.075 / 2.0), (int)((float)digital_clock0_location_y + (float)digital_clock0_size * 0.6), digital_clock0_r, 0);
}
