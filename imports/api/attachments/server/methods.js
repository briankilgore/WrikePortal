import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

let baseUrl = "https://www.wrike.com/api/v3";

export const addAttachmentToTask = new ValidatedMethod({
    name: 'attachments.addToTask',
    validate: new SimpleSchema({
        taskId: { type: String, label: "Task ID" },
        attachment: { type: Object, label: "Attachment object", blackbox: true }
    }).validator({ clean: true }),
    run({ taskId, attachment }) {
        let options = {
            headers: {
                "Authorization": "Bearer " + Meteor.settings.private.wrike.access_token,
                "X-Requested-With": "XMLHttpRequest",
                "X-File-Name": attachment.name,
                "Content-Type": "application/octet-stream"
            },
            params: {
                text: comment
            }
        };

        try {
            ///tasks/{taskId}/attachments
            let comments = HTTP.call("POST", baseUrl + "/tasks/" + taskId + "/attachments", options);
            return comments;
        }
        catch(e) {
            console.log(e);
            throw new Meteor.Error('error-retrieving', 'Unable to communicate with server');
        }
    }
});