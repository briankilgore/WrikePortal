import { ReactiveDict } from 'meteor/reactive-dict';
import { Projects } from '../../../api/projects/projects.js';

import './projectsdetail.html';

let Tasks = new Meteor.Collection(null);

let data = new ReactiveDict();

Template.ProjectsDetail.onCreated(function() {
    let projectId = FlowRouter.getParam('projectId');
    this.autorun(() => {
        this.subscribe('projects.getById', projectId);
    });
});

Template.ProjectsDetail.onRendered(function() {

});

Template.ProjectsDetail.events({
    'click .list-group-item'(event) {
        event.preventDefault();
        data.set('task', this);
    }
});

Template.ProjectsDetail.helpers({
    project() {
        let project = Projects.findOne();
        if(project) {
            data.set("project", project);
            getProjectTasks(project.projectId);
        }
        return project;
    },
    tasks() {
        let tasks = Tasks.find().fetch();
        console.log(tasks);
        return tasks;
    },
    task() {
        let task = data.get('task');
        return task;
    }
});

function getProjectTasks(projectId) {
    Meteor.call("wrike.getProjectTasks", {projectId: projectId}, function(err, res) {
        if(err) {
            sAlert.error("Error retrieving task list");
        }
        else {
            _.each(res.data.data, function(task) {
                console.log(task);
                Tasks.upsert(task.id, task);
                getTaskAttachments(task.id);
            });
        }
    });
}

function getTaskAttachments(taskId, done) {
    Meteor.call("wrike.getTaskAttachments", {taskId: taskId}, function(err, res) {
        if(err) {
            sAlert.error("Error retrieving attacment list");
        }
        else {
            _.each(res.data.data, function(attachment) {
                console.log(attachment);
                Tasks.upsert(attachment.taskId, {$push: {
                    attachments: attachment
                }});
            });
        }
    });
}