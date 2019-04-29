import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {Session} from 'meteor/session';
import {ReactiveDict} from 'meteor/reactive-dict';
import {moment} from 'meteor/momentjs:moment';
import {OHIF} from 'meteor/ohif:core';
import { Router } from 'meteor/clinical:router';

Template.login.events({



    'keydown input'(event) {
        if (event.which === 13) { //  Enter

                console.log('Entra event.which === 13');

            event.preventDefault();
            validateLogin();
        }
    },
    'click #submitLogin'(event) {

                        console.log('Entra click #submitLogin');

        event.preventDefault();
        validateLogin();
    },
});

function validateLogin() {
    $("#divError").empty();
    if ($.trim($('#txtUser').val()) === "") {
        $("#divError").append("Introduzca un nombre de usuario.");
        return;
    }
    if ($.trim($('#txtPassword').val()) === "") {
        $("#divError").append("Introduzca la contraseña.");
        return;
    }

    Meteor.call('validateUser', {user: $('#txtUser').val(), password: $('#txtPassword').val(), encriptado: false},
        (error, result) => {
            if (error) {
                                        console.log('Entra error' + error);

                $("#divError").append(error.reason);
            }
            if (result) {
                console.log('Entra result' + result);

                Session.setPersistent('userLogin', $("#txtUser").val());
                Session.setPersistent("lastAction",moment().toDate());
                if (window.location.href.match(/login/))
                    Router.go('studylist');
                else
                    window.location;
            }
        }
    );

}