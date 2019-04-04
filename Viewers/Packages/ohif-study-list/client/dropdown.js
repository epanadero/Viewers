import { Meteor } from 'meteor/meteor';
import { OHIF } from 'meteor/ohif:core';
import { TAPi18n } from 'meteor/tap:i18n';

getUserLanguage = function () {
    var localeFromBrowser = window.navigator.userLanguage || window.navigator.language;
    var locale = 'en';
    if (localeFromBrowser.match(/es/)) {
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

    OHIF.studylist.dropdown = new OHIF.ui.Dropdown();

    OHIF.studylist.dropdown.setItems([{
        action: OHIF.studylist.viewSeriesDetails,
        text: TAPi18n.__('dropdown.viewSeriesDetail')
    }, {
        text: TAPi18n.__('dropdown.anonymize'),
        disabled: true
    }, {
        text: TAPi18n.__('dropdown.send'),
        disabled: true,
        separatorAfter: true
    }, {
        text: TAPi18n.__('dropdown.delete'),
        disabled: true
    }, {
        action: OHIF.studylist.exportSelectedStudies,
        text: TAPi18n.__('dropdown.export'),
        title: TAPi18n.__('dropdown.exportSelected')
    }]);
});
