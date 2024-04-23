Ext.onReady(function () {
  // 게시글 모델 정의
  Ext.define('BoardPost', {
    extend: 'Ext.data.Model',
    fields: ['boardSn', 'title', 'author', 'createdAt', 'content']
  });

  // 트리 패널 생성
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
    flex : 1,
    height : '100%',
    store: treeStore,
    rootVisible: true,
    collapsible: true,
    split: true,
  });

  // 그리드 패널 생성
  var store = Ext.create('Ext.data.Store', {
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

  var grid = Ext.create('Ext.grid.Panel', {
    store: store,
    flex: 2,
    height: 900,
    columns: [
      { text: 'ID', dataIndex: 'boardSn', width: 50 },
      { text: '제목', dataIndex: 'title', flex: 1 },
      { text: '작성자', dataIndex: 'author', width: 100 },
      { text: '작성일', dataIndex: 'createdAt', width: 150 }
    ],
    title: '게시판',
    split: true,
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
          Ext.Ajax.request({
            url: 'api/boards/' + selection.get('boardSn'),
            method: 'DELETE',
            success: function (response) {
              store.load();
            },
            failure: function (response) {
              Ext.Msg.alert('오류', '게시글 삭제에 실패했습니다.');
            }
          });
        }
      },
      disabled: true
    }],
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

  // 게시글 수정 및 추가 폼 함수 정의
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
              var url = isNew ? 'api/boards' : 'api/boards/' + record.get('boardSn');
              var method = isNew ? 'POST' : 'PUT';

              Ext.Ajax.request({
                url: url,
                method: method,
                jsonData: form.getValues(),
                success: function (response) {
                  store.load();
                  win.close();
                },
                failure: function (response) {
                  var message = isNew ? '게시글 추가에 실패했습니다.' : '게시글 수정에 실패했습니다.';
                  Ext.Msg.alert('오류', message);
                }
              });
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

  // 컨테이너 생성 및 배치
  var container = Ext.create('Ext.container.Container', {
    width: '100%',
    height: 900,
    layout: 'hbox',
    renderTo: Ext.getBody(),
    items: [
      treePanel, grid
    ]
  });

});
