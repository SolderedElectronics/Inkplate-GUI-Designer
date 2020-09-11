# 1 "/Users/nitkonitkic/Desktop/code/Inkplate-GUI-Designer/testScript/testScript.ino"
# 2 "/Users/nitkonitkic/Desktop/code/Inkplate-GUI-Designer/testScript/testScript.ino" 2
# 3 "/Users/nitkonitkic/Desktop/code/Inkplate-GUI-Designer/testScript/testScript.ino" 2

Inkplate display(1);

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
