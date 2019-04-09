import { Meteor } from 'meteor/meteor';
import { OHIF } from 'meteor/ohif:core';
import { TAPi18n } from 'meteor/tap:i18n';

/**
 * Loads multiple unassociated studies in the Viewer
 */
const getAssociationAssessment = () => {
    // default result value
    const assessment = {
        selected: 0,
        associated: 0
    };

    // check if timepointApi is available
    const timepointApi = OHIF.studylist.timepointApi;
    if (timepointApi) {
        // Get a Cursor pointing to the selected Studies from the StudyList
        const selectedStudies = OHIF.studylist.getSelectedStudies();
        if (selectedStudies.length > 0) {
            assessment.selected = selectedStudies.length;
            // Loop through the selected Studies and return true if at least one study has no association.
            for (let i = selectedStudies.length - 1; i >= 0; --i) {
                let study = selectedStudies[i],
                    timepoints = timepointApi.study(study.studyInstanceUid);
                if (timepoints && timepoints.length > 0) {
                    assessment.associated++;
                }
            }
        }
    }

    return assessment;
};

/**
 * Removes all present study / timepoint associations from the Clinical Trial
 */
const removeTimepointAssociations = event => {
    const dialogSettings = {
        title: 'Remove Association',
        message: 'Measurements related to this Study and Timepoint will be erased. Do you really want to delete this association?',
        confirmClass: 'btn-danger',
        position: {
            x: event.clientX,
            y: event.clientY
        }
    };

    OHIF.ui.showDialog('dialogConfirm', dialogSettings).then(() => {
        // Get a Cursor pointing to the selected Studies from the StudyList
        const selectedStudies = OHIF.studylist.getSelectedStudies();

        // Find the Timepoint that was previously referenced
        const timepointApi = OHIF.studylist.timepointApi;
        if (!timepointApi) {
            OHIF.log.error('Remove Study/Timepoint Association: No Timepoint API found.');
            return;
        }

        // Loop through the Cursor of Selected Studies
        selectedStudies.forEach(study => {
            const studyInstanceUid = study.studyInstanceUid;
            const timepoints = timepointApi.study(studyInstanceUid);
            const timepointIds = timepoints.map(t => t.timepointId);
            timepointApi.disassociateStudy(timepointIds, studyInstanceUid);
        });
    });
};

Meteor.startup(() => {
    if (!OHIF.studylist) return;

    OHIF.studylist.dropdown.setItems([{
        action: OHIF.studylist.viewStudies,
        text: TAPi18n.__('dropdown.view'),
        separatorAfter: true
    }, {
        action: () => OHIF.ui.showDialog('dialogStudyAssociation'),
        text: TAPi18n.__('dropdown.associate'),
        disabled: () => {
            const assessment = getAssociationAssessment();
            return assessment.selected < 1;
        }
    }, {
        action: removeTimepointAssociations,
        text: TAPi18n.__('dropdown.removeAssociation'),
        separatorAfter: true,
        disabled: () => {
            const assessment = getAssociationAssessment();
            return assessment.selected < 1 || assessment.selected !== assessment.associated;
        }
    }, {
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
        action: OHIF.studylist.exportSelectedStudies,
        text: TAPi18n.__('dropdown.export'),
        title: TAPi18n.__('dropdown.exportSelected')
    }, {
        text: TAPi18n.__('dropdown.delete'),
        disabled: true
    }]);
});
