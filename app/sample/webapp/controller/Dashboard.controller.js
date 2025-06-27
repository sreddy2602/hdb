sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function(Controller, JSONModel, MessageToast) {
    "use strict";
    return Controller.extend("sample.controller.Dashboard", {
        onInit: function() {
            var that = this;
            // Use the owner component to get the OData model; this is more reliable than getView().getModel()
            var oODataModel = this.getOwnerComponent().getModel();

            if (!oODataModel) {
                MessageToast.show("OData model not found. Check manifest.json!");
                return;
            }

            // Use OData V4 API to fetch /Products from CAP/HANA
            var oBinding = oODataModel.bindList("/Products");
            oBinding.requestContexts().then(function(aContexts) {
                var aProducts = aContexts.map(function(oContext) {
                    var p = oContext.getObject();
                    p.selectedQuantity = 1;
                    return p;
                });
                var oProductsModel = new JSONModel({
                    products: aProducts,
                    filteredProducts: aProducts
                });
                that.getView().setModel(oProductsModel, "products");
                that.populateCategories(aProducts);
            }).catch(function(err) {
                MessageToast.show("Failed to fetch products from server.");
                console.error(err);
            });
        },

        populateCategories: function(data) {
            var oView = this.getView();
            var oSelect = oView.byId("productCategorySelect");
            if (!oSelect) return;
            oSelect.removeAllItems();
            var categories = [];
            data.forEach(function(p) {
                if (p.category && !categories.includes(p.category)) {
                    categories.push(p.category);
                }
            });
            oSelect.addItem(new sap.ui.core.Item({ key: "", text: "All" }));
            categories.forEach(function(cat) {
                oSelect.addItem(new sap.ui.core.Item({ key: cat, text: cat }));
            });
        },

        onIncreaseProductQuantity: function(oEvent) {
            var oProduct = oEvent.getSource().getBindingContext("products").getObject();
            oProduct.selectedQuantity = (oProduct.selectedQuantity || 1) + 1;
            this.getView().getModel("products").refresh(true);
        },

        onDecreaseProductQuantity: function(oEvent) {
            var oProduct = oEvent.getSource().getBindingContext("products").getObject();
            if ((oProduct.selectedQuantity || 1) > 1) {
                oProduct.selectedQuantity--;
                this.getView().getModel("products").refresh(true);
            }
        },

        onProductQuantityInput: function(oEvent) {
            var oInput = oEvent.getSource();
            var value = parseInt(oInput.getValue(), 10);
            if (isNaN(value) || value <= 0) value = 1;
            var oProduct = oInput.getBindingContext("products").getObject();
            oProduct.selectedQuantity = value;
            this.getView().getModel("products").refresh(true);
        },

        onAddToCart: function(oEvent) {
            var oProduct = oEvent.getSource().getBindingContext("products").getObject();
            var qtyToAdd = oProduct.selectedQuantity || 1;

            var oCart = this.getOwnerComponent().getModel("cart");
            if (!oCart) {
                oCart = new sap.ui.model.json.JSONModel({ items: [] });
                this.getOwnerComponent().setModel(oCart, "cart");
            }
            var aItems = oCart.getProperty("/items") || [];
            var existing = aItems.find(p => p.name === oProduct.name);

            if (existing) {
                existing.quantity = (existing.quantity || 1) + qtyToAdd;
                MessageToast.show("Increased quantity in cart");
            } else {
                var oItem = Object.assign({}, oProduct);
                oItem.quantity = qtyToAdd;
                delete oItem.selectedQuantity;
                aItems.push(oItem);
                MessageToast.show("Added to cart");
            }
            oCart.setProperty("/items", aItems);
            oProduct.selectedQuantity = 1;
            this.getView().getModel("products").refresh(true);
        },

        onSearch: function(oEvent) {
            var sQuery = oEvent.getSource().getValue().toLowerCase();
            var oModel = this.getView().getModel("products");
            var aProducts = oModel.getProperty("/products") || [];
            var sCategory = this.getView().byId("productCategorySelect").getSelectedKey();
            var aFiltered = aProducts.filter(function(p) {
                var matchesCategory = !sCategory || p.category === sCategory;
                var matchesSearch = !sQuery || (p.name && p.name.toLowerCase().includes(sQuery));
                return matchesCategory && matchesSearch;
            });
            oModel.setProperty("/filteredProducts", aFiltered);
        },

        onCategoryChange: function() {
            this.onSearch({ getSource: () => this.getView().byId("productSearchInput") });
        },

        onHome: function() {
            var oModel = this.getView().getModel("products");
            oModel.setProperty("/filteredProducts", oModel.getProperty("/products"));
            var oInput = this.getView().byId("productSearchInput");
            if (oInput) oInput.setValue("");
            var oSelect = this.getView().byId("productCategorySelect");
            if (oSelect) oSelect.setSelectedKey("");
        },

        onCart: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteCart");
        },

        onOrders: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteOrder");
        },

        onLogout: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteLogin");
        }
    });
});