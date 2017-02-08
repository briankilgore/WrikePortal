import './login.html';

Template.Login.events({
    'submit #loginForm'(event) {
        event.preventDefault();
        var form = event.target;
        handleLogin(form);
    }
});

function handleLogin(data) {
    let user = data.email.value;
    let password = data.password.value;
    Meteor.loginWithPassword(user, password, function(response) {
        if(response && response.error) {
            sAlert.error(response.reason);
        }
        else {
            FlowRouter.go('/');
        }
    });
}