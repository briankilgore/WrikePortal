import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Import needed templates
import '../../ui/layouts/authenticated/authenticated.js';
import '../../ui/layouts/nonauthenticated/nonauthenticated.js';
import '../../ui/pages/home/home.js';
import '../../ui/pages/projects/projectslist.js';
import '../../ui/pages/projects/projectsdetail.js';
import '../../ui/pages/profile/profile.js';
import '../../ui/pages/login/login.js';
import '../../ui/pages/register/register.js';
import '../../ui/pages/forgot-password/forgot-password';
import '../../ui/pages/reset-password/reset-password';
import '../../ui/pages/not-found/not-found.js';

//public routes
var Public = FlowRouter.group({});

//private routes
var Private = FlowRouter.group({
    triggersEnter: [
        function () {
            var route;
            if (!(Meteor.loggingIn() || Meteor.userId())) {
                route = FlowRouter.current();
                return FlowRouter.go('login');
            }
        }
    ]
});

// Set up all routes in the app
Private.route('/', {
    name: 'home',
    action() {
        // BlazeLayout.render('AuthenticatedLayout', { main: 'Home' });
        FlowRouter.go("/projects");
    }
});

Private.route('/projects', {
    name: 'projects',
    action() {
        BlazeLayout.render('AuthenticatedLayout', { main: 'ProjectsList' });
    }
});

Private.route('/projects/:projectId', {
    name: 'projects',
    action() {
        BlazeLayout.render('AuthenticatedLayout', { main: 'ProjectsDetail' });
    }
});

Private.route('/profile', {
    name: 'profile',
    action() {
        BlazeLayout.render('AuthenticatedLayout', { main: 'Profile' });
    }
});

Public.route('/login', {
    name: 'login',
    action() {
        BlazeLayout.render('NonAuthenticatedLayout', { main: 'Login' });
    }
});

Private.route('/logout', {
    name: 'logout',
    action() {
        Meteor.logout(function(response) {
            if(response) {
                console.log(response);
            }
            else {
                FlowRouter.go("/");
            }
        });
    }
});

Public.route('/register', {
    name: 'register',
    action() {
        BlazeLayout.render('NonAuthenticatedLayout', { main: 'Register' });
    }
});


Public.route('/forgot-password', {
    name: 'forgot-password',
    action() {
        BlazeLayout.render('NonAuthenticatedLayout', { main: 'ForgotPassword' });
    }
});

Public.route('/reset-password/:token', {
    name: 'reset-password',
    action() {
        BlazeLayout.render('NonAuthenticatedLayout', { main: 'ResetPassword' });
    }
});

Public.route('/enroll-account/:token', {
    name: 'enroll-account',
    action() {
        BlazeLayout.render('NonAuthenticatedLayout', { main: 'ResetPassword' });
    }
});

Public.route('/verify-email/:token', {
    name: 'verify-email',
    action(params) {
        Accounts.verifyEmail(params.token, function(error) {
            //TODO better error handling
            if(error) {
                console.log(error);
                FlowRouter.go("/");
                sAlert.info("Looks like you may have already used this token. Try logging in.");
            }
            //TODO show confirmation to user that email was successfully validated
            else {
                FlowRouter.go("/");
            }
        });
    }
});

FlowRouter.notFound = {
  action() {
    BlazeLayout.render('NonAuthenticatedLayout', { main: 'NotFound' });
  },
};
