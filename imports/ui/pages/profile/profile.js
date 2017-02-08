import './profile.html';

import { ReactiveDict } from 'meteor/reactive-dict';
import { updateUserProfile } from '../../../api/users/methods.js';
import { setImageId } from '../../../api/users/methods.js';

let data = new ReactiveDict();

Template.Profile.onRendered(function() {
    this.autorun(() => {
        data.set(Template.currentData());
    });
});

Template.Profile.onCreated(function() {
    this.autorun(() => {
        this.subscribe('users.currentUserData');
    });
});

Template.Profile.events({
    "change input[type='file'].upload-photo"(event) {
        const existingImageId = Meteor.user().imageId;
        const files = event.currentTarget.files;

        if(files.length == 0) {
            return;
        }

        if(existingImageId) {
            deleteProfilePic(existingImageId, function(err, res) {
                if(!err) {
                    setImageId.call({ imageId: null}, (error, response) => {
                        if(error) {
                            sAlert.error(error.reason);
                        }
                    });
                }
                sAlert.error(err);
                uploadProfilePic(files, function(err, res) {
                    if(err) {
                        sAlert.error(err);
                    }
                    else {
                        setImageId.call({ imageId: res.public_id}, (error, response) => {
                            if(error) {
                                sAlert.error(error.reason);
                            }
                            else {
                                sAlert.success("Photo uploaded!");
                            }
                        });
                    }
                });
            })
        }
        else {
            uploadProfilePic(files, function(err, res) {
                if(err) {
                    sAlert.error(err);
                }
                else {
                    setImageId.call({ imageId: res.public_id}, (error, response) => {
                        if(error) {
                            sAlert.error(error.reason);
                        }
                        else {
                            sAlert.success("Photo uploaded!");
                        }
                    });
                }
            });
        }
    },
    "submit #personalInfoForm"(event) {
        event.preventDefault();
        var form = event.target;

        let userData = {
            firstName: form.firstName.value,
            lastName: form.lastName.value,
            phoneNumber: form.phoneNumber.value
        };

        handleFormSubmit(userData);
    }
});

Template.Profile.helpers({
    profileData() {
        let user = Meteor.user();

        return {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.emails[0].address,
            phoneNumber: user.phoneNumber,
            imageId: user.imageId
        };
    }
});

function uploadProfilePic(file, complete) {
    Cloudinary.upload(file, {
        folder: "profilepics",
        gravity: "face",
        aspect_ratio: "1:1",
        crop: "fill"
    }, function(err, res) {
        complete(err, res);
    });
}

function deleteProfilePic(imageId, complete) {
    Cloudinary.delete(imageId, function(err, res) {
        complete(err, res);
    });
}

function handleFormSubmit(userData) {
    updateUserProfile.call(userData, (error, response) => {
        if(error) {
            sAlert.error(error.reason);
        }
        else {
            sAlert.success("Saved!");
        }
    });

}