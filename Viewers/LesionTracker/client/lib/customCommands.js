import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { OHIF } from 'meteor/ohif:core';
import { TAPi18n } from 'meteor/tap:i18n';


getUserLanguage = function () {
    var localeFromBrowser = window.navigator.userLanguage || window.navigator.language;
    var locale = 'en';
    moment.locale("en");
    if (localeFromBrowser.match(/es/)) {
        moment.locale("es");
        locale = 'es';
    }
    return locale;
};

Meteor.startup(() => {

        TAPi18n.setLanguage(getUserLanguage())
        .done(function () {
            Session.set("showLoadingIndicator", false);
        })
        .fail(function (error_message) {
            // Handle the situation
            console.log(error_message);
        });

    const { toolManager } = OHIF.viewerbase;
    const contextName = 'viewer';

    // Enable the custom tools
    const customTools = [{
        id: 'bidirectional',
        name: TAPi18n.__('lesionTracker.bidirectional')
    }, {
        id: 'nonTarget',
        name: TAPi18n.__('lesionTracker.crTarget')
    }, {
        id: 'targetCR',
        name: TAPi18n.__('lesionTracker.crTarget')
    }, {
        id: 'targetUN',
        name: TAPi18n.__('lesionTracker.unTarget')
    }];
    customTools.forEach(tool => {
        _.defaults(OHIF.hotkeys.defaults[contextName], { [tool.id]: '' });
        OHIF.commands.register(contextName, tool.id, {
            name: tool.name,
            action: tool.action || (() => toolManager.setActiveTool(tool.id))
        });
    });

    // Enable the custom commands
    const customCommands = [{
        id: 'linkStackScroll',
        name: TAPi18n.__('lesionTracker.link'),
        action: OHIF.viewerbase.viewportUtils.linkStackScroll
    }, {
        id: 'saveMeasurements',
        name: TAPi18n.__('lesionTracker.saveMeasures'),
        hotkey: 'CTRL+F',
        action() {
            const activeTimepoint = OHIF.measurements.getActiveTimepoint();
            if (!activeTimepoint) return;
            OHIF.measurements.saveMeasurements(OHIF.viewer.measurementApi, activeTimepoint.timepointId);
        }
    }];
    customCommands.forEach(command => {
        _.defaults(OHIF.hotkeys.defaults[contextName], { [command.id]: command.hotkey || '' });
        OHIF.commands.register(contextName, command.id, {
            name: command.name,
            action: command.action || (() => toolManager.setActiveTool(command.id))
        });
    });
});
