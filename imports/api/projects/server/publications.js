import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Projects } from '../projects.js';
import { Random } from 'meteor/random';

let baseUrl = "https://www.wrike.com/api/v3";

// Meteor.publish('projects.all', function () {
//     if(this.userId) {
//         let user = Meteor.users.findOne(this.userId);
//         console.log(user);

//         let projects = Projects.find({
//             accountId: user.accountId
//         });
//         // console.log(projects);
//         return projects;
//     }
//     else {
//         this.ready();
//     }
// });

// Meteor.publish('projects.getById', function (projectId) {
//     if(this.userId) {
//         let project = Projects.find(projectId);
//         // console.log(projects);
//         return project;
//     }
//     else {
//         this.ready();
//     }
// });

Meteor.publish('projects.getAll', function () {
    if(this.userId) {
        let options = {
            headers: {
                "Authorization": "Bearer " + Meteor.settings.private.wrike.access_token
            }
        };

        try {
            let user = Meteor.users.findOne(this.userId);

            let metadata = {
                key: "sugar_account_id",
                value: user.accountId
            };

            let accountFolder = HTTP.call("GET", baseUrl + "/folders/" + Meteor.settings.private.wrike.customer_folder_id + "/folders?metadata=" + JSON.stringify(metadata), options);            
            let childIds = accountFolder.data.data[0].childIds.join(",");

            let projects = HTTP.call("GET", baseUrl + "/folders/" + childIds, options);   
            _.each(projects.data.data, (project) => {
                this.added('projects', Random.id(), project);
            });

            this.ready();
        }
        catch(e) {
            console.log(e);
            throw new Meteor.Error('error-retrieving', 'Unable to communicate with server');
        }
    }
    else {
        this.ready();
    }
});

Meteor.publish('projects.getById', function (projectId) {
    if(this.userId && projectId) {
        let options = {
            headers: {
                "Authorization": "Bearer " + Meteor.settings.private.wrike.access_token
            }
        };

        try {
            let self = this;
            let pollingFactor = (Meteor.settings.public.env == "development") ? .1 : 1;
            (function doPoll() {
                let projects = HTTP.call("GET", baseUrl + "/folders/" + projectId, options);

                _.each(projects.data.data, (project) => {
                    self.added('projects', project.id, project);
                });

                self.ready();
                Meteor.setTimeout(doPoll, 60000 * pollingFactor);
            })();
        }
        catch(e) {
            console.log(e);
            throw new Meteor.Error('error-retrieving', 'Unable to communicate with server');
        }
    }
    else {
        this.ready();
    }
});