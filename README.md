# Rounded Screen Corners

A GNOME Shell extension that adds aesthetic rounded corners to your screen, creating a modern and premium look for your desktop.

![Rounded Screen Corners](https://github.com/nopan-studio/rounded-screen-corners/blob/main/images/1.png)

![Rounded Screen Corners](https://github.com/nopan-studio/rounded-screen-corners/blob/main/images/2.png)

## Features

- **Multi-Monitor Support**: Automatically applies rounded corners to all connected monitors.
- **Customizable Corner Radius**: Easily adjust the size of the corners through the extension settings.
- **Customizable Colors**: Choose any color for your screen corners using a built-in color picker.
- **Default vs. Static Mode**: 
  - **Default Mode**: Corners are placed below the top panel (traditional behavior).
  - **Static Mode**: Corners are fixed at the top of the monitor, regardless of the panel's presence or height.
- **Symbolic SVGs**: Uses high-quality SVG assets for crisp rendering at any size.

## Compatibility

Compatible with GNOME Shell versions:
- 45
- 46
- 47
- 48
- 49

## Installation

### Via GNOME Extensions Website
Visit [Rounded Screen Corners on GNOME Extensions](https://extensions.gnome.org/) and toggle the switch to ON.

### Manual Installation
1. Download or clone this repository.
2. Run the installation script to package and install the extension:
   ```bash
   ./install.sh
   ```
3. Restart GNOME Shell (X11: `Alt+F2`, type `r`, `Enter`; Wayland: Log out and back in).
4. Enable the extension using GNOME Extensions or Extensions Manager.

## Configuration

Open the extension settings to customize:
- **Corner Size**: Set the radius in pixels.
- **Default Mode**: Toggle between behavior relative to the panel or static screen edges.
- **Corner Color**: Pick a custom color and transparency for the corner overlays.

## License

This project is licensed under the GNU General Public License v3.0 - see the LICENSE file for details.
