#include "Arduino.h"
#include "Inkplate.h"
#include "Fonts/FreeSansBold24pt7b.h"

extern Inkplate display;

String text0_content = "Hello there!";
int text0_cursor_x = 300;
int text0_cursor_y = 290;
const GFXfont *text0_font = &24px FreeSansBold24pt7b;

int rect0_a_x = 90;
int rect0_a_y = 89;
int rect0_b_x = 638;
int rect0_b_y = 487;
int rect0_fill = -1;
int rect0_radius = -1;
int rect0_color = 0;

void mainDraw() {
    display.setFont(text0_font);
    display.setTextColor(0, 7);    display.setTextSize(1);    display.setCursor(text0_cursor_x, text0_cursor_y);
    display.print(text0_content);

    if (rect0_radius != -1 && rect0_fill != -1)
       display.fillRoundRect(rect0_a_x, rect0_a_y, rect0_b_x - rect0_a_x, rect0_b_y - rect0_a_y, rect0_radius, rect0_color);
   else if (rect0_radius != -1 && rect0_fill == -1)
       display.drawRoundRect(rect0_a_x, rect0_a_y, rect0_b_x - rect0_a_x, rect0_b_y - rect0_a_y, rect0_radius, rect0_color);
   else if (rect0_radius == -1 && rect0_fill != -1)
       display.fillRect(rect0_a_x, rect0_a_y, rect0_b_x - rect0_a_x, rect0_b_y - rect0_a_y, rect0_color);
   else if (rect0_radius == -1 && rect0_fill == -1)
       display.drawRect(rect0_a_x, rect0_a_y, rect0_b_x - rect0_a_x, rect0_b_y - rect0_a_y, rect0_color);

}
