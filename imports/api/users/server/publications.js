import { Meteor } from 'meteor/meteor';

Meteor.publish("users.currentUserData", function () {
    if (this.userId) {
        const fields = {
            'firstName': true,
            'lastName': true,
            'phoneNumber': true,
            'imageId': true
        };

        let user = Meteor.users.find({_id: this.userId}, {fields: fields});
        return user;
    }
    else {
        this.ready();
    }
});