#include "Arduino.h"
#include "Inkplate.h"
#include "Fonts/FreeSansBold24pt7b.h"

extern Inkplate display;

String text0_content = "Hello there!";
int text0_cursor_x = 300;
int text0_cursor_y = 290;
const GFXfont *text0_font = &FreeSansBold24pt7b;

String text1_content = "Hello World";
int text1_cursor_x = 96;
int text1_cursor_y = 173;
const GFXfont *text1_font = &FreeSansBold24pt7b;

String text2_content = "Hello World";
int text2_cursor_x = 100;
int text2_cursor_y = 100;
const GFXfont *text2_font = &FreeSansBold24pt7b;

void mainDraw() {
    display.setFont(text0_font);
    display.setTextColor(0, 7);    display.setTextSize(1);    display.setCursor(text0_cursor_x, text0_cursor_y);
    display.print(text0_content);

    display.setFont(text1_font);
    display.setTextColor(0, 7);    display.setTextSize(1);    display.setCursor(text1_cursor_x, text1_cursor_y);
    display.print(text1_content);

    display.setFont(text2_font);
    display.setTextColor(0, 7);    display.setTextSize(1);    display.setCursor(text2_cursor_x, text2_cursor_y);
    display.print(text2_content);

}
