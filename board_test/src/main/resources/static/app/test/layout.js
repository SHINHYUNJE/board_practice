Ext.onReady(function () {
    Ext.create('Ext.panel.Panel', {
        width: '100%',
        height: 1000,
        layout : 'border',
        renderTo : Ext.getBody(),
        items: [{
            xtype: 'panel',
            title : '좌측',
            region: 'west',
            flex: 1,
            split : true,
            collapsible : true,
            html: '<br>안녕하세요</br>'
        }, {
            xtype: 'panel',
            title : '우측',
            region: 'center',
            flex: 2,
            layout : 'border',
            items : [
                {
                    xtype : 'panel',
                    region : 'center',
                    title : '우측 위',
                    border : true,
                    flex : 2,
                    layout : 'center',
                    items : [{
                        xtype : 'button',
                        text : '버튼 클릭',
                        listeners : {
                            click : function(btn1){
                                alert(btn1.getText());
                            }
                        }
                        //,
                        // handler : function(btn){
                        //     alert('버튼 클릭');
                        // }
                    },{
                        xtype : 'button',
                        text : '목록'
                    }]
                },{
                    xtype : 'panel',
                    region : 'south',
                    title : '우측 아래',
                    border : true,
                    split : true,
                    flex : 1
                }
            ]
        }
        ]
    });
})