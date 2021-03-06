Package.describe({
    name: 'ohif:login',
    summary: 'OHIF Login',
    version: '0.0.1'
});

Npm.depends({
    loglevel: '1.4.1'
});

Package.onUse(function(api) {
    api.versionsFrom('1.4');

    api.use('ecmascript');
    api.use('standard-app-packages');
    api.use('clinical:router@2.0.19', ["client", "server"]);
    api.use(["tap:i18n"], ["client", "server"]);
    api.use('stylus');

    // Our custom packages
    api.use('ohif:design');
    api.use('ohif:core');
    api.use('ohif:log');
    api.use('ohif:servers');
    api.use('ohif:dicom-services');
    api.use('ohif:viewerbase');
    api.use('ohif:wadoproxy');
    api.use('ohif:studies');
    api.use('jquery',["client", "server"]);
    api.use

    //api.addFiles('client/index.js', 'client');

  api.addFiles([
    'server/index.js',
    'server/methods/validateLogin.js',

  ], ['server']);


  api.addFiles([
    'client/components/login.html',
    'client/components/login.js',
    'client/components/login.styl',
    'client/index.js'
  ], ['client']);

});
