/**
 * Customer view model
 */

var app = app || {};

app.customer = (function () {
    'use strict'
    
    var $commentsContainer,
        listScroller;
    
    var customerViewModel = (function () {
        
        var customerUid,
            customer,
            $customerPicture;
        
        var init = function () {
            $commentsContainer = $('#comments-listview');
            $customerPicture = $('#picture');
        };
        
        var show = function (e) {
            
            $commentsContainer.empty();
            
            listScroller = e.view.scroller;
            listScroller.reset();
            
            customerUid = e.view.params.uid;
            // Get current customer (based on item uid) from Customers model
            customer = app.Customers.customers.getByUid(customerUid);
            $customerPicture[0].style.display = customer.Picture ? 'block' : 'none';
            
            app.Comments.comments.filter({
                field: 'customerId',
                operator: 'eq',
                value: customer.Id
            });
            
            kendo.bind(e.view.element, customer, kendo.mobile.ui);
        };
        
        var removecustomer = function () {
            
            var customers = app.Customers.customers;
            var customer = customers.getByUid(customerUid);
            
            app.showConfirm(
                appSettings.messages.removecustomerConfirm,
                'Delete customer',
                function (confirmed) {
                    if (confirmed === true || confirmed === 1) {
                        
                        customers.remove(customer);
                        customers.one('sync', function () {
                            app.mobileApp.navigate('#:back');
                        });
                        customers.sync();
                    }
                }
            );
        };
        
        return {
            init: init,
            show: show,
            remove: removecustomer,
            customer: function () {
                return customer;
            }
        };
        
    }());
    
    return customerViewModel;
    
}());
