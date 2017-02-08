import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Projects } from '../projects.js';

Meteor.publish('projects.all', function () {
    if(this.userId) {
        let user = Meteor.users.findOne(this.userId);
        console.log(user);

        let projects = Projects.find({
            accountId: user.accountId
        });
        // console.log(projects);
        return projects;
    }
    else {
        this.ready();
    }
});

Meteor.publish('projects.getById', function (projectId) {
    if(this.userId) {
        let project = Projects.find(projectId);
        // console.log(projects);
        return project;
    }
    else {
        this.ready();
    }
});