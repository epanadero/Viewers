import { OHIF } from 'meteor/ohif:core';

Meteor.methods({
    'findUser':function () {
        var crypto = require("crypto");
        var hashed = crypto.createHash("sha256");
        hashed.update("todo","utf-8");
        var hash = hashed.digest("hex");
        console.log("Crypto : " + hash);
        OHIF.MysqlUtils.select('todo',hash);
        return hash;

    }

});
