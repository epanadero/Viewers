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
    mysql:{}
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
            password: "tornelo",
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

    OHIF.mysql.conMysql = function (){
        // Throw error if there is no user logged in
        var mysql = require('mysql');
        var con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "tornelo",
            port : "3306",
            database : "tmis"
        });
        con.connect(function(err) {
            if (err)
                throw err;
            console.log("Conectado a la BBDD!");
        });
        var query = con.query('SELECT * FROM Usuario', [], function(error, result){
            if(error){
                throw error;
            }else{
                var resultado = result;
                if(resultado.length > 0){
                    console.log('Numero de usuarios ' + result.length);
                }else{
                    console.log('Registro no encontrado');
                }
            }
        });
    }
    OHIF.mysql.conMysql();
}


export { OHIF };
