import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

export const createUser = new ValidatedMethod({
    name: 'users.createUser',
    validate: new SimpleSchema({
        email: { type: String, regEx: SimpleSchema.RegEx.Email, label: "User email address" },
        firstName: { type: String, label: "User first name" },
        lastName: { type: String, label: "User last name" }
    }).validator({ clean: true }),
    run({ email, firstName, lastName }) {
        //TODO add security checks???

        let userId = Accounts.createUser({
            email: email,
            firstName: firstName,
            lastName: lastName
        });

        try {
            Accounts.sendEnrollmentEmail(userId);
        }
        catch(e) {
            console.log(e);
            throw new Meteor.Error('error-sending', 'Unable to send verification email. Please contact support at support@opentrainer.us');
        }
    }
});