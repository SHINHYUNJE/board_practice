Ext.onReady(function(){
    Ext.create('Ext.panel.Panel',{
        width: 500,
        height: 500,
        renderTo: Ext.getBody(),
        items: [{
            xtype: 'treepanel',
            root: {
                text: 'Servers',
                expanded: false,
                children: [{
                    text: '.settings'
                },{
                    text: 'Tomcat v8.0 server'
                },{
                    text: '.project'
                }]
            }
        }]
    });
});
