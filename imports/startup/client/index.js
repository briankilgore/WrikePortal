// Import client startup through a single index entry point

import './routes.js';

sAlert.config({
    effect: 'stackslide',
    position: 'top',
    timeout: 4000,
    html: false,
    onRouteClose: true,
    stack: false
});

$.cloudinary.config({
    cloud_name: Meteor.settings.public.cloudinary.cloud_name
});

Template.registerHelper('formatDateWithTime', function(date) {
  return moment(date).format('MMM D, h:mm A');
});