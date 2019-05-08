import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { OHIF } from 'meteor/ohif:core';

const { OHIFPlugin } = OHIF.plugins;

const plugin = {
    name: "MultiplanarReformattingPlugin",
    url: "http://localhost:8000/multiplanarReformatting/main.js",
    allowCaching: false,
    moduleURLs: [
        "http://localhost:8000/lib/index.js",
    ],
    scriptURLs: [
        'https://github.com/Kitware/vtk-js',
    ]
};

Meteor.startup(() => {
    OHIFPlugin.reloadPlugin(plugin);

    OHIF.commands.register('viewer', `reload-${plugin.name}-L`, {
        name: `plugin-${plugin.name}`,
        action: () => {
            const viewportIndex = Session.get('activeViewport');

            OHIF.viewerbase.layoutManager.viewportData[viewportIndex].pluginData = {
                viewDirection: 'L'
            };

            OHIF.plugins[plugin.name].setViewportToPlugin(viewportIndex);
        }
    });

    OHIF.commands.register('viewer', `reload-${plugin.name}-A`, {
        name: `plugin-${plugin.name}`,
        action: () => {
            const viewportIndex = Session.get('activeViewport');

            OHIF.viewerbase.layoutManager.viewportData[viewportIndex].pluginData = {
                viewDirection: 'A'
            };

            OHIF.plugins[plugin.name].setViewportToPlugin(viewportIndex);
        }
    });

    OHIF.commands.register('viewer', `reload-${plugin.name}-S`, {
        name: `plugin-${plugin.name}`,
        action: () => {
            const viewportIndex = Session.get('activeViewport');

            OHIF.viewerbase.layoutManager.viewportData[viewportIndex].pluginData = {
                viewDirection: 'S'
            };

            OHIF.plugins[plugin.name].setViewportToPlugin(viewportIndex);
        }
    });
});
