var http = require('http');
var fs = require('fs');

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
    //console.dir(req);

    // var filename = '../images/house.png';
    // fs.readFile(filename, function(err, data){
    //     res.writeHead(200, {"Content-Type":"image/png"});
    //     res.write(data);
    //     res.end();
    // });

    var filename = "../sound/freq.mp3";
    fs.readFile(filename, function(err, data){
        res.writeHead(200, {"Content-Type":"audio/mp3"});
        res.write(data);
        res.end();
    })

    // res.writeHead(200, {"Content-Type":"text/html; charset=utf-8"});
    // res.write('<!DOCTYPE html>');
    // res.write('<html>');
    // res.write('<head>');
    // res.write('<title>응답 페이지 </title>');
    // res.write('</head>');
    // res.write('<body>');
    // res.write('<h1>노드제이에스로부터의 응답 페이지 </h1>');
    // res.write('</body>');
    // res.write('</html>');
    // res.end();

});

//서버 종료 이벤트 처리 
server.on('close', function() {
    console.log('서버가 종료됩니다.');
});