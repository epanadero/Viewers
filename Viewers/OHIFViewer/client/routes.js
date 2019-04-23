import { Meteor } from "meteor/meteor";
import { Router } from 'meteor/clinical:router';
import { OHIF } from 'meteor/ohif:core';
import { moment } from 'meteor/momentjs:moment';

Router.configure({
    layoutTemplate: 'layout',
});


// If we are running a disconnected client similar to the StandaloneViewer
// (see https://docs.ohif.org/standalone-viewer/usage.html) we don't want
// our routes to get stuck while waiting for Pub / Sub.
//
// In this case, the developer is required to add Servers and specify
// a CurrentServer with some other approach (e.g. a separate script).
if (Meteor.settings &&
    Meteor.settings.public &&
    Meteor.settings.public.clientOnly !== true) {
    Router.waitOn(function() {
        return [
            Meteor.subscribe('servers'),
            Meteor.subscribe('currentServer')
        ];
    });
}

console.log(Meteor.settings);


/*Router.onBeforeAction(function() {
    // verifyEmail controls whether emailVerification template will be rendered or not
    const publicSettings = Meteor.settings && Meteor.settings.public;
    const verifyEmail = publicSettings && publicSettings.verifyEmail || false;

    // Check if user is signed in or needs an email verification
    if (!Meteor.userId() && !Meteor.loggingIn()) {
        this.render('entrySignIn');
    } else if (verifyEmail && Meteor.user().emails && !Meteor.user().emails[0].verified) {
        this.render('emailVerification');
    } else {
        this.next();
    }
}, {
    except: ['entrySignIn', 'entrySignUp', 'forgotPassword', 'resetPassword', 'emailVerification']
});*/



Router.onBeforeAction('loading');

/*Router.onBeforeAction(function() {
    // verifyEmail controls whether emailVerification template will be rendered or not
    console.log('Entra onBeforeAction');

    const userLogin=Session.get('userLogin');
    const timeNow=moment();
    const timeLastAction=Session.get('lastAction');

    // Check if user is signed in or needs an email verification
    if (!userLogin || (timeNow.subtract(60,'minutes')>timeLastAction)) {
        this.render('login');

    } else {
        console.log("Usuario loegado : " + userLogin);
        this.next();
    }
}, {
    except: ['logout','viewerStudiesWithLogin']
});*/



Router.route('/', function() {
    Router.go('studylist', {}, { replaceState: true });
}, { name: 'home' });

Router.route('/studylist', function() {
    this.render('ohifViewer', { data: { template: 'studylist' } });
}, { name: 'studylist' });

Router.route('/viewer/:studyInstanceUids', function() {
    const studyInstanceUids = this.params.studyInstanceUids.split(';');
    OHIF.viewerbase.renderViewer(this, { studyInstanceUids }, 'ohifViewer');
}, { name: 'viewerStudies' });

// OHIF #98 Show specific series of study
Router.route('/study/:studyInstanceUid/series/:seriesInstanceUids', function () {
    const studyInstanceUid = this.params.studyInstanceUid;
    const seriesInstanceUids = this.params.seriesInstanceUids.split(';');
    OHIF.viewerbase.renderViewer(this, { studyInstanceUids: [studyInstanceUid], seriesInstanceUids }, 'ohifViewer');
}, { name: 'viewerSeries' });

Router.route('/IHEInvokeImageDisplay', function() {
    const requestType = this.params.query.requestType;

    if (requestType === "STUDY") {
        const studyInstanceUids = this.params.query.studyUID.split(';');

        OHIF.viewerbase.renderViewer(this, {studyInstanceUids}, 'ohifViewer');
    } else if (requestType === "STUDYBASE64") {
        const uids = this.params.query.studyUID;
        const decodedData = window.atob(uids);
        const studyInstanceUids = decodedData.split(';');

        OHIF.viewerbase.renderViewer(this, {studyInstanceUids}, 'ohifViewer');
    } else if (requestType === "PATIENT") {
        const patientUids = this.params.query.patientID.split(';');

        Router.go('studylist', {}, {replaceState: true});
    } else {
        Router.go('studylist', {}, {replaceState: true});
    }
});

function validarUsuario(user,password)
{
    return new Promise(
        function (resolve, reject) {
            Meteor.call('validateUser',{user:user,password:password,encriptado:true},
                (error, result) => {
                    if (error) {
                        reject(Meteor.Error(error.error, error.message));
                    }
                        if(result) {
                            Session.setPersistent("lastAction",moment().toDate());
                            Session.setPersistent('userLogin', user);
                            resolve(true);
                    }
                }
            );
        });
};
