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
    title: '카테고리 목록', // 트리 패널의 제목 설정
    flex: 1, // 트리 패널이 차지하는 영역의 비율 설정
    height: '100%', // 트리 패널의 높이 설정
    store: treeStore, // 트리 패널에 데이터 저장소 연결
    rootVisible: true, // 루트 노드 표시 여부 설정
    collapsible: true, // 패널 축소 가능 여부 설정
    split: true, // 다른 패널과의 분리선 생성 설정
  });

  // 그리드 패널 생성
  var store = Ext.create('Ext.data.Store', {
    model: 'BoardPost', // 데이터 모델 연결
    proxy: {
      type: 'ajax', // Ajax 프록시 사용 설정
      url: 'api/boards', // 데이터 요청 URL 설정
      reader: {
        type: 'json', // JSON 리더 사용 설정
        root: 'data', // 데이터 루트 설정
        successProperty: 'status' // 성공 여부 속성 설정
      }
    },
    autoLoad: true, // 자동으로 데이터 로드 설정
    autoSync: true // 변경 사항 자동으로 서버와 동기화 설정
  });

  var grid = Ext.create('Ext.grid.Panel', {
    store: store, // 그리드에 데이터 저장소 연결
    flex: 2, // 그리드 패널이 차지하는 영역의 비율 설정
    height: 900, // 그리드 패널의 높이 설정
    columns: [
      { text: 'ID', dataIndex: 'boardSn', width: 50 }, // 컬럼 설정: ID
      { text: '제목', dataIndex: 'title', flex: 1 }, // 컬럼 설정: 제목
      { text: '작성자', dataIndex: 'author', width: 100 }, // 컬럼 설정: 작성자
      { text: '작성일', dataIndex: 'createdAt', width: 150 } // 컬럼 설정: 작성일
    ],
    title: '게시판', // 그리드 패널의 제목 설정
    split: true, // 다른 패널과의 분리선 생성 설정
    tbar: [{ // 상단 툴바 설정
      text: '게시글 추가', // 버튼 텍스트 설정
      handler: function () {
        showEditForm(); // 게시글 추가 폼 표시 함수 호출
      }
    }, {
      itemId: 'editButton', // 아이템 ID 설정
      text: '게시글 보기', // 버튼 텍스트 설정
      handler: function () {
        var selection = grid.getView().getSelectionModel().getSelection()[0]; // 선택된 레코드 가져오기
        if (selection) {
          showEditForm(selection); // 선택된 레코드의 내용으로 게시글 보기 폼 표시 함수 호출
        } else {
          Ext.Msg.alert('알림', '게시글을 선택하세요.'); // 경고 메시지 표시
        }
      },
      disabled: true // 초기에 비활성화 설정
    }, {
      itemId: 'deleteButton', // 아이템 ID 설정
      text: '게시글 삭제', // 버튼 텍스트 설정
      handler: function () {
        var selection = grid.getView().getSelectionModel().getSelection()[0]; // 선택된 레코드 가져오기
        if (selection) {
          Ext.Ajax.request({
            url: 'api/boards/' + selection.get('boardSn'), // 선택된 레코드의 ID를 포함한 URL 설정
            method: 'DELETE', // HTTP DELETE 메서드 사용 설정
            success: function (response) {
              store.load(); // 데이터 다시 로드
            },
            failure: function (response) {
              Ext.Msg.alert('오류', '게시글 삭제에 실패했습니다.'); // 삭제 오류 메시지 표시
            }
          });
        }
      },
      disabled: true // 초기에 비활성화 설정
    }],
    listeners: { // 이벤트 리스너 설정
      itemdblclick: function (view, record) {
        showEditForm(record); // 더블 클릭한 아이템의 내용으로 게시글 보기 폼 표시 함수 호출
      },
      selectionchange: function (selModel, selections) {
        grid.down('#editButton').setDisabled(selections.length === 0); // 선택된 아이템이 없으면 게시글 보기 버튼 비활성화
        grid.down('#deleteButton').setDisabled(selections.length === 0); // 선택된 아이템이 없으면 게시글 삭제 버튼 비활성화
      }
    }
  });

  // 게시글 수정 및 추가 폼 함수 정의
  function showEditForm(record) {
    var isNew = !record; // 새로운 게시글 여부 확인
    var win = Ext.create('Ext.window.Window', {
      title: isNew ? '게시글 추가' : '게시글 수정', // 윈도우 제목 설정
      modal: true, // 모달 창 설정
      width: 600, // 윈도우 너비 설정
      height: 400, // 윈도우 높이 설정
      layout: 'fit', // 레이아웃 설정
      items: {
        xtype: 'form', // 폼 패널 사용 설정
        layout: 'anchor', // 폼 패널 레이아웃 설정
        bodyPadding: 10, // 내부 패딩 설정
        defaultType: 'textfield', // 기본 입력 필드 타입 설정
        items: [{
          fieldLabel: '제목', // 입력 필드 레이블 설정
          name: 'title', // 필드 이름 설정
          allowBlank: false, // 빈 값 허용 여부 설정
          value: isNew ? '' : record.get('title'), // 필드 값 설정
          anchor: '100%' // 필드 너비 설정
        }, {
          fieldLabel: '작성자', // 입력 필드 레이블 설정
          name: 'author', // 필드 이름 설정
          allowBlank: false, // 빈 값 허용 여부 설정
          value: isNew ? '' : record.get('author'), // 필드 값 설정
          readOnly: !isNew, // 읽기 전용 여부 설정
          anchor: '100%' // 필드 너비 설정
        }, {
          fieldLabel: '내용', // 입력 필드 레이블 설정
          name: 'content', // 필드 이름 설정
          xtype: 'textarea', // 텍스트 에리어 입력 필드 설정
          allowBlank: false, // 빈 값 허용 여부 설정
          value: isNew ? '' : record.get('content'), // 필드 값 설정
          anchor: '100% -50', // 필드 너비 설정
          height: 200 // 필드 높이 설정
        }],
        buttons: [{ // 폼 패널의 버튼 설정
          text: isNew ? '추가' : '저장', // 버튼 텍스트 설정
          formBind: true, // 폼 유효성 검사 후 활성화 여부 설정
          handler: function () { // 클릭 핸들러 함수 설정
            var form = this.up('form').getForm(); // 폼 찾기
            if (form.isValid()) { // 유효성 검사
              var url = isNew ? 'api/boards' : 'api/boards/' + record.get('boardSn'); // 데이터 저장 URL 설정
              var method = isNew ? 'POST' : 'PUT'; // HTTP 메서드 설정

              Ext.Ajax.request({
                url: url, // 요청 URL 설정
                method: method, // 요청 메서드 설정
                jsonData: form.getValues(), // JSON 데이터 설정
                success: function (response) { // 요청 성공 콜백
                  store.load(); // 데이터 다시 로드
                  win.close(); // 윈도우 닫기
                },
                failure: function (response) { // 요청 실패 콜백
                  var message = isNew ? '게시글 추가에 실패했습니다.' : '게시글 수정에 실패했습니다.'; // 실패 메시지 설정
                  Ext.Msg.alert('오류', message); // 오류 메시지 표시
                }
              });
            }
          }
        }, {
          text: '취소', // 버튼 텍스트 설정
          handler: function () { // 클릭 핸들러 함수 설정
            win.close(); // 윈도우 닫기
          }
        }]
      }
    });
    win.show(); // 윈도우 표시
  }

  // 컨테이너 생성 및 배치
  var container = Ext.create('Ext.container.Container', {
    width: '100%', // 컨테이너 너비 설정
    height: 900, // 컨테이너 높이 설정
    layout: 'hbox', // 컨테이너 레이아웃 설정
    renderTo: Ext.getBody(), // 렌더링 대상 설정
    items: [
      treePanel, grid // 트리 패널과 그리드 패널 추가
    ]
  });

});

