import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';

import { OHIF } from 'meteor/ohif:core';
import 'meteor/ohif:viewerbase';
import { TAPi18n } from 'meteor/tap:i18n';

function isThereSeries(studies) {
    if (studies.length === 1) {
        const study = studies[0];

        if (study.seriesList && study.seriesList.length > 1) {
            return true;
        }

        if (study.displaySets && study.displaySets.length > 1) {
            return true;
        }
    }

    return false;
}

Template.toolbarSection.events({
    'click #divDocuments'(event){
        if($('#modalAuto').css("display") != "block")
            $("#modalDocumentos").modal('show');
    },
    'click .enlaceDocumento'(event){
        const target = $(event.currentTarget);
        window.open(target.data("url"));

    }
});

Template.toolbarSection.onCreated(() => {
    const instance = Template.instance();

    if (OHIF.uiSettings.leftSidebarOpen) {
        instance.data.state.set('leftSidebar', 'studies');
    }
});

Template.toolbarSection.helpers({
    leftSidebarToggleButtonData() {
        const instance = Template.instance();
        return {
            toggleable: true,
            key: 'leftSidebar',
            value: instance.data.state,
            options: [{
                value: 'studies',
                svgLink: 'packages/ohif_viewerbase/assets/icons.svg#icon-studies',
                svgWidth: 15,
                svgHeight: 13,
                bottomLabel: 'Series'
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
                value: 'hangingprotocols',
                iconClasses: 'fa fa-cog',
                bottomLabel: TAPi18n.__('hanging.hanging')

            }]
        };
    },

    toolbarButtons() {
        const extraTools = [];

        extraTools.push({
            id: 'crosshairs',
            title: TAPi18n.__('toolbar.crosshairs'),
            classes: 'imageViewerTool',
            iconClasses: 'fa fa-crosshairs'
        });

        extraTools.push({
            id: 'magnify',
            title: TAPi18n.__('toolbar.magnify'),
            classes: 'imageViewerTool toolbarSectionButton',
            iconClasses: 'fa fa-circle'
        });

        extraTools.push({
            id: 'wwwcRegion',
            title: TAPi18n.__('toolbar.ROIWindow'),
            classes: 'imageViewerTool',
            iconClasses: 'fa fa-square'
        });

        extraTools.push({
            id: 'dragProbe',
            title: TAPi18n.__('toolbar.probe'),
            classes: 'imageViewerTool',
            iconClasses: 'fa fa-dot-circle-o'
        });

        extraTools.push({
            id: 'ellipticalRoi',
            title: TAPi18n.__('toolbar.ellipse'),
            classes: 'imageViewerTool',
            iconClasses: 'fa fa-circle-o'
        });

        extraTools.push({
            id: 'rectangleRoi',
            title: TAPi18n.__('toolbar.rectangle'),
            classes: 'imageViewerTool',
            iconClasses: 'fa fa-square-o'
        });

        extraTools.push({
            id: 'toggleDownloadDialog',
            title: TAPi18n.__('toolbar.download'),
            classes: 'imageViewerCommand',
            iconClasses: 'fa fa-camera',
            active: () => $('#downloadDialog').is(':visible')
        });

        extraTools.push({
            id: 'invert',
            title: TAPi18n.__('toolbar.invert'),
            classes: 'imageViewerCommand',
            iconClasses: 'fa fa-adjust'
        });

        extraTools.push({
            id: 'rotateR',
            title: TAPi18n.__('toolbar.rotateRight'),
            classes: 'imageViewerCommand',
            svgLink: '/packages/ohif_viewerbase/assets/icons.svg#icon-tools-rotate-right'
        });

        extraTools.push({
            id: 'flipH',
            title: 'Flip H',
            classes: TAPi18n.__('toolbar.flipH'),
            svgLink: '/packages/ohif_viewerbase/assets/icons.svg#icon-tools-flip-horizontal'
        });

        extraTools.push({
            id: 'flipV',
            title: TAPi18n.__('toolbar.flipV'),
            classes: 'imageViewerCommand',
            svgLink: '/packages/ohif_viewerbase/assets/icons.svg#icon-tools-flip-vertical'
        });

        extraTools.push({
            id: 'clearTools',
            title: TAPi18n.__('toolbar.clear'),
            classes: 'imageViewerCommand',
            iconClasses: 'fa fa-trash'
        });

        const buttonData = [];

        buttonData.push({
            id: 'stackScroll',
            title: TAPi18n.__('toolbar.stackScroll'),
            classes: 'imageViewerTool',
            iconClasses: 'fa fa-bars'
        });

        buttonData.push({
            id: 'zoom',
            title: TAPi18n.__('toolbar.zoom'),
            classes: 'imageViewerTool',
            svgLink: 'packages/ohif_viewerbase/assets/icons.svg#icon-tools-zoom'
        });

        buttonData.push({
            id: 'wwwc',
            title: TAPi18n.__('toolbar.levels'),
            classes: 'imageViewerTool',
            svgLink: 'packages/ohif_viewerbase/assets/icons.svg#icon-tools-levels'
        });

        buttonData.push({
            id: 'pan',
            title: TAPi18n.__('toolbar.pan'),
            classes: 'imageViewerTool',
            svgLink: 'packages/ohif_viewerbase/assets/icons.svg#icon-tools-pan'
        });

        buttonData.push({
            id: 'length',
            title: TAPi18n.__('toolbar.length'),
            classes: 'imageViewerTool toolbarSectionButton',
            svgLink: 'packages/ohif_viewerbase/assets/icons.svg#icon-tools-measure-temp'
        });

        buttonData.push({
            id: 'annotate',
            title: TAPi18n.__('toolbar.annotate'),
            classes: 'imageViewerTool',
            svgLink: 'packages/ohif_viewerbase/assets/icons.svg#icon-tools-measure-non-target'
        });

        buttonData.push({
            id: 'angle',
            title: TAPi18n.__('toolbar.angle'),
            classes: 'imageViewerTool',
            iconClasses: 'fa fa-angle-left'
        });

        buttonData.push({
            id: 'resetViewport',
            title: TAPi18n.__('toolbar.reset'),
            classes: 'imageViewerCommand',
            iconClasses: 'fa fa-undo'
        });

        if (!OHIF.uiSettings.displayEchoUltrasoundWorkflow) {

            buttonData.push({
                id: 'previousDisplaySet',
                title: TAPi18n.__('toolbar.previous'),
                classes: 'imageViewerCommand',
                iconClasses: 'fa fa-toggle-up fa-fw'
            });

            buttonData.push({
                id: 'nextDisplaySet',
                title: TAPi18n.__('toolbar.next'),
                classes: 'imageViewerCommand',
                iconClasses: 'fa fa-toggle-down fa-fw'
            });

            const { isPlaying } = OHIF.viewerbase.viewportUtils;
            buttonData.push({
                id: 'toggleCinePlay',
                title: () => isPlaying() ? TAPi18n.__('toolbar.stop') : TAPi18n.__('toolbar.play'),
                classes: 'imageViewerCommand',
                iconClasses: () => ('fa fa-fw ' + (isPlaying() ? 'fa-stop' : 'fa-play')),
                active: isPlaying
            });

            buttonData.push({
                id: 'toggleCineDialog',
                title: TAPi18n.__('toolbar.cine'),
                classes: 'imageViewerCommand',
                iconClasses: 'fa fa-youtube-play',
                active: () => $('#cineDialog').is(':visible')
            });
        }

        buttonData.push({
            id: 'layout',
            title: TAPi18n.__('toolbar.layout'),
            iconClasses: 'fa fa-th-large',
            buttonTemplateName: 'layoutButton'
        });

        /* Plugin testing buttons: Only here temporarily */
        buttonData.push({
            id: 'reload-VolumeRenderingPlugin',
            title: 'Volume Rendering',
            classes: 'imageViewerCommand',
            iconClasses: 'fa fa-road',
        });

        buttonData.push({
            id: 'mprMode',
            title: '4-up',
            classes: 'imageViewerCommand',
            iconClasses: 'fa fa-compress',
        });

        buttonData.push({
            id: 'reload-MultiplanarReformattingPlugin-L',
            title: 'MPR-L',
            classes: 'imageViewerCommand',
            iconClasses: 'fa fa-bookmark',
        });

        buttonData.push({
            id: 'reload-MultiplanarReformattingPlugin-A',
            title: 'MPR-A',
            classes: 'imageViewerCommand',
            iconClasses: 'fa fa-bookmark',
        });

        buttonData.push({
            id: 'reload-MultiplanarReformattingPlugin-S',
            title: 'MPR-S',
            classes: 'imageViewerCommand',
            iconClasses: 'fa fa-bookmark',
        });
        /* Plugin testing buttons: Only here temporarily */

        buttonData.push({
            id: 'toggleMore',
            title: TAPi18n.__('toolbar.more'),
            classes: 'rp-x-1 rm-l-3',
            svgLink: 'packages/ohif_viewerbase/assets/icons.svg#icon-tools-more',
            subTools: extraTools
        });

        return buttonData;
    },

    hangingProtocolButtons() {
        let buttonData = [];

        buttonData.push({
            id: 'previousPresentationGroup',
            title: TAPi18n.__('toolbar.prevStage'),
            iconClasses: 'fa fa-step-backward',
            buttonTemplateName: 'previousPresentationGroupButton'
        });

        buttonData.push({
            id: 'nextPresentationGroup',
            title: TAPi18n.__('toolbar.nextStage'),
            iconClasses: 'fa fa-step-forward',
            buttonTemplateName: 'nextPresentationGroupButton'
        });

        return buttonData;
    }

});

Template.toolbarSection.onRendered(function() {
    const instance = Template.instance();

    instance.$('#layout').dropdown();

    // Set disabled/enabled tool buttons that are set in toolManager
    const states = OHIF.viewerbase.toolManager.getToolDefaultStates();
    const disabledToolButtons = states.disabledToolButtons;
    const allToolbarButtons = $('#toolbar').find('button');
    if (disabledToolButtons && disabledToolButtons.length > 0) {
        for (let i = 0; i < allToolbarButtons.length; i++) {
            const toolbarButton = allToolbarButtons[i];
            $(toolbarButton).prop('disabled', false);

            const index = disabledToolButtons.indexOf($(toolbarButton).attr('id'));
            if (index !== -1) {
                $(toolbarButton).prop('disabled', true);
            }
        }
    }

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
    
});
