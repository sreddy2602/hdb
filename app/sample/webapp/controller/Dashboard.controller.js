sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function(Controller, JSONModel, MessageToast, MessageBox) {
    "use strict";
    return Controller.extend("sample.controller.Dashboard", {
        onInit: function() {
            this._loadProducts();
        },

        _loadProducts: function() {
            var oView = this.getView();
            fetch("http://localhost:8000/home")
                .then(function(response) {
                    if (!response.ok) throw new Error("Failed to fetch products");
                    return response.json();
                })
                .then(function(data) {
                    var oModel = new JSONModel({products: data});
                    oView.setModel(oModel, "products");
                    // Fill category filter
                    var categories = [...new Set(data.map(p => p.category))];
                    var categorySelect = oView.byId("productCategory");
                    categorySelect.removeAllItems();
                    categorySelect.addItem(new sap.ui.core.Item({key: "", text: "All"}));
                    categories.forEach(function(cat) {
                        categorySelect.addItem(new sap.ui.core.Item({key: cat, text: cat}));
                    });
                })
                .catch(function(err) {
                    MessageBox.error("Could not load products: " + err.message);
                });
        },

        onSearch: function(oEvent) {
            var sQuery = oEvent.getSource().getValue().toLowerCase();
            var oModel = this.getView().getModel("products");
            var aProducts = oModel.getProperty("/products") || [];
            var aFiltered = aProducts.filter(function(p) {
                return p.name.toLowerCase().includes(sQuery);
            });
            oModel.setProperty("/filteredProducts", aFiltered.length ? aFiltered : aProducts);
        },

        onCategoryChange: function(oEvent) {
            var sCategory = oEvent.getSource().getSelectedKey();
            var oModel = this.getView().getModel("products");
            var aProducts = oModel.getProperty("/products") || [];
            var aFiltered = sCategory
                ? aProducts.filter(function(p) { return p.category === sCategory; })
                : aProducts;
            oModel.setProperty("/filteredProducts", aFiltered);
        },

        onAfterRendering: function() {
            var oModel = this.getView().getModel("products");
            if (oModel) {
                this._bindProductGrid();
            }
        },

        _bindProductGrid: function() {
            var oView = this.getView();
            var oGrid = oView.byId("productGrid");
            oGrid.removeAllContent();
            var oModel = oView.getModel("products");
            var aProducts = oModel.getProperty("/filteredProducts") || oModel.getProperty("/products") || [];
            aProducts.forEach(function(product) {
                oGrid.addContent(new sap.m.Panel({
                    headerText: product.name,
                    content: [
                        new sap.m.Image({src: product.image, width: "100%"}),
                        new sap.m.Text({text: product.description}),
                        new sap.m.Text({text: "Price: $" + product.price})
                    ],
                    expandable: false
                }));
            });
        },

        onHome: function() {
            // Already on home, do nothing or reload
            this._loadProducts();
        },

        onCart: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteCart");
        },

        onOrder: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteOrder");
        },

        onLogout: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteLogin");
        }
    });
});