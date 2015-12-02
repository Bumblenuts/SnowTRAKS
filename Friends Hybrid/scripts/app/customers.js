/**
 * Customers view model
 */

var app = app || {};

app.Customers = (function () {
    'use strict'

    // Customers model
    var customersModel = (function () {

        var customerModel = {

            id: 'Id',
            fields: {

                Text: {
                    field: 'Text',
                    defaultValue: ''
                },
                CreatedAt: {
                    field: 'CreatedAt',
                    defaultValue: new Date()
                },
                Picture: {
                    fields: 'Picture',
                    defaultValue: null
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
                }
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
        var customersDataSource = new kendo.data.DataSource({
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
                    $('#no-customers-span').hide();
                } else {
                    $('#no-customers-span').show();
                }
            },
            sort: { field: 'CreatedAt', dir: 'desc' }
        });

        return {
            customers: customersDataSource
        };

    }());

    // Customers view model
    var customersViewModel = (function () {

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
            customers: customersModel.customers,
            customerSelected: customerSelected,
            logout: logout
        };

    }());

    return customersViewModel;

}());
