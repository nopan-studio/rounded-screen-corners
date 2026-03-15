import { ExtensionPreferences, gettext as _ } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';
import Adw from 'gi://Adw';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import Gdk from 'gi://Gdk';

export default class RoundedScreenCornersPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const settings = this.getSettings('org.gnome.shell.extensions.rounded-screen-corners');

        const page = new Adw.PreferencesPage();
        const group = new Adw.PreferencesGroup({
            title: _('Appearance'),
        });
        page.add(group);

        // Corner Size
        const sizeRow = new Adw.ActionRow({
            title: _('Corner Size (Radius)'),
            subtitle: _('Size of the rounded corners in pixels.'),
        });
        group.add(sizeRow);

        const spinButton = new Gtk.SpinButton({
            adjustment: new Gtk.Adjustment({
                lower: 0,
                upper: 100,
                step_increment: 1,
            }),
            valign: Gtk.Align.CENTER,
        });
        settings.bind('corner-size', spinButton, 'value', Gio.SettingsBindFlags.DEFAULT);
        sizeRow.add_suffix(spinButton);
        sizeRow.activatable_widget = spinButton;

        // Default Mode Toggle
        const modeRow = new Adw.ActionRow({
            title: _('Default Mode'),
            subtitle: _('Enabled: Corners follow panel height. Disabled: Static screen corners.'),
        });
        group.add(modeRow);

        const modeSwitch = new Gtk.Switch({
            valign: Gtk.Align.CENTER,
        });
        settings.bind('default-mode', modeSwitch, 'active', Gio.SettingsBindFlags.DEFAULT);
        modeRow.add_suffix(modeSwitch);
        modeRow.activatable_widget = modeSwitch;

        // Corner Color Picker
        const colorRow = new Adw.ActionRow({
            title: _('Corner Color'),
            subtitle: _('Pick a color for the rounded corners.'),
        });
        group.add(colorRow);

        const colorButton = new Gtk.ColorButton({
            valign: Gtk.Align.CENTER,
            use_alpha: true,
        });
        
        // Manual binding for color string to Gdk.RGBA
        const initialColor = new Gdk.RGBA();
        initialColor.parse(settings.get_string('corner-color'));
        colorButton.set_rgba(initialColor);

        colorButton.connect('color-set', () => {
            const rgba = colorButton.get_rgba();
            settings.set_string('corner-color', rgba.to_string());
        });

        settings.connect('changed::corner-color', () => {
            const rgba = new Gdk.RGBA();
            rgba.parse(settings.get_string('corner-color'));
            colorButton.set_rgba(rgba);
        });

        colorRow.add_suffix(colorButton);
        colorRow.activatable_widget = colorButton;

        // Corner Opacity
        const opacityRow = new Adw.ActionRow({
            title: _('Corner Opacity'),
            subtitle: _('Opacity of the corners (0-255).'),
        });
        group.add(opacityRow);

        const opacitySpinButton = new Gtk.SpinButton({
            adjustment: new Gtk.Adjustment({
                lower: 0,
                upper: 255,
                step_increment: 1,
            }),
            valign: Gtk.Align.CENTER,
        });
        settings.bind('corner-opacity', opacitySpinButton, 'value', Gio.SettingsBindFlags.DEFAULT);
        opacityRow.add_suffix(opacitySpinButton);
        opacityRow.activatable_widget = opacitySpinButton;

        // Animation Style
        const animationStyleRow = new Adw.ComboRow({
            title: _('Animation Style'),
            subtitle: _('Style of the transition animation.'),
            model: Gtk.StringList.new([_('Fade In'), _('Ease In'), _('No Animation')]),
        });
        settings.bind('animation-style', animationStyleRow, 'selected', Gio.SettingsBindFlags.DEFAULT);
        group.add(animationStyleRow);

        // Animation Speed
        const speedRow = new Adw.ActionRow({
            title: _('Animation Speed'),
            subtitle: _('Duration of the animation in milliseconds.'),
        });
        group.add(speedRow);

        const speedSpinButton = new Gtk.SpinButton({
            adjustment: new Gtk.Adjustment({
                lower: 0,
                upper: 5000,
                step_increment: 10,
            }),
            valign: Gtk.Align.CENTER,
        });
        settings.bind('animation-speed', speedSpinButton, 'value', Gio.SettingsBindFlags.DEFAULT);
        speedRow.add_suffix(speedSpinButton);
        speedRow.activatable_widget = speedSpinButton;

        window.add(page);
    }
}
