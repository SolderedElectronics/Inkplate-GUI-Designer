#include "Arduino.h"
#include "Inkplate.h"

extern Inkplate display;

int widget0_n = 32;

int widget0_corner1_x = 50;
int widget0_corner2_y = 50;

int widget0_corner2_x = 500;
int widget0_corner1_y = 500;

double widget0_data[128] = {0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0};

void mainDraw() {
   int widget0_textMargin = 68;
   double widget0_minData = 1e9F;
   double widget0_maxData = -1e9F;

   for (int i = 0; i < widget0_n; ++i)
   {
       widget0_minData = min(widget0_minData, widget0_data[i]);
       widget0_maxData = max(widget0_maxData, widget0_data[i]);
   }

   double widget0_span = max(0.3D, fabs(widget0_maxData - widget0_minData));
   int widget0_prev_x = -1;
   int widget0_prev_y = -1;

   for (int i = 0; i < widget0_n; ++i)
   {
       int tx = widget0_corner1_x + i * (widget0_corner2_x - widget0_corner1_x - widget0_textMargin) / widget0_n;
       double v = widget0_data[i];
       int h = ((v - widget0_minData) * abs(widget0_corner1_y - widget0_corner2_y) / widget0_span);
       int ty = widget0_corner1_y - h;

       if (i)
       {
           double dy = (ty - widget0_prev_y) / ((widget0_corner2_x - widget0_corner1_x - widget0_textMargin) / widget0_n);

           for (int j = 0; j < (widget0_corner2_x - widget0_corner1_x) / widget0_n + 1; ++j)
               display.drawGradientLine(widget0_prev_x + j,
                                        round(widget0_prev_y + dy * j),
                                        widget0_prev_x + j,
                                        widget0_corner1_y, 3, 7);
       }

       widget0_prev_x = tx;
       widget0_prev_y = ty;
   }

   for (int i = 0; i < widget0_n; ++i)
   {
       int tx = widget0_corner1_x + i * (widget0_corner2_x - widget0_corner1_x - widget0_textMargin) / widget0_n;
       double v = widget0_data[i];
       int h = ((v - widget0_minData) * abs(widget0_corner1_y - widget0_corner2_y) / widget0_span);
       int ty = widget0_corner1_y - h;

       if (i)
       {
           display.drawThickLine(widget0_prev_x, widget0_prev_y, tx, ty, 0, 5.0);
       }

       widget0_prev_x = tx;
       widget0_prev_y = ty;
   }

   for (int i = 0; i < 4; ++i) {
       display.drawFastHLine(widget0_corner1_x, widget0_corner2_y + i * (widget0_corner1_y - widget0_corner2_y) / 4, widget0_corner2_x - widget0_corner1_x, 4);
       display.setCursor(widget0_corner2_x - widget0_textMargin + 10, widget0_corner1_y + (4 - i) * (widget0_corner2_y - widget0_corner1_y) / 4 + 23);
       display.setTextColor(0, 7);
       display.setTextSize(3);
       display.print(String((widget0_minData + (widget0_maxData - widget0_minData) * (4 - i) / 4)));
   }
   for (int i = 0; i < 5; ++i)
       display.drawFastVLine(widget0_corner1_x + i * (widget0_corner2_x - widget0_corner1_x) / 5, widget0_corner2_y, widget0_corner1_y - widget0_corner2_y, 4);

   display.drawFastVLine(widget0_corner2_x - widget0_textMargin + 2, widget0_corner2_y, widget0_corner1_y - widget0_corner2_y, 4);
   display.drawThickLine(widget0_corner1_x, widget0_corner1_y, widget0_corner2_x, widget0_corner1_y, 0, 3);

}
