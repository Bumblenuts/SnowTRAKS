'use strict';

app.addCustomer = kendo.observable({
    onShow: function() {},
    afterShow: function() {}
});

// START_CUSTOM_CODE_addCustomer
// END_CUSTOM_CODE_addCustomer
(function(parent) {
    var addCustomerModel = kendo.observable({
        fields: {
            email: '',
            mobile: '',
            homeTel: '',
            streetAddress: '',
            customerName: '',
        },
        submit: function() {},
        cancel: function() {}
    });

    parent.set('addCustomerModel', addCustomerModel);
})(app.addCustomer);

// START_CUSTOM_CODE_addCustomerModel

// END_CUSTOM_CODE_addCustomerModel