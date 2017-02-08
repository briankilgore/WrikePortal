import './alert.html';

Template.Alert.helpers({
    alertIcon(condition) {
        switch(condition) {
            case "error":
                return "times-circle";
            case "warning":
                return "exclamation-circle";
            case "info":
                return "info-circle";
            case "success":
                return "check-circle";
        }
    }
})