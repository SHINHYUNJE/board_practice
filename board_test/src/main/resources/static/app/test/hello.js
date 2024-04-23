Ext.onReady(function () {
    var container = Ext.create('Ext.container.Container', {
        renderTo: Ext.getBody(),
        layout: {
            type: 'vbox',
            align: 'center'
        }
    });

    var button = Ext.create('Ext.button.Button', {
        text: '클릭하여 알림',
        handler: function () {
            Ext.Msg.alert('알림', 'HELLO WORLD!!');
        }
    });

    container.add(button);
});
