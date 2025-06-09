sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function(Controller, MessageToast, MessageBox) {
    "use strict";
    return Controller.extend("sample.controller.Signup", {
        onSignup: function() {
            var oView = this.getView();
            var email = oView.byId("email").getValue();
            var username = oView.byId("username").getValue();
            var mobilenumber = oView.byId("mobilenumber").getValue();
            var password = oView.byId("password").getValue();
            var confirmpassword = oView.byId("confirmpassword").getValue();

            // Basic validation
            if (!email || !username || !mobilenumber || !password || !confirmpassword) {
                MessageBox.error("Please fill in all fields.");
                return;
            }
            if (password !== confirmpassword) {
                MessageBox.error("Passwords do not match.");
                return;
            }

            var payload = {
                email: email,
                username: username,
                mobilenumber: mobilenumber,
                password: password
            };

            // Send POST request to signup endpoint
            fetch("http://localhost:4004/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })
            .then(function(response) {
                if (!response.ok) {
                    throw new Error("Signup failed");
                }
                return response.json();
            })
            .then(function(data) {
                MessageToast.show("Signup successful!");
                // Optionally, navigate to login or dashboard page
                // var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                // oRouter.navTo("RouteHome");
            }.bind(this))
            .catch(function(err) {
                MessageBox.error("Signup failed: " + err.message);
            });
        },

        onSignInNav: function() {
            // Navigate to Sign In/Login page
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteHome");
        }
    });
});