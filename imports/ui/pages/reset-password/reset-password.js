import { Accounts } from 'meteor/accounts-base'

import './reset-password.html';

Template.ResetPassword.onRendered(() => {
    $('body').addClass("gray-bg");
});

Template.ResetPassword.onDestroyed(() => {
    $('body').removeClass("gray-bg");
});

Template.ResetPassword.events({
    'submit #resetPasswordForm'(event) {
        event.preventDefault();

        let form = event.currentTarget;
        let newPassword = form.newPassword.value;
        let confirmPassword = form.confirmPassword.value;
        let token = FlowRouter.getParam('token');

        if(passwordsMatch(newPassword, confirmPassword)) {
            Accounts.resetPassword(token, newPassword, function(err) {
                if(err) {
                    console.error(err);
                    sAlert.error(err.message);
                }
                else {
                    FlowRouter.go("/");
                    sAlert.success("Password updated.");
                }
            });
        }
        else {
            sAlert.error("Passwords do not match. Please re-enter.");
        }
    }
});

function passwordsMatch(newPassword, confirmPassword) {
    if(newPassword == confirmPassword) {
        return true;
    }
    else {
        return false;
    }
}