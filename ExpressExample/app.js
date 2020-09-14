var express = require('express');
var http = require('http');

var app = express();

app.set('port', process.env.PORT || 3000);

app.use(function(req, res, next){

    console.log('첫 번째 미들웨어에서 요청을 처리함.');

    req.user = 'mike';

    //res.redirect('http://google.co.kr');

    //res.send({name : '소녀시대', age : 20});

    res.redirect('http://google.co.kr');

    next();
});

//미들웨어 등록, 클라이언트의 요청 이벤트를 처리
// app.use(function(req, res, next){
//     console.log('첫 번째 미들웨어에서 요청을 처리함.');

//     res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
//     res.end('<h1>Express 서버에서' + req.user + ' 응답한 결과입니다.</h1>');

// });

http.createServer(app).listen(app.get('port'), function(){
    console.log('익스프레스 서버를 시작했습니다. : ' + app.get('port'));
});

