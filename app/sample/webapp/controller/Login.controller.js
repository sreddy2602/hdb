sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function(Controller, MessageToast, MessageBox) {
    "use strict";
    return Controller.extend("sample.controller.Login", {
        onLogin: function() {
            var oView = this.getView();
            var email = oView.byId("email").getValue();
            var password = oView.byId("password").getValue();

            // Basic validation
            if (!email || !password) {
                MessageBox.error("Please enter both email and password.");
                return;
            }

            var payload = {
                email: email,
                password: password
            };

            // Send POST request to login endpoint
            fetch("http://localhost:4004/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })
            .then(function(response) {
                if (!response.ok) {
                    throw new Error("Login failed");
                }
                return response.json();
            })
            .then(function(data) {
                MessageToast.show("Login successful!");
                // Navigate to home or dashboard as needed
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteHome");
            }.bind(this))
            .catch(function(err) {
                MessageBox.error("Login failed: " + err.message);
            });
        },

        onSignupNav: function() {
            // Navigate to Sign Up page
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteSignup");
        }
    });
});