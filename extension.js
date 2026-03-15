/**
 * Rounded Screen Corners Extension
 * GNOME Shell 45–49 (ESM format)
 */

import St from 'gi://St';
import Clutter from 'gi://Clutter';
import Gio from 'gi://Gio';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';

export default class RoundedScreenCornersExtension extends Extension {
    enable() {
        this._corners = [];
        this._settings = this.getSettings('org.gnome.shell.extensions.rounded-screen-corners');
        this._cornerSize = this._settings.get_int('corner-size');
        this._defaultMode = this._settings.get_boolean('default-mode');
        this._cornerColor = this._settings.get_string('corner-color');
        this._cornerOpacity = this._settings.get_int('corner-opacity');
        this._animationStyle = this._settings.get_int('animation-style');
        this._animationSpeed = this._settings.get_int('animation-speed');
        this._isOverview = Main.overview.visible;

        this._settingsSignalId = this._settings.connect('changed', (settings, key) => {
            this._cornerSize = this._settings.get_int('corner-size');
            this._defaultMode = this._settings.get_boolean('default-mode');
            this._cornerColor = this._settings.get_string('corner-color');
            this._cornerOpacity = this._settings.get_int('corner-opacity');
            this._animationStyle = this._settings.get_int('animation-style');
            this._animationSpeed = this._settings.get_int('animation-speed');
            this._recreateCorners();
        });

        this._addCorners();

        this._panelSignalId = Main.panel.connect(
            'notify::height',
            () => this._updateCornersPositions()
        );
        this._layoutSignalId = Main.layoutManager.connect(
            'monitors-changed',
            () => this._recreateCorners()
        );
        this._overviewShowingId = Main.overview.connect(
            'showing',
            () => { this._isOverview = true; this._updateCornersPositions(); }
        );
        this._overviewHidingId = Main.overview.connect(
            'hiding',
            () => { this._isOverview = false; this._updateCornersPositions(); }
        );
    }

    disable() {
        if (this._panelSignalId) {
            Main.panel.disconnect(this._panelSignalId);
            this._panelSignalId = null;
        }
        if (this._layoutSignalId) {
            Main.layoutManager.disconnect(this._layoutSignalId);
            this._layoutSignalId = null;
        }
        if (this._settingsSignalId) {
            this._settings.disconnect(this._settingsSignalId);
            this._settingsSignalId = null;
        }
        if (this._overviewShowingId) {
            Main.overview.disconnect(this._overviewShowingId);
            this._overviewShowingId = null;
        }
        if (this._overviewHidingId) {
            Main.overview.disconnect(this._overviewHidingId);
            this._overviewHidingId = null;
        }
        this._settings = null;
        
        this._removeCorners();
    }

    _makeCornerWidget(corner) {
        let svgName = '';
        switch (corner) {
            case 'top-left': svgName = 'corner-tl-symbolic.svg'; break;
            case 'top-right': svgName = 'corner-tr-symbolic.svg'; break;
            case 'bottom-left': svgName = 'corner-bl-symbolic.svg'; break;
            case 'bottom-right': svgName = 'corner-br-symbolic.svg'; break;
        }

        const file = this.dir.get_child('corners').get_child(svgName);
        const gicon = new Gio.FileIcon({ file });

        const widget = new St.Icon({
            gicon: gicon,
            icon_size: this._cornerSize,
            reactive: false,
            can_focus: false,
            style: `color: ${this._cornerColor};`,
            opacity: this._cornerOpacity,
        });

        return widget;
    }

    _addCorners() {
        if (!Main.layoutManager.monitors) return;

        const panelHeight = Main.panel.height;
        const r = this._cornerSize;

        for (const monitor of Main.layoutManager.monitors) {
            const isPrimary = (monitor === Main.layoutManager.primaryMonitor);
            
            let topY;
            if (this._defaultMode) {
                topY = (isPrimary && !this._isOverview) ? monitor.y + panelHeight : monitor.y;
            } else {
                topY = monitor.y;
            }
            const bottomY = monitor.y + monitor.height;
            const leftX = monitor.x;
            const rightX = monitor.x + monitor.width;

            const positions = [
                { corner: 'top-left',     x: leftX,       y: topY },
                { corner: 'top-right',    x: rightX - r,  y: topY },
                { corner: 'bottom-left',  x: leftX,       y: bottomY - r },
                { corner: 'bottom-right', x: rightX - r,  y: bottomY - r },
            ];

            for (const { corner, x, y } of positions) {
                const widget = this._makeCornerWidget(corner);
                Main.uiGroup.add_child(widget);
                widget.set_position(x, y);
                Main.uiGroup.set_child_above_sibling(widget, null);
                this._corners.push(widget);
            }
        }
    }

    _removeCorners() {
        if (!this._corners) return;
        for (const widget of this._corners) {
            if (widget.get_parent())
                widget.get_parent().remove_child(widget);
            widget.destroy();
        }
        this._corners = [];
    }

    _recreateCorners() {
        this._removeCorners();
        this._addCorners();
    }

    _updateCornersPositions() {
        if (!Main.layoutManager.monitors || !this._corners) return;

        const expectedCornersCount = Main.layoutManager.monitors.length * 4;
        if (this._corners.length !== expectedCornersCount) {
            this._recreateCorners();
            return;
        }

        const panelHeight = Main.panel.height;
        const r = this._cornerSize;
        
        let cornerIndex = 0;

        for (const monitor of Main.layoutManager.monitors) {
            const isPrimary = (monitor === Main.layoutManager.primaryMonitor);
            
            let topY;
            if (this._defaultMode) {
                topY = (isPrimary && !this._isOverview) ? monitor.y + panelHeight : monitor.y;
            } else {
                topY = monitor.y;
            }
            const bottomY = monitor.y + monitor.height;
            const leftX = monitor.x;
            const rightX = monitor.x + monitor.width;

            const positions = [
                { x: leftX,       y: topY },
                { x: rightX - r,  y: topY },
                { x: leftX,       y: bottomY - r },
                { x: rightX - r,  y: bottomY - r },
            ];

            for (const { x, y } of positions) {
                if (cornerIndex < this._corners.length) {
                    const widget = this._corners[cornerIndex];
                    if (this._animationStyle === 1) { // Ease In
                        widget.ease({
                            x: x,
                            y: y,
                            duration: this._animationSpeed,
                            mode: Clutter.AnimationMode.EASE_OUT_QUAD
                        });
                    } else if (this._animationStyle === 0) { // Fade In
                        if (widget.x !== x || widget.y !== y) {
                            widget.remove_all_transitions();
                            widget.set_position(x, y);
                            widget.opacity = 0;
                            widget.ease({
                                opacity: this._cornerOpacity,
                                duration: this._animationSpeed,
                                mode: Clutter.AnimationMode.EASE_OUT_QUAD
                            });
                        } else {
                            widget.ease({
                                opacity: this._cornerOpacity,
                                duration: this._animationSpeed,
                                mode: Clutter.AnimationMode.EASE_OUT_QUAD
                            });
                        }
                    } else { // No Animation
                        widget.remove_all_transitions();
                        widget.set_position(x, y);
                        widget.opacity = this._cornerOpacity;
                    }
                }
                cornerIndex++;
            }
        }
    }
}
