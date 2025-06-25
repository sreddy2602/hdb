sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function(Controller, MessageToast) {
    "use strict";
    return Controller.extend("sample.controller.Cart", {
        onInit: function() {
            var oCart = this.getOwnerComponent().getModel("cart");
            if (!oCart) {
                oCart = new sap.ui.model.json.JSONModel({ items: [] });
                this.getOwnerComponent().setModel(oCart, "cart");
            }
            this.getView().setModel(oCart, "cart");
        },

        onIncreaseQuantity: function(oEvent) {
            var oItem = oEvent.getSource().getParent().getBindingContext("cart").getObject();
            oItem.quantity = (oItem.quantity || 1) + 1;
            this.getView().getModel("cart").refresh(true);
        },

        onDecreaseQuantity: function(oEvent) {
            var oModel = this.getView().getModel("cart");
            var aItems = oModel.getProperty("/items");
            var oItem = oEvent.getSource().getParent().getBindingContext("cart").getObject();
            if (oItem.quantity > 1) {
                oItem.quantity--;
            } else {
                var iIndex = aItems.indexOf(oItem);
                if (iIndex !== -1) {
                    aItems.splice(iIndex, 1);
                    oModel.setProperty("/items", aItems);
                    MessageToast.show("Removed from cart");
                }
            }
            oModel.refresh(true);
        },

        onDeleteItem: function(oEvent) {
            var oModel = this.getView().getModel("cart");
            var aItems = oModel.getProperty("/items");
            var oItem = oEvent.getSource().getParent().getBindingContext("cart").getObject();
            var iIndex = aItems.indexOf(oItem);
            if (iIndex !== -1) {
                aItems.splice(iIndex, 1);
                oModel.setProperty("/items", aItems);
                MessageToast.show("Removed from cart");
            }
            oModel.refresh(true);
        },

        onCheckout: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RoutePay"); // Change "RouteOrders" to "RoutePay"
        }
    });
});