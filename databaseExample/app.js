var express = require('express');
var http = require('http');
var path = require('path');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var static = require('serve-static');
var errorHandler = require('errorhandler');

var expressErrorHandler = require('express-error-handler');

var expressSession = require('express-session');

//var MongoClient = require('mongodb').MongoClient;

var mongoose = require('mongoose');
const { connect } = require('mongodb');

//디비객체
var database;
//디비스키마객체
var UserSchema;
//디비모델객체
var UserModel;

function connectDB() {
    //데이터베이스 연결 정보
    var databaseUrl = "mongodb://localhost:27017/local";

    console.log('데이터베이스 연결을 시도합니다.');
    mongoose.Promise = global.Promise;
    mongoose.connect(databaseUrl);
    database = mongoose.connection;

    database.on('error', console.error.bind(console, 'mongoose connection error'));
    database.on('open', function() {
        console.log('데이터베이스에 연결되었습니다. : ' + databaseUrl);

        UserSchema = mongoose.Schema({
            id: String,
            name: String,
            password: String
        });
        console.log('UserSchema정의함.');

        UserModel = mongoose.model("users", UserSchema);
        console.log('UserModel 정의함.');
    });

    database.on('disconnected', function(){
        console.log('연결이 끊어졌습니다. 5초 후 다시 연결합니다.');
        setInterval(connectDB, 5000);
    });

    //데이터베이스 연결
    // MongoClient.connect(databaseUrl, {useUnifiedTopology:true}, function(err, db){
    //     if(err) throw err;

    //     console.log('데이터베이스에 연결되었습니다. : ' + databaseUrl);

    //     //database변수에 할당
    //     database = db.db('local');

    // });
}

var authUser = function(database, id, password, callback) {
    console.log('authUser 호출됨.');

    //var users = database.collection('users');

    // users.find({"id":id, "password":password}).toArray(function(err, docs) {
    //     if(err){
    //         callback(err, null);
    //         return;
    //     }
    //     if(docs.length > 0) {
    //         console.log('아이디 [%s], 비밀번호 [%s]가 일치하는 사용자 찾음.', id, password);
    //         callback(null, docs);
    //     }else {
    //         console.log('일치하는 사용자를 찾지 못함.');
    //         callback(null, null);
    //     }
    // });

    UserModel.find({"id" : id, "password" : password}, function(err, results) {
        if(err) {
            callback(err, null);
            return;
        }

        console.log('아아디 [%s], 비밀번호 [%s]로 사용자 검색 결과', id, password);
        console.dir(results);

        if(results.length > 0){
            console.log('일치하는 사용자 찾음.', id, password);
            callback(null, results);
        }
        else {
            console.log('일치하는 사용자를 찾지 못함.');
            callback(null, null);
        }
    });
}

var addUser = function(database, id, password, name, callback) {
    console.log('addUser 호출됨 : ' + id + ', ' + password + ', ' + name);

    //var users = database.collection('users');

    var user = new UserModel({"id":id, "password":password, "name":name});

    user.save(function(err){
        if(err){
            callback(err, null);
            return;
        }

        console.log("사용자의 데이터 추가함.");
        callback(null, user);
    });

    // users.insertMany([{"id":id, "password":password, "name":name}], function(err, result) {
    //     if(err) {
    //         callback(err, null);
    //         return;
    //     }

    //     if(result.insertedCount > 0) {
    //         console.log("사용자레코드 추가됨 : " + result.insertedCount);
    //     }else {
    //         console.log("추가된 레코드가 없음.");
    //     }

    //     callback(null, result);

    // });
}

var app = express();

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({extended:false}));

app.use(bodyParser.json());

app.use('/public', static(path.join(__dirname, 'public')));

app.use(cookieParser());

app.use(expressSession({
    secret : 'my key',
    resave : true,
    saveUninitialized : true
}));

var router = express.Router();

router.route('/process/login').post(function(req, res){
    console.log('/process/login called');

    var paramId = req.body.id;
    var paramPassword = req.body.password;

    console.log(paramId);
    console.log(paramPassword);

    if(database) {
        
        authUser(database, paramId, paramPassword, function(err, docs) {
            if(err) throw err;

            if(docs) {
                console.log(docs);

                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>로그인 성공</h1>');
                res.write('<div><p>사용자 아이디 : ' + paramId + '</p></div>');
                res.write('<div><p>사용자 이름 : ' + docs[0].name + '</p></div>');
                res.write('<br><br><a href="/public/login.html"> 다시 로그인하기</a>');
                res.end();
            }else {
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>로그인 실패</h1>');
                res.write('<div><p>아이디와 비밀번호를 다시 확인하십니다.</p></div>');
                res.write('<br><br><a href="/public/login.html"> 다시 로그인하기</a>');
                res.end();
            }
        });
    }else {
        res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.write('<div><p>데이터베이스에 연결하지 못했습니다. </p></div>');
        res.end();
    }
});

router.route('/process/adduser').post(function(req, res){
    console.log('/process/adduser 호출됨.');
    
    var paramId = req.body.id;
    var paramPassword = req.body.password;
    var paramName = req.body.name;

    console.log("요청 파라미터 : " + paramId + ', ' + paramPassword + ', ' + paramName);

    if(database) {
        addUser(database, paramId, paramPassword, paramName, function(err, result){
            if(err) {throw err;}

            if(result) {
                console.dir(result);

                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>사용자 추가 성공</h2>');
                res.end();
            }else {
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>데이터베이스 연결 실패</h2>');
                res.end();
            }
        });
    } else {
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.end();
    }
});

app.use('/', router);

var errorHandler = expressErrorHandler({
    static : {
        '404' : './public/404.html'
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

http.createServer(app).listen(app.get('port'), function(){
    console.log('익스프레스 서버를 시작했습니다. : ' + app.get('port'));

    connectDB();

});