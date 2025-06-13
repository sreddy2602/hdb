sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function(Controller, MessageToast) {
    "use strict";
    return Controller.extend("sample.controller.Login", {
        onLogin: function() {
            MessageToast.show("Navigating to Dashboard...");
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteDashboard");
        },
        onSignupNav: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteSignup");
        }
    });
});