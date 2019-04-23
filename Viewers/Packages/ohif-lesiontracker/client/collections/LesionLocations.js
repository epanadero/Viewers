import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { TAPi18n } from 'meteor/tap:i18n';

const LocationSchema = new SimpleSchema({
    id: {
        type: String,
        label: 'Location ID'
    },
    location: {
        type: String,
        label: 'Location Name'
    },
    selected: {
        type: Boolean,
        label: 'Selected',
        defaultValue: false
    },
    isNodal: {
        type: Boolean,
        label: 'Nodal Location',
        defaultValue: false
    }
});

LesionLocations = new Meteor.Collection(null);
LesionLocations.attachSchema(LocationSchema);
LesionLocations._debugName = 'LesionLocations';

var organGroups = [
    TAPi18n.__('organ.abdomen'),
    TAPi18n.__('organ.adrenal'),
    TAPi18n.__('organ.bladder'),
    TAPi18n.__('organ.bone'),
    TAPi18n.__('organ.brain'),
    TAPi18n.__('organ.breast'),
    TAPi18n.__('organ.colon'),
    TAPi18n.__('organ.esophagus'),
    TAPi18n.__('organ.extremities'),
    TAPi18n.__('organ.gallbladder'),
    TAPi18n.__('organ.kidney'),
    TAPi18n.__('organ.liver'),
    TAPi18n.__('organ.lung'),
    TAPi18n.__('organ.lymph'),
    TAPi18n.__('organ.mediastinum'),
    TAPi18n.__('organ.muscle'),
    TAPi18n.__('organ.neck'),
    TAPi18n.__('organ.softTissue'),
    TAPi18n.__('organ.ovary'),
    TAPi18n.__('organ.pancreas'),
    TAPi18n.__('organ.pelvis'),
    TAPi18n.__('organ.peritoneum'),
    TAPi18n.__('organ.prostate'),
    TAPi18n.__('organ.retroperitoneum'),
    TAPi18n.__('organ.bowel'),
    TAPi18n.__('organ.spleen'),
    TAPi18n.__('organ.stomach'),
    TAPi18n.__('organ.subcutaneous')];


function nameToID(name) {
    // http://stackoverflow.com/questions/29258016/remove-special-symbols-and-extra-spaces-and-make-it-camel-case-javascript
    return name
        .trim() //might need polyfill if you need to support older browsers
        .toLowerCase() //lower case everything
        .replace(/([^A-Z0-9]+)(.)/ig, //match multiple non-letter/numbers followed by any character
            function(match) {
                return arguments[2].toUpperCase(); //3rd index is the character we need to transform uppercase
            }
        );
}

organGroups.forEach(function(organGroup) {
    const id = nameToID(organGroup);

    // Check if the name has 'node' in it, if so, it is nodal
    let isNodal = false;
    if (id.toLowerCase().indexOf('node') > -1) {
        isNodal = true;
    }

    LesionLocations.insert({
        id: id,
        location: organGroup,
        selected: false,
        isNodal: isNodal
    });
});

export { LesionLocations };
