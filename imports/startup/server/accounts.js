import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

//some custom profile fields to store when creating new users
Accounts.onCreateUser((options, user) => {
    user.firstName = options.firstName;
    user.lastName = options.lastName;
    user.accountId = options.accountId;

    return user;
});

/* options:
    type            (String)    The service name, such as "password" or "twitter".
    allowed         (Boolean)   Whether this login is allowed and will be successful.
    error           (Error)     When allowed is false, the exception describing why the login failed.
    user            (Object)    When it is known which user was attempting to login, the Meteor user object.
    connection      (Object)    The connection object the request came in on.
    methodName      (String)    The name of the Meteor method being used to login.
    methodArguments (Array)     An array of the arguments passed to the login method
*/
Accounts.validateLoginAttempt(function(options) {
    // console.log("validateLoginAttempt", options);
    // If the login has failed, just return false.
    if(!options.allowed) {
        return false;
    }

    if(options.user.emails[0].verified === true) {
        return true;
    } 
    else {
        throw new Meteor.Error('email-not-verified', 'You must verify your email address before you can log in');
    }

});

//setup Accounts related emailTemplates
Accounts.emailTemplates.siteName = "Kilgore Design";
Accounts.emailTemplates.from     = "Kilgore Design <info@kilgoredesign.com>";

Accounts.emailTemplates.enrollAccount = {
    subject() {
        return "Welcome to Kilgore Design!";
    },
    text( user, url ) {
        SSR.compileTemplate('welcomeEmailText', Assets.getText('emailtemplates/enroll-account/enroll-account.txt'));

        let emailData = {
            name: user.firstName,
            emailAddress: user.emails[0].address,
            verificationLink: url.replace( '#/', '' ),
            supportEmail: "support@kilgoredesign.com"
        };

        return SSR.render('welcomeEmailText', emailData);
    },
    html( user, url ) {
        SSR.compileTemplate('welcomeEmail', Assets.getText('emailtemplates/enroll-account/enroll-account.html'));

        let emailData = {
            name: user.firstName,
            emailAddress: user.emails[0].address,
            verificationLink: url.replace( '#/', '' ),
            supportEmail: "support@kilgoredesign.com"
        };

        return SSR.render('welcomeEmail', emailData);
    }
};

Accounts.emailTemplates.verifyEmail = {
    subject() {
        return "Welcome to Kilgore Design!";
    },
    text( user, url ) {
        SSR.compileTemplate('welcomeEmailText', Assets.getText('emailtemplates/welcome/welcome.txt'));

        let emailData = {
            name: user.firstName,
            emailAddress: user.emails[0].address,
            verificationLink: url.replace( '#/', '' ),
            supportEmail: "support@kilgoredesign.com"
        };

        return SSR.render('welcomeEmailText', emailData);
    },
    html( user, url ) {
        SSR.compileTemplate('welcomeEmail', Assets.getText('emailtemplates/welcome/welcome.html'));

        let emailData = {
            name: user.firstName,
            emailAddress: user.emails[0].address,
            verificationLink: url.replace( '#/', '' ),
            supportEmail: "support@kilgoredesign.com"
        };

        return SSR.render('welcomeEmail', emailData);
    }
};

Accounts.emailTemplates.resetPassword = {
    subject() {
        return "[Kilgore Design] Reset Password";
    },
    text( user, url ) {
        SSR.compileTemplate('resetPasswordText', Assets.getText('emailtemplates/reset-password/reset-password.txt'));

        let emailData = {
            name: user.firstName,
            emailAddress: user.emails[0].address,
            resetPasswordLink: url.replace( '#/', '' ),
            supportEmail: "support@kilgoredesign.com"
        };

        return SSR.render('resetPasswordText', emailData);
    },
    html( user, url ) {
        SSR.compileTemplate('resetPasswordHTML', Assets.getText('emailtemplates/reset-password/reset-password.html'));

        let emailData = {
            name: user.firstName,
            emailAddress: user.emails[0].address,
            resetPasswordLink: url.replace( '#/', '' ),
            supportEmail: "support@kilgoredesign.com"
        };

        return SSR.render('resetPasswordHTML', emailData);
    }
};