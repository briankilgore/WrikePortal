import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

let baseUrl = "https://www.wrike.com/api/v3";

export const addCommentToTask = new ValidatedMethod({
    name: 'comments.addToTask',
    validate: new SimpleSchema({
        taskId: { type: String, label: "Task ID" },
        comment: { type: String, label: "Comment text" }
    }).validator({ clean: true }),
    run({ taskId, comment }) {
        let options = {
            headers: {
                "Authorization": "Bearer " + Meteor.settings.private.wrike.access_token
            },
            params: {
                text: comment
            }
        };

        try {
            let comments = HTTP.call("POST", baseUrl + "/tasks/" + taskId + "/comments", options);
            return comments;
        }
        catch(e) {
            console.log(e);
            throw new Meteor.Error('error-retrieving', 'Unable to communicate with server');
        }
    }
});