import { ReactiveDict } from 'meteor/reactive-dict';
import { Projects } from '../../../api/projects/projects.js';
import { Tasks } from '../../../api/tasks/tasks.js';
import { Attachments } from '../../../api/attachments/attachments.js';
import { Comments } from '../../../api/comments/comments.js';

import './projectsdetail.html';

let data = new ReactiveDict();
let loading = new ReactiveVar();

Template.ProjectsDetail.onCreated(function() {
    data.set('projectId', FlowRouter.getParam('projectId'));

    this.autorun(() => {
        let response;
        response = this.subscribe('projects.getById', data.get('projectId'));
        response = this.subscribe('tasks.getByProjectId', data.get('projectId'));
        response = this.subscribe('attachments.getByTaskId', data.get('taskId'));
        response = this.subscribe('comments.getByTaskId', data.get('taskId'));

        loading.set(!response.ready());
    });
});

Template.ProjectsDetail.onRendered(function() {

});

Template.ProjectsDetail.events({
    'click .list-group-item'(event) {
        event.preventDefault();
        console.log(this);
        data.set('taskId', this.id);
    },
    'click #attachments .image-container'(event) {
        event.preventDefault();
        console.log(this);
        data.set('activeImage', this);
        $('#myModal').modal();
    },
    'submit #addComments'(event) {
        event.preventDefault();
        let form = event.target;
        Meteor.call('wrike.addComment', { taskId: this.id, comment: form.comment.value }, function(err, res) {
            console.log(err, res);
            form.comment.value = "";
        });
    }
});

Template.ProjectsDetail.helpers({
    project() {
        let project = Projects.findOne();
        if(project) {
            data.set("project", project);
        }
        return project;
    },
    tasks() {
        let tasks = Tasks.find();

        return tasks;
    },
    task() {
        let taskId = data.get('taskId');
        let task = Tasks.findOne({ id: taskId });
        let attachments = Attachments.find().fetch();
        if(attachments.length) {
            task.attachments = attachments;
        }

        let comments = Comments.find().fetch();
        if(comments.length) {
            task.comments = comments;
        }
// console.log(task);
        return task;
    },
    loading() {
        return loading.get();
    },
    isActiveTask(id) {
        let taskId = data.get('taskId');
        return taskId == id;
    },
    isImage() {
        return this.contentType == "image/jpeg";
    },
    image() {
        let image = data.get('activeImage');
        console.log(image);
        return image;
    }
});