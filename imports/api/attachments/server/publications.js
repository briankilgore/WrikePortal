import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

let baseUrl = "https://www.wrike.com/api/v3";

Meteor.publish('attachments.getByTaskId', function (taskId) {
    if(this.userId && taskId) {
        let options = {
            headers: {
                "Authorization": "Bearer " + Meteor.settings.private.wrike.access_token
            }
        };

        try {
            let attachments = HTTP.call("GET", baseUrl + "/tasks/" + taskId + "/attachments?withUrls=true", options);
            // console.log(attachments.data);
            _.each(attachments.data.data, (attachment) => {
                this.added('attachments', Random.id(), attachment);
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