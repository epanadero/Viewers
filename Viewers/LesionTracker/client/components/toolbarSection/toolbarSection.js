import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Tracker } from 'meteor/tracker';
import { OHIF } from 'meteor/ohif:core';
import { Viewerbase } from 'meteor/ohif:viewerbase';
import { TAPi18n } from 'meteor/tap:i18n';

Template.toolbarSection.helpers({
    isFinishDisabled() {
        const instance = Template.instance();
    
        // Run this computation on save or every time any measurement / timepoint suffer changes
        OHIF.ui.unsavedChanges.depend();
        instance.saveObserver.depend();
        Session.get('LayoutManagerUpdated');
    
        return OHIF.ui.unsavedChanges.probe('viewer.*') === 0;
    },

    leftSidebarToggleButtonData() {
        const instance = Template.instance();
        return {
            toggleable: true,
            key: 'leftSidebar',
            value: instance.data.state,
            options: [{
                value: 'studies',
                svgLink: '/packages/ohif_viewerbase/assets/icons.svg#icon-studies',
                svgWidth: 15,
                svgHeight: 13,
                bottomLabel: TAPi18n.__('toolbar.studies')           
                 }]
        };
    },

    rightSidebarToggleButtonData() {
        const instance = Template.instance();
        return {
            toggleable: true,
            key: 'rightSidebar',
            value: instance.data.state,
            options: [{
                value: 'measurements',
                svgLink: '/packages/ohif_viewerbase/assets/icons.svg#icon-measurements-lesions',
                svgWidth: 18,
                svgHeight: 10,
                bottomLabel: TAPi18n.__('toolbar.measurements')
            }]
        };
    },

    toolbarButtons() {
        // Check if the measure tools shall be disabled
        const isToolDisabled = false; //!Template.instance().data.timepointApi;

        const targetSubTools = [];

        targetSubTools.push({
            id: 'bidirectional',
            title: TAPi18n.__('toolbar.bidirectional'),
            classes: 'imageViewerTool rm-l-3',
            svgLink: '/packages/ohif_viewerbase/assets/icons.svg#icon-tools-measure-target',
            disabled: isToolDisabled
        });

        targetSubTools.push({
            id: 'targetCR',
            title: TAPi18n.__('toolbar.crTarget'),
            classes: 'imageViewerTool',
            svgLink: '/packages/ohif_viewerbase/assets/icons.svg#icon-tools-measure-target-cr',
            disabled: isToolDisabled
        });

        targetSubTools.push({
            id: 'targetUN',
            title: TAPi18n.__('toolbar.unTarget'),
            classes: 'imageViewerTool',
            svgLink: '/packages/ohif_viewerbase/assets/icons.svg#icon-tools-measure-target-un',
            disabled: isToolDisabled
        });

        const extraTools = [];

        extraTools.push({
            id: 'stackScroll',
            title: TAPi18n.__('toolbar.stackScroll'),
            classes: 'imageViewerTool',
            svgLink: '/packages/ohif_viewerbase/assets/icons.svg#icon-tools-stack-scroll'
        });

        extraTools.push({
            id: 'resetViewport',
            title: TAPi18n.__('toolbar.reset'),
            classes: 'imageViewerCommand',
            svgLink: '/packages/ohif_viewerbase/assets/icons.svg#icon-tools-reset'
        });

        extraTools.push({
            id: 'rotateR',
            title: TAPi18n.__('toolbar.rotateRight'),
            classes: 'imageViewerCommand',
            svgLink: '/packages/ohif_viewerbase/assets/icons.svg#icon-tools-rotate-right'
        });

        extraTools.push({
            id: 'flipH',
            title: TAPi18n.__('toolbar.flipH'),
            classes: 'imageViewerCommand',
            svgLink: '/packages/ohif_viewerbase/assets/icons.svg#icon-tools-flip-horizontal'
        });

        extraTools.push({
            id: 'flipV',
            title: TAPi18n.__('toolbar.flipV'),
            classes: 'imageViewerCommand',
            svgLink: '/packages/ohif_viewerbase/assets/icons.svg#icon-tools-flip-vertical'
        });

        extraTools.push({
            id: 'invert',
            title: TAPi18n.__('toolbar.invert'),
            classes: 'imageViewerCommand',
            svgLink: '/packages/ohif_viewerbase/assets/icons.svg#icon-tools-invert'
        });

        extraTools.push({
            id: 'magnify',
            title: TAPi18n.__('toolbar.magnify'),
            classes: 'imageViewerTool',
            svgLink: '/packages/ohif_viewerbase/assets/icons.svg#icon-tools-magnify'
        });

        extraTools.push({
            id: 'ellipticalRoi',
            title: TAPi18n.__('toolbar.ellipse'),
            classes: 'imageViewerTool',
            svgLink: '/packages/ohif_viewerbase/assets/icons.svg#icon-tools-elliptical-roi'
        });

        extraTools.push({
            id: 'toggleDownloadDialog',
            title: TAPi18n.__('toolbar.download'),
            classes: 'imageViewerCommand',
            iconClasses: 'fa fa-camera',
            active: () => $('#imageDownloadDialog').is(':visible')
        });

        extraTools.push({
            id: 'toggleCineDialog',
            title: TAPi18n.__('toolbar.cine'),
            classes: 'imageViewerCommand',
            iconClasses: 'fa fa-youtube-play',
            active: () => $('#cineDialog').is(':visible')
        });

        const buttonData = [];

        buttonData.push({
            id: 'zoom',
            title: TAPi18n.__('toolbar.zoom'),
            classes: 'imageViewerTool',
            svgLink: '/packages/ohif_viewerbase/assets/icons.svg#icon-tools-zoom'
        });

        buttonData.push({
            id: 'wwwc',
            title: TAPi18n.__('toolbar.levels'),
            classes: 'imageViewerTool',
            svgLink: '/packages/ohif_viewerbase/assets/icons.svg#icon-tools-levels'
        });

        buttonData.push({
            id: 'pan',
            title: TAPi18n.__('toolbar.pan'),
            classes: 'imageViewerTool',
            svgLink: '/packages/ohif_viewerbase/assets/icons.svg#icon-tools-pan'
        });

        buttonData.push({
            id: 'linkStackScroll',
            title: TAPi18n.__('toolbar.link'),
            classes: 'imageViewerCommand toolbarSectionButton nonAutoDisableState',
            svgLink: '/packages/ohif_viewerbase/assets/icons.svg#icon-tools-link',
            disableFunction: Viewerbase.viewportUtils.isStackScrollLinkingDisabled
        });

        buttonData.push({
            id: 'toggleTarget',
            title: TAPi18n.__('toolbar.target'),
            classes: 'rm-l-3',
            svgLink: '/packages/ohif_viewerbase/assets/icons.svg#icon-tools-measure-target',
            disabled: isToolDisabled,
            subTools: targetSubTools
        });

        buttonData.push({
            id: 'nonTarget',
            title: 'Non-Target',
            classes: 'imageViewerTool',
            svgLink: '/packages/ohif_viewerbase/assets/icons.svg#icon-tools-measure-non-target',
            disabled: isToolDisabled
        });

        buttonData.push({
            id: 'length',
            title: 'Temp',
            classes: 'imageViewerTool',
            svgLink: '/packages/ohif_viewerbase/assets/icons.svg#icon-tools-measure-temp'
        });

        buttonData.push({
            id: 'toggleMore',
            title: TAPi18n.__('toolbar.more'),
            classes: 'rp-x-1 rm-l-3',
            svgLink: '/packages/ohif_viewerbase/assets/icons.svg#icon-tools-more',
            disabled: isToolDisabled,
            subTools: extraTools
        });


        Template.toolbarSection.onCreated( function() {
       const instance = Template.instance();
        instance.path = 'viewer.studyViewer.measurements';
        instance.saveObserver = new Tracker.Dependency();
        instance.api = {
                save() {
                    // Clear signaled unsaved changes...
                        const successHandler = () => {
                            OHIF.ui.unsavedChanges.clear(`${instance.path}.*`);
                            instance.saveObserver.changed();
                        };

                        // Display the error messages
                            const errorHandler = data => {
                            OHIF.ui.showDialog('dialogInfo', Object.assign({ class: 'themed' }, data));
                        };

                        const promise = instance.data.measurementApi.storeMeasurements();
                    promise.then(successHandler).catch(errorHandler);
                    OHIF.ui.showDialog('dialogLoading', {
                            promise,
                            text: 'Saving measurement data'
                 });

                    return promise;
                }
        };

        instance.unsavedChangesHandler = () => {
                const isNotDisabled = !instance.$('.js-finish-case').hasClass('disabled');
                if (isNotDisabled && instance.progressPercent.get() === 100) {
                    instance.api.save();
                }
            };

            // Attach handler for unsaved changes dialog...
                OHIF.ui.unsavedChanges.attachHandler(instance.path, 'save', instance.unsavedChangesHandler);
    });


        return buttonData;
    }
});

