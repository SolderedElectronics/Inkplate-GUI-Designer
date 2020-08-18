#include "Inkplate.h"
#include "generatedUI.h"

Inkplate display(INKPLATE_3BIT);

void setup() {
  Serial.begin(115200);
  display.begin();
  display.clearDisplay();
  display.clean();

  for(int i = 0; i < widget0_n; ++i) {
    widget0_data[i] = 100.0 * sin((float)i / (float)widget0_n * 3.0 * 3.14159265);
  }
  
  mainDraw();

  display.display();
}

void loop() {
  // put your main code here, to run repeatedly:

}
