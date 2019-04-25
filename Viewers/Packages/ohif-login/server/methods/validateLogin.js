import { OHIF } from 'meteor/ohif:core';
import { $ } from 'meteor/jquery';
import { Router } from 'meteor/clinical:router';
import { Promise } from 'meteor/promise';

Meteor.methods({
     async validateUser (args) {
        console.log("Validar USUARIO : " + args.user + "  PASSWORD :" + args.password + " ENCRIPTADO :" + args.encriptado);
        var resultado=false;
        if(!args.encriptado) {
            var crypto = require("crypto");
            var hashed = crypto.createHash("sha256");
            hashed.update(args.password, "utf-8");
            args.password = hashed.digest("hex");
        }
        Promise.await(OHIF.MysqlUtils.getUser(args.user,args.password)
            .then(function (data) {
                console.log("Usuario encontrado,login validado");
                resultado=true;
            })
            .catch(function (error) {
                throw new Meteor.Error(error.error, error.reason);
            }));
        return resultado;
    }
});


