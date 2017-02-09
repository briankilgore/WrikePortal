import { Comments } from '../../../api/comments/comments.js';

import './comments.html';

Template.Comments.onRendered(function() {
    scrollCommentsPanelToBottom();
});

Template.Comments.events({
    'submit #addComments'(event) {
        event.preventDefault();
        let form = event.target;
        Meteor.call('comments.addToTask', { taskId: this.taskId, comment: form.comment.value }, function(err, res) {
            if(err) {
                sAlert.error("Error adding comment");
            }
            else {
                // Projects.insert(res);
                _.each(res.data.data, (data) => {
                    let comment = {
                        _id: data.id,
                        authorId: data.authorId,
                        createdDate: data.createdDate,
                        taskId: data.taskId,
                        text: data.text,
                        updatedDate: data.updatedDate
                    };

                    Comments._collection.insert(comment);
                });
                form.comment.value = "";
                scrollCommentsPanelToBottom();
            }
        });
    }
});

function scrollCommentsPanelToBottom() {
    let commentsPanel = document.querySelector(".chat-panel .panel-body")
    commentsPanel.scrollTop = commentsPanel.scrollHeight;
}