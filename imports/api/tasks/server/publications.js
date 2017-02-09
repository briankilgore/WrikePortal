import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

let baseUrl = "https://www.wrike.com/api/v3";

Meteor.publish('tasks.getByProjectId', function (projectId) {
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

        try {
            let self = this;
            let pollingFactor = (Meteor.settings.public.env == "development") ? .1 : 1;
            (function doPoll() {
                let tasks = HTTP.call("GET", baseUrl + "/folders/" + projectId + "/tasks", options);
                
                _.each(tasks.data.data, (task) => {
                    self.added('tasks', task.id, task);
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