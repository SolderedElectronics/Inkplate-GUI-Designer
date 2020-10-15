#include <Arduino.h>
#line 1 "/Users/nitkonitkic/Desktop/code/Inkplate-GUI-Designer/testScript/testScript.ino"
#include "Inkplate.h"
#include "generatedUI.h"

Inkplate display(INKPLATE_3BIT); 

void setup() {
  Serial.begin(115200);
  display.begin();
  display.clearDisplay();
  display.clean();

  mainDraw();

  display.display();
}

void loop() {
  // put your main code here, to run repeatedly:

}

