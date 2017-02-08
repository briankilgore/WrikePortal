import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

let baseUrl = "https://www.wrike.com/api/v3";

export const getAllProjects = new ValidatedMethod({
    name: 'wrike.getAllProjects',
    validate: null,
    run() {
        let options = {
            headers: {
                "Authorization": "Bearer " + Meteor.settings.private.wrike.access_token
            }
        };

        try {
            let projects = HTTP.call("GET", baseUrl + "/folders", options);
            // console.log(projects);
            return projects;
        }
        catch(e) {
            console.log(e);
            throw new Meteor.Error('error-retrieving', 'Unable to communicate with server');
        }
    }
});

export const getProject = new ValidatedMethod({
    name: 'wrike.getProjectsById',
    validate: new SimpleSchema({
        projectIds: { type: String, label: "Comma separated list of Project IDs" }
    }).validator({ clean: true }),
    run({ projectIds }) {
        let options = {
            headers: {
                "Authorization": "Bearer " + Meteor.settings.private.wrike.access_token
            }
        };

        try {
            let projects = HTTP.call("GET", baseUrl + "/folders" + projectId, options);
            // console.log(projects);
            return projects;
        }
        catch(e) {
            console.log(e);
            throw new Meteor.Error('error-retrieving', 'Unable to communicate with server');
        }
    }
});

export const getProjectTasks = new ValidatedMethod({
    name: 'wrike.getProjectTasks',
    validate: new SimpleSchema({
        projectId: { type: String, label: "Comma separated list of Project IDs" }
    }).validator({ clean: true }),
    run({ projectId }) {
        let options = {
            headers: {
                "Authorization": "Bearer " + Meteor.settings.private.wrike.access_token
            }
        };

        try {
            let tasks = HTTP.call("GET", baseUrl + "/folders/" + projectId + "/tasks", options);
            // console.log(projects);
            return tasks;
        }
        catch(e) {
            console.log(e);
            throw new Meteor.Error('error-retrieving', 'Unable to communicate with server');
        }
    }
});

export const getTaskAttachments = new ValidatedMethod({
    name: 'wrike.getTaskAttachments',
    validate: new SimpleSchema({
        taskId: { type: String, label: "Task ID" }
    }).validator({ clean: true }),
    run({ taskId }) {
        let options = {
            headers: {
                "Authorization": "Bearer " + Meteor.settings.private.wrike.access_token
            }
        };

        try {
            let attachments = HTTP.call("GET", baseUrl + "/tasks/" + taskId + "/attachments?withUrls=true", options);
            return attachments;
        }
        catch(e) {
            console.log(e);
            throw new Meteor.Error('error-retrieving', 'Unable to communicate with server');
        }
    }
});

export const getTaskComments = new ValidatedMethod({
    name: 'wrike.getTaskComments',
    validate: new SimpleSchema({
        taskId: { type: String, label: "Task ID" }
    }).validator({ clean: true }),
    run({ taskId }) {
        let options = {
            headers: {
                "Authorization": "Bearer " + Meteor.settings.private.wrike.access_token
            }
        };

        try {
            let comments = HTTP.call("GET", baseUrl + "/tasks/" + taskId + "/comments", options);
            return comments;
        }
        catch(e) {
            console.log(e);
            throw new Meteor.Error('error-retrieving', 'Unable to communicate with server');
        }
    }
});