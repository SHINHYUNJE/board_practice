Ext.onReady(function () {
    var store = {
        fields: ['test1', 'test2'],
        data: [{
            test1: '첫번째',
            test2: 'first'
        }, {
            test1: '두번째',
            test2: 'second'
        }, {
            test1: '세번째',
            test2: 'third'
        }]
    };

    console.log(store);

    Ext.create('Ext.panel.Panel', {
        width: 500,
        height: 300,
        title: 'Data Store',
        renderTo: Ext.getBody(),
        items: [{
            xtype: 'combo',
            editable: false,
            value: 'second',
            displayField: 'test1',
            valueField: 'test2',
            store: store
        }]
    });
})