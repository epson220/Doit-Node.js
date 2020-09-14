var http = require('http');

var options = {
    host : 'www.google.com',
    port : 80,
    path : '/'
};

var req = http.get(options, function(res){
    var resData = '';
    res.on('data', function(chunk){
        console.log('data 이벤트 발생!');
        resData += chunk;
    });

    res.on('end', function(){
        console.log(resData);
    });

});

req.on('error', function(err){
    console.log('오류 발생 : '+err.message);
});