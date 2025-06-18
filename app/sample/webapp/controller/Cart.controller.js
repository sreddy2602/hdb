sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function(Controller, MessageToast) {
    "use strict";
    return Controller.extend("sample.controller.Cart", {
        onInit: function() {
            // Ensure cart model is available
            var oCart = this.getOwnerComponent().getModel("cart");
            if (!oCart) {
                oCart = new sap.ui.model.json.JSONModel({ items: [] });
                this.getOwnerComponent().setModel(oCart, "cart");
            }
            this.getView().setModel(oCart, "cart");
        },
        onCheckout: function() {
            MessageToast.show("Checkout functionality not implemented.");
        }
    });
});