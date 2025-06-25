sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function(Controller, MessageToast) {
    "use strict";
    return Controller.extend("sample.controller.Order", {
        onInit: function() {
            // Set the cart model to the view for binding
            var oCart = this.getOwnerComponent().getModel("cart");
            if (!oCart) {
                oCart = new sap.ui.model.json.JSONModel({ items: [] });
                this.getOwnerComponent().setModel(oCart, "cart");
            }
            this.getView().setModel(oCart, "cart");
        },
        // onPay: function() {
        //     // Payment logic goes here
        //     MessageToast.show("Payment successful! Thank you for your order.");
        //     // Optionally, clear the cart after payment
        //     var oCart = this.getOwnerComponent().getModel("cart");
        //     oCart.setProperty("/items", []);
        //     oCart.refresh(true);
        // }
    });
});