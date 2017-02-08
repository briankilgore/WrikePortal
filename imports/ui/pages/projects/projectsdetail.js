import { ReactiveDict } from 'meteor/reactive-dict';
import { Projects } from '../../../api/projects/projects.js';

import './projectsdetail.html';

let data = new ReactiveDict();
let loading = new ReactiveVar();

Template.ProjectsDetail.onCreated(function() {
    data.setDefault('tasks', []);
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
        let task = this;
        loading.set(true);
        getTaskAttachments(task.id, function(err, res) {
            task.attachments = res;
            getTaskComments(task.id, function(err, res) {
                task.comments = res;
                data.set('task', task);
                loading.set(false);
            });
        });
    },
    'submit #addComments'(event) {
        event.preventDefault();
        let form = event.target;
        let task = data.get('task');
        task.comments.push({text: form.comment.value});
        data.set('task', task);
        form.comment.value = "";
    }
});

Template.ProjectsDetail.helpers({
    project() {
        let project = Projects.findOne();
        if(project) {
            data.set("project", project);
            getProjectTasks(project.projectId);
            Meteor.setInterval(function() {
                getProjectTasks(project.projectId);
            }, 5000);
        }
        return project;
    },
    tasks() {
        let tasks = data.get('tasks');
        console.log(tasks);
        return tasks;
    },
    task() {
        let task = data.get('task');
        console.log(task);
        return task;
    },
    loading() {
        return loading.get();
    },
    isActiveTask(id) {
        let task = data.get('task');
        if(task && task.id == id) {
            return true;
        }
    }
});

function getProjectTasks(projectId) {
    Meteor.call("wrike.getProjectTasks", {projectId: projectId}, function(err, res) {
        if(err) {
            sAlert.error("Error retrieving task list");
        }
        else {
            data.set('tasks', res.data.data);
            // _.each(res.data.data, function(task) {
            //     console.log(task);
            //     Tasks.upsert(task.id, task);
            // });
        }
    });
}

function getTaskAttachments(taskId, done) {
    Meteor.call("wrike.getTaskAttachments", {taskId: taskId}, function(err, res) {
        if(err) {
            sAlert.error("Error retrieving attacment list");
        }
        else {
            done(null, res.data.data);
        }
    });
}

function getTaskComments(taskId, done) {
    Meteor.call("wrike.getTaskComments", {taskId: taskId}, function(err, res) {
        if(err) {
            sAlert.error("Error retrieving attacment list");
        }
        else {
            console.log(res.data);
            done(null, res.data.data);
        }
    });
}