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
    
    var filename = "../images/house.png";
    var infile = fs.createReadStream(filename, {flag:'r'});

    var filelength = 0;
    var curlength = 0;

    fs.stat(filename, function(err, stats){
        filelength = stats.size;
    });

    res.writeHead(200, {"Content-Type":"text/plain;charset=utf-8"});

    infile.on('readable', function(){
        var chunk;
        while(null != (chunk = infile.read())){
            console.log('읽어 들인 데이터 크기 : %d 바이트', chunk.length);
            curlength += chunk.length;
            res.write(chunk, 'utf8', function(err){
                console.log('파일 부분 쓰기 완료 : %d, 파일 크기 : %d', curlength, filelength);
                if(curlength >= filelength){
                    //응답 전송하기
                    res.end();
                }
            });
        }
    });
    //파이프로 연결하여 알아서 처리하도록 함
    //infile.pipe(res);
});

//서버 종료 이벤트 처리 
server.on('close', function() {
    console.log('서버가 종료됩니다.');
});