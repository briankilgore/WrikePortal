import { Projects } from '../../api/projects/projects.js';
import { createUser } from '../../api/users/server/methods.js';

JsonRoutes.add("POST", "/api/users", function (req, res, next) {
    console.log(res);
    if(req.body) {
        try {
            let userId = Accounts.createUser({
                email: req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                accountId: req.body.accountId
            });

            Accounts.sendEnrollmentEmail(userId);

            JsonRoutes.sendResult(res, {
                code: 201,
                data: {
                    id: userId,
                    message: "User created"
                }
            });
        }
        catch(e) {
            JsonRoutes.sendResult(res, {
                code: e.error,
                data: {
                    message: e.reason
                }
            });
        }
    }
});

JsonRoutes.add("POST", "/api/projects", function (req, res, next) {
    // console.log(req.body);
    Projects.insert({
        projectId: req.body.id,
        accountId: req.body.accountId,
        title: req.body.title,
        createdDate: req.body.createdDate,
        updatedDate: req.body.updatedDate,
        status: req.body.status
    });

    JsonRoutes.sendResult(res, {
        code: 200,
        data: {
            success: true
        }
    });
});

JsonRoutes.add("POST", "/api/webhooks/projects", function (req, res, next) {
    // console.log(req.body);
    Projects.insert({
        projectId: req.body.id,
        accountId: req.body.accountId,
        title: req.body.title,
        createdDate: req.body.createdDate,
        updatedDate: req.body.updatedDate,
        status: req.body.status
    });

    JsonRoutes.sendResult(res, {
        code: 200,
        data: {
            success: true
        }
    });
});