//setup Cloudinary
Cloudinary.config({
	cloud_name: Meteor.settings.private.cloudinary.cloud_name,
	api_key: Meteor.settings.private.cloudinary.api_key,
	api_secret: Meteor.settings.private.cloudinary.api_secret
});

//setup Mailgun
process.env.MAIL_URL = "smtp://" + 
    Meteor.settings.private.mailgun.default_smtp_login + ":" + 
    Meteor.settings.private.mailgun.default_password + "@" + 
    Meteor.settings.private.mailgun.smtp_hostname + ":587";
