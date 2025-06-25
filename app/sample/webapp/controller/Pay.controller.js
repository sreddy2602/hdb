sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function(Controller, MessageToast) {
    "use strict";
    return Controller.extend("sample.controller.Pay", {
        onInit: function() {
            // Optional: initialize payment data
        },
        onPayNow: function() {
            MessageToast.show("Payment processing...");
            // Implement payment logic here
        }
    });
});