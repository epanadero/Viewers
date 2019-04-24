import { Meteor } from 'meteor/meteor';
import { Router } from 'meteor/clinical:router';
import { OHIF } from 'meteor/ohif:core';
import {Session} from "meteor/session";
import { moment } from 'meteor/momentjs:moment';

var APP_NAME=Meteor.settings.public.appNameLesionTracker;


Router.configure({
    loadingTemplate: 'loading',
    layoutTemplate: 'layout'
});

// If we are running a disconnected client similar to the StandaloneViewer
// (see https://docs.ohif.org/standalone-viewer/usage.html) we don't want
// our routes to get stuck while waiting for Pub / Sub.
//
// In this case, the developer is required to add Servers and specify
// a CurrentServer with some other approach (e.g. a separate script).
if (Meteor.settings &-&
    Meteor.settings.public &&
    Meteor.settings.public.clientOnly !== true) {
    Router.waitOn(function() {
        return [
            Meteor.subscribe('servers'),
            Meteor.subscribe('currentServer')
        ];
    });
}

Router.onBeforeAction('loading');

Router.onBeforeAction(function() {
    // verifyEmail controls whether emailVerification template will be rendered or not
    //const publicSettings = Meteor.settings && Meteor.settings.public;
    //const verifyEmail = publicSettings && publicSettings.verifyEmail || false;
    const userLogin=Session.get('userLogin');
    const timeNow=moment();
    const timeLastAction=Session.get('lastAction');

    // Check if user is signed in or needs an email verification
    /*if (!Meteor.userId() && !Meteor.loggingIn()) {
        this.render('entrySignIn');
    } else if (verifyEmail && Meteor.user().emails && !Meteor.user().emails[0].verified) {
        this.render('emailVerification');
    } else {*/
    if (!userLogin || (timeNow.subtract(60,'minutes')>timeLastAction)) {
        this.render('login');
    } else {
        console.log("Usuario loegado : " + userLogin);


        this.next();
    }
}, {
    except: ['logout','viewerStudiesWithLogin']
});

Router.route(APP_NAME+'/', function() {
    Router.go('studylist', {}, { replaceState: true });
}, { name: 'home' });


Router.route(APP_NAME+'/logout', function() {

    Session.clear('userLogin');
    //delete Session.clearPersistent();
    Router.go('login', {}, { replaceState: true });
},{name:'logout'});

Router.route(APP_NAME+'/login', function(url) {
    this.render('login');
},{name:'login'});



Router.route(APP_NAME+'/studylist', {
    name: 'studylist',
    onBeforeAction: function() {
        const next = this.next;

        // Retrieve the timepoints data to display in studylist
        const promise = OHIF.studylist.timepointApi.retrieveTimepoints({});
        promise.then(() => next());
    },
    action: function() {
        this.render('app', { data: { template: 'studylist' } });
    }
});

Router.route(APP_NAME+'/viewer/timepoints/:timepointId', function() {
    const timepointId = this.params.timepointId;
    OHIF.viewerbase.renderViewer(this, { timepointId });
}, { name: 'viewerTimepoint' });

Router.route(APP_NAME+'/viewer/studies/:studyInstanceUids', function() {
    const studyInstanceUids = this.params.studyInstanceUids.split(';');
    OHIF.viewerbase.renderViewer(this, { studyInstanceUids });
}, { name: 'viewerStudies' });

Router.route(APP_NAME+'/study/:studyInstanceUid/series/:seriesInstanceUids', function () {
    const studyInstanceUids = this.params.studyInstanceUids.split(';');
    const user = this.params.userInstance;
    const password = this.params.passwordInstance;
    var thisRouter=this;
    validarUsuario(user,password)
        .then(function () {
            OHIF.viewerbase.renderViewer(thisRouter, { studyInstanceUids });
        })
        .catch(function () {
            thisRouter.render('login');
        });
}, { name: 'viewerStudiesWithLogin' });


// OHIF #98 Show specific series of study
Router.route('/study/:studyInstanceUid/series/:seriesInstanceUids', function () {
    const studyInstanceUid = this.params.studyInstanceUid;
    const seriesInstanceUids = this.params.seriesInstanceUids.split(';');
    OHIF.viewerbase.renderViewer(this, { studyInstanceUids: [studyInstanceUid], seriesInstanceUids });
}, { name: 'viewerSeries' });

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
                        Session.setPersistent('userLogin', user);

                        resolve(true);
                    }
                }
            );
        });
};
