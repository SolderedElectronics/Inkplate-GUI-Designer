# Inkplate-GUI-Designer
Web app for designing GUI for Inkplate e-paper displays

# Configuring Fonts

The GUI editor is capable of rendering fonts in an accurate way to how Adafruit
GFX will render them on an Inkplate device.

By default, `fonts.css` is configured with a list of the basic GNU FreeFont
fonts typically used in the [Adafruit GFX font tutorial](https://learn.adafruit.com/adafruit-gfx-graphics-library/using-fonts).
You can acquire the TTFs from their [project page](http://savannah.gnu.org/projects/freefont/)
and place them in the `fonts/` folder for the GUI designer to use them.

To use custom fonts, place any TTF font in the `fonts/` folder, and update
`fonts.css` to add references to them.
