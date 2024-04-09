Ext.onReady(function () {
    Ext.define('BoardPost', {
        extend: 'Ext.data.Model',
        fields: ['boardSn', 'title', 'author', 'createdAt', 'content'],
        proxy: {
            type: 'ajax',
            api: {
                create: 'api/boards',
                read: 'api/boards',
                update: 'api/boards',
                destroy: 'api/boards'
            },
            reader: {
                type: 'json',
                root: 'data',
                successProperty: 'success'
            },
            writer: {
                type: 'json',
                writeAllFields: true
            },
            actionMethods: {
                create: 'POST',
                read: 'GET',
                update: 'PUT',
                destroy: 'DELETE'
            }
        }
    });

    var store = Ext.create('Ext.data.Store', {
        model: 'BoardPost',
        autoLoad: true,
        autoSync: true
    });

    var grid = Ext.create('Ext.grid.Panel', {
        store: store,
        columns: [
            { text: 'ID', dataIndex: 'boardSn', width: 50 },
            { text: '제목', dataIndex: 'title', flex: 1 },
            { text: '작성자', dataIndex: 'author', width: 100 },
            { text: '작성일', dataIndex: 'createdAt', width: 150 }
        ],
        height: 900,
        width: '100%',
        title: '게시판',
        renderTo: Ext.getBody(),
        tbar: [{
            text: '게시글 추가',
            handler: function () {
                showEditForm();
            }
        }, {
            itemId: 'editButton',
            text: '게시글 보기',
            handler: function () {
                var selection = grid.getView().getSelectionModel().getSelection()[0];
                console.log(selection);
                if (selection) {
                    showEditForm(selection);
                } else {
                    Ext.Msg.alert('알림', '게시글을 선택하세요.');
                }
            },
            disabled: true
        }, {
            itemId: 'deleteButton',
            text: '게시글 삭제',
            handler: function () {
                var selection = grid.getView().getSelectionModel().getSelection()[0];
                if (selection) {
                    store.remove(selection);
                }
            },
            disabled: true
        }],
        listeners: {
            itemdblclick: function (view, record) {s
                showEditForm(record);
            },
            selectionchange: function (selModel, selections) {
                grid.down('#editButton').setDisabled(selections.length === 0);
                grid.down('#deleteButton').setDisabled(selections.length === 0);
            }
        }
    });

    function showEditForm(record) {
        var isNew = !record;
        var win = Ext.create('Ext.window.Window', {
            title: isNew ? '게시글 추가' : '게시글 수정',
            modal: true,
            width: 600,
            height: 400,
            layout: 'fit',
            items: {
                xtype: 'form',
                layout: 'anchor',
                bodyPadding: 10,
                defaultType: 'textfield',
                items: [{
                    fieldLabel: '제목',
                    name: 'title',
                    allowBlank: false,
                    value: isNew ? '' : record.get('title'),
                    anchor: '100%' 
                }, {
                    fieldLabel: '작성자',
                    name: 'author',
                    allowBlank: false,
                    value: isNew ? '' : record.get('author'),
                    readOnly: !isNew,
                    anchor: '100%' 
                }, {
                    fieldLabel: '내용',
                    name: 'content',
                    xtype: 'textarea',
                    allowBlank: false,
                    value: isNew ? '' : record.get('content'),
                    anchor: '100% -50', 
                    height: 200 
                }],
                buttons: [{
                    text: isNew ? '추가' : '저장',
                    formBind: true,
                    handler: function () {
                        var form = this.up('form').getForm();
                        if (form.isValid()) {
                            if (isNew) {
                                store.add(form.getValues());
                            } else {
                                record.set(form.getValues());
                            }
                            win.close();
                        }
                    }
                }, {
                    text: '취소',
                    handler: function () {
                        win.close();
                    }
                }]
            }
        });
        win.show();
    }

});
