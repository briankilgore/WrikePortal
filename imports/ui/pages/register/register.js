import './register.html';

Template.Register.events({
    'submit form[name="registrationForm"]'(event) {
        event.preventDefault();
        let form = event.target;
        handleCreateUser(form, function(err, res) {
            if(err) {
                sAlert.error(err.message);
            }
            else {
                FlowRouter.go("/");
                sAlert.info("Please check your email to verify your account");
            }
        });
    }
});

function handleCreateUser(data, complete) {
    let user = {
        firstName: data.firstName.value,
        lastName: data.lastName.value,
        email: data.email.value,
        password: data.password.value
    };

    Meteor.call('users.createUser', user, (error, response) => {
        complete(error, response);
    });
}