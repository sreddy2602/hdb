sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
], function(Controller, JSONModel, MessageBox) {
    "use strict";
    return Controller.extend("sample.controller.Dashboard", {
        onInit: function() {
            // Load products from local JSON file
            var oModel = new JSONModel();
            var oView = this.getView();
            oModel.loadData("model/products.json", null, false);
            oView.setModel(oModel, "products");
            // Set filteredProducts for gallery binding
            oModel.setProperty("/filteredProducts", oModel.getProperty("/products"));
            this.populateCategories(oModel.getProperty("/products"));
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
        onAddToCart(oEvent) {
            const oProduct = oEvent.getSource().getBindingContext("products").getObject();
            const oCart = this.getOwnerComponent().getModel("cart");
            const aItems = oCart.getProperty("/items");
            if (aItems.length >= 5) {
              return MessageToast.show("You can only add up to 5 items");
            }
            if (aItems.find(p => p.id === oProduct.id)) {
              return MessageToast.show("Item already in cart");
            }
            aItems.push(oProduct);
            oCart.setProperty("/items", aItems);
            MessageToast.show("Added to cart");
          },

        onCategoryChange: function() {
            // Reuse search logic to filter on category change
            this.onSearch({ getSource: () => this.getView().byId("productSearchInput") });
        },

        // Navigation handlers
        onHome: function() {
            // Reset filter
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
        },
        onAddToCart: function(oEvent) {
            var oSource = oEvent.getSource();
            var oContext = oSource.getBindingContext("products");
            var oProduct = oContext.getObject();
        
            // Add to cart model (local only)
            var oCart = this.getOwnerComponent().getModel("cart");
            var aItems = oCart.getProperty("/items") || [];
            if (aItems.find(p => p.name === oProduct.name)) {
                sap.m.MessageToast.show("Item already in cart");
                return;
            }
            aItems.push(oProduct);
            oCart.setProperty("/items", aItems);
            sap.m.MessageToast.show("Added to cart");
        
            // Navigate to Cart page
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("Cart"); // Use the target name from your manifest.json
        },

        
    });
});