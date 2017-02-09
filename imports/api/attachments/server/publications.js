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
            let self = this;
            let pollingFactor = (Meteor.settings.public.env == "development") ? .1 : 1;
            (function doPoll() {
                console.log("attachments.getByTaskId");
                let attachments = HTTP.call("GET", baseUrl + "/tasks/" + taskId + "/attachments?withUrls=true", options);

                _.each(attachments.data.data, (attachment) => {
                    self.added('attachments', attachment.id, attachment);
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