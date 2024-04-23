Ext.onReady(function () {
    Ext.define('BoardPost', {
        extend: 'Ext.data.Model',
        fields: ['boardSn', 'title', 'author', 'createdAt', 'content']
    });
    
    var boardStore = Ext.create('Ext.data.Store', {
        model: 'BoardPost',
        proxy: {
            type: 'ajax',
            url: 'api/boards',
            reader: {
                type: 'json',
                root: 'data', 
                successProperty: 'status'
            }
        },
        autoLoad: true,
        autoSync: true
    });

    console.log(boardStore);

    Ext.define('BoardForm', {
        extend: 'Ext.window.Window',
        modal: true,
        title: '게시글 추가',
        width: 400,
        height: 300,
        items: [{
            xtype: 'form',
            layout: 'anchor',
            defaultFieldWidth: 200,
            items: [{
                xtype: 'textfield',
                fieldLabel: '제목',
                name: 'title'
            }, {
                xtype: 'textarea',
                fieldLabel: '내용',
                name: 'content'
            }, {
                xtype: 'textfield',
                fieldLabel: '작성자',
                name: 'author'
            }]
        }],
        buttons: [{
            text: '저장',
            handler: function () {
                var form = this.up('window').down('form').getForm();
                if (form.isValid()) {
                    var data = form.getValues();

                    Ext.Ajax.request({
                        url: '/api/boards',
                        method: 'POST',
                        jsonData: data,
                        success: function (response) {
                            Ext.Msg.alert('성공', '게시글이 추가되었습니다.');
                            Ext.getCmp('boardGrid').getStore().load();
                            this.up('window').close();
                        },
                        failure: function (response) {
                            Ext.Msg.alert('실패', '게시글 추가에 실패했습니다.');
                        }
                    });
                }
            }
        }, {
            text: '취소',
            handler: function () {
                this.up('window').close();
            }
        }]
    });

    Ext.define('BoardDetailWindow', {
        extend: 'Ext.window.Window',
        modal: true,
        title: '게시글 상세보기',
        width: 600,
        height: 400,

        items: [{
            xtype: 'form',
            reference: 'boardForm',
            layout: 'anchor',
            defaultFieldWidth: 250,
            items: [{
                xtype: 'textfield',
                fieldLabel: '제목',
                name: 'title'
            }, {
                xtype: 'textarea',
                fieldLabel: '내용',
                name: 'content'
            }, {
                xtype: 'textfield',
                fieldLabel: '작성자',
                name: 'author'
            }, {
                xtype: 'datefield',
                fieldLabel: '작성일',
                name: 'createdAt',
                readOnly: true
            }]
        }],

        buttons: [{
            text: '수정',
            handler: function () {
                var form = this.lookupReference('boardForm').getForm();
                if (form.isValid()) {
                    var data = form.getValues();
                    var board = form.getRecord();

                    Ext.Ajax.request({
                        url: '/api/boards/' + board.get('boardSn'),
                        method: 'PUT',
                        jsonData: data,
                        success: function (response) {
                            Ext.Msg.alert('성공', '게시글이 수정되었습니다.');
                            Ext.getCmp('boardGrid').getStore().load();
                            this.close();
                        },
                        failure: function (response) {
                            Ext.Msg.alert('실패', '게시글 수정에 실패했습니다.');
                        }
                    });
                }
            }
        }, {
            text: '삭제',
            handler: function () {
                var form = this.lookupReference('boardForm').getForm();
                var board = form.getRecord();

                Ext.Msg.confirm('삭제 확인', '이 게시글을 삭제하시겠습니까?', function (btnId) {
                    if (btnId === 'yes') {
                        Ext.Ajax.request({
                            url: '/api/boards/' + board.get('boardSn'),
                            method: 'DELETE',
                            success: function (response) {
                                Ext.Msg.alert('성공', '게시글이 삭제되었습니다.');
                                Ext.getCmp('boardGrid').getStore().load();
                                this.close();
                            },
                            failure: function (response) {
                                Ext.Msg.alert('실패', '게시글 삭제에 실패했습니다.');
                            }
                        });
                    }
                }, this);
            }
        }, {
            text: '닫기',
            handler: function () {
                this.close();
            }
        }],

        setBoard: function (board) {
            var form = this.lookupReference('boardForm').getForm();
            var record = Ext.create('BoardPost', board.getData());
            form.loadRecord(record);
        }
    });

    var showBoardDetail = function(boardId) {
        var detailWindow = Ext.create('BoardDetailWindow');
        var boardStore = Ext.getCmp('boardGrid').getStore();
        var board = boardStore.getById(boardId);

        detailWindow.setBoard(board);
        detailWindow.show();
    }

    var editBoard = function(boardId) {
        var detailWindow = Ext.create('BoardDetailWindow');
        var boardStore = Ext.getCmp('boardGrid').getStore();
        var board = boardStore.getById(boardId);

        detailWindow.setBoard(board);
        detailWindow.show();
    }

    var deleteBoard = function(boardId) {
        Ext.Msg.confirm('삭제 확인', '이 게시글을 삭제하시겠습니까?', function (btnId) {
            if (btnId === 'yes') {
                Ext.Ajax.request({
                    url: '/api/boards/' + boardId,
                    method: 'DELETE',
                    success: function (response) {
                        Ext.Msg.alert('성공', '게시글이 삭제되었습니다.');
                        Ext.getCmp('boardGrid').getStore().load();
                    },
                    failure: function (response) {
                        Ext.Msg.alert('실패', '게시글 삭제에 실패했습니다.');
                    }
                });
            }
        });
    }

    Ext.create('Ext.grid.Panel', {
        id: 'boardGrid',
        title: '게시판 목록',
        store: boardStore,
        renderTo: Ext.getBody(),
        columns: [
            { text: 'ID', dataIndex: 'boardSn', width: 50 },
            { text: '제목', dataIndex: 'title', flex: 1 },
            { text: '작성자', dataIndex: 'author', width: 100 },
            { text: '작성일', dataIndex: 'createdAt', width: 150 },
            {
                text: '보기', dataIndex: 'boardSn', width: 80,
                renderer: function (value, metaData, record) {
                    var boardId = record.get('boardSn');
                    return Ext.String.format('<a href="#" onclick="showBoardDetail({0})">보기</a>', boardId);
                }
            },
            {
                text: '수정', dataIndex: 'boardSn', width: 80,
                renderer: function (value, metaData, record) {
                    var boardId = record.get('boardSn');
                    return Ext.String.format('<a href="#" onclick="editBoard({0})">수정</a>', boardId);
                }
            },
            {
                text: '삭제', dataIndex: 'boardSn', width: 80,
                renderer: function (value, metaData, record) {
                    var boardId = record.get('boardSn');
                    return Ext.String.format('<a href="#" onclick="deleteBoard({0})">삭제</a>', boardId);
                }
            }
        ],
        dockedItems: [{
            xtype: 'toolbar',
            items: [{
                text: '게시글 추가',
                handler: function () {
                    var win = Ext.create('BoardForm');
                    win.show();
                }
            }]
        }]
    });
});