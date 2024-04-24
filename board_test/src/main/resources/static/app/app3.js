Ext.onReady(function () {
    Ext.define('BoardPost', {
        extend: 'Ext.data.Model',
        fields: ['boardSn', 'title', 'author', 'content', 'createdAt']
    });

    var treeStore = Ext.create('Ext.data.TreeStore', {
        root: {
            text: '게시판 목록',
            expanded: true,
            children: [
                { text: 'Notice 1', leaf: true },
                { text: 'Notice 2', leaf: true },
                { text: 'Notice 3', leaf: true },
                { text: 'Notice 4', leaf: true }
            ]
        }
    });

    var treePanel = Ext.create('Ext.tree.Panel', {
        title: '카테고리 목록',
        width: '10%',
        height: '100%',
        store: treeStore,
        rootVisible: true, // 루트 노드 표시 여부 설정
        collapsible: true, // 패널 축소 가능 여부 설정
        split: true, // 다른 패널과의 분리선 생성 설정
    });

    // BoardStore 정의
    Ext.define('BoardStore', {
        extend: 'Ext.data.Store',
        model: 'BoardPost',
        proxy: {
            type: 'ajax',
            url: 'api/boards',
            reader: {
                type: 'json',
                root: 'data',
                totalProperty: 'total' // 전체 레코드 수를 나타내는 필드 이름
            }
        },
        autoLoad: true,
        autoSync: true,
        pageSize: 25 // 한 페이지에 표시할 레코드 수
    });

    // BoardStore 생성
    var store = Ext.create('BoardStore');


    var grid = Ext.create('Ext.grid.Panel', {
        store: store,
        flex: 2,
        height: 900,
        columns: [{
            text: 'ID', dataIndex: 'boardSn', width: 50
        }, {
            text: '제목', dataIndex: 'title', flex: 1
        }, {
            text: '작성자', dataIndex: 'author', width: 100
        }, {
            text: '작성일', dataIndex: 'createdAt', width: 150
        }],
        title: '게시판',
        split: true,
        tbar: [
            {
                text: '게시글 추가',
                handler: function () {
                    showEditForm();
                }
            }, {
                itemId: 'editButton',
                text: '게시글 보기',
                handler: function () {
                    var selection = grid.getView().getSelectionModel().getSelection()[0];
                    if (selection) {
                        showEditForm(selection);
                    } else {
                        Ext.Msg.alert("알림", '게시글을 선택해주세요');
                    }
                },
                disabled: true
            }, {
                itemId: 'deleteButton',
                text: '게시글 삭제',
                handler: function () {
                    var selection = grid.getView().getSelectionModel().getSelection()[0];
                    if (selection) {
                        Ext.Ajax.request({
                            url: 'api/boards/' + selection.get('boardSn'),
                            method: 'DELETE',
                            success: function (response) {
                                store.load();
                            },
                            failure: function (response) {
                                Ext.Msg.alert("알림", '게시글 삭제 실패');
                            }
                        });
                    }
                },
                disabled: true
            }
        ],
        bbar: Ext.create('Ext.toolbar.Paging', {
            store: store, // 스토어 지정
            displayInfo: true // 페이징 정보 표시 여부
        }),
        listeners: {
            itemdblclick: function (view, record) {
                showEditForm(record);
            },
            selectionchange: function (selModel, selections) {
                grid.down('#editButton').setDisabled(selections.length === 0);
                grid.down('#deleteButton').setDisabled(selections.length === 0);
            }
        }
    });

    function showEditForm(record) {
        var isNew = !record
        var win = Ext.create('Ext.window.Window', {
            title: isNew ? '게시글 추가' : '게시글 수정',
            modal: true,
            layout: 'fit',
            width: 600,
            height: 600,
            items: {
                xtype: 'form',
                layout: 'anchor',
                defaultType: 'textfield',
                bodyPadding: 10,
                items: [{
                    fieldLabel: '제목',
                    name: 'title',
                    value: isNew ? '' : record.get('title'),
                    allowBlank: false,
                    anchor: '100%'
                }, {
                    fieldLabel: '작성자',
                    name: 'author',
                    value: isNew ? '' : record.get('author'),
                    readOnly: !isNew,
                    allowBlank: false,
                    anchor: '100%'
                }, {
                    fieldLabel: '내용',
                    name: 'content',
                    xtype: 'textarea',
                    value: isNew ? '' : record.get('content'),
                    allowBlank: false,
                    anchor: '100%',
                    height: 200
                }],
                buttons: [{
                    text: isNew ? '추가' : '저장',
                    formBind: true,
                    handler: function () {
                        var form = this.up('form').getForm();
                        if (form.isValid()) {
                            var url = isNew ? 'api/boards' : 'api/boards' + record.get('boardSn');
                            var method = isNew ? 'POST' : 'PUT';

                            Ext.Ajax.request({
                                url: url,
                                method: method,
                                jsonData: form.getValues(),
                                success: function (response) {
                                    store.load();
                                    win.close();
                                },
                                faliure: function (response) {
                                    var message = isNew ? '게시글 추가 실패' : '게시글 수정 실패';
                                    Ext.Msg.alert('오류', message);
                                }
                            })
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

    var container = Ext.create('Ext.container.Viewport', {
        width: '100%',
        height: 900,
        layout: 'hbox',
        renderTo: Ext.getBody(),
        items: [
            treePanel, grid
        ]
    });

})