#include "Arduino.h"
#include "Inkplate.h"

#include "FreeSans24pt7b.h"

extern Inkplate display;

String text0_content = "test";
int text0_cursor_x = 0;
int text0_cursor_y = 100;
const GFXfont *text0_font = &FreeSans24pt7b;

int widget0_a[] = {10,20,30,40,50,60,70,80,90,100};
int widget0_t1 = 1;
String widget0_h = "lololo";
int widget0_corner_x = 58;
int widget0_corner_y = 55;

int widget1_a[] = {10,20,30,40,50,60,70,80,90,100};
int widget1_t1 = 1;
String widget1_h = "lololo";
int widget1_corner_x = 62;
int widget1_corner_y = 59;

int widget2_a[] = {10,20,30,40,50,60,70,80,90,100};
int widget2_t1 = 1;
String widget2_h = "lololo";
int widget2_corner_x = 50;
int widget2_corner_y = 50;

void mainDraw() {
    display.setFont(text0_font);
    display.setTextColor(0, 7);    display.setCursor(text0_cursor_x, text0_cursor_y);
    display.print(text0_content);

    for(int i = 0; i < 10; ++i)
       display.drawLine(widget0_corner_x + 100 + i * 20, widget0_corner_y + 100, widget0_corner_x + 100 + i * 20, widget0_corner_y + 100 + widget0_a[i] * 4, 0);

    for(int i = 0; i < 10; ++i)
       display.drawLine(widget1_corner_x + 100 + i * 20, widget1_corner_y + 100, widget1_corner_x + 100 + i * 20, widget1_corner_y + 100 + widget1_a[i] * 4, 0);

    for(int i = 0; i < 10; ++i)
       display.drawLine(widget2_corner_x + 100 + i * 20, widget2_corner_y + 100, widget2_corner_x + 100 + i * 20, widget2_corner_y + 100 + widget2_a[i] * 4, 0);

}
