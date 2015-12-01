/**
 * AddCustomer view model
 */

var app = app || {};

app.AddCustomer = (function () {
    'use strict'

    var addCustomerViewModel = (function () {
        
        var $newStatus;
 //       var $CustomerName;
        var validator;
        
        var init = function () {
            
            validator = $('#enterStatus').kendoValidator().data('kendoValidator');
            $newStatus = $('#newStatus');

//            $CustomerName = $('#CustomerName');

            $newStatus.on('keydown', app.helper.autoSizeTextarea);
        };
        
        var show = function () {
            
            // Clear field on view show
            $newStatus.val('');
            validator.hideMessages();
            $newStatus.prop('rows', 1);
        };
        
        var saveCustomer = function () {
            
            // Validating of the required fields
            if (validator.validate()) {
                
                // Adding new customer to Customers model
                var customers = app.Customers.customers;
                var customer = customers.add();
                
                customer.Text = $newStatus.val();
  //              customer.CustomerName = CustomerName.val();
                customer.UserId = app.Users.currentUser.get('data').Id;
                
                customers.one('sync', function () {
                    app.mobileApp.navigate('#:back');
                });
                
                customers.sync();
            }
        };
        
        return {
            init: init,
            show: show,
            me: app.Users.currentUser,
            saveCustomer: saveCustomer
        };
        
    }());
    
    return addCustomerViewModel;
    
}());
