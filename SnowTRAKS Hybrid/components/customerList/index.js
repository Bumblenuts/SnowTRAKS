'use strict';

app.customerList = kendo.observable({
    onShow: function() {},
    afterShow: function() {}
});

// START_CUSTOM_CODE_customerList
// END_CUSTOM_CODE_customerList
(function(parent) {
    var dataProvider = app.data.defaultProvider,
        processImage = function(img) {
            if (!img) {
                var empty1x1png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYII=';
                img = 'data:image/png;base64,' + empty1x1png;
            } else if (img.slice(0, 4) !== 'http' &&
                img.slice(0, 2) !== '//' && img.slice(0, 5) !== 'data:') {
                var setup = dataProvider.setup || {};
                img = setup.scheme + ':' + setup.url + setup.apiKey + '/Files/' + img + '/Download';
            }

            return img;
        },
        flattenLocationProperties = function(dataItem) {
            var propName, propValue,
                isLocation = function(value) {
                    return propValue && typeof propValue === 'object' &&
                        propValue.longitude && propValue.latitude;
                };

            for (propName in dataItem) {
                if (dataItem.hasOwnProperty(propName)) {
                    propValue = dataItem[propName];
                    if (isLocation(propValue)) {
                        dataItem[propName] =
                            kendo.format('Latitude: {0}, Longitude: {1}',
                                propValue.latitude, propValue.longitude);
                    }
                }
            }
        },
        dataSourceOptions = {
            type: 'everlive',
            transport: {
                typeName: 'Customers',
                dataProvider: dataProvider
            },

            change: function(e) {
                var data = this.data();
                for (var i = 0; i < data.length; i++) {
                    var dataItem = data[i];

                    dataItem['PhotoUrl'] =
                        processImage(dataItem['Photo']);

                    flattenLocationProperties(dataItem);
                }
            },
            schema: {
                model: {
                    fields: {
                      
                        'CustomerName': {
                            field: 'CustomerName',
                            defaultValue: ''
                        },
                         'Mobile': {
                            field: 'Mobile',
                            defaultValue: ''
                        },
                        'Address': {
                            field: 'Address',
                            defaultValue: ''
                        },
                        'Photo': {
                            field: 'Photo',
                            defaultValue: ''
                        },
                    }
                }
            },
        },
        dataSource = new kendo.data.DataSource(dataSourceOptions),
        customerListModel = kendo.observable({
            dataSource: dataSource,
            itemClick: function(e) {
                app.mobileApp.navigate('#components/customerList/details.html?uid=' + e.dataItem.uid);
            },
             itemAdd: function(e) {
                 
                 var itemToAdd = {
    'CustomerName': 'Harper Lee'
};
                   dataSource = customerListModel.get('dataSource'),
                       dataSource.add(itemToAdd);
                 dataSource.sync();
                 customerListModel.set('currentItem', itemToAdd);
                app.mobileApp.navigate('#components/customerList/addCustomer.html?uid=' + e.dataItem.uid);
            },
            
              sync: function(e) {
                dataSource.sync();
            },
            detailsShow: function(e) {
                var item = e.view.params.uid,
                    dataSource = customerListModel.get('dataSource'),
                    itemModel = dataSource.getByUid(item);
                if (!itemModel.HomeTel) {
                    itemModel.HomeTel = String.fromCharCode(160);
                }
                customerListModel.set('currentItem', itemModel);
            },
                       addShow: function(e) {
                var item = e.view.params.uid,
                    dataSource = customerListModel.get('dataSource'),
                    itemModel = dataSource.getByUid(item);
                if (!itemModel.HomeTel) {
                    itemModel.HomeTel = String.fromCharCode(160);
                }
                customerListModel.set('currentItem', itemModel);
            },
            
            
            currentItem: null
        });

    parent.set('customerListModel', customerListModel);
})(app.customerList);

// START_CUSTOM_CODE_customerListModel
// END_CUSTOM_CODE_customerListModel