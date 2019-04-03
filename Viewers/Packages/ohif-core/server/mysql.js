import { OHIF } from 'meteor/ohif:core';
import './configMysql.js';
import {Meteor} from "meteor/meteor";


class MysqlUtils {

    static getUser(user,password){
        return new Promise(
            function (resolve,reject) {
                console.log("Validar USUARIO : " + user + "  PASSWORD :" + password);
                var mysql = require('mysql');
                var con = mysql.createConnection({
                    host: Meteor.mysqlHost,
                    user: Meteor.mysqlUser,
                    password: Meteor.mysqlPassword,
                    port :  Meteor.mysqlPort,
                    database : Meteor.mysqlDatabase
                });
                con.connect(function(err) {
                    if (err)
                        reject(new Meteor.Error('error-access-db', "Error al conectar con la base de datos de usuarios."));
                    console.log("Conectado a la BBDD!");
                });
                var query = con.query("SELECT * FROM Usuario WHERE nombre=? AND password=?", [user,password], function(error, result){
                    if(error){
                        console.log("ERROR EN LA CONSULTA SQL: "+error.message);
                        con.destroy();
                        reject(new Meteor.Error('error-select', "Se ha producido un error al consultar el usuario."));
                    }
                    else{
                        if(result.length==0) {
                            console.log("USUARIO NO ENCONTRADO");
                            con.destroy();
                            reject(new Meteor.Error('user-not-found', "Usuario/contraseña no válidos."));
                        }
                        else {
                            con.destroy();
                            resolve(result);
                        }
                    }
                });
            }
        );
    }


}

OHIF.MysqlUtils = MysqlUtils;