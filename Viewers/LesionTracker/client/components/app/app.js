import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Router } from 'meteor/clinical:router';
import { ReactiveVar } from 'meteor/reactive-var';
import { OHIF } from 'meteor/ohif:core';
import { TAPi18n } from 'meteor/tap:i18n';


Template.app.onCreated(() => {
    const instance = Template.instance();
    instance.headerClasses = new ReactiveVar('');

   

    instance.autorun(() => {
        const currentRoute = Router.current();
        if (!currentRoute) return;
        const routeName = currentRoute.route.getName();
        const isViewer = routeName.indexOf('viewer') === 0;

        // Add or remove the strech class from body
        $(document.body)[isViewer ? 'addClass' : 'removeClass']('stretch');

        // Set the header on its bigger version if the viewer is not opened
        instance.headerClasses.set(isViewer ? '' : 'header-big');

        // Set the viewer open state on session
        Session.set('ViewerOpened', isViewer);
    });
});

Template.app.events({

    'click #lnkLogout'(event,instance){
        event.preventDefault();
      Router.go('logout');
    },


    'click .js-toggle-studyList'(event, instance) {
        event.preventDefault();
        event.stopPropagation();
        const isViewer = Session.get('ViewerOpened');

        if (!isViewer) {
            const timepointId = OHIF.viewer.data.currentTimepointId;
            if (timepointId) {
                Router.go('viewerTimepoint', { timepointId });
            } else {
                const { studyInstanceUids } = OHIF.viewer.data;
                Router.go('viewerStudies', { studyInstanceUids });
            }

            return;
        }

        OHIF.ui.unsavedChanges.presentProactiveDialog('viewer.*', (hasChanges, userChoice) => {
            if (!hasChanges) {
                return Router.go('studylist');
            }

            switch (userChoice) {
                case 'abort-action':
                    return;
                case 'save-changes':
                    OHIF.ui.unsavedChanges.trigger('viewer', 'save', false);
                    OHIF.ui.unsavedChanges.clear('viewer.*');
                    break;
                case 'abandon-changes':
                    OHIF.ui.unsavedChanges.clear('viewer.*');
                    break;
            }

            Router.go('studylist');
        }, {
            position: {
                x: event.clientX + 15,
                y: event.clientY + 15
            }
        });
    }
});

Template.app.helpers({
    userName: Session.get('userLogin'),

    studyListToggleText() {
        const isViewer = Session.get('ViewerOpened');

        // Return empty if viewer was not opened yet
        if (!OHIF.utils.ObjectPath.get(OHIF, 'viewer.data.studyInstanceUids')) return;

        return isViewer ? TAPi18n.__('studyList.studyList') : TAPi18n.__('studyList.backToViewer');
    },

    dasherize(text) {
        return text.replace(/ /g, '-').toLowerCase();
    }
});

Session.set('defaultSignInMessage', 'Tumor tracking in your browser.');
