import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { $ } from 'meteor/jquery';
import { _ } from 'meteor/underscore';
import { OHIF } from 'meteor/ohif:core';
import { toolManager } from './toolManager';
import { switchToImageRelative } from './switchToImageRelative';
import { switchToImageByIndex } from './switchToImageByIndex';
import { viewportUtils } from './viewportUtils';
import { panelNavigation } from './panelNavigation';
import { WLPresets } from './WLPresets';
import { TAPi18n } from 'meteor/tap:i18n';

getUserLanguage = function () {
    var localeFromBrowser = window.navigator.userLanguage || window.navigator.language;
    var locale = 'en';
    if (localeFromBrowser.match(/es/)) {
        locale = 'es';
    }
    return locale;
};



// TODO: add this to namespace definitions
Meteor.startup(function() {

    TAPi18n.setLanguage(getUserLanguage())
        .done(function () {
            Session.set("showLoadingIndicator", false);
        })
        .fail(function (error_message) {
            // Handle the situation
            console.log(error_message);
        });


    OHIF.viewer.loadIndicatorDelay = 200;
    OHIF.viewer.defaultTool = 'wwwc';
    OHIF.viewer.refLinesEnabled = true;
    OHIF.viewer.isPlaying = {};
    OHIF.viewer.cine = {
        framesPerSecond: 24,
        loop: true
    };

    OHIF.viewer.defaultHotkeys = {
        // Tool hotkeys
        defaultTool: 'ESC',
        zoom: 'Z',
        wwwc: 'W',
        pan: 'P',
        angle: 'A',
        stackScroll: 'S',
        magnify: 'M',
        length: '',
        annotate: '',
        dragProbe: '',
        ellipticalRoi: '',
        rectangleRoi: '',

        // Viewport hotkeys
        flipH: 'H',
        flipV: 'V',
        rotateR: 'R',
        rotateL: 'L',
        invert: 'I',
        zoomIn: '',
        zoomOut: '',
        zoomToFit: '',
        resetViewport: '',
        clearTools: '',

        // Viewport navigation hotkeys
        scrollDown: 'DOWN',
        scrollUp: 'UP',
        scrollLastImage: 'END',
        scrollFirstImage: 'HOME',
        previousDisplaySet: 'PAGEUP',
        nextDisplaySet: 'PAGEDOWN',
        nextPanel: 'RIGHT',
        previousPanel: 'LEFT',

        // Miscellaneous hotkeys
        toggleOverlayTags: 'O',
        toggleCinePlay: 'SPACE',
        toggleCineDialog: '',
        toggleDownloadDialog: '',

        // Preset hotkeys
        WLPreset0: '1',
        WLPreset1: '2',
        WLPreset2: '3',
        WLPreset3: '4',
        WLPreset4: '5',
        WLPreset5: '6',
        WLPreset6: '7',
        WLPreset7: '8',
        WLPreset8: '9',
        WLPreset9: '0'
    };

    // For now
    OHIF.viewer.hotkeys = OHIF.viewer.defaultHotkeys;

    // Create commands context for viewer
    const contextName = 'viewer';
    OHIF.commands.createContext(contextName);

    // Create a function that returns true if the active viewport is empty
    const isActiveViewportEmpty = () => {
        const activeViewport = Session.get('activeViewport') || 0;
        return $('.imageViewerViewport').eq(activeViewport).hasClass('empty');
    };

    // Functions to register the tool switching commands
    const registerToolCommands = map => _.each(map, (commandName, toolId) => {
        OHIF.commands.register(contextName, toolId, {
            name: commandName,
            action: toolManager.setActiveTool,
            params: toolId
        });
    });

    // Register the default tool command
    OHIF.commands.register(contextName, 'defaultTool', {
        name: TAPi18n.__('hotkeys.defaultTool'),
        action: () => toolManager.setActiveTool(toolManager.getDefaultTool())
    });

    // Register the tool switching commands
    registerToolCommands({
        wwwc: 'W/L',
        zoom: TAPi18n.__('hotkeys.zoom'),
        angle: TAPi18n.__('hotkeys.ange'),
        dragProbe: TAPi18n.__('hotkeys.dragProbe'),
        ellipticalRoi: TAPi18n.__('hotkeys.ellipticalRoi'),
        rectangleRoi: TAPi18n.__('hotkeys.rectangleRoi'),
        magnify: TAPi18n.__('hotkeys.magnify'),
        annotate: TAPi18n.__('hotkeys.annotate'),
        stackScroll: TAPi18n.__('hotkeys.stackScroll'),
        pan: TAPi18n.__('hotkeys.pan'),
        length: TAPi18n.__('hotkeys.length'),
        wwwcRegion: TAPi18n.__('hotkeys.wwwcRegion'),
        crosshairs: TAPi18n.__('hotkeys.crosshairs')

    });

    // Functions to register the viewport commands
    const registerViewportCommands = map => _.each(map, (commandName, commandId) => {
        OHIF.commands.register(contextName, commandId, {
            name: commandName,
            action: viewportUtils[commandId],
            disabled: isActiveViewportEmpty
        });
    });

    // Register the viewport commands
    registerViewportCommands({
        zoomIn: TAPi18n.__('hotkeys.zoomIn'),
        zoomOut: TAPi18n.__('hotkeys.zoomOut'),
        zoomToFit: TAPi18n.__('hotkeys.zoomToFit'),
        invert: TAPi18n.__('hotkeys.invert'),
        flipH: TAPi18n.__('hotkeys.flipH'),
        flipV: TAPi18n.__('hotkeys.flipV'),
        rotateR: TAPi18n.__('hotkeys.rotateR'),
        rotateL: TAPi18n.__('hotkeys.rotateL'),
        resetViewport: TAPi18n.__('hotkeys.resetViewport'),
        clearTools: TAPi18n.__('hotkeys.clearTools')

    });

    // Register the preset switching commands
    const applyPreset = presetName => WLPresets.applyWLPresetToActiveElement(presetName);
    for (let i = 0; i < 10; i++) {
        OHIF.commands.register(contextName, `WLPreset${i}`, {
            name: `W/L Preset ${i + 1}`,
            action: applyPreset,
            params: i
        });
    }

    // Check if display sets can be moved
    const canMoveDisplaySets = isNext => {
        if (!OHIF.viewerbase.layoutManager) {
            return false;
        } else {
            return OHIF.viewerbase.layoutManager.canMoveDisplaySets(isNext);
        }
    };

    // Register viewport navigation commands
    OHIF.commands.set(contextName, {
        scrollDown: {
            name: TAPi18n.__('hotkeys.scrollDown'),
            action: () => !isActiveViewportEmpty() && switchToImageRelative(1)
        },
        scrollUp: {
            name: TAPi18n.__('hotkeys.scrollUp'),
            action: () => !isActiveViewportEmpty() && switchToImageRelative(-1)
        },
        scrollFirstImage: {
            name: TAPi18n.__('hotkeys.scrollToFirsImage'),
            action: () => !isActiveViewportEmpty() && switchToImageByIndex(0)
        },
        scrollLastImage: {
            name: TAPi18n.__('hotkeys.scrollToLastImage'),
            action: () => !isActiveViewportEmpty() && switchToImageByIndex(-1)
        },
        previousDisplaySet: {
            name: TAPi18n.__('hotkeys.previousDisplaySet'),
            action: () => OHIF.viewerbase.layoutManager.moveDisplaySets(false),
            disabled: () => !canMoveDisplaySets(false)
        },
        nextDisplaySet: {
            name: TAPi18n.__('hotkeys.nextDisplaySet'),
            action: () => OHIF.viewerbase.layoutManager.moveDisplaySets(true),
            disabled: () => !canMoveDisplaySets(true)
        },
        nextPanel: {
            name: TAPi18n.__('hotkeys.nextPanel'),
            action: () => panelNavigation.loadNextActivePanel()
        },
        previousPanel: {
            name: TAPi18n.__('hotkeys.previousPanel'),
            action: () => panelNavigation.loadPreviousActivePanel()
        }
    }, true);

    // Register miscellaneous commands
    OHIF.commands.set(contextName, {
        toggleOverlayTags: {
            name: TAPi18n.__('hotkeys.toggleOverlayTags'),
            action() {
                const $dicomTags = $('.imageViewerViewportOverlay .dicomTag');
                $dicomTags.toggle($dicomTags.eq(0).css('display') === 'none');
            }
        },
        toggleCinePlay: {
            name: TAPi18n.__('hotkeys.toggleCinePlay'),
            action: viewportUtils.toggleCinePlay,
            disabled: OHIF.viewerbase.viewportUtils.hasMultipleFrames
        },
        toggleCineDialog: {
            name: TAPi18n.__('hotkeys.toggleCineDialog'),
            action: viewportUtils.toggleCineDialog,
            disabled: OHIF.viewerbase.viewportUtils.hasMultipleFrames
        },
        toggleDownloadDialog: {
            name: TAPi18n.__('hotkeys.toggleDownloadDialog'),
            action: viewportUtils.toggleDownloadDialog,
            disabled: () => !viewportUtils.isDownloadEnabled()
        },
        sr: {
            name: 'Show/Hide Structured Report',
            action: () => OHIF.ui.showDialog('structuredReportModal'),
            disabled: () => false
        }
    }, true);

    OHIF.viewer.hotkeyFunctions = {};

    OHIF.viewer.loadedSeriesData = {};

    // Enable hotkeys
    hotkeyUtils.enableHotkeys();
});

