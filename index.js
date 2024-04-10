import express from "express";
import sales from "./data/sales.js";
import { z } from "zod";
import bcrypt from "bcryptjs";
import adminRouter from "./routes/admin2.js";
import memberRouter from "./routes/member.js"
import abRouter from "./routes/address-book.js";
import session from "express-session";
import mysqlSession from "express-mysql-session";
import db from "./utils/mysql2-connect.js";
import dayjs from "dayjs";
import cors from "cors";

const MysqlStore = mysqlSession(session);
const sessionStore = new MysqlStore({}, db);

const app = express();

app.set("view engine", "ejs");

// top-level middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const corsOptions = {
  credentials: true,
  origin: (origin, callback)=>{
    console.log({origin});
    callback(null, true);
  }
}
app.use(cors(corsOptions));
app.use(
  session({
    saveUninitialized: true,
    resave: true,
    secret: "kdjfsk94859348JHGJK85743",
    store: sessionStore,
    //cookie: {
    //  maxAge: 1200_000,
    //}
  })
);

// 自訂的頂層的 middlewares
app.use((req, res, next) => {
  res.locals.title = "小新的網站";
  res.locals.pageName = "";
  res.locals.session = req.session; // 讓 ejs 可以使用 session
  res.locals.originalUrl = req.originalUrl;
  next();
});

/*

// 測試用, 服務 react 發佈後的專案
app.use("/", express.static("build"));
app.get("*", (req, res) => {
  res.send(`<!doctype html><html lang="zh"><head><meta charset="utf-8"/><link rel="icon" href="/favicon.ico"/><meta name="viewport" content="width=device-width,initial-scale=1"/><meta name="theme-color" content="#000000"/><meta name="description" content="Shinder react hooks"/><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"/><title>Shinder react hooks</title><script defer="defer" src="/static/js/main.6a205622.js"></script></head><body><noscript>You need to enable JavaScript to run this app.</noscript><div id="root"></div></body></html>`);
});

*/

// 這個路由只接受 GET 方法, 路徑要為／
app.get("/", (req, res) => {
  res.locals.title = "首頁 - " + res.locals.title;
  res.locals.pageName = "home";
  // res.send("<h2>hello</2>"); // html 輸出
  // res.send({a:1});  // json 輸出
  // res.json({a:1, b:2});  // json 輸出
  res.render("home", { name: "Shinder" });
});
/*
app.get("/a.html", (req, res) => {
  res.send("<h2>假的 a.html</2>");
});
*/
app.get("/json-sales", (req, res) => {
  res.locals.title = "json - " + res.locals.title;
  res.locals.pageName = "json-sales";
  res.render("json-sales", { sales });
});

app.get(/^\/m\/09\d{2}-?\d{3}-?\d{3}$/i, (req, res) => {
  let u = req.url.split("?")[0]; // 排除 query string
  u = u.slice(3); // 去掉前面的三個字元 /m/
  u = u.split("-").join(""); // 去掉 -
  res.json({ u });
});

app.use("/admins", adminRouter);
app.use("/member", memberRouter);

app.get("/try-sess", (req, res) => {
  // req.session.myNum = req.session.myNum || 0;
  req.session.myNum ||= 0; // 簡略的寫法
  req.session.myNum++;
  res.json(req.session);
});

app.get("/login", (req, res) => {
  // 如果此用戶已經登入了, 跳轉到首頁
  if(req.session.admin){
    return res.redirect("/");
  }
  res.render("login");
});

app.post("/login", async (req, res) => {
  let {account, password} = req.body || {};
  const output = {
    success: false,
    error: "",
    code: 0,
    postData: req.body,
  };
  if(!account || !password){
    output.error = "欄位資料不足";
    output.code = 400;
    return res.json(output);
  }
  account = account.trim();
  password = password.trim();

  const sql = "SELECT * FROM members WHERE email=?";
  const [rows] = await db.query(sql, [account]);
  
  if(!rows.length){
    // 帳號是錯的
    output.error = "帳號或密碼錯誤";
    output.code = 420;
    return res.json(output);
  }
  const row = rows[0];

  const result = await bcrypt.compare(password, row.password);
  if(result){
    // 帳號是對的, 密碼也是對的
    output.success = true;
    req.session.admin = {
      id: row.id,
      email: account,
      nickname: row.nickname
    };
  } else {
    // 密碼是錯的
    output.error = "帳號或密碼錯誤";
    output.code = 450;
  }
  res.json(output);
});
app.get("/logout", (req, res) => {
  // if(req.session && req.session.admin)
  // 簡略的寫法
  if(req.session?.admin){
    delete req.session.admin;
  }
  if(req.query.u){
    res.redirect(req.query.u);
  } else {
    res.redirect("/");
  }

});

app.get("/try-db", async (req, res) => {
  const sql = "SELECT * FROM address_book LIMIT 3";
  const [rows, fields] = await db.query(sql);
  // fields: 資料表結構的相關訊息

  res.json(rows);
});

app.get("/dayjs", (req, res) => {
  const date1 = new Date();
  const dayjs1 = dayjs();
  res.json({
    date1,
    dayjs1: dayjs1.format("YYYY-MM-DD"),
    dayjs2: dayjs1.format("YYYY-MM-DD HH:mm:ss"),
  });
});

app.use("/address-book", abRouter);

app.get("/zod", (req, res) => {
  const v1 = "teest.com";
  const v2 = "te@sest.com";
  const schema = z.string().email({ message: "錯誤的電郵格式" });
  const result1 = schema.safeParse(v1);
  const result2 = schema.safeParse(v2);
  res.send({ result1, result2 });
});

app.get("/zod2", (req, res) => {
  const dataObj = {
    name: "a",
    email: "tttt",
  };
  const schema = z.object({
    name: z.string().min(2, { message: "請填寫兩個字以上" }),
    email: z.string().email({ message: "錯誤的電郵格式" }),
  });
  const result = schema.safeParse(dataObj);
  res.send(result);
});

app.get("/yahoo", (req, res) => {
  fetch("https://tw.yahoo.com/")
  .then(r=>r.text())
  .then(txt=>{
    res.send(txt);
  })
  .catch(ex=>res.send("出錯啦"));
});

/* ************** 其他的路, 放在這行之前 *********** */
// 靜態內容的資料夾

app.use("/", express.static("public"));
app.use("/bootstrap", express.static("node_modules/bootstrap/dist"));
app.use("/jquery", express.static("node_modules/jquery/dist"));

/* 404 頁面 */
app.use((req, res) => {
  res.status(404).send(`<h2>404 走錯路了</h2>`);
});

const port = process.env.WEB_PORT || 3002;
app.listen(port, () => {
  console.log(`伺服器啟動 使用通訊埠 ${port}`);
});
