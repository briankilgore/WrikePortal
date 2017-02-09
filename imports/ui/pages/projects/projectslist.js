import { Projects } from '../../../api/projects/projects.js';

import './projectslist.html';

Template.ProjectsList.onCreated(function() {
    this.autorun(() => {
        this.subscribe('projects.all');
    });
});

Template.ProjectsList.onRendered(function() {

});

Template.ProjectsList.events({
    'click .project-item'(event) {
        event.preventDefault();
        FlowRouter.go('/projects/' + this._id)
        console.log(this);
    }
});

Template.ProjectsList.helpers({
    projects() {
        let projects = Projects.find().fetch();
        console.log(projects);
        return projects;
    },
    statusColor() {
        if(this.status == "Green") {
            return "success";
        }
    }
});

function getProjects(projectIds) {
    Meteor.call("projects.get", function(err, res) {
        if(err) {
            sAlert.error("Error retrieving project list");
        }
        else {
            // console.log(res.data);
            // data.set(res.data);
            let data = [];
            _.each(res.data.data, function(project) {
                // data.push(project);
                Projects.insert(project);
            });
            // console.log(data);

            // Projects.insert(data);
        }
    });
}