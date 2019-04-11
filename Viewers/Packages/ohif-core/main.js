import { Meteor } from 'meteor/meteor';

/*
 * Defines the base OHIF object
 */

const OHIF = {
    log: {},
    ui: {},
    utils: {},
    viewer: {},
    cornerstone: {},
    user: {},
    DICOMWeb: {}, // Temporarily added
    mysql: {}
};

// Expose the OHIF object to the client if it is on development mode
// @TODO: remove this after applying namespace to this package
if (Meteor.isClient) {
    OHIF.mysql.conMysql = function (){
        // Throw error if there is no user logged in
        var mysql = require('mysql');
        var con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "panadero",
            port : "3306"
        });
        con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
        });
    }


    window.OHIF = OHIF;
}

if (Meteor.isServer) {

    console.log("Meteor isServer");
    
}


export { OHIF };