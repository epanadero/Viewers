import { OHIF } from 'meteor/ohif:core';

Meteor.methods({
    'findUser':function () {
        OHIF.mysql.conMysql();
    }

});