Template.toolbarSection.events({
    'click #toggleTarget'(event, instance) {
        const $target = $(event.currentTarget);
        if (!$target.hasClass('active') && $target.hasClass('expanded')) {
            Viewerbase.toolManager.setActiveTool('bidirectional');
        }
    },
    'click #divDocuments'(event){
        if($('#modalAuto').css("display") != "block")
            $("#modalDocumentos").modal('show');
    },

    'click .enlaceDocumento'(event){
        const target = $(event.currentTarget);
        window.open(target.data("url"));

    },

    'click #toggleHUD'(event) {
        const $this = $(event.currentTarget);

        // Stop here if the tool is disabled
        if ($this.hasClass('disabled')) {
            return;
        }

        const state = Session.get('measurementTableHudOpen');
        Session.set('measurementTableHudOpen', !state);
    },

    'click #toggleTrial'(event) {
        if (!$(event.currentTarget).hasClass('disabled')) {
            OHIF.ui.showDialog('trialOptionsModal');
        }
    }
});

Template.toolbarSection.onCreated( function() {
    const instance = Template.instance();

    instance.path = 'viewer.studyViewer.measurements';
    instance.saveObserver = new Tracker.Dependency();
    instance.api = {
        save() {
            // Clear signaled unsaved changes...
            const successHandler = () => {
                OHIF.ui.unsavedChanges.clear(`${instance.path}.*`);
                instance.saveObserver.changed();
            };
    
            // Display the error messages
            const errorHandler = data => {
                OHIF.ui.showDialog('dialogInfo', Object.assign({ class: 'themed' }, data));
            };
    
            const promise = instance.data.measurementApi.storeMeasurements();
            promise.then(successHandler).catch(errorHandler);
            OHIF.ui.showDialog('dialogLoading', {
                promise,
                text: 'Saving measurement data'
            });
    
            return promise;
        }
    };

    instance.unsavedChangesHandler = () => {
        const isNotDisabled = !instance.$('.js-finish-case').hasClass('disabled');
        if (isNotDisabled && instance.progressPercent.get() === 100) {
            instance.api.save();
        }
    };

    // Attach handler for unsaved changes dialog...
    OHIF.ui.unsavedChanges.attachHandler(instance.path, 'save', instance.unsavedChangesHandler);
});

