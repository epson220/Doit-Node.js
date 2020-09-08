var http = require('http');

//웹서버 객체를 생성
var server = http.createServer();

//웹서버를 싲가하여 3000번 포트에서 대기하도록 설정합니다.
var port = 3000;
server.listen(port, function() {
    console.log('웹서버가 시작되었습니다. : %d', port);
});

//클라이언트 연결 이벤트 처리
server.on('connection', function(socket){
    var addr = socket.address(); //클라이언트가 접속 시, 서버 내부적으로 socket이 생성됨, client정보를 
    //담는 객체 
    console.log('클라이언트가 접속했습니다 : %s, %d', addr.address, addr.port);
});

//클라이언트 요청 이벤트 처리
server.on('request', function(req, res){
    console.log('클라이언트 요청이 들어왔습니다.');
    console.dir(req);
});

//서버 종료 이벤트 처리 
server.on('close', function() {
    console.log('서버가 종료됩니다.');
});