Ext.onReady(function(){
    Ext.create('Ext.panel.Panel', {
        width: 500,
        height: 500,
        renderTo: Ext.getBody(),
        items: [{
            xtype: 'combo',
            editable: false,
            value: 'first' ,
            displayField: 'c1',
            valueField: 'c2',
            store: {
                fields: ['c1', 'c2'],
                proxy: {
                    type: 'ajax',
                    url: '../static/app/test/ex.json',
                    reader: {
                        type: 'json',
                        rootProperty: 'data'
                    }
                }
            }
        }, {
            xtype: 'grid',
            columns: [{
                text: '컬럼1',
                dataIndex: 'column1'
            }, {
                text: '컬럼2',
                dataIndex: 'column2'
            }, {
                text: '컬럼3',
                dataIndex: 'column3'
            }],
            store: {
                autoLoad: true,
                fields: ['column1', 'column2', 'column3'],
                proxy: {
                    type: 'ajax',
                    url: '../static/app/test/ex2.json',
                    reader: {
                        type: 'json',
                        rootProperty: 'data'
                    }
                }
            }
        }]
    });
});
