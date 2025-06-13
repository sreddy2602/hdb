sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
], function(Controller, JSONModel, MessageBox) {
    "use strict";
    return Controller.extend("sample.controller.Dashboard", {
        onInit: function() {
            this.loadProducts();
        },

        loadProducts: function() {
            var oView = this.getView();
            fetch("http://localhost:8000/home")
                .then(function(response) {
                    if (!response.ok) throw new Error("Failed to fetch products");
                    return response.json();
                })
                .then(function(data) {
                    // Assume data is an array of products
                    var oModel = new JSONModel({
                        products: data,
                        filteredProducts: data
                    });
                    oView.setModel(oModel, "products");
                    this.populateCategories(data);
                }.bind(this))
                .catch(function(err) {
                    MessageBox.error("Could not load products: " + err.message);
                });
        },

        populateCategories: function(data) {
            var oView = this.getView();
            var oSelect = oView.byId("productCategorySelect");
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

        onCategoryChange: function() {
            // Reuse search logic to filter on category change
            this.onSearch({ getSource: () => this.getView().byId("productSearchInput") });
        },

        // Navigation handlers
        onHome: function() {
            // Already on Dashboard; could reload data if needed
            this.loadProducts();
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