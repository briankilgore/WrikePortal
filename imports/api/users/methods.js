import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

export const updateUserProfile = new ValidatedMethod({
    name: 'users.updateProfile',
    validate: new SimpleSchema({
        firstName: { type: String, label: "User first name" },
        lastName: { type: String, label: "User last name" },
        phoneNumber: { type: String, label: "User phone number", optional: true }
    }).validator({ clean: true }),
    run({ firstName, lastName, phoneNumber, club }) {
        if(this.userId) {
            Meteor.users.update({_id: this.userId}, {$set: {
                firstName: firstName,
                lastName: lastName,
                phoneNumber: phoneNumber
            }});
        }
        else {
            throw new Meteor.Error("access-denied", "Only logged in users may update their profile");
        }
    }
});

export const setImageId = new ValidatedMethod({
    name: 'users.setImageId',
    validate: new SimpleSchema({
        imageId: { type: String, label: "ID of uploaded image", optional: true }
    }).validator({ clean: true }),
    run({ imageId }) {
        if(this.userId) {
            Meteor.users.update({_id: this.userId}, {$set: {imageId: imageId}});
        }
        else {
            throw new Meteor.Error("access-denied", "Only logged in users may update their profile");
        }
    }
});