Ext.onReady(function () {
    var viewport = Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        border: true,
        items: [{
            xtype: 'panel',
            title: '부모패널',
            layout: 'center',
            items: [{
                xtype: 'button',
                text: '등록'
            }
            ]
        }]
    });
});
