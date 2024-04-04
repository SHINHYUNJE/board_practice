Ext.onReady(function() {
    Ext.define('Post', {
        extend: 'Ext.data.Model',
        fields: ['id', 'title', 'author', 'createdDate'] // 모델 필드 정의
    });

    // 서버로부터 전달받은 데이터를 이용해 스토어 생성
    var store = Ext.create('Ext.data.Store', {
        model: 'Post',
        data: initialData // Thymeleaf로부터 받은 데이터
    });

    // 게시글 목록 그리드
    Ext.create('Ext.grid.Panel', {
        renderTo: 'boardApp',
        store: store,
        width: '100%',
        height: 400,
        title: '게시글 목록',
        columns: [
            { text: 'ID', dataIndex: 'id', width: 50 },
            { text: '제목', dataIndex: 'title', flex: 1 },
            { text: '작성자', dataIndex: 'author', width: 200 },
            { text: '작성일', dataIndex: 'createdDate', width: 200 }
        ]
    });
});