Template.toolbarSection.onRendered(function() {
    const instance = Template.instance();

    // Set disabled/enabled tool buttons that are set in toolManager
    const states = Viewerbase.toolManager.getToolDefaultStates();
    const disabledToolButtons = states.disabledToolButtons;
    const allToolbarButtons = $('.toolbarSection').find('.toolbarSectionButton:not(.nonAutoDisableState)');
    var numeroDocumentos=0;
    $("#bodyModalDocuments").empty();
    instance.data.studies[0].seriesList.forEach((serie) => {
        if(serie.modality=="SR" || serie.modality=="DOC") {
            $("#bodyModalDocuments").append(
            "<div class='row' style='margin-top: 0.5em;margin-bottom: 0.5em'>" +
                "<div class='col-lg-1 col-lg-offset-2'>"+serie.modality+"</div>"+
                "<div class='col-lg-4'>"+serie.seriesDescription+"</div>"+
                "<div class='col-lg-3 '>"+
                    "<button style='background-color: darkorange;color: black' class='btn btn-xs enlaceDocumento col-lg-12' data-url='http://localhost:8080/rid/IHERetrieveDocument?requestType=DOCUMENT&documentUID=" + serie.instances[0].sopInstanceUid + "&preferredContentType=application/pdf'>"+TAPi18n.__('open')+"</button> "+
                "</div>"+
            "</div>"
            );
            numeroDocumentos++;
        }
    });
    $("#numberDocuments").text(numeroDocumentos);

    // Additional toolbar buttons whose classes are not toolbarSectionButton
    allToolbarButtons.push($('#toolbarSectionEntry')[0]);
    allToolbarButtons.push($('#toggleMeasurements')[0]);

    if (disabledToolButtons && disabledToolButtons.length > 0) {
        for (let i = 0; i < allToolbarButtons.length; i++) {
            const toolbarButton = allToolbarButtons[i];
            const index = disabledToolButtons.indexOf($(toolbarButton).attr('id'));
            if (index !== -1) {
                $(toolbarButton).addClass('disabled');
                $(toolbarButton).find('*').addClass('disabled');
            } else {
                $(toolbarButton).removeClass('disabled');
                $(toolbarButton).find('*').removeClass('disabled');
            }
        }
    }
});

Template.caseProgress.onDestroyed(() => {
    const instance = Template.instance();
    // Remove unsaved changes handler after this view has been destroyed...
    OHIF.ui.unsavedChanges.removeHandler(instance.path, 'save', instance.unsavedChangesHandler);
});
