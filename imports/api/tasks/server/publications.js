import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { Projects } from '../../projects/projects.js';

let baseUrl = "https://www.wrike.com/api/v3";

Meteor.publish('tasks.getByProjectId', function (projectId) {
    console.log("tasks.getByProjectId");
    if(this.userId) {
        let options = {
            headers: {
                "Authorization": "Bearer " + Meteor.settings.private.wrike.access_token
            },
            params: {
                fields: JSON.stringify([
                    'description'
                ])
            }
        };

        let project = Projects.findOne(projectId);

        try {
            let tasks = HTTP.call("GET", baseUrl + "/folders/" + project.projectId + "/tasks", options);
            
            _.each(tasks.data.data, (task) => {
                console.log(task);
                this.added('tasks', Random.id(), task);
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