// Define a jQuery reverse function
$.fn.reverse = [].reverse;

/**
 * Overrides OHIF's refLinesEnabled
 * @param  {Boolean} refLinesEnabled True to enable and False to disable
 */
function setOHIFRefLines(refLinesEnabled) {
    OHIF.viewer.refLinesEnabled = refLinesEnabled;
}

/**
 * Overrides OHIF's hotkeys
 * @param  {Object} hotkeys Object with hotkeys mapping
 */
function setOHIFHotkeys(hotkeys) {
    OHIF.viewer.hotkeys = hotkeys;
}

/**
 * Binds all hotkeys keydown events to the tasks defined in
 * OHIF.viewer.hotkeys or a given param
 * @param  {Object} hotkeys hotkey and task mapping (not required). If not given, uses OHIF.viewer.hotkeys
 */
function enableHotkeys(hotkeys) {
    const definitions = hotkeys || OHIF.viewer.hotkeys;
    OHIF.hotkeys.set('viewer', definitions, true);
    OHIF.context.set('viewer');
}

/**
 * Export functions inside hotkeyUtils namespace.
 */

const hotkeyUtils = {
    setOHIFRefLines, /* @TODO: find a better place for this...  */
    setOHIFHotkeys,
    enableHotkeys
};

export { hotkeyUtils };
