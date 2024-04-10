import express from "express";
import sales from "./data/sales.js";
import upload from "./utils/upload-imgs.js";
import adminRouter from "./routes/admin2.js";
import abRouter from "./routes/address-book.js";
import session from "express-session";
import mysqlSession from "express-mysql-session";
import db from "./utils/mysql2-connect.js";
import dayjs from "dayjs";
import { z } from "zod";
import bcrypt from "bcryptjs";
import cors from "cors";
import jwt from "jsonwebtoken";

// const upload = multer({dest: "tmp_uploads/"})

const MysqlStore = mysqlSession(session);
const sessionStore = new MysqlStore({}, db);

const app = express();

app.set("view engine", "ejs");

// top level middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    callback(null, true);
  },
};

app.use(cors(corsOptions));
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: "mhfgjk764567458fjhmh674765",
    store: sessionStore,
    // cookie: {
    //   maxAge: 1200_000,
    // }
  })
);

// self made middlewares
app.use((req, res, next) => {
  res.locals.title = "web title";
  res.locals.pageName = "";
  res.locals.session = req.session;
  res.locals.originalUrl = req.originalUrl;

  // const waitMSec = Math.random() * 2000
  // setTimeout(()=>{
  //   next()
  // }, waitMSec)

  const auth = req.get("Authorization");
  if (auth && auth.indexOf("Bearer ") === 0) {
    const token = auth.slice(7);
    try {
      // res.locals.my_jwt
      req.my_jwt = jwt.verify(token, process.env.JWT_SECRET);
      console.log(req.my_jwt.id)
    } catch (ex) {
      console.log(ex);
    }
  }

  next();
});

// app.use("/", express.static("build"));
// app.get("*", (req, res) => {
//   res.send(`

//   `)
// })

// 這個路由只接受 GET 方法, 路徑要為／
app.get("/", (req, res) => {
  // res.send("<h2>hello</2>");
  res.locals.title = "Home page";
  res.render("home", { name: "Linda" });
});

app.get("/json-sales", (req, res) => {
  res.locals.title = "json - " + res.locals.title;
  res.locals.pageName = "json-sales";
  res.render("json-sales", { sales });
});

app.get("/try-qs", (req, res) => {
  res.json(req.query);
});

app.post("/try-post", (req, res) => {
  res.json(req.body);
});

app.get("/try-post-form", (req, res) => {
  res.render("try-post-form");
});

app.post("/try-post-form", (req, res) => {
  res.render("try-post-form", req.body);
});

app.post("/try-uploads", upload.array("photos", 5), (req, res) => {
  res.json(req.files);
});

//action and id can be named by yourself
// ? means it is optional
app.get("/my-params1/:action?/:id?", (req, res) => {
  res.json(req.params);
});

app.get(/^\/m\/09\d{2}-?\d{3}-?\d{3}$/i, (req, res) => {
  let u = req.url.split("?")[0];
  u = u.slice(3); // remove the first 3 letters
  u = u.split("-").join("");
  res.json({ u });
});

app.use("/admins", adminRouter);

app.post("/try-upload", upload.single("avatar"), (req, res) => {
  res.json({ body: req.body, file: req.file });
});

app.get("/try-sess", (req, res) => {
  req.session.myNum ||= 0;
  req.session.myNum++;
  res.json(req.session);
});

app.get("/login", (req, res) => {
  if (req.session.admin) {
    res.redirect("/");
  }
  res.render("login");
});

app.post("/login", upload.none(), async (req, res) => {
  let { account, password } = req.body || {};
  const output = {
    success: false,
    error: "",
    code: 0,
  };

  if (!account || !password) {
    output.error = "Information is incomplete";
    output.code = 1;
    return res.json(output);
  }
  account = account.trim();
  password = password.trim();

  const sql = "SELECT * from members WHERE email=?";
  const [rows] = await db.query(sql, [account]);

  if (!rows.length) {
    output.error = "Account or password is wrong";
    output.code = 2;
    return res.json(output);
  }

  const result = await bcrypt.compare(password, rows[0].password);
  if (result) {
    output.success = true;
    req.session.admin = {
      id: rows[0].id,
      email: account,
      nickname: rows[0].nickname,
    };
  } else {
    output.code = 3;
    output.error = "Account or password is wrong";
  }

  res.json(output);
});

app.get("/logout", (req, res) => {
  if (req.session?.admin) {
    delete req.session.admin;
  }
  if (req.query.u) {
    res.redirect(req.query.u);
  } else {
    res.redirect("/login");
  }
});

// send JWT token after logging in
app.post("/login-jwt", async (req, res) => {
  let { account, password } = req.body || {};
  const output = {
    success: false,
    error: "",
    code: 0,
    data: {
      id: 0,
      account: "",
      nickname: "",
      token: "",
    },
  };

  if (!account || !password) {
    output.error = "Information is incomplete";
    output.code = 1;
    return res.json(output);
  }
  account = account.trim();
  password = password.trim();

  const sql = "SELECT * from members WHERE email=?";
  const [rows] = await db.query(sql, [account]);

  if (!rows.length) {
    output.error = "Account or password is wrong";
    output.code = 2;
    return res.json(output);
  }

  const result = await bcrypt.compare(password, rows[0].password);
  if (result) {
    output.success = true;

    const token = jwt.sign(
      {
        id: rows[0].id,
        account: rows[0].email,
      },
      process.env.JWT_SECRET
    );

    // TODO:
    output.data = {
      id: rows[0].id,
      account: rows[0].email,
      nickname: rows[0].nickname,
      token,
    };
  } else {
    output.code = 3;
    output.error = "Account or password is wrong";
  }

  res.json(output);
});

app.get("/jwt-data", async (req, res) => {
  res.json(req.my_jwt);
});

app.get("/try-db", async (req, res) => {
  const sql = "SELECT * from address_book LIMIT 3";
  const [rows] = await db.query(sql);

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
  const v = "test.gmail.com";
  const schema = z.string().email({ message: "Wrong email address" });
  const result = schema.safeParse(v);
  res.send(result);
});

app.get("/zod2", (req, res) => {
  const dataObj = {
    name: "a",
    email: "ttt",
  };

  const schema = z.object({
    name: z.string().min(2, "Please enter more than 2 characters"),
    email: z.string().email({ message: "Wrong email address" }),
  });

  const result = schema.safeParse(dataObj);

  res.send(result);
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
