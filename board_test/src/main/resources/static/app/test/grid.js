Ext.onReady(function(){
    Ext.create('Ext.grid.Panel',{
        width : 500,
        height : 500,
        renderTo : Ext.getBody(), 
        columns : [{
            text : '컬럼1',
            dataIndex : 'c1',
            flex : 1
        },{
            text : '컬럼2',
            dataIndex : 'c2',
            flex : 1
        },{
            text : '컬럼3',
            dataIndex : 'c3',
            flex : 1
        }],
        store : {
            fields : ['c1','c2','c3'],
            data : [{
                c1 : '컬럼 1-1',
                c2 : '컬럼 1-2',
                c3 : '컬럼 1-3'
            },{
                c1 : '컬럼 2-1',
                c2 : '컬럼 2-2',
                c3 : '컬럼 2-3',
            }]
        }
    });
});
