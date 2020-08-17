#include "Inkplate.h"
#include "generatedUI.h"

Inkplate display(INKPLATE_3BIT);

void setup() {
  display.begin();
  display.clearDisplay();
  display.clean();

  mainDraw();

  display.display();
}

void loop() {
  // put your main code here, to run repeatedly:

}
