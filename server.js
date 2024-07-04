const mongoclient = require("mongodb").MongoClient;
const ObjId = require("mongodb").ObjectId;
const url =
  "mongodb+srv://admin:1234@cluster0.qefoj4b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";



let mydb;

mongoclient
  .connect(url)
  .then((client) => {
    console.log(">>몽고DB 접속");

    mydb = client.db("myboard");
    console.log(">>몽고DB 연결");

    // mydb.collection('post').find().toArray().then(result =>{
    //     console.log(result);
    // })

    app.listen(8080, function () {
      console.log("포트 8080으로 서버 대기중 ... ");
    });
  })
  .catch((err) => {
    console.log(err);
  });

// // MySQL + nodejs 접속 코드
// var mysql = require("mysql2");
// var conn = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "0000",
//   database: "myboard",
// });

//conn.connect();

const express = require("express");
const app = express();



//body-parser 라이브러리 추가
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
//정적 파일 라이브러리 추가
app.use(express.static("public"));

app.get("/book", function (req, res) {
  res.send("도서 목록 관련 페이지입니다.");
});

app.get("/", function (req, res) {
  res.render("index.ejs");
});

app.get("/list", function (req, res) {
  //   conn.query("select * from post", function (err, rows, fields) {
  //     if (err) throw err;
  //     console.log(rows);
  //   });
  mydb
    .collection("post")
    .find()
    .toArray()
    .then((result) => {
      console.log(result);
      res.render("list.ejs", { data: result });
    });
});

//'/enter' 요청에 대한 처리 루틴
app.get("/enter", function (req, res) {
  // res.sendFile(__dirname + '/enter.html');
  res.render("enter.ejs");
});

//'/save' 요청에 대한 post 방식의 처리 루틴
app.post("/save", function (req, res) {
  console.log('req.body<<',req.body);
  //몽고DB에 데이터 저장하기
  // mydb.collection('post').insertOne(
  //     {title : req.body.title, content : req.body.content},
  //     function(err, result){
  //         console.log(err);
  //         console.log(result);
  //         console.log('데이터 추가 성공');
  //     });

  mydb
    .collection("post")
    .insertOne({
      title: req.body.title,
      address: req.body.address,
      price: req.body.price,
      callNum: req.body.callNum,
      size: req.body.size,
      date: req.body.someDate,
    })
    .then((result) => {
      console.log(result);
      console.log("데이터 추가 성공");
    });

  // let sql = "insert into post (title, content, created) values(?, ?, NOW())";
  // let params = [req.body.title, req.body.content];
  // conn.query(sql, params, function (err, result) {
  //     if (err) throw err;
  //     console.log('데이터 추가 성공');
  // });
  res.redirect("/list");
});

app.post("/delete", function (req, res) {
  console.log(req.body);
  req.body._id = new ObjId(req.body._id);
  mydb
    .collection("post")
    .deleteOne(req.body)
    .then((result) => {
      console.log("매수");
      res.status(200).send();
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send();
    });
});

//'/content' 요청에 대한 처리 루틴
app.get("/content/:id", function (req, res) {
  console.log(req.params.id);
  req.params.id = new ObjId(req.params.id);
  mydb
    .collection("post")
    .findOne({ _id: req.params.id })
    .then((result) => {
      console.log(result);
      res.render("content.ejs", { data: result });
    });
});

//'/edit' 요청에 대한 처리 루틴
app.get('/edit/:id', function (req, res) {
  req.params.id = new ObjId(req.params.id);
  mydb
    .collection("post")
    .findOne({ _id: req.params.id })
    .then((result) => {
      console.log(result);
      res.render("edit.ejs", { data: result });
    });
});

app.post("/edit", function (req, res) {
  console.log(req.body);
  req.body.id = new ObjId(req.body.id);
  mydb
    .collection("post")
    .updateOne({ _id: req.body.id }, { $set: { title: req.body.title, address: req.body.address, price: req.body.price, size: req.body.size, num: req.body.callNum, date: req.body.someDate } }) //updateOne({조건},{변경항목})
    .then((result) => {
      console.log("수정완료");
      res.redirect('/list');
    })
    .catch((err) => {
      console.log(err);
    });
});

//목록 검색기능
app.get('/search', function (req, res) {
  console.log(req.query);

  mydb.collection("post")
  .find({ title:req.query.value}).toArray()
  .then((result) => {
    console.log(result);
    res.render("list.ejs", {data:result}); //search.ejs
  })
});

/////////////////// team9 ///////////////////////
// app.get('/', (req, res) =>{
//   console.log('>>홈 라우터 접속');
//   res.render('index.ejs');
// });

//부동산
//초기화면
app.get('/realty', function(req,res){
  console.log('>>부동산 라우터 접속');
  res.render('realty.ejs');
});