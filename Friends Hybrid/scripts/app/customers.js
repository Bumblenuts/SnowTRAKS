/**
 * Customers view model
 */

var app = app || {};

app.Customers = (function () {
    'use strict'

    // Customers model
    var CustomersModel = (function () {

        var customersModel = {

            id: 'Id',
            fields: {
                CreatedAt: {
                    field: 'CreatedAt',
                    defaultValue: new Date()
                },
                UserId: {
                    field: 'UserId',
                    defaultValue: null
                },
                CustomerName: {
                    fields: 'CustomerName',
                    defaultValue: null
                },
                Email: {
                    fields: 'Email',
                    defaultValue: null
                },
                GPS: {
                    fields: 'GPS',
                    defaultValue: null
                },
                HomeTel: {
                    fields: 'HomeTel',
                    defaultValue: null
                },
                Mobile: {
                    fields: 'Mobile',
                    defaultValue: null
                },
                Picture: {
                    fields: 'Picture',
                    defaultValue: null
                },
            },
            CreatedAtFormatted: function () {

                return app.helper.formatDate(this.get('CreatedAt'));
            },
            PictureUrl: function () {

                return app.helper.resolvePictureUrl(this.get('Picture'));
            },
            User: function () {

                var userId = this.get('UserId');

                var user = $.grep(app.Users.users(), function (e) {
                    return e.Id === userId;
                })[0];

                return user ? {
                    DisplayName: user.DisplayName,
                    PictureUrl: app.helper.resolveProfilePictureUrl(user.Picture)
                } : {
                    DisplayName: 'Anonymous',
                    PictureUrl: app.helper.resolveProfilePictureUrl()
                };
            },
            isVisible: function () {
                var currentUserId = app.Users.currentUser.data.Id;
                var userId = this.get('UserId');

                return currentUserId === userId;
            }
        };

        // Customers data source. The Backend Services dialect of the Kendo UI DataSource component
        // supports filtering, sorting, paging, and CRUD operations.
        var CustomersDataSource = new kendo.data.DataSource({
            type: 'everlive',
            schema: {
                model: customerModel
            },
            transport: {
                // Required by Backend Services
                typeName: 'Customers'
            },
            change: function (e) {

                if (e.items && e.items.length > 0) {
                    $('#no-Customers-span').hide();
                } else {
                    $('#no-Customers-span').show();
                }
            },
            sort: { field: 'CreatedAt', dir: 'desc' }
        });

        return {
            Customers: CustomersDataSource
        };

    }());

    // Customers view model
    var CustomersViewModel = (function () {

        // Navigate to customerView when a customer is selected
        var customerSelected = function (e) {

            app.mobileApp.navigate('views/customerView.html?uid=' + e.data.uid);
        };

        // Navigate to app home
        var navigateHome = function () {

            app.mobileApp.navigate('#welcome');
        };

        // Logout user
        var logout = function () {

            app.helper.logout()
            .then(navigateHome, function (err) {
                app.showError(err.message);
                navigateHome();
            });
        };

        return {
            Customers: CustomersModel.Customers,
            customerSelected: customerSelected,
            logout: logout
        };

    }());

    return CustomersViewModel;

}());
