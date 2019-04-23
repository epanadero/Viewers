import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { OHIF } from 'meteor/ohif:core';
import { cornerstoneWADOImageLoader } from 'meteor/ohif:cornerstone';


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


Meteor.startup(function() {
    const maxWebWorkers = Math.max(navigator.hardwareConcurrency - 1, 1);
    const config = {
        maxWebWorkers: maxWebWorkers,
        startWebWorkersOnDemand: true,
        webWorkerPath : OHIF.utils.absoluteUrl('packages/ohif_cornerstone/public/js/cornerstoneWADOImageLoaderWebWorker.es5.js'),
        taskConfiguration: {
            'decodeTask' : {
                loadCodecsOnStartup : true,
                initializeCodecsOnStartup: false,
                codecsPath: OHIF.utils.absoluteUrl('packages/ohif_cornerstone/public/js/cornerstoneWADOImageLoaderCodecs.es5.js'),
                usePDFJS: true
            }
        }
    };

      Session.set("showLoadingIndicator", true);

    TAPi18n.setLanguage(getUserLanguage())
        .done(function () {
            Session.set("showLoadingIndicator", false);
        })
        .fail(function (error_message) {
            // Handle the situation
            console.log(error_message);
        });


/*    cornerstoneWADOImageLoader.webWorkerManager.initialize(config);

    cornerstoneWADOImageLoader.configure({
        beforeSend: function(xhr) {
            const userId = Meteor.userId();
            const loginToken = Accounts._storedLoginToken();
            if (userId && loginToken) {
                xhr.setRequestHeader("x-user-id", userId);
                xhr.setRequestHeader("x-auth-token", loginToken);
            }
        }
    });*/

    cornerstoneWADOImageLoader.webWorkerManager.initialize(config);

});