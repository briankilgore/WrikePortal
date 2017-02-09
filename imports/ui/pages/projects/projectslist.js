import { Projects } from '../../../api/projects/projects.js';

import './projectslist.html';

Template.ProjectsList.onCreated(function() {
    this.autorun(() => {
        // this.subscribe('projects.all');
        this.subscribe('projects.getAll');
    });
});

Template.ProjectsList.onRendered(function() {

});

Template.ProjectsList.events({
    'click .project-item'(event) {
        event.preventDefault();
        FlowRouter.go('/projects/' + this.id)
        console.log(this);
    }
});

Template.ProjectsList.helpers({
    projects() {
        let projects = Projects.find({}, {sort: { updatedDate: -1 }}).fetch();
        console.log(projects);
        return projects;
    },
    statusColor() {
        if(this.project && this.project.status == "Green") {
            return "success";
        }
    }
});