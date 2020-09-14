var http = require('http');

var opts = {
    host : 'www.google.com',
    port : 80,
    method : 'POST',
    path : '/',
    headers : {}
};

var resData = '';

var req = http.request(opts, function(res){
    res.on('data', function(chunk){
        resData += chunk;
        console.log('data 이벤트 발생!!');
    });

    res.on('end', function(){
        console.log(resData);
    });
});

opts.headers['Content-Type'] = 'application/x-www-form-urlencoded';
req.data = "q=actor";
opts.headers['Content-Length'] = req.data.length;

req.on('error', function(err){
    console.log("오류 발생 : " + err.message);
});

req.write(req.data);
req.end();