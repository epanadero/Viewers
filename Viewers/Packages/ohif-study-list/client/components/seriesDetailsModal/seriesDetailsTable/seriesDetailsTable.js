import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { _ } from 'meteor/underscore';
import { OHIF } from 'meteor/ohif:core';

Template.seriesDetailsTable.onCreated(() => {
    const instance = Template.instance();

    // Create selected studies
    instance.selectedStudies = new ReactiveDict();

    let selectedStudiesData = instance.data.selectedStudies;

    if (!selectedStudiesData) {
        return;
    }

    // Display loading text while getting series
    _.each(selectedStudiesData, selectedStudy => {

        selectedStudy.displaySeriesLoadingText = true;
    });

    // Set reactive selected studies
    instance.selectedStudies.set('studies', selectedStudiesData);
});

Template.seriesDetailsTable.onRendered(() => {
    const instance = Template.instance();
    const studies = instance.selectedStudies.get('studies');

    if (!studies) {
        return;
    }

    // Get series list for the study
    _.map(studies, (selectedStudy, index) => {
        studies[index].displaySeriesLoadingText = true;
        studies[index].seriesList = [];
        var study=OHIF.studies.retrieveStudyMetadata( selectedStudy.studyInstanceUid);
        study.then(function (result) {
            studies[index].seriesList = result.seriesList;
            studies[index].displaySeriesLoadingText = false;
            instance.selectedStudies.set('studies', studies);
        })
    });
});


Template.seriesDetailsTable.helpers({
    selectedStudies() {
        const instance = Template.instance();
        return instance.selectedStudies.get('studies');
    }
});
